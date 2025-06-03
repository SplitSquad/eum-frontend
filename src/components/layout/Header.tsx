import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material';
import styled from '@emotion/styled';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import useAuthStore from '@/features/auth/store/authStore';
import { useTranslation } from '@/shared/i18n';
import { useLanguageContext } from '@/features/theme/components/LanguageProvider';
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
import { AlarmCenter } from '@/components/notification/AlarmCenter';
import { InfoIcon } from 'lucide-react';
import { shouldForwardProp } from '@mui/system';
import { seasonalColors, SeasonColors } from '@/components/layout/springTheme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import homeIcon from '@/assets/icons/navigation/home.svg';
import forumIcon from '@/assets/icons/navigation/forum.svg';
import debateIcon from '@/assets/icons/navigation/debate.svg';
import chatIcon from '@/assets/icons/navigation/chat.svg';
import infoIcon from '@/assets/icons/navigation/info.svg';
import accountIcon from '@/assets/icons/navigation/account.svg';

/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

// 로그 전송 타입 정의
interface WebLog {
  userId: number;
  content: string;
}

// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;

// 로그 전송 함수
export function sendWebLog(log: WebLog) {
  // jwt token 가져오기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return; // 비로그인 상태면 로그 전송하지 않고 그냥 넘어감
  }
  fetch(`${BASE}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(log),
  }).catch(err => {
    console.error('WebLog 전송 실패:', err);
  });
  // 전송 완료
  console.log('WebLog 전송 성공:', log);
}

// useTrackedNavigation 훅
export function useTrackedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // to는 이동하려는 페이지, tag는 현재 페이지
  return (to: string, tag: string | null = null) => {
    const userId = getUserId() || 0;
    const navLogPayload = {
      UID: userId,
      ClickPath: location.pathname,
      TAG: tag,
      CurrentPath: location.pathname,
      Event: 'click',
      Content: `Navigated to ${to} from ${location.pathname}`,
      Timestamp: new Date().toISOString(),
    };
    // '/mypage'로 이동할 때는 로그를 보내지 않음
    if (tag !== '' && to !== '/mypage') {
      sendWebLog({ userId, content: JSON.stringify(navLogPayload) });
    }
    navigate(to);
  };
}

/**------------------------------------------------------------------------------------**/

// 스타일드 컴포넌트
const StyledAppBar = styled(AppBar)<{ season: string }>`
  ${props =>
    props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
      ? `
    background: linear-gradient(to bottom, ${seasonalColors[props.season]?.background}, #fff 98%);
  box-shadow: none;
  border-bottom: 0px solid rgba(0, 0, 0, 0);
  backdrop-filter: blur(10px);
    color: ${seasonalColors[props.season]?.text || '#333333'};
  `
      : ''}
  .MuiToolbar-root {
    min-height: 72px;
  }
`;

const NavButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isactive',
})<{ season: string; isactive: boolean }>`
  margin: 0 8px;
  font-weight: ${props => (props.isactive ? '600' : '400')};
  color: ${props =>
    props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
      ? props.isactive
        ? seasonalColors[props.season]?.secondary
        : seasonalColors[props.season]?.text
      : undefined};
  padding: 8px 16px 8px;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 48px;
  line-height: 1.2;
`;

const LoginNavButton = styled(NavButton)`
  && {
    font-weight: 700 !important;
    font-size: 1.1rem !important;
    color: white !important;
    background-color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.primary
        : undefined} !important;

    &:hover {
      background-color: ${props =>
        props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
          ? seasonalColors[props.season]?.secondary
          : undefined} !important;
    }

    .MuiButton-startIcon {
      margin-right: 8px;
      .MuiSvgIcon-root {
        font-size: 1.1rem;
        font-weight: bold;
      }
    }

    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

const MenuNavButton = styled(NavButton)`
  && {
    background: transparent !important;
    text-transform: none !important;
    min-width: auto !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 8px 12px 8px !important;
    margin: 0 4px 0 !important;
    line-height: 1.2 !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
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
      background-color: ${props =>
        props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
          ? seasonalColors[props.season]?.hover
          : undefined};
      border-radius: 4px !important;
      box-shadow: none !important;

      &:after {
        background-color: ${props =>
          props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
            ? seasonalColors[props.season]?.secondary
            : undefined};
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

const LogoText = styled(Typography)<{ season: string }>`
  font-weight: 700;
  font-size: 1.5rem;
  background-image: ${props =>
    props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
      ? `linear-gradient(135deg, ${seasonalColors[props.season]?.primary || '#ff7e5f'}, ${seasonalColors[props.season]?.secondary || '#feb47b'})`
      : 'none'};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
`;

const MobileMenuButton = styled(IconButton)<{ season: string }>`
  color: ${props =>
    props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
      ? seasonalColors[props.season]?.text
      : undefined};

  &:hover {
    background-color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.hover
        : undefined};
    color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.text
        : undefined};
  }
