import { create } from 'zustand';

// 언어 상태 관리 타입 정의
interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
}

// Zustand를 이용해 언어 상태(store) 생성
export const useLanguageStore = create<LanguageStore>(set => ({
  language: 'ko', // 기본 언어는 'ko'
  setLanguage: lang => set({ language: lang }),
}));
