import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, } from '@mui/material';
import styled from '@emotion/styled';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import useAuthStore from '@/features/auth/store/authStore';
import { useTranslation } from '@/shared/i18n';
import { useLanguageContext } from '@/features/theme/components/LanguageProvider';
import Notification from '@/components/feedback/Notification';
import { mockNotifications } from '@/tests/mocks';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language';
import { SUPPORTED_LANGUAGES } from '@/features/onboarding/components/common/LanguageSelector';
import { getGoogleAuthUrl } from '@/features/auth/api/authApi';
// 계절별 색상 정의
const seasonalColors = {
    spring: {
        primary: 'rgba(255, 200, 200, 0.9)',
        secondary: 'rgba(255, 150, 150, 0.8)',
        text: '#333333',
        hover: 'rgba(255, 150, 150, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
    },
    summer: {
        primary: 'rgba(100, 180, 255, 0.9)',
        secondary: 'rgba(0, 150, 255, 0.8)',
        text: '#333333',
        hover: 'rgba(100, 180, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
    },
    autumn: {
        primary: 'rgba(210, 105, 30, 0.9)',
        secondary: 'rgba(180, 80, 10, 0.8)',
        text: '#333333',
        hover: 'rgba(210, 105, 30, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
    },
    winter: {
        primary: 'rgba(176, 196, 222, 0.9)',
        secondary: 'rgba(70, 130, 180, 0.8)',
        text: '#333333',
        hover: 'rgba(176, 196, 222, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
    },
};
// 스타일드 컴포넌트
const StyledAppBar = styled(AppBar) `
  background: linear-gradient(
    to bottom,
    rgba(230, 245, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  box-shadow: none;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  color: ${props => seasonalColors[props.season]?.text || '#333333'};

  .MuiToolbar-root {
    min-height: 72px;
  }
`;
const NavButton = styled(Button) `
  margin: 0 8px;
  font-weight: ${props => (props.active ? '600' : '400')};
  color: ${props => props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
  padding: 6px 16px 2px;
  position: relative;
  transition: all 0.3s ease;
`;
const LoginNavButton = styled(NavButton) `
  && {
    font-weight: 700 !important;
    font-size: 1.1rem !important;
    color: white !important;
    background-color: ${props => seasonalColors[props.season]?.primary} !important;

    &:hover {
      background-color: ${props => seasonalColors[props.season]?.secondary} !important;
    }

    .MuiButton-startIcon {
      margin-right: 8px;
      .MuiSvgIcon-root {
        font-size: 1.1rem;
        font-weight: bold;
      }
    }
  }
`;
const MenuNavButton = styled(NavButton) `
  && {
    background: transparent !important;
    text-transform: none !important;
    min-width: auto !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 12px 8px !important;
    margin: 0 4px 0 !important;
    line-height: 1 !important;
    height: auto !important;
    font-weight: 600 !important;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      border-radius: 3px;
      background-color: transparent;
      transition: all 0.3s ease;
      opacity: 0;
    }

    &:hover {
      background-color: ${props => seasonalColors[props.season]?.hover};
      border-radius: 4px !important;
      box-shadow: none !important;

      &:after {
        background-color: ${props => seasonalColors[props.season]?.secondary};
        opacity: 0.5;
      }
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: none;
    }
  }
`;
const LogoText = styled(Typography) `
  font-weight: 700;
  font-size: 1.5rem;
  background-image: linear-gradient(
    135deg,
    ${props => seasonalColors[props.season]?.primary || '#ff7e5f'},
    ${props => seasonalColors[props.season]?.secondary || '#feb47b'}
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
`;
const MobileMenuButton = styled(IconButton) `
  color: ${props => seasonalColors[props.season]?.text};

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
  }
`;
const DrawerHeader = styled(Box) `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${props => seasonalColors[props.season]?.primary};
`;
const DrawerItem = styled(ListItem) `
  margin: 4px 8px;
  border-radius: 8px;
  background-color: ${props => props.active ? seasonalColors[props.season]?.hover : 'transparent'};

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
  }

  .MuiListItemIcon-root {
    color: ${props => props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
  }

  .MuiListItemText-primary {
    color: ${props => props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
    font-weight: ${props => (props.active ? '600' : '400')};
  }
`;
function logMenuClick(menuName, currentPath, clickPath) {
    const rawData = {
        event: 'click',
        currentPath,
        menuName,
        clickPath,
        timestamp: new Date().toISOString(),
    };
    console.log('Web Log:', rawData);
}
// 네비게이션 항목 정의
const getNavItems = (t) => [
    { name: t('common.home'), path: '/home', icon: _jsx(HomeIcon, {}) },
    {
        name: t('common.community'),
        path: '/community',
        icon: _jsx(ForumIcon, {}),
        dropdown: [
            { name: t('common.smallGroups'), path: '/community/groups' },
            { name: t('common.communicationBoard'), path: '/community/board' },
        ],
    },
    { name: t('common.debate'), path: '/debate', icon: _jsx(ChatIcon, {}) },
    { name: t('common.aiassistant'), path: '/assistant', icon: _jsx(ChatIcon, {}) },
    { name: t('common.mypage'), path: '/mypage', icon: _jsx(AccountCircleIcon, {}), requireAuth: true },
];
const DropdownContainer = styled.div `
  position: relative;
  display: inline-block;
  text-align: center;
`;
const DropdownMenu = styled.div `
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
  padding: 4px 0;
  margin-top: 4px;
  width: fit-content;
  min-width: 120px;
`;
const CommunityDropdownItem = styled.div `
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
    color: ${props => seasonalColors[props.season]?.text};
  }
`;
const ProfileSection = styled(Box) `
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
`;
const ProfileInfo = styled(Box) `
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;
const ProfileName = styled(Typography) `
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
`;
const ProfileDetail = styled(Typography) `
  font-size: 0.8rem;
  color: #666666;
  line-height: 1.2;
