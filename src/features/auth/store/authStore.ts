import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { checkAuthStatus, logout } from '../api/authApi'; // 실제 구글 인증 API
import { getToken, setToken, removeToken, getValidToken, isTokenExpired } from '../tokenUtils';

/**
 * 사용자 타입 정의
 */
export interface User {
  userId: number;
  email?: string;
  role: string;
  isNewUser?: boolean; // 신규 사용자 여부
  isOnBoardDone?: boolean; // 온보딩 완료 여부
  name?: string;
  picture?: string;
  profileImagePath?: string; // 프로필 이미지 경로 추가
  googleId?: string;
}

/**
 * 인증 상태 타입 정의
 *
 * 참고: 이 부분은 실제 프로젝트에서 상훈님 쪽으으로, 전역상태 쪽으로
 * 이동될 수 있습니다. 현재는 인증 기능 구현을 위한 임시 상태 관리입니다.
 *
 * TODO: 상훈님이랑 협의하여 전역 상태 관리 방식으로 리팩토링 필요
 */
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthState: (user: User) => void;

  // 로그인/로그아웃 시 상태 관리
  handleLogin: (token: string, user: User) => void;
  handleLogout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearAuthState: () => void;

  // isOnBoardDone 직접 제어 (추가)
  setOnBoardDone: (isDone: boolean) => void;
  getOnBoardDone: () => boolean;

  // 프로필 이미지 업데이트 (추가)
  updateProfileImage: (imagePath: string) => void;
}

// 타입 변환 헬퍼 함수: isOnBoardDone 값을 항상 boolean으로 처리
const ensureBoolean = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

// JWT 토큰에서 userId 추출하는 유틸리티 함수
const getUserIdFromToken = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || 0;
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return 0;
  }
};

