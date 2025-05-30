import Header from './Header';
import Footer from './Footer';
import FloatingNavigator from './FloatingNavigator';
import { SeasonalBackground } from '@/features/theme';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import { useModalStore } from '@/shared/store/ModalStore';
import useAuthStore from '@/features/auth/store/authStore';
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import eum2Image from '@/assets/images/characters/이음이.png';
import '../../app/App.css';
import { Container } from '@mui/material';
import useLayoutVisibility from './useLayoutVisibility';

export default function AppLayout() {
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const { isAuthenticated, loadUser } = useAuthStore();
  const btnRef = useRef<HTMLImageElement>(null);
  const { isHeaderVisible, isModalVisible } = useLayoutVisibility();

  // 기존의 updateVisibility, useEffect 등은 필요에 따라 커스텀 훅으로 분리 가능
  // 여기서는 간단히 유지

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
    <div className={`app-container ${isModalOpen ? 'modal-open' : ''}`}>
      {/* 모달 */}
      {isModalVisible && isAuthenticated && (
        <Modal isOpen={isModalOpen} onClose={closeModal} position={position}>
          {content ?? <ModalContent />}
        </Modal>
      )}
      <div className={`app-content ${isModalOpen ? 'dimmed' : ''}`}>
        <Header isVisible={isHeaderVisible} />
        <SeasonalBackground>
          <main className="main-content">
            <div style={{ paddingTop: '0.5rem', height: '100%' }}>
              <Container
                maxWidth="lg"
                sx={{
                  py: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                <Outlet />
              </Container>
            </div>
          </main>
          {isModalVisible && isAuthenticated && (
            <div
              className="fixed right-8 bottom-[30px] z-[1001] eumi-fade-in-up eumi-visible"
              style={{ pointerEvents: 'auto' }}
            >
              <img
                ref={btnRef}
                src={eum2Image}
                alt="이음이"
                onClick={onButtonClick}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  transform: isModalOpen ? 'rotate(90deg)' : 'scale(1.08)',
                }}
                className="modal-toggle-img eumi-hover-float"
              />
            </div>
          )}
        </SeasonalBackground>
        <Footer />
      </div>
      <FloatingNavigator isHeaderVisible={isHeaderVisible} />
    </div>
  );
}
