import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
  Paper,
  Autocomplete,
  Chip,
  Container,
  InputAdornment,
  Avatar,
  alpha,
  styled,
  Button,
  IconButton,
  Theme,
} from '@mui/material';
import OnboardingLayout from '../components/common/OnboardingLayout';
import FormButtons from '../components/common/FormButtons';
import CommonStep, { CommonStepType, LanguageData, EmergencyData } from './CommonSteps';
import { useThemeStore } from '../../theme/store/themeStore';
import { saveOnboardingData } from '../api/onboardingApi';
import { koreanCities, koreanAdministrativeDivisions } from '../data/koreaData';
import { motion } from 'framer-motion';

// 아이콘 임포트
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisaIcon from '@mui/icons-material/DocumentScanner';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTranslation } from '@/shared/i18n';

const { t } = useTranslation();
// 스타일링된 컴포넌트
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

const GradientButton = styled(Button)(
  ({ theme, gradientcolors }: { theme: Theme; gradientcolors?: string }) => ({
    background:
      gradientcolors ||
      `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
    color: '#fff',
    fontWeight: 600,
    padding: theme.spacing(1.2, 3),
    borderRadius: theme.spacing(6),
    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
  })
);

const StepIcon = styled(Box)(({ theme, color = '#1976d2' }: { theme: Theme; color?: string }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
  boxShadow: `0 4px 15px ${alpha(color, 0.3)}`,
  color: 'white',
  margin: '0 auto',
  fontSize: '1.5rem',
}));

const StepConnector = styled(Box)(
  ({ theme, active = false }: { theme: Theme; active?: boolean }) => ({
    height: 3,
    backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
    width: '100%',
    transition: 'background-color 0.3s ease',
  })
);

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
}));

const AnimatedCircle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.03)',
}));

/**
 * 거주 온보딩 정보 데이터
 */
interface LivingProfileData {
  gender: string;
  age: string;
  nationality: string;
  country: string;
  uiLanguage: string;
  residenceStatus: string;
  housingType: string;
  visaType: string;

  // 거주 목적
  livingPurpose: string;
  livingSituation: string;

  // 거주 일정
  startDate: string;
  endDate: string;
  livingDuration: string;

  // 거주 지역 선택
  preferredRegions: string[];

  // 가족 및 주거 정보
  familyMembers: number;
  hasChildren: boolean;
  housingBudget: string;

  // 공통 섹션 데이터
  language: LanguageData;
  emergencyInfo: EmergencyData;
  interests: string[];
}

// UI 언어 옵션
const uiLanguageOptions = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ภาษาไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
];

// 거주 목적 옵션
const getLivingPurposeOptions = (t: any) => [
  { value: 'family', label: t('onboarding.living.purpose.family') },
  { value: 'retirement', label: t('onboarding.living.purpose.retirement') },
  { value: 'lifestyle', label: t('onboarding.living.purpose.lifestyle') },
  { value: 'business', label: t('onboarding.living.purpose.business') },
  { value: 'accompany', label: t('onboarding.living.purpose.accompany') },
  { value: 'other', label: t('onboarding.living.purpose.other') },
];

// 거주 상황 옵션
const livingSituationOptions = [
  { value: 'single', label: t('onboarding.living.situationOptions.single') },
  { value: 'couple', label: t('onboarding.living.situationOptions.couple') },
  { value: 'family', label: t('onboarding.living.situationOptions.family') },
  { value: 'friends', label: t('onboarding.living.situationOptions.friends') },
  { value: 'other', label: t('onboarding.living.situationOptions.other') },
];
// 주거 유형 옵션
const housingTypeOptions = [
  { value: 'apartment', label: t('onboarding.living.housingTypeOptions.apartment') },
  { value: 'house', label: t('onboarding.living.housingTypeOptions.house') },
  { value: 'officetel', label: t('onboarding.living.housingTypeOptions.officetel') },
  { value: 'dormitory', label: t('onboarding.living.housingTypeOptions.dormitory') },
];

// 비자 종류 옵션
const visaTypeOptions = [
  { code: 'f1_3', name: t('onboarding.living.visaTypeOptions.f1_3') },
  { code: 'f1_5', name: t('onboarding.living.visaTypeOptions.f1_5') },
  { code: 'f1_9', name: t('onboarding.living.visaTypeOptions.f1_9') },
  { code: 'f2_2', name: t('onboarding.living.visaTypeOptions.f2_2') },
  { code: 'f2_3', name: t('onboarding.living.visaTypeOptions.f2_3') },
  { code: 'f3_1', name: t('onboarding.living.visaTypeOptions.f3_1') },
  { code: 'f4_11', name: t('onboarding.living.visaTypeOptions.f4_11') },
  { code: 'f4_12', name: t('onboarding.living.visaTypeOptions.f4_12') },
  { code: 'f5', name: t('onboarding.living.visaTypeOptions.f5') },
  { code: 'f5_5', name: t('onboarding.living.visaTypeOptions.f5_5') },
  { code: 'f6_1', name: t('onboarding.living.visaTypeOptions.f6_1') },
  { code: 'f6_2', name: t('onboarding.living.visaTypeOptions.f6_2') },
  { code: 'd7_1', name: t('onboarding.living.visaTypeOptions.d7_1') },
  { code: 'd7_2', name: t('onboarding.living.visaTypeOptions.d7_2') },
  { code: 'd8_1', name: t('onboarding.living.visaTypeOptions.d8_1') },
  { code: 'd8_2', name: t('onboarding.living.visaTypeOptions.d8_2') },
  { code: 'd8_3', name: t('onboarding.living.visaTypeOptions.d8_3') },
  { code: 'd8_4', name: t('onboarding.living.visaTypeOptions.d8_4') },
  { code: 'd9_1', name: t('onboarding.living.visaTypeOptions.d9_1') },
  { code: 'd9_2', name: t('onboarding.living.visaTypeOptions.d9_2') },
  { code: 'd9_3', name: t('onboarding.living.visaTypeOptions.d9_3') },
  { code: 'd9_4', name: t('onboarding.living.visaTypeOptions.d9_4') },
  { code: 'g1_10', name: t('onboarding.living.visaTypeOptions.g1_10') },
  { code: 'unknown', name: t('onboarding.living.visaTypeOptions.unknown') },
  { code: 'other', name: t('onboarding.living.visaTypeOptions.other') },
];

/**
 * 거주 프로필 페이지
 */
const LivingProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();

  // 현재 스텝
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 시/도 목록 (select box용)
  const cityProvinceList = Object.keys(koreanAdministrativeDivisions);

  // 데이터 스테이트
  const [formData, setFormData] = useState<LivingProfileData>({
    gender: '',
    age: '',
    nationality: '',
    country: '',
    uiLanguage: 'ko',
    residenceStatus: '',
    housingType: '',
    visaType: '',

    // 거주 목적
    livingPurpose: '',
    livingSituation: '',

    // 거주 일정
    startDate: '',
    endDate: '',
    livingDuration: '',

    // 거주 지역 선택
    preferredRegions: [],

    // 가족 및 주거 정보
    familyMembers: 1,
    hasChildren: false,
    housingBudget: '',

    // 공통 섹션 초기화
    language: { koreanLevel: 'basic' },
    emergencyInfo: {
      contact: '',
      medicalConditions: '',
      foodAllergies: '',
      receiveEmergencyAlerts: true,
    },
    interests: [],
  });

  // 계절에 따른 색상 가져오기
  const getColorByTheme = () => {
    switch (season) {
      case 'spring':
        return '#FFAAA5';

      default:
        return '#FFAAA5';
    }
  };

  const primaryColor = getColorByTheme();

  // 스텝 라벨 정의
  const stepLabels = [
    t('onboarding.living.steps.profile'),
    t('onboarding.living.steps.purpose'),
    t('onboarding.living.steps.schedule'),
    t('onboarding.living.steps.location'),
    t('onboarding.living.steps.family'),
    t('onboarding.living.steps.language'),
    t('onboarding.living.steps.interests'),
    t('onboarding.living.steps.emergency'),
  ];

  // 스텝 아이콘 정의
  const stepIcons = [
    <PersonIcon />,
    <HomeIcon />,
    <CalendarTodayIcon />,
    <LocationOnIcon />,
    <FamilyRestroomIcon />,
    <TranslateIcon />,
    <FavoriteIcon />,
    <HealthAndSafetyIcon />,
  ];

  // 총 스텝 수
  const totalSteps = stepLabels.length;

  // 현재 스텝에 해당하는 공통 컴포넌트 타입
  const getCommonStepType = (): CommonStepType | null => {
    switch (currentStep) {
      case 6:
        return 'language';
      case 7:
        return 'interests';
      case 8:
        return 'emergency';
      default:
        return null;
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 숫자값 변경 핸들러
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  // 불리언 값 변경 핸들러
  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 언어 데이터 변경 핸들러
  const handleLanguageChange = (data: LanguageData) => {
    setFormData(prev => ({
      ...prev,
      language: data,
    }));
  };

  // 응급 정보 변경 핸들러
  const handleEmergencyChange = (data: EmergencyData) => {
    setFormData(prev => ({
      ...prev,
      emergencyInfo: data,
    }));
  };

  // 관심사 변경 핸들러
  const handleInterestsChange = (interests: string[]) => {
    setFormData(prev => ({
      ...prev,
      interests,
    }));
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // 이전 단계로 이동
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/onboarding');
    }
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 필수 필드 검증
      if (!formData.nationality && !formData.country) {
        alert('국적 정보를 입력해주세요.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.gender) {
        alert('성별 정보를 입력해주세요.');
        setIsSubmitting(false);
        return;
      }

      // 백엔드에 전달할 데이터 객체 생성
      const onboardingData = {
        // 백엔드 필수 필드에 매핑될 데이터
        country: formData.nationality || formData.country, // nation 필드로 매핑
        gender: formData.gender, // gender 필드로 매핑
        uiLanguage: formData.uiLanguage || 'ko', // language 필드로 매핑

        // 상세 정보 (onBoardingPreference JSON으로 저장됨)
        age: formData.age,
        residenceStatus: formData.residenceStatus,
        housingType: formData.housingType,
        visaType: formData.visaType,

        // 공통 정보
        language: formData.language,
        emergencyInfo: formData.emergencyInfo,
        interests: formData.interests,
      };

      try {
        // 백엔드에 데이터 저장 (visit purpose: living)
        await saveOnboardingData('living', onboardingData);
        // 성공 메시지 표시
        console.log('온보딩 데이터가 성공적으로 저장되었습니다.');
      } catch (saveError) {
        // 로그인하지 않은 상태이거나 API 오류가 발생한 경우 여기서 처리
        console.warn('온보딩 데이터 저장 실패. 테스트 모드에서는 무시합니다:', saveError);
        // 에러를 throw하지 않고 계속 진행
      }

      // store의 사용자 정보 최신화
      await useAuthStore.getState().loadUser();

      // 메인 페이지로 이동
      navigate('/dashboard');
    } catch (error) {
      console.error('온보딩 데이터 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 배경 애니메이션용 원 위치 생성
  const circleVariants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.3,
      },
    }),
  };

  // 현재 단계에 따른 폼 렌더링
  const renderFormByStep = () => {
    const commonStepType = getCommonStepType();

    if (commonStepType) {
      return (
        <CommonStep
          stepType={commonStepType}
          languageData={formData.language}
          emergencyData={formData.emergencyInfo}
          interests={formData.interests}
          onLanguageChange={handleLanguageChange}
          onEmergencyChange={handleEmergencyChange}
          onInterestsChange={handleInterestsChange}
        />
      );
    }

    switch (currentStep) {
      case 1: // 거주자 세부 프로필
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {t('onboarding.living.profileTitle')}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 2,
              }}
            >

              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  id="gender-label"
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-focused': { color: primaryColor },
                    mb: 1,
                  }}
                >
                  {t('onboarding.living.form.gender')}
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="gender-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label={t('onboarding.living.form.male')}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label={t('onboarding.living.form.female')}
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label={t('onboarding.living.form.other')}
                  />
                </RadioGroup>
              </FormControl>


              <StyledTextField
                label={t('onboarding.living.form.age')}
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                type="number"
              />

            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >

              <StyledTextField
                label={t('onboarding.living.form.nationality')}
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                fullWidth
              />



              <StyledTextField
                select
                label={t('onboarding.living.form.uiLanguage')}
                name="uiLanguage"
                value={formData.uiLanguage}
                onChange={handleInputChange}
                fullWidth
                helperText={t('onboarding.living.form.uiLanguageHelper')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TranslateIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              >
                {uiLanguageOptions.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 2: // 거주 목적
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(primaryColor, 0.2),
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <HomeIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.living.purposeTitle')}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.living.form.purpose')}
                name="livingPurpose"
                value={formData.livingPurpose}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 3 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {getLivingPurposeOptions(t).map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.living.form.situation')}
                name="livingSituation"
                value={formData.livingSituation}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 3 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FamilyRestroomIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {livingSituationOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>

            <Box sx={{ mt: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.living.form.visaType')}
                name="visaType"
                value={formData.visaType}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisaIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {visaTypeOptions.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 3: // 거주 일정
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(primaryColor, 0.2),
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <CalendarTodayIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.living.scheduleTitle')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {t('onboarding.living.selectDuration')}
              </Typography>
              <StyledTextField
                select
                label={t('onboarding.living.durationLabel')}
                name="livingDuration"
                value={formData.livingDuration}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 1 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="underSixMonths">{t('onboarding.living.underSixMonths')}</MenuItem>
                <MenuItem value="sixMonthsToOneYear">
                  {t('onboarding.living.sixMonthsToOneYear')}
                </MenuItem>
                <MenuItem value="oneYearToThreeYears">
                  {t('onboarding.living.oneYearToThreeYears')}
                </MenuItem>
                <MenuItem value="threeYearsToFiveYears">
                  {t('onboarding.living.threeYearsToFiveYears')}
                </MenuItem>
                <MenuItem value="overFiveYears">{t('onboarding.living.overFiveYears')}</MenuItem>
                <MenuItem value="permanent">{t('onboarding.living.permanent')}</MenuItem>
              </StyledTextField>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {t('onboarding.living.startDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.living.startDate')}
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                      </InputAdornment>
                    ),
                  }}
                />
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
                  {t('onboarding.living.endDateGuide')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.living.endDate')}
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </StyledPaper>
        );

      case 4: // 거주 지역 선택
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(primaryColor, 0.2),
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <LocationOnIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.region.regionTitle')}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {t('onboarding.region.selectRegionGuide')}
              </Typography>

              <Autocomplete
                multiple
                id="preferredRegions"
                options={cityProvinceList.filter(city => !formData.preferredRegions.includes(city))}
                value={formData.preferredRegions}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    preferredRegions: newValue,
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: alpha(primaryColor, 0.1),
                        color: primaryColor,
                        borderRadius: '16px',
                        border: `1px solid ${alpha(primaryColor, 0.3)}`,
                        '& .MuiChip-deleteIcon': {
                          color: primaryColor,
                          '&:hover': {
                            color: alpha(primaryColor, 0.7),
                          },
                        },
                      }}
                    />
                  ))
                }
                renderInput={params => (
                  <StyledTextField
                    {...params}
                    label={t('onboarding.region.regionLabel')}
                    placeholder={t('onboarding.region.regionPlaceholder')}
                    color="primary"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mt: 1,
                }}
              >
                {t('onboarding.region.selectAtLeastOne')}
              </Typography>
            </Box>

            {formData.preferredRegions.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  {t('onboarding.region.selectedRegion', {
                    count: String(formData.preferredRegions.length),
                  })}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                  }}
                >
                  {formData.preferredRegions.map(region => (
                    <Box
                      key={region}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${alpha(primaryColor, 0.2)}`,
                        backgroundColor: alpha(primaryColor, 0.05),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon
                          sx={{
                            fontSize: '1.2rem',
                            color: primaryColor,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {region}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            preferredRegions: prev.preferredRegions.filter(r => r !== region),
                          }));
                        }}
                        sx={{
                          p: 0.5,
                          color: 'text.secondary',
                          '&:hover': {
                            color: theme.palette.error.main,
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        ✕
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </StyledPaper>
        );

      case 5: // 가족 및 주거 정보
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(primaryColor, 0.2),
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <FamilyRestroomIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.family.familyTitle')}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 3,
              }}
            >
              <StyledTextField
                label={t('onboarding.family.familyMembers')}
                name="familyMembers"
                type="number"
                value={formData.familyMembers}
                onChange={handleNumberChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <FamilyRestroomIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
                color="primary"
              />

              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    id="children-label"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-focused': { color: primaryColor },
                      mb: 1,
                    }}
                  >
                    {t('onboarding.family.hasChildren')}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="children-label"
                    name="hasChildren"
                    value={formData.hasChildren ? 'true' : 'false'}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        hasChildren: e.target.value === 'true',
                      }));
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.grey[400],
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={t('onboarding.family.childrenYes')}
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.grey[400],
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={t('onboarding.family.childrenNo')}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.family.housingType')}
                name="housingType"
                value={formData.housingType}
                onChange={handleInputChange}
                fullWidth
                required
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {housingTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(`onboarding.family.housingTypeOptions.${option.value}`)}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>

            <Box sx={{ mt: 3 }}>
              <StyledTextField
                label={t('onboarding.family.housingBudget')}
                name="housingBudget"
                value={formData.housingBudget}
                onChange={handleInputChange}
                fullWidth
                placeholder={t('onboarding.family.housingBudgetPlaceholder')}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalAtmIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </StyledPaper>
        );
      default:
        return null;
    }
  };

  // 다음 버튼 비활성화 여부 확인
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: // 거주자 세부 프로필
        return !formData.gender || !formData.age || !formData.nationality;
      case 2: // 거주 목적
        return !formData.livingPurpose || !formData.livingSituation;
      case 3: // 거주 일정
        return !formData.livingDuration;
      case 4: // 거주 지역 선택
        return formData.preferredRegions.length === 0;
      case 5: // 가족 및 주거 정보
        return !formData.housingType;
      case 6: // 언어 능력
        return !formData.language.koreanLevel;
      default:
        return false;
    }
  };

  // 커스텀 스텝 표시
  const renderCustomStepper = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 4,
          width: '100%',
          maxWidth: '700px',
          mx: 'auto',
          gap: 1.5,
        }}
      >
        {stepLabels.map((label, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isCompleted ? 'pointer' : 'default',
                opacity: isActive || isCompleted ? 1 : 0.6,
                transition: 'all 0.3s ease',
                px: 1,
              }}
              onClick={() => isCompleted && setCurrentStep(index + 1)}
            >
              <Box
                sx={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background:
                    isActive || isCompleted
                      ? `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`
                      : theme.palette.grey[200],
                  boxShadow: isActive ? `0 4px 12px ${alpha(primaryColor, 0.3)}` : 'none',
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  color: isActive || isCompleted ? 'white' : theme.palette.grey[500],
                }}
              >
                {isCompleted ? (
                  <Typography sx={{ fontWeight: 600 }}>✓</Typography>
                ) : (
                  <Typography sx={{ fontWeight: 600 }}>{index + 1}</Typography>
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? primaryColor : 'text.secondary',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  width: isMobile ? 60 : 70,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        py: 4,
        px: 2,
        background: `linear-gradient(135deg, ${alpha(primaryColor, 0.02)} 0%, ${alpha(primaryColor, 0.05)} 100%)`,
      }}
    >
      {/* 배경 애니메이션 */}
      <AnimatedBackground>
        {[...Array(6)].map((_, i) => (
          <AnimatedCircle
            key={i}
            custom={i}
            variants={circleVariants}
            animate="animate"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              border: `1px solid ${alpha(primaryColor, 0.03)}`,
              opacity: 0.3 - i * 0.04,
            }}
          />
        ))}
      </AnimatedBackground>

      <Container maxWidth="md" sx={{ py: 2, zIndex: 1, width: '100%' }}>
        {/* 헤더 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            mt: 2,
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              mr: 2,
              color: 'text.secondary',
              '&:hover': { color: primaryColor },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                letterSpacing: '-0.01em',
              }}
            >
              {t('onboarding.living.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                opacity: 0.85,
              }}
            >
              {t('onboarding.living.description')}
            </Typography>
          </Box>
        </Box>

        {/* 스텝퍼 */}
        {renderCustomStepper()}

        {/* 메인 콘텐츠 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderFormByStep()}
        </motion.div>

        {/* 버튼 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            mb: 6,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: alpha(theme.palette.grey[400], 0.5),
              color: 'text.secondary',
              px: 3,
              py: 1,
              borderRadius: '50px',
              '&:hover': {
                borderColor: alpha(theme.palette.grey[600], 0.5),
                backgroundColor: alpha(theme.palette.grey[100], 0.5),
              },
              textTransform: 'none',
            }}
          >
            {t('onboarding.travel.back')}
          </Button>

          <Button
            variant="contained"
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={isNextDisabled() || isSubmitting}
            sx={{
              bgcolor: primaryColor,
              color: 'white',
              px: { xs: 3, md: 4 },
              py: 1,
              borderRadius: '50px',
              fontWeight: 600,
              boxShadow: `0 6px 16px ${alpha(primaryColor, 0.25)}`,
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.9),
                boxShadow: `0 8px 20px ${alpha(primaryColor, 0.35)}`,
                transform: 'translateY(-2px)',
              },
              textTransform: 'none',
            }}
          >
            {currentStep === totalSteps
              ? isSubmitting
                ? 'onboarding.travel.saving'
                : 'onboarding.travel.finish'
              : t('onboarding.travel.next')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LivingProfile;
