import React, { useState, useRef } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  alpha,
  styled,
  Button,
  IconButton,
  Avatar,
  Theme,
} from '@mui/material';
import OnboardingLayout from '../components/common/OnboardingLayout';
import FormButtons from '../components/common/FormButtons';
import CommonStep, { CommonStepType, LanguageData, EmergencyData } from './CommonSteps';
import { useThemeStore } from '../../theme/store/themeStore';
import { saveOnboardingData } from '../api/onboardingApi';
import { koreanCities, koreanTouristAttractions } from '../data/koreaData';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../auth/store/authStore';
import { useTranslation } from '@/shared/i18n/';

import CountrySelector from '@/shared/components/CountrySelector';


// 아이콘 임포트
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExploreIcon from '@mui/icons-material/Explore';
import TranslateIcon from '@mui/icons-material/Translate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisaIcon from '@mui/icons-material/DocumentScanner';

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
 * 여행 온보딩 정보 데이터
 */
interface TravelProfileData {
  gender: string;
  age: string;
  nationality: string;
  country: string;
  uiLanguage: string;
  travelType: string;
  travelDuration: string;
  travelCompanions: string;
  startDate: string;
  endDate: string;
  interestedCities: string[];
  travelPurposes: string[];
  visaType: string;

  // 공통 섹션 데이터
  language: LanguageData;
  emergencyInfo: EmergencyData;
  interests: string[];
}
const { t } = useTranslation();
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

// 여행 목적 옵션
const getTravelPurposeOptions = (t: any) => [
  { code: 'sightseeing', name: t('onboarding.travel.purposes.sightseeing') },
  { code: 'food', name: t('onboarding.travel.purposes.food') },
  { code: 'shopping', name: t('onboarding.travel.purposes.shopping') },
  { code: 'culture', name: t('onboarding.travel.purposes.culture') },
  { code: 'nature', name: t('onboarding.travel.purposes.nature') },
  { code: 'relaxation', name: t('onboarding.travel.purposes.relaxation') },
  { code: 'entertainment', name: t('onboarding.travel.purposes.entertainment') },
  { code: 'history', name: t('onboarding.travel.purposes.history') },
  { code: 'photography', name: t('onboarding.travel.purposes.photography') },
  { code: 'nightlife', name: t('onboarding.travel.purposes.nightlife') },
];

// 비자 종류 옵션 (여행 관련 비자 위주로)
const visaTypeOptions = [
  { code: 'b1', name: t('onboarding.visa.types.b1') },
  { code: 'b2_1', name: t('onboarding.visa.types.b2_1') },
  { code: 'b2_2', name: t('onboarding.visa.types.b2_2') },
  { code: 'c3_1', name: t('onboarding.visa.types.c3_1') },
  { code: 'c3_2', name: t('onboarding.visa.types.c3_2') },
  { code: 'c3_3', name: t('onboarding.visa.types.c3_3') },
  { code: 'c3_4', name: t('onboarding.visa.types.c3_4') },
  { code: 'c3_5', name: t('onboarding.visa.types.c3_5') },
  { code: 'c3_6', name: t('onboarding.visa.types.c3_6') },
  { code: 'c3_8', name: t('onboarding.visa.types.c3_8') },
  { code: 'c3_9', name: t('onboarding.visa.types.c3_9') },
  { code: 'c3_10', name: t('onboarding.visa.types.c3_10') },
  { code: 'h1', name: t('onboarding.visa.types.h1') },
  { code: 'k_eta', name: t('onboarding.visa.types.k_eta') },
  { code: 'unknown', name: t('onboarding.visa.types.unknown') },
  { code: 'other', name: t('onboarding.visa.types.other') },
];

// 여행 유형 옵션
const travelTypeOptions = [
  { value: 'leisure', label: t('onboarding.travel.types.leisure') },
  { value: 'business', label: t('onboarding.travel.types.business') },
  { value: 'visiting', label: t('onboarding.travel.types.visiting') },
  { value: 'medical', label: t('onboarding.travel.types.medical') },
  { value: 'education', label: t('onboarding.travel.types.education') },
  { value: 'other', label: t('onboarding.travel.types.other') },
];

