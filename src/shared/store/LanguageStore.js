import { create } from 'zustand';
// Zustand를 이용해 언어 상태(store) 생성
export const useLanguageStore = create(set => ({
    language: 'ko', // 기본 언어는 'ko'
    setLanguage: lang => set({ language: lang }),
}));
