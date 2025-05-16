'use client';

import React, { useRef } from 'react';
import Header from './Header';
import GuestHeader from './GuestHeader';
import Footer from './Footer';
import { useUserStore } from '@/shared/store/UserStore';
import { useModalStore } from '@/shared/store/ModalStore';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import { useLocation } from 'react-router-dom';

export default function LegacyAppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const btnRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // 현재 경로가 루트('/')인 경우 Header를 숨김
  const showHeader = location.pathname !== '/';

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
    <div className="flex flex-col min-h-screen">
      {/* 전역 모달: content가 null이면 기본 ChatModalContent 사용 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} position={position}>
        {content ?? <ModalContent />}
      </Modal>

      {showHeader && (isAuthenticated ? <Header /> : <GuestHeader />)}

      <main className="flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
      </main>

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
