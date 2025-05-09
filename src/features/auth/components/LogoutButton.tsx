import React, { useState } from 'react';
import { Button, IconButton, Tooltip, styled, Snackbar, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Styled logout button with gradient effect
const StyledLogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    background: 'linear-gradient(45deg, #E91E63, #FF69B4)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

interface LogoutButtonProps {
  variant?: 'icon' | 'button';
  size?: 'small' | 'medium' | 'large';
}

/**
 * 로그아웃 버튼 컴포넌트
 * 아이콘 형태 또는 버튼 형태로 표시 가능
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'icon',
  size = 'medium',
}) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onLogout = async () => {
    try {
      setIsLoading(true);
      await handleLogout();
      setShowSuccess(true);
      
      // 짧은 딜레이 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title="로그아웃">
          <IconButton 
            onClick={onLogout} 
            size={size} 
            disabled={isLoading}
            sx={{ color: 'rgba(233, 30, 99, 0.7)' }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
        
        <Snackbar
          open={showSuccess}
          autoHideDuration={1500}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            로그아웃되었습니다
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <StyledLogoutButton
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        size={size}
        disabled={isLoading}
        variant="contained"
      >
        {isLoading ? '로그아웃 중...' : '로그아웃'}
      </StyledLogoutButton>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          로그아웃되었습니다
        </Alert>
      </Snackbar>
    </>
  );
};

export default LogoutButton;