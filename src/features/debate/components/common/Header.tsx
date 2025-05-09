import React from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutButton from '../../../auth/components/LogoutButton';
import useAuthStore from '../../../auth/store/authStore';

// Styled components
const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  zIndex: 10,
  borderBottom: '1px solid rgba(255, 182, 193, 0.3)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, rgba(255,182,193,0.3) 0%, rgba(255,192,203,0.6) 50%, rgba(255,182,193,0.3) 100%)',
  }
}));

export interface HeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showUserIcons?: boolean;
  showLogoutButton?: boolean;
}

/**
 * 공통 헤더 컴포넌트
 * 다른 개발자가 만든 헤더 컴포넌트로 쉽게 교체할 수 있는 구조
 */
const Header: React.FC<HeaderProps> = ({
  title = '토론',
  leftComponent,
  rightComponent,
  showBackButton = true,
  onBackClick,
  showUserIcons = true,
  showLogoutButton = true,
}) => {
  const { isAuthenticated } = useAuthStore();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  // Left component (default: back button)
  const renderLeftComponent = () => {
    if (leftComponent) {
      return leftComponent;
    }
    
    if (showBackButton) {
      return (
        <IconButton onClick={handleBackClick} sx={{ color: 'rgba(233, 30, 99, 0.7)' }}>
          <ArrowBackIcon />
        </IconButton>
      );
    }
    
    return null;
  };

  // Right component (default: user & notification icons)
  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }
    
    if (showUserIcons) {
      return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton sx={{ color: 'rgba(233, 30, 99, 0.7)' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={{ color: 'rgba(233, 30, 99, 0.7)' }}>
            <AccountCircleIcon />
          </IconButton>
          {isAuthenticated && showLogoutButton && <LogoutButton variant="icon" size="medium" />}
        </Box>
      );
    }
    
    return null;
  };

  return (
    <HeaderContainer>
      {renderLeftComponent()}
      <Typography variant="h5" fontWeight={700} sx={{ 
        background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        {title}
      </Typography>
      {renderRightComponent()}
    </HeaderContainer>
  );
};

export default Header; 