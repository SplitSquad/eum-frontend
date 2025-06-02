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
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisaIcon from '@mui/icons-material/DocumentScanner';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTranslation } from '@/shared/i18n';
import CountrySelector from '@/shared/components/CountrySelector';

// 번역을 위한 useTranslation 훅
const { t } = useTranslation();

// 스타일링된 컴포넌트
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 10px 40px rgba(80, 80, 90, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  position: 'relative',
  background: '#fafbfc',
  border: '1px solid #e0e0e0',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#636363',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: '#636363',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: '#636363',
  color: '#fff',
  fontWeight: 600,
  padding: theme.spacing(1.2, 3),
  borderRadius: theme.spacing(6),
  boxShadow: '0 4px 15px #e0e0e0',
  '&:hover': {
    boxShadow: '0 6px 20px #bdbdbd',
    background: '#888',
  },
}));

const StepIcon = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#e0e0e0',
  boxShadow: '0 4px 15px #bdbdbd',
  color: '#636363',
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
 * 취업 온보딩 정보 데이터
 */
interface JobProfileData {
  gender: string;
  age: string;
  nationality: string;
  country: string;
  uiLanguage: string;

  // 직업 정보
  jobField: string;
  workExperience: string;
  desiredPosition: string;
  visaType: string;

  // 취업 날짜 및 기간
  startDate: string;
  endDate: string;
  employmentDuration: string;