`;

const DrawerHeader = styled(Box)<{ season: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${props =>
    props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
      ? seasonalColors[props.season]?.primary
      : undefined};
  @media (max-width: 600px) {
    padding: 12px 10px;
  }
`;

const DrawerItem = styled(ListItem, {
  shouldForwardProp: prop => prop !== 'isactive',
})<{ season: string; isactive: boolean }>`
  margin: 4px 8px;
  border-radius: 8px;
  background-color: ${props =>
    (props.season === 'spring' || props.season === 'hanji' || props.season === 'professional') &&
    props.isactive
      ? seasonalColors[props.season]?.hover
      : 'transparent'};
  @media (max-width: 600px) {
    margin: 2px 0;
    padding: 10px 16px;
    font-size: 1.05rem;
  }
  &:hover {
    background-color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.hover
        : undefined};
  }
  .MuiListItemIcon-root {
    color: ${props =>
      (props.season === 'spring' || props.season === 'hanji' || props.season === 'professional') &&
      props.isactive
        ? seasonalColors[props.season]?.secondary
        : props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
          ? seasonalColors[props.season]?.text
          : undefined};
    @media (max-width: 600px) {
      min-width: 36px;
    }
  }
  .MuiListItemText-primary {
    color: ${props =>
      (props.season === 'spring' || props.season === 'hanji' || props.season === 'professional') &&
      props.isactive
        ? seasonalColors[props.season]?.secondary
        : props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
          ? seasonalColors[props.season]?.text
          : undefined};
    font-weight: ${props => (props.isactive ? '600' : '400')};
    @media (max-width: 600px) {
      font-size: 1.05rem;
    }
  }
`;

type NotificationItem = {
  id: number;
  content: string;
  language: string;
};

type HeaderProps = {
  isPlaying?: boolean;
  userName?: string;
  userCountry?: string;
  userType?: string;
  notifications?: NotificationItem[];
  isVisible?: boolean;
};

function logMenuClick(menuName: string, currentPath: string, clickPath: string) {
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
const getNavItems = (t: (key: string) => string) => [
  { name: t('common.home'), path: '/dashboard', icon: <HomeIcon /> },
  { name: t('common.info'), path: '/info', icon: <ForumIcon /> },
  {
    name: t('common.community'),
    path: '/community',
    icon: <ForumIcon />,
    dropdown: [
      { name: t('common.smallGroups'), path: '/community/groups' },
      { name: t('common.communicationBoard'), path: '/community/board' },
    ],
  },
  { name: t('common.debate'), path: '/debate', icon: <ChatIcon /> },
  { name: t('common.aiassistant'), path: '/assistant', icon: <ChatIcon /> },
  { name: t('common.mypage'), path: '/mypage', icon: <AccountCircleIcon />, requireAuth: true },
];

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
`;

const DropdownMenu = styled.div<{ season: string }>`
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
  padding: 0;
  margin-top: 0;
  width: fit-content;
  min-width: 120px;
`;

const CommunityDropdownItem = styled.div<{ season: string }>`
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
    background-color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.hover
        : undefined};
    color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.text
        : undefined};
  }
`;

const ProfileSection = styled(Box)<{ season: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
`;

const ProfileInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const ProfileName = styled(Typography)`
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
`;

const ProfileDetail = styled(Typography)`
  font-size: 0.8rem;
  color: #666666;
  line-height: 1.2;
`;

const ProfileRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.1rem;
`;

const DetailRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

// 구글 로그인 콜백 타입 정의
type GoogleLoginCallback = {
  status: 'redirecting' | 'success' | 'error';
  error?: any;
};

const MenuContainer = styled(Box)`
  display: flex;
  align-items: center;
  height: 100%;
