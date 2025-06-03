import { SnackbarProvider } from 'notistack';
import React, { ReactNode, useEffect } from 'react';
import useAuthStore from '@/features/auth/store/authStore';

export default function AppProviders({ children }: { children: ReactNode }) {
  const { loadUser, isAuthenticated } = useAuthStore();

  // 앱 시작 시 인증 상태 확인 및 사용자 정보 로드
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      console.log('AppProviders: Starting initial user info load');
      loadUser();
    }
  }, [loadUser, isAuthenticated]);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={1500}
    >
      {children}
    </SnackbarProvider>
  );
}
