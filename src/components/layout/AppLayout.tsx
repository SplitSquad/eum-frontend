'use client';

import React, { useRef } from 'react';
import Header from './Header';
import GuestHeader from './GuestHeader';
import Footer from './Footer';
import { useUserStore } from '@/shared/store/UserStore';
import { useModalStore } from '@/shared/store/ModalStore';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const btnRef = useRef<HTMLButtonElement>(null);

  const onButtonClick = () => {
    if (isModalOpen) {
      closeModal();
    } else if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const offset = 8;
      const MODAL_WIDTH = 350;

      let x = rect.left - offset - MODAL_WIDTH + scrollX;
      const y = rect.top + scrollY - 400;
      if (x < 0) x = rect.right + offset + scrollX;

      openModal(<ModalContent />, { x, y });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 전역 모달: content가 null이면 기본 ChatModalContent 사용 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} position={position}>
        {content ?? <ModalContent />}
      </Modal>

      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      <Footer />

      <button
        ref={btnRef}
        onClick={onButtonClick}
        className="fixed bottom-4 right-4 z-60 p-3 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {isModalOpen ? 'Close Modal' : 'Open Modal'}
      </button>
    </div>
  );
}
