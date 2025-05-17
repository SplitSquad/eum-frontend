import { create } from 'zustand';

// 테마 상태 관리 타입 정의
interface ThemeStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Zustand를 이용해 테마 상태(store) 생성
export const useThemeStore = create<ThemeStore>(set => ({
  theme: 'light', // 기본 테마는 'light'
  setTheme: theme => set({ theme }),
  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