`;

const ProfileDropdown = styled(Box)<{ season: string }>`
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

const ProfileDropdownItem = styled(Box)<{ season: string }>`
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
    background-color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.hover
        : undefined};
    color: ${props =>
      props.season === 'spring' || props.season === 'hanji' || props.season === 'professional'
        ? seasonalColors[props.season]?.text
        : undefined};
  }
`;

// Add a mobile-friendly language selector styled component
const MobileLanguageSelector = styled('div')`
  width: 100%;
  padding: 12px 16px 16px 16px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
  @media (min-width: 600px) {
    display: none;
  }
`;

function Header({ isVisible = true, notifications }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguageStore();
  const { currentLanguage, changeLanguage } = useLanguageContext();
  const { t } = useTranslation();
  const { isAuthenticated, user, handleLogout, loadUser } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('auth_token');
  console.log('headcheck user:', user);
  // user 정보에서 가져오기 (없으면 기본값)
  const userName = user?.name || 'user';
  const userCountry = user?.nation || t('header.country');
  const userType = user?.visitPurpose || t('header.study');

  // 인증 상태가 변경될 때마다 사용자 정보 로드
  useEffect(() => {
    // 토큰이 있는지 확인
    console.log('token:', token);
    if (token && isAuthenticated) {
      loadUser();
    }
  }, [token, isAuthenticated, loadUser]);

  // 컴포넌트 마운트 시 사용자 정보 로드 (새로고침 시 즉시 반영)
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && !user?.profileImagePath) {
      loadUser();
    }
  }, [user?.profileImagePath, loadUser]);

  // 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityAnchorEl, setCommunityAnchorEl] = useState<null | HTMLElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const season = 'professional';
  const isactive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    handleProfileMenuClose();
    navigate('/google-login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);

    // 온보딩 페이지 언어 변경은 새로고침이 되어야 번역 돼서 새로기침 로직 추가해요!
    if (location.pathname.startsWith('/onboarding')) {
      window.location.reload();
    }
    handleLanguageMenuClose();
  };
  const handleMenuClick = (path: string, menuName: string) => {
    logMenuClick(menuName, location.pathname, path);
    navigate(path);
  };

  const trackedNavigate = useTrackedNavigation();

  const handleCommunityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCommunityAnchorEl(event.currentTarget);
  };

  const handleCommunityMenuClose = () => {
    setCommunityAnchorEl(null);
  };

  const handleCommunityItemClick = (path: string) => {
    handleNavigation(path);
    handleCommunityMenuClose();
  };

  const navItems = React.useMemo(() => getNavItems(t), [t, language]);

  const handleGoogleLogin = async () => {
    /*try {
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login error:', error);
    }*/
    navigate('/google-login');
  };

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    setIsProfileMenuOpen(false);
    navigate(path);
  };

  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  return (
    <header>
      <StyledAppBar
        season={season}
        position="sticky"
        sx={{
          ...(isMobile && {
            minHeight: 56,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: isMobile ? 56 : '72px',
            px: isMobile ? 1 : 3,
            position: 'sticky',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 로고 - Always visible */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              ...(isMobile && { flex: 1 }),
            }}
            onClick={() => handleMenuClick('/home', '로고')}
          >
            <LogoText season={season} sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
              EUM
            </LogoText>
          </Box>

          {!isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* 헤더 우측 영역: 온보딩/일반 분기 */}
          {location.pathname.startsWith('/onboarding') ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 4, height: 48 }}>
              {/* 로그인 상태: 로그아웃+지구본 */}
              {isAuthenticated && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogoutClick}
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'white',
                    backgroundColor: seasonalColors[season]?.primary,
                    '&:hover': {
                      backgroundColor: seasonalColors[season]?.secondary,
                    },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 2000,
                  }}
                >
                  {t('common.logout')}
                </Button>
              )}
              {/* 지구본(언어선택)은 항상 */}
              <IconButton onClick={handleLanguageMenuOpen} sx={{ ml: 0.5, width: 40, height: 40 }}>
                <LanguageIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          ) : (
            isVisible && (
              <>
                {/* 데스크톱 메뉴 */}
                {!isMobile && (
                  <MenuContainer>
                    {navItems.map(item => (
                      <React.Fragment key={item.path}>
                        {item.dropdown ? (
                          <DropdownContainer
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                          >
                            <MenuNavButton
                              season={season}
                              isactive={isactive(item.path)}
                              onClick={() => trackedNavigate('/community', item.name.toLowerCase())}
                            >
                              {item.name}
                            </MenuNavButton>
                            <DropdownMenu
                              season={season}
                              style={{
                                opacity: isDropdownOpen ? 1 : 0,
                                visibility: isDropdownOpen ? 'visible' : 'hidden',
                                transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                              }}
                            >
                              {item.dropdown.map(subItem => {
                                const isSubActive =
                                  (subItem.path === '/community/groups' &&
                                    (location.pathname === '/community' ||
                                      location.pathname.startsWith('/community/groups'))) ||
                                  location.pathname === subItem.path;
                                return (
                                  <CommunityDropdownItem
                                    key={subItem.path}
                                    season={season}
                                    onClick={
                                      isSubActive
                                        ? undefined
                                        : () =>
                                            trackedNavigate(
                                              subItem.path,
                                              subItem.name.toLowerCase()
                                            )
                                    }
                                    style={{
                                      background: undefined,
                                      color: isSubActive ? 'rgba(89, 89, 89, 0.64)' : undefined,
                                      pointerEvents: isSubActive ? 'none' : undefined,
                                      opacity: isSubActive ? 0.7 : 1,
                                    }}
                                  >
                                    {subItem.name}
                                  </CommunityDropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </DropdownContainer>
                        ) : (
                          <MenuNavButton
                            season={season}
                            isactive={isactive(item.path)}
                            onClick={() => trackedNavigate(item.path, item.name.toLowerCase())}
                          >
                            {item.name}
                          </MenuNavButton>
                        )}
                      </React.Fragment>
                    ))}
                  </MenuContainer>
                )}

                {/* 유저 정보 + 알림 (PC) */}
                {!isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 4, height: 48 }}>
                    {/* 프로필 */}
                    {isAuthenticated ? (
                      <Box sx={{ position: 'relative' }} ref={profileMenuRef}>
                        <ProfileSection season={season} onClick={handleProfileClick}>
                          <Avatar
                            src={user?.profileImagePath || user?.picture}
                            alt={user?.name || 'User'}
                            sx={{
                              width: 40,
                              height: 40,
                              border: `2px solid ${seasonalColors[season]?.primary}`,
                              cursor: 'pointer',
                            }}
                          />
                          <ProfileInfo>
                            <ProfileRow>
                              <ProfileName>{userName}</ProfileName>
                            </ProfileRow>
                            <DetailRow>
                              <ProfileDetail>{userType}</ProfileDetail>
                              <ProfileDetail>{userCountry}</ProfileDetail>
                            </DetailRow>
                          </ProfileInfo>
                        </ProfileSection>

                        {isProfileMenuOpen && (
                          <ProfileDropdown season={season}>
                            {/* 관리자일 때만 보이는 관리자 페이지 버튼 */}
                            {user?.role === 'ROLE_ADMIN' && (
                              <ProfileDropdownItem
                                season={season}
                                onClick={() => handleMenuItemClick('/adminpage')}
                              >
                                <AccountCircleIcon />
                                {t('header.adminpage')}
                              </ProfileDropdownItem>
                            )}
                            <ProfileDropdownItem
                              season={season}
                              onClick={() => handleMenuItemClick('/mypage')}
                            >
                              <AccountCircleIcon />
                              {t('header.mypage')}
                            </ProfileDropdownItem>
                            <ProfileDropdownItem season={season} onClick={handleLogoutClick}>
                              <LogoutIcon />
                              {t('header.logout')}
                            </ProfileDropdownItem>
                          </ProfileDropdown>
                        )}
                      </Box>
                    ) : (
                      <LoginNavButton
                        variant="contained"
                        onClick={handleGoogleLogin}
                        startIcon={<LoginIcon />}
                        season={season}
                        isactive={false}
                      >
                        {t('common.login')}
                      </LoginNavButton>
                    )}

                    {/* 알림 */}
                    <Box
                      sx={{
                        ml: 2,
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        height: 48,
                        width: 40,
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AlarmCenter />
                      </Box>
                    </Box>

                    {/* 언어 선택 */}
                    <IconButton
                      onClick={handleLanguageMenuOpen}
                      sx={{ ml: 0.5, width: 40, height: 40 }}
                    >
                      <LanguageIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                  </Box>
                )}

                {/* 모바일: 햄버거 메뉴 버튼만 우측에 노출 */}
                {isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                    {/* 알림 버튼: 알림이 있을 때만 노출 */}
                    {notifications && notifications.length > 0 && (
                      <Box
                        sx={{
                          mr: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          height: 48,
                          width: 40,
                          justifyContent: 'center',
                        }}
                      >
                        <AlarmCenter />
                      </Box>
                    )}
                    <IconButton onClick={toggleDrawer}>
                      <MenuIcon fontSize="large" />
                    </IconButton>
                  </Box>
                )}
              </>
            )
          )}

          {/* 언어 선택 메뉴 - Only render if isVisible is true */}
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageMenuClose}
          >
            {(location.pathname.startsWith('/onboarding')
              ? SUPPORTED_LANGUAGES.slice(0, 2) // 온보딩: 상위 2개만 표시되도록 수정했습니다. (언어 번역이 영어까지만 돼서 ㅠㅠ)
              : SUPPORTED_LANGUAGES
            ) // 그 외: 전체
              .map(lang => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={currentLanguage === lang.code}
                >
                  {lang.name}
                </MenuItem>
              ))}
          </Menu>

          {/* 모바일 드로어 - Only render if isVisible is true */}
          {isVisible && (
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
              <DrawerHeader season={season}>
                <LogoText season={season}>EUM</LogoText>
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              </DrawerHeader>
              <List>
                {navItems.map(item => {
                  let iconImg: string | null = null;
                  if (item.path === '/dashboard') iconImg = homeIcon;
                  else if (item.path === '/info') iconImg = infoIcon;
                  else if (item.path === '/community') iconImg = forumIcon;
                  else if (item.path === '/debate') iconImg = debateIcon;
                  else if (item.path === '/assistant') iconImg = chatIcon;
                  else if (item.path === '/mypage') iconImg = accountIcon;
                  return (
                    <DrawerItem
                      key={item.path}
                      season={season}
                      isactive={isactive(item.path)}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {iconImg ? (
                          <img src={iconImg} alt={item.name} style={{ width: 28, height: 28 }} />
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </DrawerItem>
                  );
                })}
                <Divider />
                {isAuthenticated ? (
                  <DrawerItem season={season} isactive={false} onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('common.logout')} />
                  </DrawerItem>
                ) : (
                  <DrawerItem season={season} isactive={false} onClick={handleGoogleLogin}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('common.login')} />
                  </DrawerItem>
                )}
              </List>
              {/* 모바일 언어 선택 드롭다운 */}
              <MobileLanguageSelector>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                  {t('common.language')}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={mobileLangOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#333',
                    background: '#fff',
                    borderColor: '#eee',
                    width: '100%',
                    textTransform: 'none',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => setMobileLangOpen(open => !open)}
                >
                  {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name ||
                    currentLanguage}
                </Button>
                <Collapse in={mobileLangOpen} timeout={200} unmountOnExit>
                  <Box
                    sx={{
                      mt: 1,
                      border: '1px solid #eee',
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <Button
                        key={lang.code}
                        variant="text"
                        size="small"
                        sx={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          px: 2,
                          py: 1,
                          color:
                            currentLanguage === lang.code ? theme.palette.primary.main : '#333',
                          fontWeight: currentLanguage === lang.code ? 700 : 500,
                          background: 'none',
                          borderRadius: 0,
                          fontSize: '0.95rem',
                        }}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setMobileLangOpen(false);
                        }}
                        disabled={currentLanguage === lang.code}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </Box>
                </Collapse>
              </MobileLanguageSelector>
            </Drawer>
          )}
        </Toolbar>
        {/* When isVisible is false, show logout button at far right if authenticated (온보딩 경로는 제외) */}
        {!isVisible && isAuthenticated && !location.pathname.startsWith('/onboarding') && (
          <Box sx={{ position: 'absolute', right: 24, top: 16 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white',
                backgroundColor: seasonalColors[season]?.primary,
                '&:hover': {
                  backgroundColor: seasonalColors[season]?.secondary,
                },
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 2000,
              }}
            >
              {t('common.logout')}
            </Button>
          </Box>
        )}
      </StyledAppBar>
    </header>
  );
}

export default Header;
