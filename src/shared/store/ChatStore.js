import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
/**
 * useChatStore
 * - Zustand와 persist 미들웨어를 사용해 채팅 메시지 상태를 전역으로 관리
 * - localStorage를 사용해 세션 간 메시지를 유지
 */
export const useChatStore = create()(persist(set => ({
    // 초기 상태: 메시지 배열 빈 배열
    messages: [],
    // addMessage: 이전 상태 복사 후 새로운 메시지 추가
    addMessage: msg => set(state => ({ messages: [...state.messages, msg] })),
    // clearMessages: 메시지 배열 초기화
    clearMessages: () => set({ messages: [] }),
}), {
    name: 'chat-storage', // localStorage에 저장될 key 이름
    storage: createJSONStorage(() => localStorage), // 브라우저 localStorage 사용
}));