`;
const FlagEmoji = styled.span `
  font-size: 1.2rem;
  line-height: 1.2;
`;
const ProfileRow = styled(Box) `
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.1rem;
`;
const DetailRow = styled(Box) `
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;
const MenuContainer = styled(Box) `
  display: flex;
  align-items: flex-end;
  gap: 0;
  height: 100%;
  padding-bottom: 2px;
  margin-bottom: -2px;
  position: relative;
  top: 50%;
  transform: translateY(50%);
`;
const ProfileDropdown = styled(Box) `
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  padding: 4px 0;
  width: calc(100% - 1rem);
`;
const ProfileDropdownItem = styled(Box) `
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  box-sizing: border-box;
  width: 100%;

  .MuiSvgIcon-root {
    margin-right: 12px;
    font-size: 1.2rem;
  }

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
    color: ${props => seasonalColors[props.season]?.text};
  }
`;
function Header({ userName = '기본값', userCountry = '한국', userType = '유학', isVisible = true, }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { season } = useThemeStore();
    const { language } = useLanguageStore();
    const { currentLanguage, changeLanguage } = useLanguageContext();
    const { t } = useTranslation();
    const { isAuthenticated, user, handleLogout, loadUser } = useAuthStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const token = localStorage.getItem('auth_token');
    // 인증 상태가 변경될 때마다 사용자 정보 로드
    useEffect(() => {
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        // 토큰이 있는지 확인
        console.log('token:', token);
        if (token) {
            console.log('Header: 사용자 정보 로드 시작');
            loadUser();
        }
    }, [token]);
    // 국가 코드에 따른 국기 이모지 매핑
    const getCountryFlag = (country) => {
        const countryCode = country === '한국'
            ? 'ko'
            : country === '미국'
                ? 'en'
                : country === '일본'
                    ? 'ja'
                    : country === '중국'
                        ? 'zh'
                        : country === '독일'
                            ? 'de'
                            : country === '프랑스'
                                ? 'fr'
                                : country === '스페인'
                                    ? 'es'
                                    : country === '러시아'
                                        ? 'ru'
                                        : 'ko';
        const lang = SUPPORTED_LANGUAGES.find(l => l.code === countryCode);
        return lang?.flag || '🌎';
    };
    const flagEmoji = getCountryFlag(userCountry);
    // 상태 관리
    const [anchorEl, setAnchorEl] = useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [communityAnchorEl, setCommunityAnchorEl] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const isActive = (path) => location.pathname === path;
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogoutClick = () => {
        handleLogout();
        handleProfileMenuClose();
        navigate('/home');
    };
    const handleNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };
    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };
    const handleLanguageChange = (languageCode) => {
        changeLanguage(languageCode);
        handleLanguageMenuClose();
    };
    const handleMenuClick = (path, menuName) => {
        logMenuClick(menuName, location.pathname, path);
        navigate(path);
    };
    const handleCommunityMenuOpen = (event) => {
        setCommunityAnchorEl(event.currentTarget);
    };
    const handleCommunityMenuClose = () => {
        setCommunityAnchorEl(null);
    };
    const handleCommunityItemClick = (path) => {
        handleNavigation(path);
        handleCommunityMenuClose();
    };
    const navItems = getNavItems(t);
    const handleGoogleLogin = async () => {
        try {
            const authUrl = await getGoogleAuthUrl();
            window.location.href = authUrl;
        }
        catch (error) {
            console.error('Google login error:', error);
        }
    };
    // 프로필 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleProfileClick = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };
    const handleMenuItemClick = (path) => {
        setIsProfileMenuOpen(false);
        navigate(path);
    };
    return (_jsx("header", { children: _jsx(StyledAppBar, { season: season, children: _jsxs(Toolbar, { sx: { minHeight: '72px' }, children: [_jsx(Box, { sx: { display: 'flex', alignItems: 'center', cursor: 'pointer' }, onClick: () => handleMenuClick('/home', '로고'), children: _jsx(LogoText, { season: season, children: "EUM" }) }), _jsx(Box, { sx: { flexGrow: 1 } }), isVisible && (_jsxs(_Fragment, { children: [!isMobile && (_jsx(MenuContainer, { children: navItems.map(item => (_jsx(React.Fragment, { children: item.dropdown ? (_jsxs(DropdownContainer, { onMouseEnter: () => setIsDropdownOpen(true), onMouseLeave: () => setIsDropdownOpen(false), children: [_jsx(MenuNavButton, { season: season, active: isActive(item.path), onClick: () => handleNavigation(item.path), children: item.name }), _jsx(DropdownMenu, { season: season, style: {
                                                    opacity: isDropdownOpen ? 1 : 0,
                                                    visibility: isDropdownOpen ? 'visible' : 'hidden',
                                                    transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                                                }, children: item.dropdown.map(subItem => (_jsx(CommunityDropdownItem, { season: season, onClick: () => handleNavigation(subItem.path), children: subItem.name }, subItem.path))) })] })) : (_jsx(MenuNavButton, { season: season, active: isActive(item.path), onClick: () => handleNavigation(item.path), children: item.name })) }, item.path))) })), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1, ml: 4 }, children: [isAuthenticated ? (_jsxs(Box, { sx: { position: 'relative' }, ref: profileMenuRef, children: [_jsxs(ProfileSection, { season: season, onClick: handleProfileClick, children: [_jsx(Avatar, { src: user?.profileImagePath || user?.picture, alt: user?.name || 'User', sx: {
                                                            width: 40,
                                                            height: 40,
                                                            border: `2px solid ${seasonalColors[season]?.primary}`,
                                                            cursor: 'pointer',
                                                        } }), _jsxs(ProfileInfo, { children: [_jsxs(ProfileRow, { children: [_jsx(ProfileName, { children: user?.name || userName }), _jsx(FlagEmoji, { children: flagEmoji })] }), _jsxs(DetailRow, { children: [_jsx(ProfileDetail, { children: userType }), _jsx(ProfileDetail, { children: userCountry })] })] })] }), isProfileMenuOpen && (_jsxs(ProfileDropdown, { season: season, children: [_jsxs(ProfileDropdownItem, { season: season, onClick: () => handleMenuItemClick('/mypage'), children: [_jsx(AccountCircleIcon, {}), "\uB9C8\uC774\uD398\uC774\uC9C0"] }), _jsxs(ProfileDropdownItem, { season: season, onClick: handleLogoutClick, children: [_jsx(LogoutIcon, {}), "\uB85C\uADF8\uC544\uC6C3"] })] }))] })) : (_jsx(LoginNavButton, { variant: "contained", onClick: handleGoogleLogin, startIcon: _jsx(LoginIcon, {}), season: season, active: false, children: t('common.login') })), _jsx(Notification, { items: mockNotifications }), _jsx(IconButton, { onClick: handleLanguageMenuOpen, sx: { ml: 0.5 }, children: _jsx(LanguageIcon, {}) }), isMobile && (_jsx(IconButton, { onClick: toggleDrawer, children: _jsx(MenuIcon, {}) }))] })] })), isVisible && (_jsx(Menu, { anchorEl: languageAnchorEl, open: Boolean(languageAnchorEl), onClose: handleLanguageMenuClose, children: SUPPORTED_LANGUAGES.map(lang => (_jsx(MenuItem, { onClick: () => handleLanguageChange(lang.code), selected: currentLanguage === lang.code, children: lang.name }, lang.code))) })), isVisible && (_jsxs(Drawer, { anchor: "right", open: drawerOpen, onClose: toggleDrawer, children: [_jsxs(DrawerHeader, { season: season, children: [_jsx(LogoText, { season: season, children: "EUM" }), _jsx(IconButton, { onClick: toggleDrawer, children: _jsx(CloseIcon, {}) })] }), _jsxs(List, { children: [navItems.map(item => (_jsxs(DrawerItem, { season: season, active: isActive(item.path), onClick: () => handleNavigation(item.path), children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.name })] }, item.path))), _jsx(Divider, {}), isAuthenticated ? (_jsxs(DrawerItem, { season: season, active: false, onClick: handleLogoutClick, children: [_jsx(ListItemIcon, { children: _jsx(LogoutIcon, {}) }), _jsx(ListItemText, { primary: t('common.logout') })] })) : (_jsxs(DrawerItem, { season: season, active: false, onClick: handleGoogleLogin, children: [_jsx(ListItemIcon, { children: _jsx(LoginIcon, {}) }), _jsx(ListItemText, { primary: t('common.login') })] }))] })] }))] }) }) }));
}
export default Header;
