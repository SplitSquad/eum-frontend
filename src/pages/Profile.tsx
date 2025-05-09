import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuthStore } from '../features/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

// 프로필 카드 스타일링
const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 235, 235, 0.8)',
  marginBottom: theme.spacing(4),
}));

// 사용자 아바타 스타일링
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  border: '4px solid #FFD7D7',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

// 프로필 섹션 스타일링
const ProfileSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

// 버튼 스타일링
const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 8,
  padding: '10px 24px',
  backgroundColor: '#FF9999',
  color: 'white',
  '&:hover': {
    backgroundColor: '#FF7777',
  },
}));

/**
 * 프로필 페이지 컴포넌트
 * 사용자 정보 표시 및 로그아웃 기능 제공
 *
 * TODO: 백엔드 API 연동 시 실제 사용자 정보를 표시하도록 수정 필요
 */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, handleLogout } = useAuthStore();

  // 로그아웃 처리
  const onLogout = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#FF9999' }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            사용자 정보를 찾을 수 없습니다.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
            로그인하러 가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
        내 프로필
      </Typography>

      <Box mt={4}>
        {/* 사용자 기본 정보 카드 */}
        <ProfileCard elevation={2}>
          <Box textAlign="center">
            <StyledAvatar src={user.picture}>
              {!user.picture && <PersonIcon sx={{ fontSize: 60 }} />}
            </StyledAvatar>

            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              {user.name || '사용자 이름'}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {user.email || 'email@example.com'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                display: 'inline-block',
                px: 2,
                py: 0.5,
                borderRadius: 10,
                bgcolor: '#FFE9E9',
                color: '#FF7777',
              }}
            >
              {user.role === 'admin' ? '관리자' : '일반 사용자'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 계정 정보 리스트 */}
          <ProfileSection>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              계정 정보
            </Typography>

            <List disablePadding>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary="이메일"
                  secondary={user.email || 'email@example.com'}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary="가입 방법"
                  secondary={user.googleId ? 'Google 소셜 로그인' : '이메일 가입'}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary="계정 역할"
                  secondary={user.role === 'admin' ? '관리자' : '일반 사용자'}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            </List>
          </ProfileSection>

          <Box textAlign="center">
            <LogoutButton
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              disableElevation
            >
              로그아웃
            </LogoutButton>
          </Box>
        </ProfileCard>

        {/* TODO 노트 */}
        <Box textAlign="center" mt={6} mb={3}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            참고: 현재 임시 구현 상태입니다. 백엔드 API 연동 후 실제 사용자 정보가 표시됩니다.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
