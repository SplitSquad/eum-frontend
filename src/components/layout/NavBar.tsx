import React, { useState } from 'react';
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
  Tooltip,
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
import { useThemeStore } from '../../features/theme/store/themeStore';
import { useLanguageStore } from '../../features/theme/store/languageStore';
import useAuthStore from '../../features/auth/store/authStore';
import { useTranslation } from '../../shared/i18n';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language';
import { SUPPORTED_LANGUAGES } from '../../features/onboarding/components/common/LanguageSelector';
import { useLanguageContext } from '../../features/theme/components/LanguageProvider';
import { AlarmCenter } from '@/components/notification/alarmCenter';

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
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
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

  // to는 현재 페이지, tag는 이동하려는 페이지
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
    sendWebLog({ userId, content: JSON.stringify(navLogPayload) });
    navigate(to);
  };
}

/**------------------------------------------------------------------------------------**/

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
    primary: 'rgba(255, 170, 165, 0.9)',
    secondary: 'rgba(255, 107, 107, 0.8)',
    text: '#333333',
    hover: 'rgba(255, 107, 107, 0.2)',
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
  background-color: ${props =>
    seasonalColors[props.season]?.background || 'rgba(255, 255, 255, 0.9)'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  color: ${props => seasonalColors[props.season]?.text || '#333333'};
`;

const NavButton = styled(Button)<{ season: string; active: boolean }>`
  margin: 0 8px;
  font-weight: ${props => (props.active ? '600' : '400')};
  color: ${props =>
    props.active ? seasonalColors[props.season]?.secondary : seasonalColors[props.season]?.text};
  padding: 6px 16px;
  position: relative;
  transition: all 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background-color: ${props =>
      props.active ? seasonalColors[props.season]?.secondary : 'transparent'};
    transition: all 0.3s ease;
  }

  &:hover {
    background-color: ${props => seasonalColors[props.season]?.hover};

    &:after {
      background-color: ${props => seasonalColors[props.season]?.secondary};
      opacity: ${props => (props.active ? '1' : '0.5')};
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

// 네비게이션 항목 정의
const getNavItems = (t: (key: string) => string) => [
  { name: t('common.home'), path: '/', icon: <HomeIcon /> },
  { name: t('common.community'), path: '/community', icon: <ForumIcon /> },
  { name: t('common.debate'), path: '/debate', icon: <ChatIcon /> },
  { name: t('AIAssistant'), path: '/assistant', icon: <ChatIcon /> },
  { name: t('common.mypage'), path: '/mypage', icon: <AccountCircleIcon />, requireAuth: true },
];

// NavBar 컴포넌트
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { season } = useThemeStore();
  const { language } = useLanguageStore();
  const { currentLanguage, changeLanguage } = useLanguageContext();
  const { t } = useTranslation();
  const { isAuthenticated, user, handleLogout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 번역된 네비게이션 항목
  const navItems = getNavItems(t);

  // 현재 경로에 따라 활성화 여부 반환
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // 프로필 메뉴 핸들러
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/google-login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // 모바일 드로어 핸들러
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 언어 메뉴 핸들러
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

  const trackedNavigate = useTrackedNavigation();
  return (
    <>
      <StyledAppBar position="sticky" season={season}>
        <Toolbar>
          {isMobile ? (
            <MobileMenuButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              season={season}
            >
              <MenuIcon />
            </MobileMenuButton>
          ) : null}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <LogoText variant="h6" season={season}>
              EUM
            </LogoText>
          </Box>
          {/* 데스크톱 네비게이션 링크 */}
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems
                .filter(item => !item.requireAuth || (item.requireAuth && isAuthenticated))
                .map(item => (
                  <NavButton
                    key={item.name}
                    season={season}
                    active={isActive(item.path)}
                    onClick={() =>
                      // 클릭 로그 + 네비게이션
                      trackedNavigate(
                        item.path, // ClickPath
                        item.name.toLowerCase() // TAG (예: 'home', 'community' 등)
                      )
                    }
                  >
                    {item.name}
                  </NavButton>
                ))}
            </Box>
          )}
          {/* 알림 센터 */}/{/* 언어 선택 메뉴 */}
          <Box sx={{ mr: 2 }}>
            <Tooltip title={t('common.selectLanguage')}>
              <IconButton
                onClick={handleLanguageMenuOpen}
                sx={{
                  color: seasonalColors[season]?.text,
                  '&:hover': {
                    backgroundColor: seasonalColors[season]?.hover,
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: '8px',
                  minWidth: '180px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={currentLanguage === lang.code}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: `${seasonalColors[season]?.hover}`,
                      '&:hover': {
                        backgroundColor: `${seasonalColors[season]?.hover}`,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <span>{lang.flag}</span>
                  </ListItemIcon>
                  <ListItemText>{lang.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* 사용자 프로필 또는 로그인 버튼 */}
          <Box sx={{ ml: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title={t('nav.accountSettings')}>
                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar
                      alt={user?.name || 'User'}
                      src={user?.picture || ''}
                      sx={{
                        width: 32,
                        height: 32,
                        border: `2px solid ${seasonalColors[season]?.secondary}`,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: '8px',
                      minWidth: '200px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    onClick={() => {
                      handleNavigation('/mypage');
                      handleProfileMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('common.mypage')}</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('common.logout')}</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={{
                  backgroundColor: seasonalColors[season]?.primary,
                  '&:hover': {
                    backgroundColor: seasonalColors[season]?.secondary,
                  },
                }}
              >
                {t('common.login')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* 모바일 드로어 메뉴 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: '280px',
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        <DrawerHeader season={season}>
          <LogoText variant="h6" season={season}>
            EUM
          </LogoText>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
        <List sx={{ p: 1 }}>
          {navItems
            .filter(item => !item.requireAuth || (item.requireAuth && isAuthenticated))
            .map(item => (
              <DrawerItem
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                season={season}
                active={isActive(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </DrawerItem>
            ))}

          {/* 모바일 언어 선택 */}
          <Divider sx={{ my: 2 }} />
          {SUPPORTED_LANGUAGES.map(lang => (
            <DrawerItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              season={season}
              active={currentLanguage === lang.code}
            >
              <ListItemIcon>
                <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              </ListItemIcon>
              <ListItemText primary={lang.name} />
            </DrawerItem>
          ))}

          <Divider sx={{ my: 2 }} />
          {isAuthenticated ? (
            <DrawerItem onClick={handleLogoutClick} season={season} active={false}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t('common.logout')} />
            </DrawerItem>
          ) : (
            <DrawerItem onClick={handleLogin} season={season} active={false}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={t('common.login')} />
            </DrawerItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
