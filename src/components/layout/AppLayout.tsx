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
      
      // 모달 크기 (실제 크기와 정확히 일치)
      const MODAL_WIDTH = 350;
      const MODAL_HEIGHT = 400;
      const PADDING = 10; // 버튼과의 간격
      
      console.log('=== 모달 위치 계산 (이음이 버튼 좌상단) ===');
      console.log('버튼 위치:', { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
      
      // 기본 위치: 버튼의 좌상단에 모달의 우하단이 오도록 설정
      let x = rect.left - MODAL_WIDTH;
      let y = rect.top - MODAL_HEIGHT;
      
      // 화면 왼쪽을 벗어나면 오른쪽으로 이동
      if (x < PADDING) {
        x = rect.right + PADDING;
        console.log('왼쪽 경계 벗어남, 오른쪽으로 이동:', x);
      }
      
      // 화면 위쪽을 벗어나면 아래쪽으로 이동
      if (y < PADDING) {
        y = rect.bottom + PADDING;
        console.log('위쪽 경계 벗어남, 아래쪽으로 이동:', y);
      }
      
      // 화면 오른쪽을 벗어나면 조정
      if (x + MODAL_WIDTH > window.innerWidth - PADDING) {
        x = window.innerWidth - MODAL_WIDTH - PADDING;
        console.log('오른쪽 경계 벗어남, 조정:', x);
      }
      
      // 화면 아래쪽을 벗어나면 조정 (푸터 고려)
      const footerHeight = 120;
      if (y + MODAL_HEIGHT > window.innerHeight - footerHeight - PADDING) {
        y = window.innerHeight - footerHeight - MODAL_HEIGHT - PADDING;
        console.log('아래쪽 경계 벗어남, 조정:', y);
      }
      
      console.log('최종 모달 위치:', { x, y });
      console.log('=== 모달 위치 계산 완료 ===');
      
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
                  transform: isModalOpen ? 'rotate(90deg)' : 'scale(1.08)',
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
