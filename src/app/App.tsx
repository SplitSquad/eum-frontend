import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { SeasonalBackground } from '../features/theme';
import useAuthStore from '../features/auth/store/authStore';
import { NavBar } from '../components/layout';
import { useModalStore } from '@/shared/store/ModalStore';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import './App.css';

/**
 * 애플리케이션 레이아웃 컴포넌트
 * 모든 라우트의 부모 컴포넌트로 작동
 */
const App: React.FC = () => {
  const { loadUser } = useAuthStore();
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
      autoHideDuration={3000}
    >
      <SeasonalBackground>
        <div className="app-container">
          {/* 네비게이션 바 */}
          <NavBar />

          {/* 모달 */}
          <Modal isOpen={isModalOpen} onClose={closeModal} position={position}>
            {content ?? <ModalContent />}
          </Modal>

          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </SeasonalBackground>
    </SnackbarProvider>
  );
};

export default App;