// 여행 기간 옵션
const travelDurationOptions = [
  { value: 'short', label: t('onboarding.travel.durations.short') },
  { value: 'medium', label: t('onboarding.travel.durations.medium') },
  { value: 'long', label: t('onboarding.travel.durations.long') },
  { value: 'extended', label: t('onboarding.travel.durations.extended') },
];

// 여행 동반자 옵션
const travelCompanionsOptions = [
  { value: 'alone', label: t('onboarding.travel.companions.alone') },
  { value: 'couple', label: t('onboarding.travel.companions.couple') },
  { value: 'family', label: t('onboarding.travel.companions.family') },
  { value: 'friends', label: t('onboarding.travel.companions.friends') },
  { value: 'group', label: t('onboarding.travel.companions.group') },
];

/**
 * 여행 목적 프로필 페이지
 */
const TravelProfile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();

  // 현재 스텝
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 데이터 스테이트
  const [formData, setFormData] = useState<TravelProfileData>({
    gender: '',
    age: '',
    nationality: '',
    country: '',
    uiLanguage: 'ko',
    travelType: '',
    travelDuration: '',
    travelCompanions: '',
    startDate: '',
    endDate: '',
    interestedCities: [],
    travelPurposes: [],
    visaType: '',

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
  const getColorByTheme = (): string => {
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
    t('onboarding.travel.steps.profile'),
    t('onboarding.travel.steps.schedule'),
    t('onboarding.travel.steps.cities'),
    t('onboarding.travel.steps.purposes'),
    t('onboarding.travel.steps.language'),
    t('onboarding.travel.steps.interests'),
    t('onboarding.travel.steps.emergency'),
  ];

  // 스텝 아이콘 정의
  const stepIcons = [
    <PersonIcon />,
    <CalendarTodayIcon />,
    <LocationOnIcon />,
    <ExploreIcon />,
    <TranslateIcon />,
    <FavoriteIcon />,
    <HealthAndSafetyIcon />,
  ];

  // 총 스텝 수
  const totalSteps = stepLabels.length;

  // 현재 스텝에 해당하는 공통 컴포넌트 타입
  const getCommonStepType = (): CommonStepType | null => {
    switch (currentStep) {
      case 5:
        return 'language';
      case 6:
        return 'interests';
      case 7:
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
        alert(t('onboarding.confirmNation'));
        setIsSubmitting(false);
        return;
      }

      if (!formData.gender) {
        alert(t('onboarding.confirmGender'));
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
        travelType: formData.travelType,
        travelDuration: formData.travelDuration,
        travelCompanions: formData.travelCompanions,
        startDate: formData.startDate,
        endDate: formData.endDate,
        interestedCities: formData.interestedCities,
        travelPurposes: formData.travelPurposes,
        visaType: formData.visaType,

        // 공통 정보
        language: formData.language,
        emergencyInfo: formData.emergencyInfo,
        interests: formData.interests,
      };

      try {
        // 백엔드에 데이터 저장 (visit purpose: travel)
        await saveOnboardingData('travel', onboardingData);
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
    const str = (n: number) => n.toString();
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
      case 1: // 여행자 세부 프로필
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
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.travel.profile')}
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

              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    id="gender-label"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-focused': { color: primaryColor },
                      mb: 1,
                    }}
                  >
                    {t('onboarding.travel.gender')}
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
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.grey[400],
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={t('onboarding.travel.male')}
                    />
                    <FormControlLabel
                      value="female"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.grey[400],
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={t('onboarding.travel.female')}
                    />
                    <FormControlLabel
                      value="other"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.grey[400],
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={t('onboarding.travel.other')}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <StyledTextField
                label={t('onboarding.travel.age')}
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                color="primary"
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
              <CountrySelector
                label={t('onboarding.travel.country')}
                value={formData.nationality}
                onChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}
                fullWidth
              />

              <StyledTextField
                select
                label={t('onboarding.travel.uiLanguage')}
                name="uiLanguage"
                value={formData.uiLanguage}
                onChange={handleInputChange}
                fullWidth
                helperText={t('onboarding.travel.helperText')}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TranslateIcon sx={{ color: alpha(primaryColor, 0.7) }} />
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

      case 2: // 여행 기간 일정
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
                {t('onboarding.travel.scheduleTitle')}

              </Typography>
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
                  {t('onboarding.travel.startDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.travel.startDateLabel')}
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
                  {t('onboarding.travel.endDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.travel.endDateLabel')}
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


            <Box sx={{ mt: 3 }}>

              <StyledTextField
                select
                label={t('onboarding.travel.visaTypeLabel')}
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
                    {t(`onboarding.visa.types.${option.code}`)}
                  </MenuItem>
                ))}
              </StyledTextField>

            </Box>
          </StyledPaper>
        );

      case 3: // 관심 도시 설정
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
                {t('onboarding.travel.interestedCities.title')}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {t('onboarding.travel.interestedCities.description')}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
                >
                  {t('onboarding.travel.interestedCities.popularTitle')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {[
                    t('popularCities.0'),
                    t('popularCities.1'),
                    t('popularCities.2'),
                    t('popularCities.3'),
                    t('popularCities.4'),
                    t('popularCities.5'),
                  ].map(city => (
                    <Chip
                      key={city}
                      label={city}
                      clickable
                      color={formData.interestedCities.includes(city) ? 'primary' : 'default'}
                      sx={{
                        borderRadius: '16px',
                        px: 1,
                        backgroundColor: formData.interestedCities.includes(city)
                          ? alpha(primaryColor, 0.1)
                          : alpha(theme.palette.grey[200], 0.7),
                        color: formData.interestedCities.includes(city)
                          ? primaryColor
                          : 'text.secondary',
                        border: formData.interestedCities.includes(city)
                          ? `1px solid ${alpha(primaryColor, 0.3)}`
                          : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                        '&:hover': {
                          backgroundColor: formData.interestedCities.includes(city)
                            ? alpha(primaryColor, 0.2)
                            : alpha(theme.palette.grey[300], 0.5),
                        },
                      }}
                      onClick={() => {
                        const updated = formData.interestedCities.includes(city)
                          ? formData.interestedCities.filter(c => c !== city)
                          : [...formData.interestedCities, city];
                        setFormData(prev => ({ ...prev, interestedCities: updated }));
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
              >
                {t('onboarding.travel.interestedCities.searchTitle')}
              </Typography>
              <Autocomplete
                multiple
                id="interestedCities"
                options={koreanCities.filter(city => !formData.interestedCities.includes(city))}
                value={formData.interestedCities}
                onChange={(e, newValue) => {
                  setFormData(prev => ({ ...prev, interestedCities: newValue }));
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
                          '&:hover': { color: alpha(primaryColor, 0.7) },
                        },
                      }}
                    />
                  ))
                }
                renderInput={params => (
                  <StyledTextField
                    {...params}
                    label={t('onboarding.travel.interestedCities.searchTitle')}
                    placeholder={t('onboarding.travel.interestedCities.searchPlaceholder')}
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
                sx={{ color: 'text.secondary', display: 'block', mt: 1 }}
              >
                {t('onboarding.travel.interestedCities.helper')}
              </Typography>
            </Box>

            {formData.interestedCities.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                >
                  {t('onboarding.travel.interestedCities.selectedTitle', {
                    count: str(formData.interestedCities.length),
                  })}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                  }}
                >
                  {formData.interestedCities.map(city => (
                    <Box
                      key={city}
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
                        <LocationOnIcon sx={{ fontSize: '1.2rem', color: primaryColor, mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {city}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            interestedCities: prev.interestedCities.filter(c => c !== city),
                          }))
                        }
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

      case 4: // 여행 목적 선택
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
                <ExploreIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.travel.purpose.title')}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('onboarding.travel.purpose.description')}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              {getTravelPurposeOptions(t).map(option => {
                const isSelected = formData.travelPurposes.includes(option.code);

                return (
                  <Box
                    key={option.code}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        travelPurposes: isSelected
                          ? prev.travelPurposes.filter(code => code !== option.code)
                          : [...prev.travelPurposes, option.code],
                      }));
                    }}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${
                        isSelected ? alpha(primaryColor, 0.3) : alpha(theme.palette.grey[300], 0.7)
                      }`,
                      backgroundColor: isSelected ? alpha(primaryColor, 0.08) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isSelected
                          ? alpha(primaryColor, 0.12)
                          : alpha(theme.palette.grey[100], 0.7),
                        transform: 'translateY(-2px)',
                        boxShadow: isSelected
                          ? `0 4px 10px ${alpha(primaryColor, 0.2)}`
                          : '0 4px 10px rgba(0, 0, 0, 0.05)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: isSelected
                          ? alpha(primaryColor, 0.2)
                          : alpha(theme.palette.grey[200], 0.7),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      {isSelected && (
                        <Typography sx={{ fontWeight: 600, color: primaryColor }}>✓</Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? primaryColor : 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {option.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
              }}
            >
              {t('onboarding.travel.purpose.helper')}
            </Typography>
          </StyledPaper>
        );

      case 5: // 언어 능력
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
                <TranslateIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.languageAbility.title')}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('onboarding.languageAbility.description')}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              {[
                {
                  value: 'basic',
                  label: t('onboarding.languageLevel.basic.label'),
                  description: t('onboarding.languageLevel.basic.description'),
                },
                {
                  value: 'intermediate',
                  label: t('onboarding.languageLevel.intermediate.label'),
                  description: t('onboarding.languageLevel.intermediate.description'),
                },
                {
                  value: 'advanced',
                  label: t('onboarding.languageLevel.advanced.label'),
                  description: t('onboarding.languageLevel.advanced.description'),
                },
              ].map(option => {
                const isSelected = formData.language.koreanLevel === option.value;

                return (
                  <Box
                    key={option.value}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        language: {
                          ...prev.language,
                          koreanLevel: option.value,
                        },
                      }));
                    }}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${
                        isSelected ? alpha(primaryColor, 0.3) : alpha(theme.palette.grey[300], 0.7)
                      }`,
                      backgroundColor: isSelected ? alpha(primaryColor, 0.08) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isSelected
                          ? alpha(primaryColor, 0.12)
                          : alpha(theme.palette.grey[100], 0.7),
                        transform: 'translateY(-2px)',
                        boxShadow: isSelected
                          ? `0 4px 10px ${alpha(primaryColor, 0.2)}`
                          : '0 4px 10px rgba(0, 0, 0, 0.05)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: isSelected
                          ? alpha(primaryColor, 0.2)
                          : alpha(theme.palette.grey[200], 0.7),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {isSelected && (
                        <Typography sx={{ fontWeight: 600, color: primaryColor }}>✓</Typography>
                      )}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? primaryColor : 'text.primary',
                        mb: 1,
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
              }}
            >
              {t('onboarding.languageAbility.note')}
            </Typography>
          </StyledPaper>
        );

      case 6: // 관심사 선택
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
                <FavoriteIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.interests.title')}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('onboarding.interests.description')}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
              >
                {t('onboarding.interests.selectLabel')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {[
                  { value: '관광', icon: '🏙️' },
                  { value: '음식', icon: '🍱' },
                  { value: '쇼핑', icon: '🛍️' },
                  { value: '문화', icon: '🎭' },
                  { value: '자연', icon: '🏞️' },
                  { value: '휴양', icon: '🧘' },
                  { value: '엔터테인먼트', icon: '🎬' },
                  { value: '역사', icon: '🏛️' },
                  { value: '사진', icon: '📸' },
                  { value: '나이트라이프', icon: '🌃' },
                  { value: '액티비티', icon: '🏊' },
                  { value: '예술', icon: '🎨' },
                ].map(interest => {
                  const isSelected = formData.interests.includes(interest.value);

                  return (
                    <Chip
                      key={interest.value}
                      icon={
                        <Box component="span" sx={{ mr: 0.5 }}>
                          {interest.icon}
                        </Box>
                      }
                      label={t(`onboarding.interests.options.${interest.value}`)}
                      clickable
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          interests: isSelected
                            ? prev.interests.filter(i => i !== interest.value)
                            : [...prev.interests, interest.value],
                        }));
                      }}
                      sx={{
                        borderRadius: '16px',
                        px: 1,
                        py: 2.5,
                        backgroundColor: isSelected
                          ? alpha(primaryColor, 0.1)
                          : alpha(theme.palette.grey[100], 0.7),
                        color: isSelected ? primaryColor : 'text.primary',
                        border: isSelected
                          ? `1px solid ${alpha(primaryColor, 0.3)}`
                          : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                        '&:hover': {
                          backgroundColor: isSelected
                            ? alpha(primaryColor, 0.2)
                            : alpha(theme.palette.grey[200], 0.7),
                        },
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {formData.interests.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                >
                  {t('onboarding.interests.selectedTitle', {
                    count: formData.interests.length.toString(),
                  })}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(primaryColor, 0.2)}`,
                    backgroundColor: alpha(primaryColor, 0.05),
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                    {t('onboarding.interests.providedInfo')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.interests.map(interest => (
                      <Chip
                        key={interest}
                        label={t(`onboarding.interests.options.${interest}`)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(primaryColor, 0.2),
                          color: primaryColor,
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
              {t('onboarding.interests.helper')}
            </Typography>
          </StyledPaper>
        );

      case 7: // 응급 상황 설정
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
                <HealthAndSafetyIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.emergency.title')}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('onboarding.emergency.description')}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
              >
                {t('onboarding.emergency.contactLabel')}
              </Typography>
              <StyledTextField
                label={t('onboarding.emergency.contactLabel')}
                name="emergencyInfo.contact"
                value={formData.emergencyInfo.contact}
                onChange={handleInputChange}
                fullWidth
                required
                color="primary"
                placeholder={t('onboarding.emergency.contactPlaceholder')}
                helperText={t('onboarding.emergency.contactHelper')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: alpha(primaryColor, 0.7) }}>📞</Box>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
              >
                {t('onboarding.emergency.medicalLabel')}
              </Typography>
              <StyledTextField
                label={t('onboarding.emergency.medicalLabel')}
                name="emergencyInfo.medicalConditions"
                value={formData.emergencyInfo.medicalConditions}
                onChange={handleInputChange}
                multiline
                rows={2}
                fullWidth
                color="primary"
                placeholder={t('onboarding.emergency.medicalPlaceholder')}
                helperText={t('onboarding.emergency.medicalHelper')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: alpha(primaryColor, 0.7) }}>🏥</Box>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
              >
                {t('onboarding.emergency.foodLabel')}
              </Typography>
              <StyledTextField
                label={t('onboarding.emergency.foodLabel')}
                name="emergencyInfo.foodAllergies"
                value={formData.emergencyInfo.foodAllergies}
                onChange={handleInputChange}
                multiline
                rows={2}
                fullWidth
                color="primary"
                placeholder={t('onboarding.emergency.foodPlaceholder')}
                helperText={t('onboarding.emergency.foodHelper')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: alpha(primaryColor, 0.7) }}>🍽️</Box>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  p: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1.5,
                    color: theme.palette.info.main,
                    fontSize: '1.2rem',
                    mt: 0.5,
                  }}
                >
                  ℹ️
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('onboarding.emergency.notice')}
                </Typography>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.emergencyInfo.receiveEmergencyAlerts}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          emergencyInfo: {
                            ...prev.emergencyInfo,
                            receiveEmergencyAlerts: e.target.checked,
                          },
                        }))
                      }
                      sx={{
                        color: theme.palette.grey[400],
                        '&.Mui-checked': { color: primaryColor },
                      }}
                    />
                  }
                  label={t('onboarding.emergency.alertLabel')}
                />
              </Box>
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
      case 1: // 여행자 세부 프로필
        return !formData.gender || !formData.nationality;
      case 2: // 여행 기간 일정
        return !formData.startDate || !formData.endDate;
      case 3: // 관심 도시 설정
        return formData.interestedCities.length === 0;
      case 4: // 여행 목적 선택
        return formData.travelPurposes.length === 0;
      case 5: // 언어 능력
        return !formData.language.koreanLevel;
      case 6: // 관심사 선택
        return formData.interests.length === 0;
      case 7: // 응급 상황 설정
        return (
          !formData.emergencyInfo.contact ||
          !formData.emergencyInfo.medicalConditions ||
          !formData.emergencyInfo.foodAllergies
        );
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
              {t('onboarding.travel.setting')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                opacity: 0.85,
              }}
            >
              {t('onboarding.travel.settingDes')}
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
            {t('onboarding.back')}
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
                ? '저장 중...'
                : t('onboarding.save')
              : t('onboarding.next')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TravelProfile;
