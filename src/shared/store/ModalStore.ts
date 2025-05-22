import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReactNode } from 'react';

// ModalStore 인터페이스 정의
interface ModalStore {
  isModalOpen: boolean; // 모달 오픈 여부
  position?: { x: number; y: number }; // 모달 위치 좌표(옵션)
  content: ReactNode | null; // 모달에 렌더링할 콘텐츠

  // 모달 열기 액션: 콘텐츠와 위치를 인자로 받아 상태 업데이트
  openModal: (content: ReactNode, position?: { x: number; y: number }) => void;
  // 모달 닫기 액션: 상태 초기화
  closeModal: () => void;
}

/**
 * useModalStore
 * - Zustand와 persist 미들웨어를 사용한 전역 모달 상태 관리
 * - 브라우저 스토리지(localStorage)에 isModalOpen, position 상태를 유지
 */
export const useModalStore = create<ModalStore>()(
  persist(
    set => ({
      isModalOpen: false, // 초기: 모달 닫힘
      position: undefined, // 초기: 위치 미설정
      content: null, // 초기: 콘텐츠 없음

      openModal: (content, position) => set({ isModalOpen: true, content, position }), // 모달 열기

      closeModal: () => set({ isModalOpen: false, content: null, position: undefined }), // 모달 닫기
    }),
    {
      name: 'modal-storage', // 로컬 스토리지 key 이름
      partialize: state => ({
        // 저장할 상태 필드 선택
        isModalOpen: state.isModalOpen,
        position: state.position,
      }),
    }
  )
);
