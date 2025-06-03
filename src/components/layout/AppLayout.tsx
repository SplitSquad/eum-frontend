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
      const MODAL_WIDTH = 400;
      const MODAL_HEIGHT = 520;
      const PADDING = 20; // 여유 공간을 더 크게
      
      // 화면 크기
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      console.log('=== 모달 위치 계산 시작 ===');
      console.log('버튼 위치:', { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
      console.log('화면 크기:', { viewportWidth, viewportHeight });
      console.log('모달 크기:', { MODAL_WIDTH, MODAL_HEIGHT });
      
      let x, y;
      
      // 1단계: X 위치 결정 (수평 위치)
      // 기본적으로 버튼 왼쪽에 배치
      x = rect.left - MODAL_WIDTH - PADDING;
      
      // 왼쪽 공간이 부족하면 오른쪽에 배치
      if (x < PADDING) {
        x = rect.right + PADDING;
        console.log('왼쪽 공간 부족, 오른쪽으로 이동:', x);
      }
      
      // 오른쪽도 부족하면 화면에 맞춰 강제 조정
      if (x + MODAL_WIDTH > viewportWidth - PADDING) {
        x = viewportWidth - MODAL_WIDTH - PADDING;
        console.log('오른쪽도 부족, 강제 조정:', x);
      }
      
      // 최종 X 위치 검증 및 보정
      if (x < PADDING) {
        x = PADDING;
        console.log('최종 X 보정:', x);
      }
      
      // 2단계: Y 위치 결정 (수직 위치)
      y = rect.top - 50; // 버튼 위쪽에 약간 여유를 두고 배치
      
      // 위쪽 공간이 부족하면 아래로
      if (y < PADDING) {
        y = rect.bottom + PADDING;
        console.log('위쪽 공간 부족, 아래로 이동:', y);
      }
      
      // 아래쪽도 부족하면 강제 조정 (푸터 고려)
      const footerHeight = 180; // 푸터 높이를 더 크게 잡음 (140 -> 180)
      const maxY = viewportHeight - footerHeight - MODAL_HEIGHT - PADDING;
      if (y > maxY) {
        y = Math.max(PADDING, maxY);
        console.log('아래쪽 공간 부족, 강제 조정:', y);
      }
      
      // 최종 Y 위치 검증
      if (y + MODAL_HEIGHT > viewportHeight - PADDING) {
        y = viewportHeight - MODAL_HEIGHT - PADDING;
        console.log('최종 Y 보정:', y);
      }
      
      if (y < PADDING) {
        y = PADDING;
        console.log('최종 Y 최소값 보정:', y);
      }
      
      console.log('최종 모달 위치:', { x, y });
      console.log('모달 경계:', { 
        right: x + MODAL_WIDTH, 
        bottom: y + MODAL_HEIGHT,
        withinViewport: {
          x: x >= PADDING && (x + MODAL_WIDTH) <= (viewportWidth - PADDING),
          y: y >= PADDING && (y + MODAL_HEIGHT) <= (viewportHeight - PADDING)
        }
      });
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
