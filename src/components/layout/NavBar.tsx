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
import useAuthStore from '../../features/auth/store/authStore';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

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

// 네비게이션 항목
const navItems = [
  { name: '홈', path: '/', icon: <HomeIcon /> },
  { name: '모임과이야기', path: '/community', icon: <ForumIcon /> },
  { name: '핫이슈토론', path: '/debate', icon: <ChatIcon /> },
  { name: 'AI전문가', path: '/assistant', icon: <ChatIcon /> },
  { name: '마이페이지', path: '/mypage', icon: <AccountCircleIcon />, requireAuth: true },
];

// NavBar 컴포넌트
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { season } = useThemeStore();
  const { isAuthenticated, user, handleLogout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.name}
                  </NavButton>
                ))}
            </Box>
          )}

          {/* 사용자 프로필 또는 로그인 버튼 */}
          <Box sx={{ ml: 2 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="계정 설정">
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
                    <ListItemText>마이페이지</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>로그아웃</ListItemText>
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
                로그인
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
          <Divider sx={{ my: 2 }} />
          {isAuthenticated ? (
            <DrawerItem onClick={handleLogoutClick} season={season} active={false}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </DrawerItem>
          ) : (
            <DrawerItem onClick={handleLogin} season={season} active={false}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="로그인" />
            </DrawerItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
