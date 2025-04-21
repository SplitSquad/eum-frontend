import React from 'react';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './App.css';

/**
 * 애플리케이션 레이아웃 컴포넌트
 * 모든 라우트의 부모 컴포넌트로 작동
 */
const App: React.FC = () => {
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
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </SnackbarProvider>
  );
};

export default App;
