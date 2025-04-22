import { create } from 'zustand';

// 모달 상태 관리 타입 정의
interface ModalStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

// Zustand를 이용해 모달 상태(store) 생성
export const useModalStore = create<ModalStore>(set => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleModal: () => set(state => ({ isModalOpen: !state.isModalOpen })),
}));
