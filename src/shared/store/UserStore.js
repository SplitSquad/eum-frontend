import { create } from 'zustand';
// Zustand를 통해 사용자 상태(store) 생성
export const useUserStore = create(set => ({
    isAuthenticated: false,
    userProfile: null,
    token: null,
    setAuthStatus: status => set({ isAuthenticated: status }),
    setUserProfile: profile => set({ userProfile: profile }),
    setToken: token => set({ token }), // 토큰 설정
    clearAuth: () => set({
        isAuthenticated: false,
        userProfile: null,
        token: null,
    }),
}));
