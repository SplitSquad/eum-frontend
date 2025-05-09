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
  Theme
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

const GradientButton = styled(Button)(({ theme, gradientcolors }: { theme: Theme, gradientcolors?: string }) => ({
  background: gradientcolors || `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: '#fff',
  fontWeight: 600,
  padding: theme.spacing(1.2, 3),
  borderRadius: theme.spacing(6),
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const StepIcon = styled(Box)(({ theme, color = '#1976d2' }: { theme: Theme, color?: string }) => ({
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

const StepConnector = styled(Box)(({ theme, active = false }: { theme: Theme, active?: boolean }) => ({
  height: 3,
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  width: '100%',
  transition: 'background-color 0.3s ease',
}));

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
  name: string;
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
const uiLanguageOptions = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ภาษาไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
];

// 직업 분야 옵션
const jobFieldOptions = [
  { code: 'it', name: 'IT / 소프트웨어' },
  { code: 'design', name: '디자인 / 미디어' },
  { code: 'finance', name: '금융 / 회계' },
  { code: 'engineering', name: '엔지니어링' },
  { code: 'sales', name: '영업 / 마케팅' },
  { code: 'research', name: '연구 / 개발' },
  { code: 'education', name: '교육 / 강의' },
  { code: 'consulting', name: '컨설팅' },
  { code: 'manufacturing', name: '제조 / 생산' },
  { code: 'service', name: '서비스업' },
  { code: 'healthcare', name: '의료 / 건강' },
  { code: 'agriculture', name: '농업 / 축산업' },
  { code: 'construction', name: '건설 / 건축' },
  { code: 'translation', name: '번역 / 통역' },
  { code: 'hospitality', name: '호텔 / 관광' },
  { code: 'art', name: '예술 / 문화' },
  { code: 'cooking', name: '요리 / 음식' },
  { code: 'sports', name: '스포츠 / 레저' },
  { code: 'beauty', name: '미용 / 패션' },
  { code: 'other', name: '기타' },
];

// 경력 수준 옵션
const careerLevelOptions = [
  { value: 'entry', label: '신입' },
  { value: 'junior', label: '주니어 (1-3년)' },
  { value: 'midLevel', label: '미드레벨 (4-6년)' },
  { value: 'senior', label: '시니어 (7년 이상)' },
  { value: 'executive', label: '임원급' },
];

// 근무 시간 옵션
const workingHoursOptions = [
  { value: 'fullTime', label: '풀타임' },
  { value: 'partTime', label: '파트타임' },
  { value: 'flexible', label: '유연근무제' },
  { value: 'remote', label: '원격근무' },
  { value: 'shift', label: '교대근무' },
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
    name: '',
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
  
  // 계절에 따른 색상 가져오기
  const getColorByTheme = () => {
    switch (season) {
      case 'spring': return '#FFAAA5';
      case 'summer': return '#77AADD';
      case 'autumn': return '#E8846B';
      case 'winter': return '#8795B5';
      default: return '#FFAAA5';
    }
  };

  const primaryColor = getColorByTheme();
  
  // 스텝 라벨 정의
  const stepLabels = [
    '취업자 세부 프로필',
    '직업 상세 정보',
    '취업 날짜 및 기간',
    '희망 조건',
    '언어 능력',
    '관심사 선택',
    '응급 상황 설정',
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
      case 5: return 'language';
      case 6: return 'interests';
      case 7: return 'emergency';
      default: return null;
    }
  };
  
  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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
        name: formData.name,
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
      
      // 메인 페이지로 이동
      navigate('/');
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
                  bgcolor: alpha(primaryColor, 0.2), 
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                취업자 세부 프로필
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3,
              mb: 2 
            }}>
              <StyledTextField
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel 
                    id="gender-label" 
                    sx={{ 
                      color: 'text.secondary',
                      '&.Mui-focused': { color: primaryColor },
                      mb: 1
                    }}
                  >
                    성별
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
                      label="남성" 
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
                      label="여성" 
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
                      label="기타" 
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3,
              mb: 2 
            }}>
              <StyledTextField
                label="나이"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                type="number"
              />
              
              <StyledTextField
                label="국적"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                fullWidth
                color="primary"
              />
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3
            }}>
              <StyledTextField
                select
                label="UI 언어 선택"
                name="uiLanguage"
                value={formData.uiLanguage}
                onChange={handleInputChange}
                fullWidth
                helperText="앱에서 사용할 언어를 선택해주세요"
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TranslateIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {uiLanguageOptions.map((option) => (
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
                  bgcolor: alpha(primaryColor, 0.2), 
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                <WorkIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                직업 상세 정보
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label="희망 직종"
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
                      <WorkIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                {jobFieldOptions.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <StyledTextField
                select
                label="경력 수준"
                name="workExperience"
                value={formData.workExperience}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="entry">신입 (경력 없음)</MenuItem>
                <MenuItem value="junior">주니어 (1-3년)</MenuItem>
                <MenuItem value="mid">미드레벨 (4-6년)</MenuItem>
                <MenuItem value="senior">시니어 (7-10년)</MenuItem>
                <MenuItem value="expert">전문가 (10년 이상)</MenuItem>
              </StyledTextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <StyledTextField
                label="희망 직무/포지션"
                name="desiredPosition"
                value={formData.desiredPosition}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                placeholder="예: 소프트웨어 개발자, 회계사, 디자이너 등"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <StyledTextField
                select
                label="비자 종류"
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
                {visaTypeOptions.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
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
                  bgcolor: alpha(primaryColor, 0.2), 
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                <CalendarTodayIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                취업 날짜 및 기간
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                희망 근무 기간을 선택해주세요
              </Typography>
              <StyledTextField
                select
                label="희망 근무 기간"
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
                      <CalendarTodayIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="short_term">단기 (3개월 미만)</MenuItem>
                <MenuItem value="temporary">임시직 (3-6개월)</MenuItem>
                <MenuItem value="contract">계약직 (6개월-1년)</MenuItem>
                <MenuItem value="long_term">장기 계약직 (1-3년)</MenuItem>
                <MenuItem value="permanent">정규직 (무기한)</MenuItem>
              </StyledTextField>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3,
                mb: 4
              }}
            >
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  근무 시작 희망일
                </Typography>
                <StyledTextField
                  label="시작 날짜"
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
                    fontWeight: 500
                  }}
                >
                  근무 종료 예정일 (정규직은 비워두세요)
                </Typography>
                <StyledTextField
                  label="종료 날짜"
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
            
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                희망 근무 시간
              </Typography>
              <StyledTextField
                select
                label="근무 시간"
                name="desiredWorkingHours"
                value={formData.desiredWorkingHours}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: alpha(primaryColor, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="full_time">풀타임 (주 40시간)</MenuItem>
                <MenuItem value="part_time">파트타임 (주 20-30시간)</MenuItem>
                <MenuItem value="flexible">유연근무제</MenuItem>
                <MenuItem value="weekend">주말 근무</MenuItem>
                <MenuItem value="night_shift">야간 근무</MenuItem>
              </StyledTextField>
            </Box>
          </StyledPaper>
        );
        
      case 4: // 희망 조건
        return (
          <StyledPaper elevation={0} sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ 
                  bgcolor: alpha(primaryColor, 0.2), 
                  color: primaryColor,
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                희망 근무 조건
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                희망 근무 지역
              </Typography>
              <Autocomplete
                multiple
                id="desiredLocations"
                options={cityProvinceList.filter(city => !formData.desiredLocations.includes(city))}
                value={formData.desiredLocations}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    desiredLocations: newValue
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
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    label="희망 근무 지역"
                    placeholder="지역을 검색하세요"
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
                  mt: 1
                }}
              >
                최소 1개 이상의 지역을 선택해주세요.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <StyledTextField
                label="희망 연봉/급여"
                name="desiredSalary"
                value={formData.desiredSalary}
                onChange={handleInputChange}
                fullWidth
                color="primary"
                placeholder="예: 3000만원, 협의 가능 등"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentsIcon sx={{ color: alpha(primaryColor, 0.7) }} />
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
        ease: "easeInOut",
        delay: i * 0.3
      }
    })
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
                  background: isActive || isCompleted 
                    ? `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`
                    : theme.palette.grey[200],
                  boxShadow: isActive 
                    ? `0 4px 12px ${alpha(primaryColor, 0.3)}`
                    : 'none',
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
  
  // 다음 버튼 비활성화 여부 확인
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: // 취업자 세부 프로필
        return !formData.name || !formData.gender || !formData.nationality;
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
              '&:hover': { color: primaryColor }
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
              취업 프로필 설정
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.85,
              }}
            >
              한국 취업에 필요한 정보를 알려주세요
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
            이전
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
            {currentStep === totalSteps ? (isSubmitting ? '저장 중...' : '완료') : '다음'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobProfile; 