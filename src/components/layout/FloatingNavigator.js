import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@emotion/react';
import { useTranslation } from '@/shared/i18n';
const FireIcon = styled('span')({
    fontSize: 28,
    lineHeight: 1,
    color: '#ff9800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
const fadeIn = keyframes `
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeOut = keyframes `
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
`;
const FloatingNav = styled('nav') `
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
const NavButton = styled('button') `
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: ${({ active }) => (active ? '#1976d2' : '#666')};
  background: ${({ active }) => (active ? 'rgba(25, 118, 210, 0.08)' : 'none')};
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
const FloatingNavigator = ({ isHeaderVisible }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [shouldRender, setShouldRender] = React.useState(show);
    const { t } = useTranslation();
    useEffect(() => {
        console.log('FloatingNavigator mounted');
        const handleScroll = () => {
            const threshold = 60;
            const scrollY = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
            setShow(scrollY > threshold);
            console.log('[FloatingNavigator] scrollY:', scrollY, 'show:', scrollY > threshold, 'isHeaderVisible:', isHeaderVisible);
        };
        //window.addEventListener('scroll', handleScroll, { passive: true });
        document.body.addEventListener('scroll', handleScroll, { passive: true });
        console.log('FloatingNavigator: scroll event registered');
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.removeEventListener('scroll', handleScroll);
            document.documentElement.removeEventListener('scroll', handleScroll);
            console.log('FloatingNavigator: scroll event removed');
        };
    }, []);
    React.useEffect(() => {
        if (show) {
            setShouldRender(true);
        }
        else {
            const timeout = setTimeout(() => setShouldRender(false), 400); // fade duration
            return () => clearTimeout(timeout);
        }
    }, [show]);
    console.log('FloatingNavigator render, show:', show, 'isHeaderVisible:', isHeaderVisible);
    if (!shouldRender || isHeaderVisible === false) {
        console.log('FloatingNavigator not shown');
        return null;
    }
    console.log('FloatingNavigator shown');
    const navItems = [
        { label: t('common.home'), icon: _jsx(HomeIcon, {}), path: '/home' },
        { label: t('common.community'), icon: _jsx(ForumIcon, {}), path: '/community' },
        { label: t('common.debate'), icon: _jsx(FireIcon, { children: "\uD83D\uDD25" }), path: '/debate' },
        { label: t('common.aiassistant'), icon: _jsx(ChatIcon, {}), path: '/assistant' },
        { label: t('common.mypage'), icon: _jsx(AccountCircleIcon, {}), path: '/mypage' },
    ];
    return (_jsx(FloatingNav, { visible: show, children: navItems.map(item => (_jsx(Tooltip, { title: item.label, placement: "right", arrow: true, children: _jsx(NavButton, { active: location.pathname.startsWith(item.path), onClick: () => navigate(item.path), "aria-label": item.label, children: item.icon }) }, item.path))) }));
};
export default FloatingNavigator;
