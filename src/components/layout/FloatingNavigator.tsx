import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@emotion/react';
import { useTranslation } from '@/shared/i18n';
import homeIcon from '@/assets/icons/navigation/home.svg';
import forumIcon from '@/assets/icons/navigation/forum.svg';
import debateIcon from '@/assets/icons/navigation/debate.svg';
import chatIcon from '@/assets/icons/navigation/chat.svg';
import infoIcon from '@/assets/icons/navigation/info.svg';
import accountIcon from '@/assets/icons/navigation/account.svg';

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

const FloatingNav = styled('nav')<{ visible: boolean }>`
  position: fixed;
  top: 30vh;
  left: 24px;
  transform: translateY(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 32px 12px;
  align-items: center;
  min-height: 300px;
  transition: opacity 0.3s;
  animation: ${props => (props.visible ? fadeIn : fadeOut)} 0.4s both;
`;

const NavButton = styled('button')<{ isactive?: boolean }>`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: ${({ isactive }) => (isactive ? '#1976d2' : '#666')};
  background: ${({ isactive }) => (isactive ? 'rgba(25, 118, 210, 0.08)' : 'none')};
  transition:
    background 0.2s,
    color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  &:hover {
    background: rgba(25, 118, 210, 0.12);
    color: #1976d2;
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

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 60;
      const scrollY = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      setShow(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    //document.body.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 400); // fade duration
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!shouldRender || isHeaderVisible === false) {
    return null;
  }

  // navItems 배열
  const navItems = [
    {
      label: t('common.home'),
      icon: <img src={homeIcon} alt="Home" style={{ width: 28, height: 28 }} />,
      path: '/dashboard',
    },
    {
      label: t('common.info'),
      icon: <img src={infoIcon} alt="Info" style={{ width: 28, height: 28 }} />,
      path: '/info',
    },
    {
      label: t('common.community'),
      icon: <img src={forumIcon} alt="Community" style={{ width: 28, height: 28 }} />,
      path: '/community',
    },

    {
      label: t('common.debate'),
      icon: <img src={debateIcon} alt="Debate" style={{ width: 28, height: 28 }} />,
      path: '/debate',
    },
    {
      label: t('common.aiassistant'),
      icon: <img src={chatIcon} alt="AI Assistant" style={{ width: 28, height: 28 }} />,
      path: '/assistant',
    },
    {
      label: t('common.mypage'),
      icon: <img src={accountIcon} alt="My Page" style={{ width: 28, height: 28 }} />,
      path: '/mypage',
    },
  ];

  return (
    <FloatingNav visible={show}>
      {navItems.map(item => (
        <Tooltip key={item.path} title={item.label} placement="right" arrow>
          <NavButton
            isactive={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            {item.icon}
          </NavButton>
        </Tooltip>
      ))}
    </FloatingNav>
  );
};

export default FloatingNavigator;
