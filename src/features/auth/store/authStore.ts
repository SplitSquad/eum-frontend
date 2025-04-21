import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// import { checkAuthStatus, logout } from '../api/authApi'; // 실제 구글 인증 API
import { checkAuthStatus, logout } from '../api'; // 임시 인증 API

/**
 * 사용자 타입 정의
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  picture?: string;
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

      // 기본 액션 - 상태 변경
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      // 로그인 핸들러
      handleLogin: (token, user) => {
        // 토큰을 로컬 스토리지에 별도로 저장 (axios 인터셉터용)
        localStorage.setItem('auth_token', token);

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

          // 백엔드에서 현재 사용자 정보 조회
          const userData = await checkAuthStatus();
          set({
            user: userData,
            isAuthenticated: true,
            token: storedToken,
          });
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
