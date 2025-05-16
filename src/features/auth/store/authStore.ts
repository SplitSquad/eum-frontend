import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { checkAuthStatus, logout } from '../api/authApi'; // 실제 구글 인증 API
import { getToken, setToken, removeToken } from '../tokenUtils';

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
}

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
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      // OAuthCallback에서 사용하는 메서드
      setAuthState: user => {
        const token = getToken();
        set({
          isAuthenticated: true,
          user,
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

        // 사용자 권한도 별도 저장 (로그인 가드용)
        if (user.role) {
          localStorage.setItem('userRole', user.role);
        }

        // 상태 업데이트
        set({
          isAuthenticated: true,
          user,
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

          // 토큰이 없으면 인증 상태가 아님
          const storedToken = localStorage.getItem('auth_token');
          if (!storedToken) {
            get().clearAuthState();
            return;
          }

          try {
            // 백엔드에서 현재 사용자 정보 조회
            const userData = await checkAuthStatus();

            console.log('사용자 정보 로드 성공:', userData);

            set({
              user: userData,
              isAuthenticated: true,
              token: storedToken,
            });
          } catch (apiError) {
            console.warn('API에서 사용자 정보 가져오기 실패, 토큰에서 정보 추출 시도:', apiError);

            // API 호출 실패 시 토큰에서 직접 정보 추출
            try {
              // JWT 토큰 디코딩
              const payload = JSON.parse(atob(storedToken.split('.')[1]));
              const userId = payload.userId || 0;
              const role = payload.role || 'ROLE_USER';

              // 사용자 정보 생성
              const extractedUser = {
                userId,
                role,
                // 이메일 정보는 토큰에서 가져올 수 없으므로 기본값으로 설정
                email: '',
                //isOnBoardDone: true, // 온보딩 완료 상태로 설정
              };

              console.log('토큰에서 추출한 사용자 정보로 인증 상태 설정:', extractedUser);

              // 상태 업데이트 - API 호출 없이 토큰 기반으로 인증
              set({
                user: extractedUser,
                isAuthenticated: true,
                token: storedToken,
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
        removeToken(); // sessionStorage에서도 제거

        // 상태 초기화
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
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
