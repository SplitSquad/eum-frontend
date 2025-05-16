import { create } from 'zustand';

// 사용자 프로필 인터페이스 정의
export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  profileImagePath?: string;
  address?: string;
  signedAt: string;
  isDeactivated: boolean;
  nation: string;
  language: string;
  gender: string;
  visitPurpose: string;
  onBoardingPreference: { notifications: boolean; darkMode: boolean };
  isOnBoardDone: boolean;
}

// 상태 관리 타입 정의
interface UserStore {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  token: string | null; // JWT 토큰
  setAuthStatus: (status: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  setToken: (token: string | null) => void; // 토큰 설정 함수
  clearAuth: () => void; // 로그아웃
}

// Zustand를 통해 사용자 상태(store) 생성
export const useUserStore = create<UserStore>(set => ({
  isAuthenticated: false,
  userProfile: null,
  token: null,
  setAuthStatus: status => set({ isAuthenticated: status }),
  setUserProfile: profile => set({ userProfile: profile }),
  setToken: token => set({ token }), // 토큰 설정
  clearAuth: () =>
    set({
      isAuthenticated: false,
      userProfile: null,
      token: null,
    }),
}));
