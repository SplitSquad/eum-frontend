import { create } from 'zustand';
import { persist } from 'zustand/middleware';
/**
 * useModalStore
 * - Zustand와 persist 미들웨어를 사용한 전역 모달 상태 관리
 * - 브라우저 스토리지(localStorage)에 isModalOpen, position 상태를 유지
 */
export const useModalStore = create()(persist(set => ({
    isModalOpen: false, // 초기: 모달 닫힘
    position: undefined, // 초기: 위치 미설정
    content: null, // 초기: 콘텐츠 없음
    openModal: (content, position) => set({ isModalOpen: true, content, position }), // 모달 열기
    closeModal: () => set({ isModalOpen: false, content: null, position: undefined }), // 모달 닫기
}), {
    name: 'modal-storage', // 로컬 스토리지 key 이름
    partialize: state => ({
        // 저장할 상태 필드 선택
        isModalOpen: state.isModalOpen,
        position: state.position,
    }),
}));
