import styled from '@emotion/styled';
import {
  Alert,
  Box,
  Container,
  Fade,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Button,
} from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import RegionSelector from '@/features/community/components/shared/RegionSelector';
import { registerUser } from '../api/authApi';

// 로그인 카드 스타일
const LoginCard = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 235, 235, 0.8);
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

// 로고 영역
const LogoContainer = styled(Box)`
  margin-bottom: 2rem;
`;

// 페이지 제목 스타일
const PageTitle = styled(Typography)`
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

// 아이디/비밀번호 입력 영역 스타일
const InputBox = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

type InputErrors = {
  id?: string;
  password?: string;
  name?: string;
  birthday?: string;
  phone?: string;
  address?: string;
};

const SignUpInputs = ({
  id,
  setId,
  password,
  setPassword,
  name,
  setName,
  birthday,
  setBirthday,
  phone,
  setPhone,
  errors = {},
  handleRegionChange,
}: {
  id: string;
  setId: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  birthday: string;
  setBirthday: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  errors?: InputErrors;
  regionSelection: { city: string | null; district: string | null; neighborhood: string | null };
  setRegionSelection: (v: {
    city: string | null;
    district: string | null;
    neighborhood: string | null;
  }) => void;
  handleRegionChange: (
    city: string | null,
    district: string | null,
    neighborhood: string | null
  ) => void;
}) => {
  return (
    <InputBox>
      <TextField
        label="이메일"
        variant="outlined"
        value={id}
        onChange={e => setId(e.target.value)}
        fullWidth
        autoComplete="username"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        error={!!errors.id}
        helperText={errors.id}
      />
      <TextField
        label="비밀번호"
        variant="outlined"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        placeholder="at least 8 characters"
        autoComplete="current-password"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        label="이름"
        variant="outlined"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        autoComplete="name"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="생일"
        variant="outlined"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        fullWidth
        autoComplete="birthday"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        placeholder="YYYY-MM-DD"
        error={!!errors.birthday}
        helperText={errors.birthday}
      />
      <TextField
        label="폰번호"
        variant="outlined"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        autoComplete="phone"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        placeholder="010-1234-5678"
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <RegionSelector onChange={handleRegionChange} />
    </InputBox>
  );
};

const SignupButton = ({ onClick }) => (
  <Button
    variant="outlined"
    color="secondary"
    sx={{
      mt: 2,
      borderRadius: 2,
      fontWeight: 700,
      borderColor: '#FFB6B9',
      color: '#FF9999',
      '&:hover': {
        borderColor: '#FF9999',
        background: 'rgba(255, 170, 165, 0.08)',
      },
    }}
    onClick={onClick}
  >
    회원가입
  </Button>
);

const CancelButton = ({ onClick }) => (
  <Button
    variant="outlined"
    color="error"
    sx={{
      mt: 2,
      borderRadius: 2,
      fontWeight: 700,
      borderColor: '#FF5252',
      color: '#FF1744',
      '&:hover': {
        borderColor: '#FF1744',
        background: 'rgba(255, 23, 68, 0.08)',
      },
    }}
    onClick={onClick}
  >
    취소
  </Button>
);

/**
 * 일반 회원 가입 페이지
 */
const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const setNewUser = useUserStore(state => state.setNewUser);
  const [regionSelection, setRegionSelection] = useState<{
    city: string | null;
    district: string | null;
    neighborhood: string | null;
  }>({ city: '', district: '', neighborhood: '' });

  // useCallback으로 RegionSelector onChange 핸들러 래핑
  const handleRegionChange = useCallback(
    (city: string | null, district: string | null, neighborhood: string | null) => {
      setRegionSelection({
        city: city || '',
        district: district || '',
        neighborhood: neighborhood || '',
      });
    },
    []
  );

  const handleSignup = async () => {
    // 필수 입력값 체크
    const errors: InputErrors = {};
    if (!id) errors.id = '이메일을 입력하세요.';
    if (!password) errors.password = '비밀번호를 입력하세요.';
    if (!name) errors.name = '이름을 입력하세요.';
    if (!birthday) errors.birthday = '생일을 입력하세요.';
    if (!phone) errors.phone = '폰번호를 입력하세요.';
    if (!regionSelection.city) errors.address = '주소(시/도)를 선택하세요.';
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // 추가 예외처리: 비밀번호, 생일, 핸드폰번호
    if (password.length < 8) {
      alert('정확한 비밀번호 값을 입력해주세요.');
      return;
    }
    // yyyy-mm-dd 형식 및 실제 날짜 유효성 체크
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      alert('yyyy-mm-dd 형식으로 입력해주세요.');
      return;
    }
    // 실제 날짜 유효성 검사
    const [year, month, day] = birthday.split('-').map(Number);
    const date = new Date(birthday);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      alert('정확한 생일 값을 입력해주세요.');
      return;
    }
    if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
      alert('정확한 폰번호 값을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    // 지역 선택값을 address로 합쳐서 저장
    const addressValue = [
      regionSelection.city,
      regionSelection.district,
      regionSelection.neighborhood,
    ]
      .filter(Boolean)
      .join(' ');
    setAddress(addressValue);

    // userStore에 입력값 저장
    setNewUser({
      id,
      password,
      name,
      birthday,
      phone,
      address: addressValue,
    });

    try {
      // 회원가입 API 호출 (실제 API 명세에 맞게 매핑)
      await registerUser({
        name,
        address: addressValue,
        phoneNumber: phone,
        birthday,
        email: id,
        password,
      });
      // 성공 시 안내 및 이동
      setLoading(false);
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/google-login');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 4rem)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Fade in={true} timeout={1000}>
          <LoginCard elevation={3}>
            <LogoContainer>
              {/* TODO: 실제 로고로 교체 */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#FF9999',
                  fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
                }}
              >
                EUM
              </Typography>
            </LogoContainer>

            <PageTitle variant={isMobile ? 'h5' : 'h4'}>환영합니다</PageTitle>

            {error && (
              <Box mb={3}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}

            <Box
              sx={{
                width: '100%',
                mt: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              {/*회원가입 정보 입력*/}
              <SignUpInputs
                id={id}
                setId={setId}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                birthday={birthday}
                setBirthday={setBirthday}
                phone={phone}
                setPhone={setPhone}
                errors={inputErrors}
                regionSelection={regionSelection}
                setRegionSelection={setRegionSelection}
                handleRegionChange={handleRegionChange}
              />
              {/*회원가입/취소 버튼*/}
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                <CancelButton onClick={() => navigate('/google-login')} />
                <SignupButton onClick={handleSignup} />
              </Box>
            </Box>

            <Box mt={4}>
              <Typography variant="caption" color="textSecondary">
                로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
              </Typography>
            </Box>
          </LoginCard>
        </Fade>
      </Box>
    </Container>
  );
};

export default SignUpPage;
