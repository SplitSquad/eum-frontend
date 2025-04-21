import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styled from '@emotion/styled';
import GoogleIcon from '@mui/icons-material/Google';
// import { getGoogleAuthUrl } from '../api/authApi'; // 실제 구글 로그인 API
import { tempLogin } from '../api'; // 임시 로그인 API

// 봄 테마 스타일 컴포넌트
const SpringThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#555555',
  padding: '10px 20px',
  borderRadius: '12px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #FFD7D7',
  '&:hover': {
    backgroundColor: '#FFF5F5',
    boxShadow: '0 5px 15px rgba(255, 170, 180, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-50px',
    left: '-50px',
    right: '-50px',
    bottom: '-50px',
    background: 'radial-gradient(circle, rgba(255,214,214,0.2) 0%, rgba(255,255,255,0) 70%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
  },
  '&:hover:before': {
    opacity: 1,
  },
}));

// 벚꽃 애니메이션을 위한 래퍼
const SpringThemedInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#FFD7D7',
    },
    '&:hover fieldset': {
      borderColor: '#FFAAA5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF9999',
    },
  },
});

const BlossomWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  @keyframes fallDown {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(100px) rotate(360deg);
      opacity: 0;
    }
  }

  &:hover:after {
    content: '🌸';
    position: absolute;
    top: -20px;
    animation: fallDown 2s ease-in-out;
    font-size: 20px;
  }
`;

interface GoogleLoginButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  buttonText = '구글로 계속하기',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('1');

  // 실제 구글 로그인 처리 함수 (주석 처리)
  // TODO: 백엔드 구현 완료 후 이 함수 사용
  /*
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      // 백엔드 API에서 구글 인증 URL 가져오기
      const authUrl = await getGoogleAuthUrl();

      // 성공 콜백 호출 (선택적)
      if (onSuccess) {
        onSuccess({ status: 'redirecting' });
      }

      // 구글 로그인 페이지로 리디렉션
      window.location.href = authUrl;
    } catch (error) {
      setLoading(false);
      console.error('구글 로그인 URL 가져오기 실패:', error);

      if (onError) {
        onError(error);
      }
    }
  };
  */

  // 임시 로그인 다이얼로그 열기
  const handleOpenTempLogin = () => {
    setOpenDialog(true);
  };

  // 임시 로그인 다이얼로그 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 임시 로그인 처리
  const handleTempLogin = async () => {
    try {
      setLoading(true);
      const userIdNumber = parseInt(userId);

      if (isNaN(userIdNumber)) {
        throw new Error('유효한 숫자를 입력해주세요');
      }

      // 임시 로그인 API 호출
      const response = await tempLogin(userIdNumber);

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(response);
      }

      setOpenDialog(false);
    } catch (error) {
      console.error('임시 로그인 실패:', error);

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BlossomWrapper>
        <SpringThemedButton
          variant="contained"
          startIcon={!loading && <GoogleIcon />}
          onClick={handleOpenTempLogin} // 임시 로그인 다이얼로그 열기
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
        </SpringThemedButton>
      </BlossomWrapper>

      {/* 임시 로그인 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            background:
              'linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%)',
            color: '#333',
          }}
        >
          임시 로그인
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <SpringThemedInput
              autoFocus
              fullWidth
              label="사용자 ID"
              type="number"
              variant="outlined"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="임시 사용자 ID 입력 (1-100)"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            background:
              'linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%)',
            p: 2,
          }}
        >
          <Button onClick={handleCloseDialog} sx={{ color: '#777' }}>
            취소
          </Button>
          <Button
            onClick={handleTempLogin}
            disabled={loading}
            sx={{
              background: '#FFFFFF',
              color: '#555555',
              border: '1px solid #FFD7D7',
              '&:hover': {
                backgroundColor: '#FFF5F5',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoogleLoginButton;
