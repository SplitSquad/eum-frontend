import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useModalStore } from '@/shared/store/ModalStore';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Container, IconButton } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import { SeasonalBackground } from '../features/theme';
import FloatingNavigator from '@/components/layout/FloatingNavigator';
import './App.css';
import eum2Image from '@/assets/images/characters/이음이.png';

/**
 * 애플리케이션 레이아웃 컴포넌트
 * 모든 라우트의 부모 컴포넌트로 작동
 */
const App: React.FC = () => {
  const { loadUser, isAuthenticated } = useAuthStore();
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const btnRef = useRef<HTMLImageElement>(null);
  const location = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // 현재 링크와 이전 링크를 추적하는 refs
  const currentPathRef = useRef<string>(location.pathname);
  const previousPathRef = useRef<string>('');

  // 경로에 따른 컴포넌트 가시성 설정
  const updateVisibility = (path: string) => {
    // 루트 경로 체크
    if (path === '/init') {
      setIsHeaderVisible(false);
      setIsModalVisible(false);
      return;
    }

    // onboarding 경로 체크 (하위 경로 포함)
    if (path.startsWith('/onboarding')) {
      setIsHeaderVisible(false);
      setIsModalVisible(false);
      return;
    }

    // assistant 경로 체크 (하위 경로 포함)
    if (path.startsWith('/assistant')) {
      setIsHeaderVisible(true);
      setIsModalVisible(false);
      return;
    }
    if (path.startsWith('/404')) {
      setIsHeaderVisible(false);
      setIsModalVisible(false);
      return;
    }

    // 기본 상태
    setIsHeaderVisible(true);
    setIsModalVisible(true);
  };

  // 초기 마운트와 경로 변경 시 실행
  useEffect(() => {
    // 현재 경로 업데이트
    if (currentPathRef.current !== location.pathname) {
      previousPathRef.current = currentPathRef.current;
      currentPathRef.current = location.pathname;

      console.log('Route changed:', {
        from: previousPathRef.current,
        to: currentPathRef.current,
      });
    }

    // 현재 경로에 따른 가시성 업데이트
    updateVisibility(location.pathname);
  }, [location.pathname]);

  // 초기 마운트 시 한 번 실행
  useEffect(() => {
    updateVisibility(location.pathname);
  }, []);

  const onButtonClick = () => {
    console.log('onButtonClick');
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

  // 앱 초기화 시 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          console.log('App 초기화: 저장된 토큰 발견, 인증 상태 복원 시도');
          await loadUser();
        }
      } catch (error) {
        console.error('인증 상태 초기화 실패:', error);
      }
    };

    initAuth();
  }, [loadUser]);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={1500}
    >
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
              <div className="fixed bottom-[170px] right-8 z-[1001]">
                <img
                  ref={btnRef}
                  src={eum2Image}
                  alt="이음이"
                  onClick={onButtonClick}
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    transform: isModalOpen ? 'rotate(90deg)' : 'none',
                  }}
                  className="modal-toggle-img"
                />
              </div>
            )}
          </SeasonalBackground>
          <Footer />
        </div>
        <FloatingNavigator isHeaderVisible={isHeaderVisible} />
      </div>
    </SnackbarProvider>
  );
};

export default App;
