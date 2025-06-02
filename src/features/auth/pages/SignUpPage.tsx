import styled from '@emotion/styled';
import {
  Alert,
  Avatar,
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
  TextField as MuiTextField,
  TextFieldProps,
  alpha,
  InputAdornment,
} from '@mui/material';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import { registerUser } from '../api/authApi';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { useTranslation } from '@/shared/i18n';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// 스타일 컴포넌트 생략 (질문에 주신 코드 그대로 유지)

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

const LogoContainer = styled(Box)`
  margin-bottom: 2rem;
`;

const PageTitle = styled(Typography)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

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

// 이 페이지 전용: hover 시 배경색 변화 없는 TextField
const StyledTextField = (props: TextFieldProps) => (
  <MuiTextField
    {...props}
    sx={{
      background: 'rgba(255,255,255,0.7)',
      '& .MuiOutlinedInput-root': {
        '&:hover': {
          background: 'rgba(255,255,255,0.7)',
        },
      },
      ...props.sx,
    }}
  />
);

const SignUpInputs = ({
  id,
  setId,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  phone,
  setPhone,
  errors = {},
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
  phone: string;
  setPhone: (v: string) => void;
  errors?: InputErrors;
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
      <StyledTextField
        label={t('signup.email')}
        variant="outlined"
        value={id}
        onChange={e => setId(e.target.value)}
        fullWidth
        autoComplete="username"
        required
        error={!!errors.id}
        helperText={errors.id || ''}
      />
      <StyledTextField
        label={t('signup.password')}
        variant="outlined"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        placeholder={t('signup.passwordPlaceholder')}
        autoComplete="new-password"
        required
        error={!!errors.password}
        helperText={errors.password || ''}
      />
      <div>
        <StyledTextField
          label={t('signup.confirmPassword') || '비밀번호 확인'}
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          fullWidth
          placeholder={t('signup.passwordPlaceholder') || '비밀번호를 한 번 더 입력하세요'}
          autoComplete="new-password"
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
      <StyledTextField
        label={t('signup.name')}
        variant="outlined"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        autoComplete="name"
        required
        error={!!errors.name}
        helperText={errors.name || ''}
      />
      <StyledTextField
        label={t('signup.phone')}
        variant="outlined"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        autoComplete="phone"
        placeholder={t('signup.phonePlaceholder')}
        required
        error={!!errors.phone}
        helperText={errors.phone || ''}
      />
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
  const { t } = useTranslation();
  const season = useThemeStore(state => state.season);
  const colors = seasonalColors[season] || seasonalColors.spring;

  // 실시간 유효성 검사: 입력값이 변경되면 errors 해당 필드 제거
  const handleInputChange = (field: keyof InputErrors, value: string) => {
    switch (field) {
      case 'id':
        setId(value);
        if (inputErrors.id) setInputErrors(prev => ({ ...prev, id: '' }));
        break;
      case 'password':
        setPassword(value);
        if (inputErrors.password) setInputErrors(prev => ({ ...prev, password: '' }));
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (inputErrors.confirmPassword) setInputErrors(prev => ({ ...prev, confirmPassword: '' }));
        break;
      case 'name':
        setName(value);
        if (inputErrors.name) setInputErrors(prev => ({ ...prev, name: '' }));
        break;
      case 'birthday':
        setBirthday(value);
        if (inputErrors.birthday) setInputErrors(prev => ({ ...prev, birthday: '' }));
        break;
      case 'phone':
        setPhone(value);
        if (inputErrors.phone) setInputErrors(prev => ({ ...prev, phone: '' }));
        break;
      default:
        break;
    }
  };

  const handleSignup = async () => {
    const errors: InputErrors = {};
    if (!id) errors.id = t('signup.emailRequired');
    if (!password) errors.password = t('signup.passwordRequired');
    if (!name) errors.name = t('signup.nameRequired');
    if (!birthday) errors.birthday = t('signup.birthdayRequired');
    if (!phone) errors.phone = t('signup.phoneRequired');
    // 주소는 선택사항으로 변경
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (password.length < 8) {
      alert(t('signup.passwordLengthAlert'));
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      alert(t('signup.birthdayFormatAlert'));
      return;
    }
    const [year, month, day] = birthday.split('-').map(Number);
    const date = new Date(birthday);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      alert(t('signup.birthdayValidAlert'));
      return;
    }
    if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
      alert(t('signup.phoneValidAlert'));
      return;
    }

    setLoading(true);
    setError(null);

    setNewUser({
      id,
      password,
      name,
      birthday,
      phone,
      address,
    });

    try {
      await registerUser({
        name,
        address,
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
                  color: '#c0c0c0',
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
              }}
            >
              <SignUpInputs
                id={id}
                setId={v => handleInputChange('id', v)}
                password={password}
                setPassword={v => handleInputChange('password', v)}
                confirmPassword={confirmPassword}
                setConfirmPassword={v => handleInputChange('confirmPassword', v)}
                name={name}
                setName={v => handleInputChange('name', v)}
                phone={phone}
                setPhone={v => handleInputChange('phone', v)}
                errors={inputErrors}
                t={t}
              />
              <StyledTextField
                label={t('signup.birthday')}
                name="birthday"
                type="date"
                value={birthday}
                onChange={e => handleInputChange('birthday', e.target.value)}
                fullWidth
                color="primary"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!inputErrors.birthday}
                helperText={inputErrors.birthday || ''}
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
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {t('onboarding.worker.schedule.startDateLabel')}
              </Typography>
            </Box>
          </LoginCard>
        </Fade>
      </Box>
    </Container>
  );
};

export default SignUpPage;
