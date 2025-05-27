import { create } from 'zustand';
import { useLanguageStore } from '@/features/theme/store/languageStore';

interface AiAssistantState {
  selectedCategory: string;
  messages: Array<{
    id: number;
    sender: 'user' | 'bot';
    text: string;
    displayText?: string;
    isTyping?: boolean;
  }>;
  loading: boolean;
  forceRefresh: number;
}

interface AiAssistantActions {
  setSelectedCategory: (category: string) => void;
  setMessages: (messages: AiAssistantState['messages'] | ((prev: AiAssistantState['messages']) => AiAssistantState['messages'])) => void;
  setLoading: (loading: boolean) => void;
  resetStore: () => void;
  setupLanguageChangeListener: () => void;
}

type AiAssistantStore = AiAssistantState & AiAssistantActions;

const initialState: AiAssistantState = {
  selectedCategory: 'all',
  messages: [],
  loading: false,
  forceRefresh: 0,
};

export const useAiAssistantStore = create<AiAssistantStore>((set, get) => ({
  ...initialState,

  setSelectedCategory: (category: string) => {
    console.log('[AI Assistant Store] 카테고리 변경:', category);
    set({ selectedCategory: category });
  },

  setMessages: (messages) => {
    set((state) => ({
      messages: typeof messages === 'function' ? messages(state.messages) : messages
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  resetStore: () => {
    console.log('[AI Assistant Store] 스토어 초기화');
    set({ ...initialState, forceRefresh: Date.now() });
  },

  setupLanguageChangeListener: () => {
    console.log('[AI Assistant Store] 언어 변경 리스너 설정 (더미 함수)');
    // 언어 변경 감지는 이제 ChatContent에서 직접 처리
    return () => {}; // 빈 cleanup 함수 반환
  },
}));

// 언어 변경 감지는 ChatContent에서 직접 처리 