import { create } from 'zustand';
// Zustand를 이용해 테마 상태(store) 생성
export const useThemeStore = create(set => ({
    theme: 'light', // 기본 테마는 'light'
    setTheme: theme => set({ theme }),
    toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
