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
import { koreanUniversities, koreanCities, koreanAdministrativeDivisions } from '../data/koreaData';
import { motion } from 'framer-motion';

// 아이콘 임포트
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisaIcon from '@mui/icons-material/DocumentScanner';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTranslation } from '@/shared/i18n';
import CountrySelector from '@/shared/components/CountrySelector';

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
 * 유학생 온보딩 정보 데이터
 */
interface StudyProfileData {
  gender: string;
  age: string;
  nationality: string;
  country: string;
  uiLanguage: string;
  educationLevel: string;
  fieldOfStudy: string;
  desiredSchool: string;
  visaType: string;

  // 학업 정보
  studyType: string;
  majorField: string;
  academicLevel: string;

  // 유학 일정
  startDate: string;
  endDate: string;
  studyDuration: string;

  // 학교/지역 선택
  preferredUniversities: string[];
  preferredRegions: string[];

  // 공통 섹션 데이터
  language: LanguageData;
  emergencyInfo: EmergencyData;
  interests: string[];
}

// UI 언어 옵션
const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// 학업 유형 옵션
const getStudyTypeOptions = (t: any) => [
  { value: 'degree', label: t('onboarding.study.studyType.degree') },
  { value: 'exchange', label: t('onboarding.study.studyType.exchange') },
  { value: 'language', label: t('onboarding.study.studyType.language') },
  { value: 'research', label: t('onboarding.study.studyType.research') },
  { value: 'shortTerm', label: t('onboarding.study.studyType.shortTerm') },
  { value: 'other', label: t('onboarding.study.studyType.other') },
];

// 전공 분야 옵션
const getMajorFieldOptions = (t: any) => [
  { value: 'arts', label: t('onboarding.study.majorField.arts') },
  { value: 'business', label: t('onboarding.study.majorField.business') },
  { value: 'engineering', label: t('onboarding.study.majorField.engineering') },
  { value: 'humanities', label: t('onboarding.study.majorField.humanities') },
  { value: 'language', label: t('onboarding.study.majorField.language') },
  { value: 'law', label: t('onboarding.study.majorField.law') },
  { value: 'medicine', label: t('onboarding.study.majorField.medicine') },
  { value: 'naturalScience', label: t('onboarding.study.majorField.naturalScience') },
  { value: 'socialScience', label: t('onboarding.study.majorField.socialScience') },
  { value: 'other', label: t('onboarding.study.majorField.other') },
];

// 학위 과정 옵션
const getAcademicLevelOptions = (t: any) => [
  { value: 'language', label: t('onboarding.study.academicLevel.language') },
  { value: 'bachelor', label: t('onboarding.study.academicLevel.bachelor') },
  { value: 'master', label: t('onboarding.study.academicLevel.master') },
  { value: 'phd', label: t('onboarding.study.academicLevel.phd') },
  { value: 'postdoc', label: t('onboarding.study.academicLevel.postdoc') },
  { value: 'other', label: t('onboarding.study.academicLevel.other') },
];

// 비자 종류 옵션
const visaTypeOptions = [
  { code: 'd2_1', name: 'D-2-1 (전문학사)' },
  { code: 'd2_2', name: 'D-2-2 (학사유학)' },
  { code: 'd2_3', name: 'D-2-3 (석사유학)' },
  { code: 'd2_4', name: 'D-2-4 (박사유학)' },
  { code: 'd2_5', name: 'D-2-5 (연구유학)' },
  { code: 'd2_6', name: 'D-2-6 (교환학생)' },
  { code: 'd4_1', name: 'D-4-1 (대학부설어학원연수)' },
  { code: 'd4_2', name: 'D-4-2 (기타기관연수)' },
  { code: 'd4_3', name: 'D-4-3 (초중고생)' },
  { code: 'd4_5', name: 'D-4-5 (한식조리연수)' },
  { code: 'd4_6', name: 'D-4-6 (사설기관연수)' },
  { code: 'd4_7', name: 'D-4-7 (외국어연수)' },
  { code: 'c3_1', name: 'C-3-1 (단기일반)' },
  { code: 'c3_4', name: 'C-3-4 (일반상용)' },
  { code: 'd1', name: 'D-1 (문화예술연수)' },
  { code: 'f1_13', name: 'F-1-13 (유학생부모)' },
  { code: 'unknown', name: '미정/모름' },
  { code: 'other', name: '기타' },
];

/**
 * 유학생 프로필 페이지
 */
const StudyProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();

  // 현재 스텝
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 데이터 스테이트
  const [formData, setFormData] = useState<StudyProfileData>({
    gender: '',
    age: '',
    nationality: '',
    country: '',
    uiLanguage: 'ko',
    educationLevel: '',
    fieldOfStudy: '',
    desiredSchool: '',
    visaType: '',

    // 학업 정보
    studyType: '',
    majorField: '',
    academicLevel: '',

    // 유학 일정
    startDate: '',
    endDate: '',
    studyDuration: '',

    // 학교/지역 선택
    preferredUniversities: [],
    preferredRegions: [],

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

  // 시/도 목록 (select box용)
  const cityProvinceList = Object.keys(koreanAdministrativeDivisions);

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
    t('onboarding.study.steps.profile'),
    t('onboarding.study.steps.academic'),
    t('onboarding.study.steps.schedule'),
    t('onboarding.study.steps.location'),
    t('onboarding.study.steps.language'),
    t('onboarding.study.steps.interests'),
    t('onboarding.study.steps.emergency'),
  ];

  // 스텝 아이콘 정의
  const stepIcons = [
    <PersonIcon />,
    <SchoolIcon />,
    <CalendarTodayIcon />,
    <LocationOnIcon />,
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
        educationLevel: formData.educationLevel,
        fieldOfStudy: formData.fieldOfStudy,
        desiredSchool: formData.desiredSchool,
        visaType: formData.visaType,

        // 공통 정보
        language: formData.language,
        emergencyInfo: formData.emergencyInfo,
        interests: formData.interests,
      };

      try {
        // 백엔드에 데이터 저장 (visit purpose: study)
        await saveOnboardingData('study', onboardingData);
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
      case 1: // 유학생 세부 프로필
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
                {t('onboarding.study.profileTitle')}
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
                    {t('onboarding.study.form.gender')}
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
                      label={t('onboarding.study.form.male')}
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
                      label={t('onboarding.study.form.female')}
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
                      label={t('onboarding.study.form.other')}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <StyledTextField
                label={t('onboarding.study.form.age')}
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
                label={t('onboarding.study.form.nationality')}
                value={formData.nationality}
                onChange={value => setFormData(prev => ({ ...prev, nationality: value }))}
                fullWidth
              />

              <StyledTextField
                select
                label={t('onboarding.study.form.uiLanguage')}
                name="uiLanguage"
                value={formData.uiLanguage}
                onChange={handleInputChange}
                fullWidth
                helperText={t('onboarding.study.form.uiLanguageHelper')}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TranslateIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {SUPPORTED_LANGUAGES.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 2: // 학업 정보
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
                <SchoolIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.study.academicTitle')}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.study.form.studyType')}
                name="studyType"
                value={formData.studyType}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {getStudyTypeOptions(t).map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
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
                select
                label={t('onboarding.study.form.majorField')}
                name="majorField"
                value={formData.majorField}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LibraryBooksIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {getMajorFieldOptions(t).map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>

              <StyledTextField
                select
                label={t('onboarding.study.form.academicLevel')}
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {getAcademicLevelOptions(t).map(option => (
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
                    {t(`onboarding.living.visaTypeOptions.${option.code}`)}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 3: // 유학 일정
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
                {t('onboarding.studySchedule.title')}
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
                {t('onboarding.studySchedule.selectDuration')}
              </Typography>
              <StyledTextField
                select
                label={t('onboarding.studySchedule.durationLabel')}
                name="studyDuration"
                value={formData.studyDuration}
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
                <MenuItem value="underSixMonths">
                  {t('onboarding.studySchedule.underSixMonths')}
                </MenuItem>
                <MenuItem value="sixMonthsToOneYear">
                  {t('onboarding.studySchedule.sixMonthsToOneYear')}
                </MenuItem>
                <MenuItem value="oneYearToTwoYears">
                  {t('onboarding.studySchedule.oneYearToTwoYears')}
                </MenuItem>
                <MenuItem value="twoYearsToFourYears">
                  {t('onboarding.studySchedule.twoYearsToFourYears')}
                </MenuItem>
                <MenuItem value="overFourYears">
                  {t('onboarding.studySchedule.overFourYears')}
                </MenuItem>
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
                  {t('onboarding.studySchedule.startDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.studySchedule.startDate')}
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
                  {t('onboarding.studySchedule.endDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.studySchedule.endDate')}
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

      case 4: // 학교/지역 선택
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
                {t('onboarding.univRegion.title')}
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
                {t('onboarding.univRegion.univLabel')}
              </Typography>
              <Autocomplete
                multiple
                id="preferredUniversities"
                options={koreanUniversities.filter(
                  uni => !formData.preferredUniversities.includes(uni)
                )}
                value={formData.preferredUniversities}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    preferredUniversities: newValue,
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
                    label={t('onboarding.univRegion.univInputLabel')}
                    placeholder={t('onboarding.univRegion.univPlaceholder')}
                    color="primary"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <SchoolIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {t('onboarding.univRegion.regionLabel')}
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
                    label={t('onboarding.univRegion.regionInputLabel')}
                    placeholder={t('onboarding.univRegion.regionPlaceholder')}
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
      case 1: // 유학생 세부 프로필
        return !formData.age || !formData.nationality;
      case 2: // 학업 정보
        return !formData.studyType;
      case 3: // 유학 일정
        return !formData.studyDuration;
      case 5: // 언어 능력
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
              {t('onboarding.study.profileSetting')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                opacity: 0.85,
              }}
            >
              {t('onboarding.study.profileDescription')}
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

export default StudyProfile;
