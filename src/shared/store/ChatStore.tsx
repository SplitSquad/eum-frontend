import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Message 인터페이스 정의
 * - 채팅에서 사용되는 메시지 객체 타입
 */

export interface Message {
  id: number; // 고유 메시지 ID (렌더링 키 등)
  sender: 'user' | 'bot'; // 발신자 구분
  text: string; // 메시지 텍스트
}

// ChatStore 인터페이스 정의
interface ChatStore {
  messages: Message[]; // 전체 메시지 배열
  addMessage: (msg: Message) => void; // 메시지 추가 액션
  clearMessages: () => void; // 메시지 초기화 액션
}

/**
 * useChatStore
 * - Zustand와 persist 미들웨어를 사용해 채팅 메시지 상태를 전역으로 관리
 * - localStorage를 사용해 세션 간 메시지를 유지
 */
export const useChatStore = create<ChatStore>()(
  persist(
    set => ({
      // 초기 상태: 메시지 배열 빈 배열
      messages: [],

      // addMessage: 이전 상태 복사 후 새로운 메시지 추가
      addMessage: msg => set(state => ({ messages: [...state.messages, msg] })),

      // clearMessages: 메시지 배열 초기화
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // localStorage에 저장될 key 이름
      getStorage: () => localStorage, // 브라우저 localStorage 사용
    }
  )
);
