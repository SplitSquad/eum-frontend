import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@emotion/react';
import { useTranslation } from '@/shared/i18n';
import { useMediaQuery, useTheme } from '@mui/material';

const FireIcon = styled('span')({
  fontSize: 28,
  lineHeight: 1,
  color: '#ff9800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
`;

const FloatingNav = styled('nav')<{ visible: boolean; isMobile: boolean }>`
  position: fixed;
  top: ${props => props.isMobile ? '50vh' : '30vh'};
  left: ${props => props.isMobile ? '16px' : '24px'};
  transform: translateY(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: ${props => props.isMobile ? '12px' : '20px'};
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.isMobile ? '20px' : '16px'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: ${props => props.isMobile ? '16px 8px' : '32px 12px'};
  align-items: center;
  min-height: ${props => props.isMobile ? '240px' : '300px'};
  transition: all 0.3s ease;
  animation: ${props => (props.visible ? fadeIn : fadeOut)} 0.4s both;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 480px) {
    left: 12px;
    padding: 12px 6px;
    gap: 10px;
    min-height: 200px;
    border-radius: 16px;
  }
`;

const NavButton = styled('button')<{ active?: boolean; isMobile: boolean }>`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: ${props => props.isMobile ? '10px' : '12px'};
  border-radius: 50%;
  color: ${({ active }) => (active ? '#1976d2' : '#666')};
  background: ${({ active }) => (active ? 'rgba(25, 118, 210, 0.12)' : 'none')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isMobile ? '20px' : '24px'};
  min-width: ${props => props.isMobile ? '40px' : '48px'};
  min-height: ${props => props.isMobile ? '40px' : '48px'};
  position: relative;

  &:hover {
    background: rgba(25, 118, 210, 0.16);
    color: #1976d2;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  // 활성 상태 표시점
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: ${props => props.active ? '20px' : '0'};
    background: linear-gradient(135deg, #1976d2, #42a5f5);
    border-radius: 2px;
    transition: all 0.3s ease;
    opacity: ${props => props.active ? 1 : 0};
  }

  @media (max-width: 480px) {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
    font-size: 18px;
  }
`;

interface FloatingNavigatorProps {
  isHeaderVisible?: boolean;
}

const FloatingNavigator = ({ isHeaderVisible }: FloatingNavigatorProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [shouldRender, setShouldRender] = React.useState(show);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isMobile ? 40 : 60;
      const scrollY = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      setShow(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.body.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  // 모바일에서 헤더가 보이지 않을 때만 표시
  if (!shouldRender || (isMobile && isHeaderVisible !== false)) {
    return null;
  }

  const navItems = [
    { label: t('common.home'), icon: <HomeIcon />, path: '/home' },
    { label: t('common.community'), icon: <ForumIcon />, path: '/community' },
    { label: t('common.info'), icon: <ForumIcon />, path: '/info' },
    { label: t('common.debate'), icon: <FireIcon>🔥</FireIcon>, path: '/debate' },
    { label: t('common.aiassistant'), icon: <ChatIcon />, path: '/assistant' },
    { label: t('common.mypage'), icon: <AccountCircleIcon />, path: '/mypage' },
  ];

  return (
    <FloatingNav visible={show} isMobile={isMobile}>
      {navItems.map(item => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Tooltip 
            key={item.path} 
            title={item.label} 
            placement="right" 
            arrow
                         // 모바일에서는 툴팁 비활성화
            disableHoverListener={isMobile}
            disableFocusListener={isMobile}
            disableTouchListener={isMobile}
          >
            <NavButton
              active={isActive}
              isMobile={isMobile}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              {item.icon}
            </NavButton>
          </Tooltip>
        );
      })}
    </FloatingNav>
  );
};

export default FloatingNavigator;
