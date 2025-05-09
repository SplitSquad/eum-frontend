import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { SeasonalBackground, ThemeSwitcher } from '../features/theme';
import useAuthStore from '../features/auth/store/authStore';
import { NavBar } from '../components/layout';
import './App.css';

/**
 * 애플리케이션 레이아웃 컴포넌트
 * 모든 라우트의 부모 컴포넌트로 작동
 */
const App: React.FC = () => {
  const { loadUser } = useAuthStore();

  // 앱 초기화 시 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        // localStorage에 토큰이 있는지 확인
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
          {/* 네비게이션 바 추가 */}
          <NavBar />
          
          {/* 테마 전환기를 우측 하단 플로팅으로 배치 */}
          <ThemeSwitcher position="floating" />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      </SeasonalBackground>
    </SnackbarProvider>
  );
};

export default App;