/**
 * 인증 상태 관리 스토어
 * 로컬 스토리지에 인증 정보 유지
 *
 * 참고: 전역 상태 관리와 지역 상태 관리의 분리
 * 이 스토어는 인증 관련 상태만 관리하며, 다른 전역 상태와 분리되어 있습니다.
 * 실제 프로덕션에서는 개발자3이 관리하는 전역 상태 관리 시스템으로 통합될 수 있습니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isOnBoardDone: false,

      // 기본 액션 - 상태 변경
      setUser: user => {
        // user 객체가 있고, isOnBoardDone 필드가 있는 경우 boolean으로 변환
        if (user && 'isOnBoardDone' in user) {
          // isOnBoardDone 값을 명시적으로 boolean으로 변환
          const normalizedUser = {
            ...user,
            isOnBoardDone: ensureBoolean(user.isOnBoardDone),
          };
          set({ user: normalizedUser });

          // 디버깅용: 원본 값과 변환된 값 비교
          console.log('setUser - isOnBoardDone 정규화:', {
            원본값: user.isOnBoardDone,
            원본타입: typeof user.isOnBoardDone,
            변환값: normalizedUser.isOnBoardDone,
            변환타입: typeof normalizedUser.isOnBoardDone,
          });
        } else {
          set({ user });
        }
      },
      setToken: token => set({ token }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      // isOnBoardDone 직접 제어 함수 (추가)
      setOnBoardDone: (isDone: boolean) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, isOnBoardDone: isDone };
          set({ user: updatedUser });

          // 디버깅용 로그
          console.log('isOnBoardDone 직접 설정:', isDone);
        }
      },

      getOnBoardDone: () => {
        const { user } = get();
        if (!user) return false;
        return ensureBoolean(user.isOnBoardDone);
      },

      // OAuthCallback에서 사용하는 메서드
      setAuthState: user => {
        const token = getToken();
        // isOnBoardDone 값을 boolean으로 정규화
        const normalizedUser =
          user && 'isOnBoardDone' in user
            ? {
                ...user,
                isOnBoardDone: ensureBoolean(user.isOnBoardDone),
              }
            : user;

        set({
          isAuthenticated: true,
          user: normalizedUser,
          token,
          error: null,
        });
      },

      // 로그인 핸들러
      handleLogin: (token, user) => {
        // 토큰을 로컬 스토리지에 별도로 저장 (axios 인터셉터용)
        console.log('authStore - handleLogin: 토큰 저장 시작');
        localStorage.setItem('auth_token', token);
        setToken(token); // sessionStorage에도 저장
        console.log(
          'authStore - 토큰 저장 후 확인:',
          localStorage.getItem('auth_token') ? '토큰 저장 성공' : '토큰 저장 실패'
        );

        // 사용자 이메일 저장 (X-User-Email 헤더에 사용)
        if (user.email) {
          localStorage.setItem('userEmail', user.email);
          console.log('사용자 이메일 저장됨:', user.email);
        }

        // 사용자 이름 저장 (댓글/답글 작성 시 사용)
        if (user.name) {
          localStorage.setItem('userName', user.name);
          console.log('사용자 이름 저장됨:', user.name);
        }

        // 사용자 권한도 별도 저장 (로그인 가드용)
        if (user.role) {
          localStorage.setItem('userRole', user.role);
        }

        // isOnBoardDone 값을 boolean으로 정규화
        const normalizedUser =
          user && 'isOnBoardDone' in user
            ? {
                ...user,
                isOnBoardDone: ensureBoolean(user.isOnBoardDone),
              }
            : user;

        // 디버깅: 원본 값과 정규화된 값 로깅
        if (user && 'isOnBoardDone' in user) {
          console.log('handleLogin - isOnBoardDone 정규화:', {
            원본값: user.isOnBoardDone,
            원본타입: typeof user.isOnBoardDone,
            변환값: normalizedUser.isOnBoardDone,
            변환타입: typeof normalizedUser.isOnBoardDone,
          });
        }

        // 상태 업데이트
        set({
          isAuthenticated: true,
          user: normalizedUser,
          token,
          error: null,
        });

        console.log('authStore - 로그인 완료: 인증 상태 =', true);
      },

      // 로그아웃 핸들러
      handleLogout: async () => {
        try {
          set({ isLoading: true });
          await logout();
          get().clearAuthState();
        } catch (error) {
          console.error('로그아웃 중 오류:', error);
          set({ error: '로그아웃 처리 중 오류가 발생했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },

      // 사용자 정보 로드
      loadUser: async () => {
        try {
          set({ isLoading: true });

          // 유효한 토큰이 없으면 인증 상태 정리
          const validToken = getValidToken();
          if (!validToken) {
            console.log('authStore.loadUser: 유효한 토큰이 없어 인증 상태를 정리합니다.');
            get().clearAuthState();
            return;
          }

          try {
            // 백엔드에서 현재 사용자 정보 조회
            const userData = await checkAuthStatus();

            // isOnBoardDone 값을 명시적으로 boolean으로 변환
            const normalizedUserData =
              userData && 'isOnBoardDone' in userData
                ? {
                    ...userData,
                    isOnBoardDone: ensureBoolean(userData.isOnBoardDone),
                  }
                : userData;

            console.log('사용자 정보 로드 성공:', normalizedUserData);

            if (userData && 'isOnBoardDone' in userData) {
              console.log('isOnBoardDone 값 확인:', {
                원본값: userData.isOnBoardDone,
                원본타입: typeof userData.isOnBoardDone,
                변환값: normalizedUserData.isOnBoardDone,
                변환타입: typeof normalizedUserData.isOnBoardDone,
              });
            }

            // 사용자 이름을 로컬 스토리지에 저장 (댓글/답글 작성 시 사용)
            if (normalizedUserData.name) {
              localStorage.setItem('userName', normalizedUserData.name);
              console.log('사용자 이름 저장됨:', normalizedUserData.name);
            }

            // 명확한 타입으로 변환된 사용자 정보로 상태 업데이트
            set({
              user: normalizedUserData,
              isAuthenticated: true,
              token: validToken,
            });
          } catch (apiError) {
            console.warn('API에서 사용자 정보 가져오기 실패, 토큰에서 정보 추출 시도:', apiError);

            // API 호출 실패 시 토큰에서 직접 정보 추출
            try {
                          // JWT 토큰 디코딩
            const payload = JSON.parse(atob(validToken.split('.')[1]));
              const userId = payload.userId || 0;
              const role = payload.role || 'ROLE_USER';
              const name = payload.name || ''; // 이름 정보도 추출

              // 사용자 정보 생성
              const extractedUser = {
                userId,
                role,
                name, // 이름 정보도 저장
                email: '',
              };

              // 이름 정보가 있으면 로컬 스토리지에 저장
              if (name) {
                localStorage.setItem('userName', name);
                console.log('토큰에서 추출한 사용자 이름 저장됨:', name);
              }

              console.log('토큰에서 추출한 사용자 정보로 인증 상태 설정:', extractedUser);

              // 상태 업데이트 - API 호출 없이 토큰 기반으로 인증
              set({
                user: extractedUser,
                isAuthenticated: true,
                token: validToken,
              });
            } catch (tokenError) {
              console.error('토큰 디코딩 실패, 인증 상태 초기화:', tokenError);
              get().clearAuthState();
            }
          }
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          get().clearAuthState();
        } finally {
          set({ isLoading: false });
        }
      },

      // 인증 상태 초기화
      clearAuthState: () => {
        // 로컬 스토리지 토큰 제거
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName'); // 사용자 이름도 제거
        removeToken(); // sessionStorage에서도 제거

        // 상태 초기화
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
      },

      // 프로필 이미지 업데이트 (추가)
      updateProfileImage: (imagePath: string) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, profileImagePath: imagePath };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 민감 정보는 제외
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;

// Additional code to properly handle Google OAuth token management
export const processOAuthToken = (token: string, userData: any) => {
  // 토큰 저장 (tokenUtils 사용)
  setToken(token);

  // localStorage에도 토큰 저장 (axios 인터셉터용)
  localStorage.setItem('auth_token', token);

  // 사용자 정보 저장
  if (userData && userData.email) {
    localStorage.setItem('userEmail', userData.email);
  }

  if (userData && userData.name) {
    localStorage.setItem('userName', userData.name);
  }

  if (userData && userData.role) {
    localStorage.setItem('userRole', userData.role);
  }

  return {
    token,
    user: {
      userId: getUserIdFromToken(token),
      email: userData?.email || '',
      role: userData?.role || 'ROLE_USER',
    },
  };
};
