import { create } from 'zustand';
import { getPreferredLanguage, savePreferredLanguage } from '../../onboarding/utils/languageUtils';
import apiClient from '../../../config/axios';
import useAuthStore from '../../auth/store/authStore';

// 언어 상태 관리 타입 정의
interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
  syncWithBackend: (lang: string) => Promise<void>;
}

// Zustand를 이용해 언어 상태(store) 생성
export const useLanguageStore = create<LanguageStore>(set => ({
  language: getPreferredLanguage(), // 로컬스토리지에서 언어 설정 불러오기

  // 언어 변경 (로컬 상태만 업데이트)
  setLanguage: (lang: string) => {
    savePreferredLanguage(lang); // 로컬스토리지에 언어 설정 저장
    set({ language: lang });

    // 로그인한 사용자인 경우 백엔드 동기화 시도
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      // 상태 업데이트 후 비동기적으로 백엔드 동기화 시도
      useLanguageStore
        .getState()
        .syncWithBackend(lang)
        .catch(err => console.error('Failed to sync language with backend:', err));
    }
  },

  // 백엔드와 언어 설정 동기화
  syncWithBackend: async (lang: string) => {
    try {
      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        console.log('사용자가 로그인하지 않아 백엔드 동기화를 건너뜁니다.');
        return;
      }

      const token = localStorage.getItem('auth_token');
      console.log('token', token);
      if (!token) {
        console.log('인증 토큰이 없어 백엔드 동기화를 건너뜁니다.');
        return;
      }

      // 백엔드 API 호출하여 언어 설정 업데이트
      const response = await apiClient.put(
        '/users/profile/language',
        { language: lang },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log('백엔드 언어 설정 동기화 성공:', response);
    } catch (error) {
      console.error('백엔드 언어 설정 동기화 실패:', error);
      throw error;
    }
  },
}));
