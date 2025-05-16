/*
import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { SeasonalBackground } from '../features/theme';
import useAuthStore from '../features/auth/store/authStore';
import { NavBar } from '../components/layout';
import { useModalStore } from '@/shared/store/ModalStore';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import './App.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const App: React.FC = () => {
  const { loadUser } = useAuthStore();
  const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
  const btnRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // 현재 링크와 이전 링크를 추적하는 refs
  const currentPathRef = useRef<string>(location.pathname);
  const previousPathRef = useRef<string>('');

  // 링크 변경 감지
  useEffect(() => {
    // 현재 경로가 변경되었을 때만 업데이트
    if (currentPathRef.current !== location.pathname) {
      // 이전 경로를 저장
      previousPathRef.current = currentPathRef.current;
      // 현재 경로를 업데이트
      currentPathRef.current = location.pathname;

      console.log('Route changed:', {
        from: previousPathRef.current,
        to: currentPathRef.current,
      });
    }
  }, [location.pathname]);

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
      <div className="app-container">
        <SeasonalBackground>
          <Header />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </SeasonalBackground>

        <Modal isOpen={isModalOpen} onClose={closeModal} position={position}>
          {content ?? <ModalContent />}
        </Modal>

        <button
          ref={btnRef}
          onClick={onButtonClick}
          className="fixed bottom-4 right-4 z-60 p-3 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isModalOpen ? 'Close Modal' : 'Open Modal'}
        </button>
      </div>
    </SnackbarProvider>
  );
};

export default App;
*/