  // 희망 조건
  desiredSalary: string;
  desiredLocations: string[];
  desiredWorkingHours: string;

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

// 직업 분야 옵션
const getJobFieldOptions = (t: any) => [
  { code: 'it', name: t('onboarding.job.fields.it') },
  { code: 'design', name: t('onboarding.job.fields.design') },
  { code: 'finance', name: t('onboarding.job.fields.finance') },
  { code: 'engineering', name: t('onboarding.job.fields.engineering') },
  { code: 'sales', name: t('onboarding.job.fields.sales') },
  { code: 'research', name: t('onboarding.job.fields.research') },
  { code: 'education', name: t('onboarding.job.fields.education') },
  { code: 'consulting', name: t('onboarding.job.fields.consulting') },
  { code: 'manufacturing', name: t('onboarding.job.fields.manufacturing') },
  { code: 'service', name: t('onboarding.job.fields.service') },
  { code: 'healthcare', name: t('onboarding.job.fields.healthcare') },
  { code: 'agriculture', name: t('onboarding.job.fields.agriculture') },
  { code: 'construction', name: t('onboarding.job.fields.construction') },
  { code: 'translation', name: t('onboarding.job.fields.translation') },
  { code: 'hospitality', name: t('onboarding.job.fields.hospitality') },
  { code: 'art', name: t('onboarding.job.fields.art') },
  { code: 'cooking', name: t('onboarding.job.fields.cooking') },
  { code: 'sports', name: t('onboarding.job.fields.sports') },
  { code: 'beauty', name: t('onboarding.job.fields.beauty') },
  { code: 'other', name: t('onboarding.job.fields.other') },
];

// 경력 수준 옵션
const careerLevelOptions = [
  { value: 'entry', label: t('onboarding.career.levels.entry') },
  { value: 'junior', label: t('onboarding.career.levels.junior') },
  { value: 'midLevel', label: t('onboarding.career.levels.midLevel') },
  { value: 'senior', label: t('onboarding.career.levels.senior') },
  { value: 'executive', label: t('onboarding.career.levels.executive') },
];

// 근무 시간 옵션
const workingHoursOptions = [
  { value: 'fullTime', label: t('onboarding.career.hours.fullTime') },
  { value: 'partTime', label: t('onboarding.career.hours.partTime') },
  { value: 'flexible', label: t('onboarding.career.hours.flexible') },
  { value: 'remote', label: t('onboarding.career.hours.remote') },
  { value: 'shift', label: t('onboarding.career.hours.shift') },
];

// 비자 종류 옵션
const visaTypeOptions = [
  { code: 'c4', name: 'C-4 (단기취업)' },
  { code: 'd10_1', name: 'D-10-1 (구직활동)' },
  { code: 'd10_2', name: 'D-10-2 (기술창업활동)' },
  { code: 'e1', name: 'E-1 (교수)' },
  { code: 'e2_1', name: 'E-2-1 (일반회화강사)' },
  { code: 'e2_2', name: 'E-2-2 (학교보조교사)' },
  { code: 'e2_91', name: 'E-2-91 (FTA영어)' },
  { code: 'e3', name: 'E-3 (연구)' },
  { code: 'e4', name: 'E-4 (기술지도)' },
  { code: 'e5', name: 'E-5 (전문직업)' },
  { code: 'e6_1', name: 'E-6-1 (예술연예)' },
  { code: 'e6_2', name: 'E-6-2 (호텔유흥)' },
  { code: 'e6_3', name: 'E-6-3 (운동)' },
  { code: 'e7_1', name: 'E-7-1 (특정활동)' },
  { code: 'e7_91', name: 'E-7-91 (FTA독립)' },
  { code: 'e9_1', name: 'E-9-1 (제조업)' },
  { code: 'e9_2', name: 'E-9-2 (건설업)' },
  { code: 'e9_3', name: 'E-9-3 (농축산업)' },
  { code: 'e9_4', name: 'E-9-4 (어업)' },
  { code: 'e9_5', name: 'E-9-5 (서비스업)' },
  { code: 'e9_6', name: 'E-9-6 (광업)' },
  { code: 'h1', name: 'H-1 (관광취업)' },
  { code: 'h2', name: 'H-2 (방문취업)' },
  { code: 'unknown', name: '미정/모름' },
  { code: 'other', name: '기타' },
];

/**
 * 취업 프로필 페이지
 */
const JobProfile: React.FC = () => {
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
  const [formData, setFormData] = useState<JobProfileData>({
    gender: '',
    age: '',
    nationality: '',
    country: '',
    uiLanguage: 'ko',

    jobField: '',
    workExperience: '',
    desiredPosition: '',
    visaType: '',

    startDate: '',
    endDate: '',
    employmentDuration: '',

    desiredSalary: '',
    desiredLocations: [],
    desiredWorkingHours: '',

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

  // 스텝 라벨 정의
  const stepLabels = [
    t('onboarding.job.steps.profile'),
    t('onboarding.job.steps.details'),
    t('onboarding.job.steps.schedule'),
    t('onboarding.job.steps.conditions'),
    t('onboarding.job.steps.language'),
    t('onboarding.job.steps.interests'),
    t('onboarding.job.steps.emergency'),
  ];

  // 스텝 아이콘 정의
  const stepIcons = [
    <PersonIcon />,
    <WorkIcon />,
    <CalendarTodayIcon />,
    <BusinessIcon />,
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
        jobField: formData.jobField,
        workExperience: formData.workExperience,
        desiredPosition: formData.desiredPosition,
        visaType: formData.visaType,

        // 공통 정보
        language: formData.language,
        emergencyInfo: formData.emergencyInfo,
        interests: formData.interests,
      };

      try {
        // 백엔드에 데이터 저장 (visit purpose: job)
        await saveOnboardingData('job', onboardingData);
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
      case 1: // 취업자 세부 프로필
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: '#e0e0e0',
                  color: '#636363',
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.worker.profileTitle')}
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
              {/* <StyledTextField
                label={t('onboarding.worker.form.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              /> */}

              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    id="gender-label"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-focused': { color: '#636363' },
                      mb: 1,
                    }}
                  >
                    {t('onboarding.worker.form.gender')}
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
                            color: '#bdbdbd',
                            '&.Mui-checked': { color: '#636363' },
                          }}
                        />
                      }
                      label={t('onboarding.worker.form.male')}
                    />
                    <FormControlLabel
                      value="female"
                      control={
                        <Radio
                          sx={{
                            color: '#bdbdbd',
                            '&.Mui-checked': { color: '#636363' },
                          }}
                        />
                      }
                      label={t('onboarding.worker.form.female')}
                    />
                    <FormControlLabel
                      value="other"
                      control={
                        <Radio
                          sx={{
                            color: '#bdbdbd',
                            '&.Mui-checked': { color: '#636363' },
                          }}
                        />
                      }
                      label={t('onboarding.worker.form.other')}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <StyledTextField
                label={t('onboarding.worker.form.age')}
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
                label={t('onboarding.worker.form.nationality')}
                value={formData.nationality}
                onChange={value => setFormData(prev => ({ ...prev, nationality: value }))}
                fullWidth
              />

              <StyledTextField
                select
                label={t('onboarding.worker.form.uiLanguage')}
                name="uiLanguage"
                value={formData.uiLanguage}
                onChange={handleInputChange}
                fullWidth
                helperText={t('onboarding.worker.form.uiLanguageHelper')}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TranslateIcon sx={{ color: '#bdbdbd' }} />
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

      case 2: // 직업 상세 정보
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: '#e0e0e0',
                  color: '#636363',
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <WorkIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.worker.detail.title')}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.worker.detail.jobField')}
                name="jobField"
                value={formData.jobField}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {getJobFieldOptions(t).map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.worker.detail.workExperience')}
                name="workExperience"
                value={formData.workExperience}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="entry">
                  {t('onboarding.worker.detail.workExperienceOptions.entry')}
                </MenuItem>
                <MenuItem value="junior">
                  {t('onboarding.worker.detail.workExperienceOptions.junior')}
                </MenuItem>
                <MenuItem value="mid">
                  {t('onboarding.worker.detail.workExperienceOptions.mid')}
                </MenuItem>
                <MenuItem value="senior">
                  {t('onboarding.worker.detail.workExperienceOptions.senior')}
                </MenuItem>
                <MenuItem value="expert">
                  {t('onboarding.worker.detail.workExperienceOptions.expert')}
                </MenuItem>
              </StyledTextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                label={t('onboarding.worker.detail.desiredPosition')}
                name="desiredPosition"
                value={formData.desiredPosition}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                placeholder={t('onboarding.worker.detail.desiredPositionPlaceholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <StyledTextField
                select
                label={t('onboarding.worker.detail.visaType')}
                name="visaType"
                value={formData.visaType}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisaIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {visaTypeOptions.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {t(`onboarding.job.visaTypeOptions.${option.code}`)}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 3: // 취업 날짜 및 기간
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: '#e0e0e0',
                  color: '#636363',
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <CalendarTodayIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.worker.schedule.title')}
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
                {t('onboarding.worker.schedule.selectDuration')}
              </Typography>
              <StyledTextField
                select
                label={t('onboarding.worker.schedule.durationLabel')}
                name="employmentDuration"
                value={formData.employmentDuration}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 1 }}
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="short_term">
                  {t('onboarding.worker.schedule.durationOptions.short_term')}
                </MenuItem>
                <MenuItem value="temporary">
                  {t('onboarding.worker.schedule.durationOptions.temporary')}
                </MenuItem>
                <MenuItem value="contract">
                  {t('onboarding.worker.schedule.durationOptions.contract')}
                </MenuItem>
                <MenuItem value="long_term">
                  {t('onboarding.worker.schedule.durationOptions.long_term')}
                </MenuItem>
                <MenuItem value="permanent">
                  {t('onboarding.worker.schedule.durationOptions.permanent')}
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
                  {t('onboarding.worker.schedule.startDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.worker.schedule.startDate')}
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
                        <CalendarTodayIcon sx={{ color: '#bdbdbd' }} />
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
                  {t('onboarding.worker.schedule.endDateLabel')}
                </Typography>
                <StyledTextField
                  label={t('onboarding.worker.schedule.endDate')}
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
                        <CalendarTodayIcon sx={{ color: '#bdbdbd' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
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
                {t('onboarding.worker.schedule.workingHoursLabel')}
              </Typography>
              <StyledTextField
                select
                label={t('onboarding.worker.schedule.workingHoursInputLabel')}
                name="desiredWorkingHours"
                value={formData.desiredWorkingHours}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="full_time">
                  {t('onboarding.worker.schedule.workingHoursOptions.full_time')}
                </MenuItem>
                <MenuItem value="part_time">
                  {t('onboarding.worker.schedule.workingHoursOptions.part_time')}
                </MenuItem>
                <MenuItem value="flexible">
                  {t('onboarding.worker.schedule.workingHoursOptions.flexible')}
                </MenuItem>
                <MenuItem value="weekend">
                  {t('onboarding.worker.schedule.workingHoursOptions.weekend')}
                </MenuItem>
                <MenuItem value="night_shift">
                  {t('onboarding.worker.schedule.workingHoursOptions.night_shift')}
                </MenuItem>
              </StyledTextField>
            </Box>
          </StyledPaper>
        );

      case 4: // 희망 근무 조건
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: '#e0e0e0',
                  color: '#636363',
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('onboarding.worker.preference.title')}
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
                {/* {t('onboarding.worker.preference.locationLabel')} */}
              </Typography>
              <Autocomplete
                multiple
                id="desiredLocations"
                options={cityProvinceList.filter(city => !formData.desiredLocations.includes(city))}
                value={formData.desiredLocations}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    desiredLocations: newValue,
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: '#e0e0e0',
                        color: '#636363',
                        borderRadius: '16px',
                        border: '1px solid #bdbdbd',
                        '& .MuiChip-deleteIcon': {
                          color: '#636363',
                          '&:hover': {
                            color: '#bdbdbd',
                          },
                        },
                      }}
                    />
                  ))
                }
                renderInput={params => (
                  <StyledTextField
                    {...params}
                    label={t('onboarding.worker.preference.locationInputLabel')}
                    placeholder={t('onboarding.worker.preference.locationPlaceholder')}
                    color="primary"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: '#bdbdbd' }} />
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
                {t('onboarding.worker.preference.locationSelectAtLeastOne')}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StyledTextField
                label={t('onboarding.worker.preference.salaryLabel')}
                name="desiredSalary"
                value={formData.desiredSalary}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                placeholder={t('onboarding.worker.preference.salaryPlaceholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentsIcon sx={{ color: '#bdbdbd' }} />
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
                      ? 'linear-gradient(135deg, #636363 0%, #888 100%)'
                      : '#e0e0e0',
                  boxShadow: isActive ? '0 4px 12px #bdbdbd' : 'none',
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  color: isActive || isCompleted ? 'white' : '#636363',
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
                  color: isActive ? '#636363' : 'text.secondary',
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

  // 다음 버튼 비활성화 여부 확인
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: // 취업자 세부 프로필
        return !formData.gender || !formData.nationality;
      case 2: // 직업 상세 정보
        return !formData.jobField || !formData.workExperience;
      case 3: // 취업 날짜 및 기간
        return !formData.employmentDuration;
      case 4: // 희망 조건
        return formData.desiredLocations.length === 0;
      case 5: // 언어 능력
        return !formData.language.koreanLevel;
      case 6: // 관심사 선택
        return formData.interests.length === 0;
      case 7: // 응급 상황 설정
        return !formData.emergencyInfo.contact;
      default:
        return false;
    }
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
        background: 'transparent',
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
              border: `1px solid #bdbdbd`,
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
              '&:hover': { color: '#636363' },
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
              {t('onboarding.job.profileSetting')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                opacity: 0.85,
              }}
            >
              {t('onboarding.job.profileDescription')}
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
              borderColor: '#bdbdbd',
              color: 'text.secondary',
              px: 3,
              py: 1,
              borderRadius: '50px',
              '&:hover': {
                borderColor: '#888',
                backgroundColor: '#e0e0e0',
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
              bgcolor: '#636363',
              color: 'white',
              px: { xs: 3, md: 4 },
              py: 1,
              borderRadius: '50px',
              fontWeight: 600,
              boxShadow: '0 6px 16px #bdbdbd',
              '&:hover': {
                bgcolor: '#888',
                boxShadow: '0 8px 20px #bdbdbd',
                transform: 'translateY(-2px)',
              },
              textTransform: 'none',
            }}
          >
            {currentStep === totalSteps
              ? isSubmitting
                ? t('onboarding.travel.saving')
                : t('onboarding.travel.finish')
              : t('onboarding.travel.next')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobProfile;
