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
} from '@mui/material';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SUPPORTED_LANGUAGES } from '@/features/onboarding/components/common/LanguageSelector';
import { getGoogleAuthUrl } from '@/features/auth/api/authApi';
// import Cloud from '@/components/animations/Cloud';

// 계절별 스타일 적용을 위한 타입
type SeasonColors = {
  primary: string;
  secondary: string;
  text: string;
  hover: string;
  background: string;
};

// 계절별 색상 정의
const seasonalColors: Record<string, SeasonColors> = {
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
const StyledAppBar = styled(AppBar)<{ season: string }>`
  background: linear-gradient(to bottom, rgba(235, 245, 255, 0.95), rgba(255, 255, 255, 0.98));
  );
  box-shadow: none;
  border-bottom: 0px solid rgba(0, 0, 0, 0);
  backdrop-filter: blur(10px);
  color: ${props => seasonalColors[props.season]?.text || '#333333'};

  .MuiToolbar-root {
    min-height: 72px;
  }
`;

const NavButton = styled(Button)<{ season: string; active: boolean }>`
  margin: 0 8px;
  font-weight: ${props => (props.active ? '600' : '400')};
  color: ${props =>
    props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
  padding: 6px 16px 2px;
  position: relative;
  transition: all 0.3s ease;
`;

const LoginNavButton = styled(NavButton)`
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

const MenuNavButton = styled(NavButton)`
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

const LogoText = styled(Typography)<{ season: string }>`
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

const MobileMenuButton = styled(IconButton)<{ season: string }>`
  color: ${props => seasonalColors[props.season]?.text};

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
  }
`;

const DrawerHeader = styled(Box)<{ season: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${props => seasonalColors[props.season]?.primary};
`;

const DrawerItem = styled(ListItem)<{ season: string; active: boolean }>`
  margin: 4px 8px;
  border-radius: 8px;
  background-color: ${props =>
    props.active ? seasonalColors[props.season]?.hover : 'transparent'};

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};
  }

  .MuiListItemIcon-root {
    color: ${props =>
      props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
  }

  .MuiListItemText-primary {
    color: ${props =>
      props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
    font-weight: ${props => (props.active ? '600' : '400')};
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
  { name: t('common.home'), path: '/home', icon: <HomeIcon /> },
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
  padding: 4px 0;
  margin-top: 4px;
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
    background-color: ${props => seasonalColors[props.season]?.hover};
    color: ${props => seasonalColors[props.season]?.text};
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

const FlagEmoji = styled.span`
  font-size: 1.2rem;
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
  align-items: flex-end;
  gap: 0;
  height: 100%;
  padding-bottom: 2px;
  margin-bottom: -2px;
  position: relative;
  top: 50%;
  transform: translateY(50%);
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
    background-color: ${props => seasonalColors[props.season]?.hover};
    color: ${props => seasonalColors[props.season]?.text};
  }
`;

function Header({
  userName = '기본값',
  userCountry = '한국',
  userType = '유학',
  isVisible = true,
}: HeaderProps) {
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
  const getCountryFlag = (country: string) => {
    const countryCode =
      country === '한국'
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityAnchorEl, setCommunityAnchorEl] = useState<null | HTMLElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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
    handleLanguageMenuClose();
  };

  const handleMenuClick = (path: string, menuName: string) => {
    logMenuClick(menuName, location.pathname, path);
    navigate(path);
  };

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

  const navItems = getNavItems(t);

  const handleGoogleLogin = async () => {
    try {
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login error:', error);
    }
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

  return (
    <header>
      <StyledAppBar season={season} position="sticky">
        <Toolbar sx={{ minHeight: '72px', position: 'sticky' }}>
          {/* 로고 - Always visible */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleMenuClick('/home', '로고')}
          >
            <LogoText season={season}>EUM</LogoText>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Only render other components if isVisible is true */}
          {isVisible && (
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
                            active={isActive(item.path)}
                            onClick={() => handleNavigation(item.path)}
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
                                    isSubActive ? undefined : () => handleNavigation(subItem.path)
                                  }
                                  style={{
                                    background: undefined,
                                    color: isSubActive ? '#e91e63' : undefined,
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
                          active={isActive(item.path)}
                          onClick={() => handleNavigation(item.path)}
                        >
                          {item.name}
                        </MenuNavButton>
                      )}
                    </React.Fragment>
                  ))}
                </MenuContainer>
              )}

              {/* 유저 정보 + 알림 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
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
                          <ProfileName>{user?.name || userName}</ProfileName>
                          <FlagEmoji>{flagEmoji}</FlagEmoji>
                        </ProfileRow>
                        <DetailRow>
                          <ProfileDetail>{userType}</ProfileDetail>
                          <ProfileDetail>{userCountry}</ProfileDetail>
                        </DetailRow>
                      </ProfileInfo>
                    </ProfileSection>

                    {isProfileMenuOpen && (
                      <ProfileDropdown season={season}>
                        <ProfileDropdownItem
                          season={season}
                          onClick={() => handleMenuItemClick('/mypage')}
                        >
                          <AccountCircleIcon />
                          마이페이지
                        </ProfileDropdownItem>
                        <ProfileDropdownItem season={season} onClick={handleLogoutClick}>
                          <LogoutIcon />
                          로그아웃
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
                    active={false}
                  >
                    {t('common.login')}
                  </LoginNavButton>
                )}

                {/* 알림 */}
                <Notification items={mockNotifications} />

                {/* 언어 선택 */}
                <IconButton onClick={handleLanguageMenuOpen} sx={{ ml: 0.5 }}>
                  <LanguageIcon />
                </IconButton>

                {/* 모바일 메뉴 버튼 */}
                {isMobile && (
                  <IconButton onClick={toggleDrawer}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            </>
          )}

          {/* 언어 선택 메뉴 - Only render if isVisible is true */}
          {isVisible && (
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={currentLanguage === lang.code}
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Menu>
          )}

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
                {navItems.map(item => (
                  <DrawerItem
                    key={item.path}
                    season={season}
                    active={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </DrawerItem>
                ))}
                <Divider />
                {isAuthenticated ? (
                  <DrawerItem season={season} active={false} onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('common.logout')} />
                  </DrawerItem>
                ) : (
                  <DrawerItem season={season} active={false} onClick={handleGoogleLogin}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('common.login')} />
                  </DrawerItem>
                )}
              </List>
            </Drawer>
          )}
        </Toolbar>
      </StyledAppBar>
    </header>
  );
}

export default Header;
