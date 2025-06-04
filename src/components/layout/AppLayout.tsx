import Header from './Header';
import Footer from './Footer';
import FloatingNavigator from './FloatingNavigator';
import { SeasonalBackground } from '@/features/theme';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import { useModalStore } from '@/shared/store/ModalStore';
import useAuthStore from '@/features/auth/store/authStore';
import React, { useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import eum2Image from '@/assets/images/characters/이음이.png';
import '../../app/App.css';
import { Container } from '@mui/material';
import useLayoutVisibility from './useLayoutVisibility';
import { resetAgenticState } from '@/shared/utils/Agentic_state';

export default function AppLayout() {
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const { isAuthenticated, loadUser } = useAuthStore();
  const btnRef = useRef<HTMLImageElement>(null);
  const { isHeaderVisible, isModalVisible } = useLayoutVisibility();
  const [modalAdjustKey, setModalAdjustKey] = useState(0);
  const location = useLocation();

  // 기존의 updateVisibility, useEffect 등은 필요에 따라 커스텀 훅으로 분리 가능
  // 여기서는 간단히 유지
  const handleModalClose = () => {
    resetAgenticState(); // 상태 초기화
    closeModal(); // 모달 닫기
  };

  const onButtonClick = () => {
    if (isModalOpen) {
      closeModal();
    } else if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const MODAL_WIDTH = 350;
      const MODAL_HEIGHT = 400;
      const PADDING = 10;
      const footerHeight = 120;
      const OFFSET = 16; // 왼쪽으로 더 이동
      let x = rect.left - MODAL_WIDTH - OFFSET;
      let y = rect.top - MODAL_HEIGHT;
      if (x < PADDING) x = rect.right + PADDING;
      if (y < PADDING) y = rect.bottom + PADDING;
      if (x + MODAL_WIDTH > window.innerWidth - PADDING)
        x = window.innerWidth - MODAL_WIDTH - PADDING;
      if (y + MODAL_HEIGHT > window.innerHeight - footerHeight - PADDING)
        y = window.innerHeight - footerHeight - MODAL_HEIGHT - PADDING;
      openModal(<ModalContent />, { x, y });
    }
  };

  React.useEffect(() => {
    // 페이지가 변경되면 모달을 즉시 닫기 (비동기 처리 없이)
    if (isModalOpen) {
      closeModal();
      resetAgenticState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={`app-container ${isModalOpen ? 'modal-open' : ''}`}>
      {/* 모달 */}
      {isModalVisible && isAuthenticated && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} position={position}>
          {content ?? <ModalContent />}
        </Modal>
      )}
      <div className={`app-content`}>
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
                  padding: 0,
                }}
              >
                <Outlet />
              </Container>
            </div>
          </main>
          {isModalVisible && isAuthenticated && (
            <div
              className="fixed right-8 bottom-[30px] eumi-fade-in-up eumi-visible"
              style={{
                pointerEvents: 'auto',
                zIndex: 99999, // 매우 높은 z-index로 설정
                position: 'fixed', // position을 명시적으로 설정
              }}
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
                  transform: isModalOpen ? 'translateY(-16px)' : 'translateY(0)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))', // 그림자 효과로 더 잘 보이게
                  zIndex: 99999, // 이미지에도 높은 z-index 적용
                  position: 'relative',
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
