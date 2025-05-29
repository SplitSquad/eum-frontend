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
  FormHelperText,
} from '@mui/material';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import RegionSelector from '@/features/community/components/shared/RegionSelector';
import { registerUser } from '../api/authApi';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { useTranslation } from '@/shared/i18n';

// 로그인 카드 스타일
const LoginCard = styled(Paper)<{ colors: typeof seasonalColors.spring }>`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1.5px solid ${({ colors }) => colors.primary};
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
const PageTitle = styled(Typography)<{ color: string }>`
  color: ${({ color }) => color};
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
  confirmPassword?: string;
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
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  birthday,
  setBirthday,
  phone,
  setPhone,
  errors = {},
  handleRegionChange,
  t,
}: {
  id: string;
  setId: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
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
  t: (key: string) => string;
}) => {
  // 실시간 비밀번호 일치 메시지
  const showConfirm = confirmPassword.length > 0 || password.length > 0;

  let confirmMsg = '';
  let confirmColor: 'success' | 'error' | undefined = undefined;

  if (showConfirm) {
    if (confirmPassword.length === 0) {
      confirmMsg = '';
    } else if (password === confirmPassword) {
      confirmMsg = t('signup.passwordMatch');
      confirmColor = 'success';
    } else {
      confirmMsg = t('signup.passwordMismatch');
      confirmColor = 'error';
    }
  }

  return (
    <InputBox>
      <TextField
        label={t('signup.email')}
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
        label={t('signup.password')}
        variant="outlined"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        placeholder={t('signup.passwordPlaceholder')}
        autoComplete="new-password"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        error={!!errors.password}
        helperText={errors.password}
      />
      <div>
        <TextField
          label={t('signup.confirmPassword') || '비밀번호 확인'}
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          fullWidth
          placeholder={t('signup.passwordPlaceholder') || '비밀번호를 한 번 더 입력하세요'}
          autoComplete="new-password"
          sx={{ background: 'rgba(255,255,255,0.7)' }}
          required
          error={!!errors.confirmPassword || (showConfirm && confirmColor === 'error')}
        />
        {/* 실시간 메시지 */}
        {showConfirm && (
          <FormHelperText
            sx={{
              color:
                confirmColor === 'success' ? 'green' : confirmColor === 'error' ? 'red' : undefined,
              ml: 1,
              fontWeight: 500,
            }}
          >
            {confirmMsg}
          </FormHelperText>
        )}
        {/* 유효성 검사 에러도 함께 표시 */}
        {!!errors.confirmPassword && (
          <FormHelperText sx={{ color: 'red', ml: 1 }}>{errors.confirmPassword}</FormHelperText>
        )}
      </div>
      <TextField
        label={t('signup.name')}
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
        label={t('signup.birthday')}
        variant="outlined"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        fullWidth
        autoComplete="birthday"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        placeholder={t('signup.birthdayPlaceholder')}
        error={!!errors.birthday}
        helperText={errors.birthday}
      />
      <TextField
        label={t('signup.phone')}
        variant="outlined"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        autoComplete="phone"
        sx={{ background: 'rgba(255,255,255,0.7)' }}
        required
        placeholder={t('signup.phonePlaceholder')}
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <RegionSelector onChange={handleRegionChange} />
    </InputBox>
  );
};

const SignupButton = ({ onClick, colors, t }) => (
  <Button
    variant="outlined"
    color="secondary"
    sx={{
      mt: 2,
      borderRadius: 2,
      fontWeight: 700,
      borderColor: colors.primary,
      color: colors.primary,
      '&:hover': {
        borderColor: colors.primary,
        background: colors.hover,
      },
    }}
    onClick={onClick}
  >
    {t('signup.signup')}
  </Button>
);

const CancelButton = ({ onClick, colors, t }) => (
  <Button
    variant="outlined"
    color="error"
    sx={{
      mt: 2,
      borderRadius: 2,
      fontWeight: 700,
      borderColor: colors.primary,
      color: colors.primary,
      '&:hover': {
        borderColor: colors.primary,
        background: colors.hover,
      },
    }}
    onClick={onClick}
  >
    {t('signup.cancel')}
  </Button>
);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const { t } = useTranslation();
  const season = useThemeStore(state => state.season);
  const colors = seasonalColors[season] || seasonalColors.spring;

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
    const errors: InputErrors = {};
    if (!id) errors.id = t('signup.emailRequired'); // 이메일을 입력하세요.
    if (!password) errors.password = t('signup.passwordRequired'); // 비밀번호를 입력하세요.
    if (!confirmPassword) errors.confirmPassword = t('signup.confirmPasswordRequired'); // 비밀번호 확인을 입력하세요.
    // if (password && confirmPassword && password !== confirmPassword)
    //   errors.confirmPassword = t('signup.passwordMismatch');        // 비밀번호가 일치하지 않습니다.
    if (!name) errors.name = t('signup.nameRequired'); // 이름을 입력하세요.
    if (!birthday) errors.birthday = t('signup.birthdayRequired'); // 생일을 입력하세요.
    if (!phone) errors.phone = t('signup.phoneRequired'); // 폰번호를 입력하세요.
    if (!regionSelection.city) errors.address = t('signup.addressRequired'); // 주소(시/도)를 선택하세요.
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (password.length < 8) {
      alert(t('signup.passwordLengthAlert')); // 정확한 비밀번호 값을 입력해주세요.
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      alert(t('signup.birthdayFormatAlert')); // yyyy-mm-dd 형식으로 입력해주세요.
      return;
    }
    const [year, month, day] = birthday.split('-').map(Number);
    const date = new Date(birthday);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      alert(t('signup.birthdayValidAlert')); // 정확한 생일 값을 입력해주세요.
      return;
    }
    if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
      alert(t('signup.phoneValidAlert')); // 정확한 폰번호 값을 입력해주세요.
      return;
    }

    setLoading(true);
    setError(null);

    const addressValue = [
      regionSelection.city,
      regionSelection.district,
      regionSelection.neighborhood,
    ]
      .filter(Boolean)
      .join(' ');
    setAddress(addressValue);

    setNewUser({
      id,
      password,
      name,
      birthday,
      phone,
      address: addressValue,
    });

    try {
      await registerUser({
        name,
        address: addressValue,
        phoneNumber: phone,
        birthday,
        email: id,
        password,
      });
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
          <LoginCard elevation={3} colors={colors}>
            <LogoContainer>
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

            <PageTitle variant={isMobile ? 'h5' : 'h4'} color={colors.primary}>
              {t('signup.welcome')}
            </PageTitle>

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
              <SignUpInputs
                id={id}
                setId={setId}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
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
                t={t}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                <CancelButton onClick={() => navigate('/google-login')} colors={colors} t={t} />
                <SignupButton onClick={handleSignup} colors={colors} t={t} />
              </Box>
            </Box>

            <Box mt={4}>
              <Typography variant="caption" color="textSecondary">
                {t('signup.termsAgreement')}
              </Typography>
            </Box>
          </LoginCard>
        </Fade>
      </Box>
    </Container>
  );
};

export default SignUpPage;
