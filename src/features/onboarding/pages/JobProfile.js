import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useTheme, useMediaQuery, Paper, Autocomplete, Chip, Container, InputAdornment, Avatar, alpha, styled, Button, IconButton } from '@mui/material';
import CommonStep from './CommonSteps';
import { useThemeStore } from '../../theme/store/themeStore';
import { saveOnboardingData } from '../api/onboardingApi';
import { koreanAdministrativeDivisions } from '../data/koreaData';
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
const GradientButton = styled(Button)(({ theme, gradientcolors }) => ({
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
const StepIcon = styled(Box)(({ theme, color = '#1976d2' }) => ({
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
const StepConnector = styled(Box)(({ theme, active = false }) => ({
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
const JobProfile = () => {
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
    const [formData, setFormData] = useState({
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
        _jsx(PersonIcon, {}),
        _jsx(WorkIcon, {}),
        _jsx(CalendarTodayIcon, {}),
        _jsx(BusinessIcon, {}),
        _jsx(TranslateIcon, {}),
        _jsx(FavoriteIcon, {}),
        _jsx(HealthAndSafetyIcon, {}),
    ];
    // 총 스텝 수
    const totalSteps = stepLabels.length;
    // 현재 스텝에 해당하는 공통 컴포넌트 타입
    const getCommonStepType = () => {
        switch (currentStep) {
            case 5: return 'language';
            case 6: return 'interests';
            case 7: return 'emergency';
            default: return null;
        }
    };
    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    // 불리언 값 변경 핸들러
    const handleBooleanChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };
    // 언어 데이터 변경 핸들러
    const handleLanguageChange = (data) => {
        setFormData(prev => ({
            ...prev,
            language: data,
        }));
    };
    // 응급 정보 변경 핸들러
    const handleEmergencyChange = (data) => {
        setFormData(prev => ({
            ...prev,
            emergencyInfo: data,
        }));
    };
    // 관심사 변경 핸들러
    const handleInterestsChange = (interests) => {
        setFormData(prev => ({
            ...prev,
            interests,
        }));
    };
    // 다음 단계로 이동
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
        else {
            handleSubmit();
        }
    };
    // 이전 단계로 이동
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
        else {
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
            }
            catch (saveError) {
                // 로그인하지 않은 상태이거나 API 오류가 발생한 경우 여기서 처리
                console.warn('온보딩 데이터 저장 실패. 테스트 모드에서는 무시합니다:', saveError);
                // 에러를 throw하지 않고 계속 진행
            }
            // 메인 페이지로 이동
            navigate('/home');
        }
        catch (error) {
            console.error('온보딩 데이터 저장 실패:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // 현재 단계에 따른 폼 렌더링
    const renderFormByStep = () => {
        const commonStepType = getCommonStepType();
        if (commonStepType) {
            return (_jsx(CommonStep, { stepType: commonStepType, languageData: formData.language, emergencyData: formData.emergencyInfo, interests: formData.interests, onLanguageChange: handleLanguageChange, onEmergencyChange: handleEmergencyChange, onInterestsChange: handleInterestsChange }));
        }
        switch (currentStep) {
            case 1: // 취업자 세부 프로필
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(PersonIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uCDE8\uC5C5\uC790 \uC138\uBD80 \uD504\uB85C\uD544" })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 2
                            }, children: [_jsx(StyledTextField, { label: "\uC774\uB984", name: "name", value: formData.name, onChange: handleInputChange, fullWidth: true, required: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    } }), _jsx(Box, { children: _jsxs(FormControl, { component: "fieldset", fullWidth: true, children: [_jsx(FormLabel, { id: "gender-label", sx: {
                                                    color: 'text.secondary',
                                                    '&.Mui-focused': { color: primaryColor },
                                                    mb: 1
                                                }, children: "\uC131\uBCC4" }), _jsxs(RadioGroup, { row: true, "aria-labelledby": "gender-label", name: "gender", value: formData.gender, onChange: handleInputChange, children: [_jsx(FormControlLabel, { value: "male", control: _jsx(Radio, { sx: {
                                                                color: theme.palette.grey[400],
                                                                '&.Mui-checked': { color: primaryColor },
                                                            } }), label: "\uB0A8\uC131" }), _jsx(FormControlLabel, { value: "female", control: _jsx(Radio, { sx: {
                                                                color: theme.palette.grey[400],
                                                                '&.Mui-checked': { color: primaryColor },
                                                            } }), label: "\uC5EC\uC131" }), _jsx(FormControlLabel, { value: "other", control: _jsx(Radio, { sx: {
                                                                color: theme.palette.grey[400],
                                                                '&.Mui-checked': { color: primaryColor },
                                                            } }), label: "\uAE30\uD0C0" })] })] }) })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 2
                            }, children: [_jsx(StyledTextField, { label: "\uB098\uC774", name: "age", value: formData.age, onChange: handleInputChange, fullWidth: true, color: "primary", type: "number" }), _jsx(StyledTextField, { label: "\uAD6D\uC801", name: "nationality", value: formData.nationality, onChange: handleInputChange, fullWidth: true, color: "primary" })] }), _jsx(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }, children: _jsx(StyledTextField, { select: true, label: "UI \uC5B8\uC5B4 \uC120\uD0DD", name: "uiLanguage", value: formData.uiLanguage, onChange: handleInputChange, fullWidth: true, helperText: "\uC571\uC5D0\uC11C \uC0AC\uC6A9\uD560 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694", color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(TranslateIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: uiLanguageOptions.map((option) => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }) })] }));
            case 2: // 직업 상세 정보
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(WorkIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC9C1\uC5C5 \uC0C1\uC138 \uC815\uBCF4" })] }), _jsx(Box, { sx: { mb: 3 }, children: _jsx(StyledTextField, { select: true, label: "\uD76C\uB9DD \uC9C1\uC885", name: "jobField", value: formData.jobField, onChange: handleInputChange, fullWidth: true, required: true, sx: { mb: 2 }, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(WorkIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: jobFieldOptions.map((option) => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }) }), _jsx(Box, { sx: { mb: 3 }, children: _jsxs(StyledTextField, { select: true, label: "\uACBD\uB825 \uC218\uC900", name: "workExperience", value: formData.workExperience, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BusinessIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: [_jsx(MenuItem, { value: "entry", children: "\uC2E0\uC785 (\uACBD\uB825 \uC5C6\uC74C)" }), _jsx(MenuItem, { value: "junior", children: "\uC8FC\uB2C8\uC5B4 (1-3\uB144)" }), _jsx(MenuItem, { value: "mid", children: "\uBBF8\uB4DC\uB808\uBCA8 (4-6\uB144)" }), _jsx(MenuItem, { value: "senior", children: "\uC2DC\uB2C8\uC5B4 (7-10\uB144)" }), _jsx(MenuItem, { value: "expert", children: "\uC804\uBB38\uAC00 (10\uB144 \uC774\uC0C1)" })] }) }), _jsx(Box, { sx: { mb: 3 }, children: _jsx(StyledTextField, { label: "\uD76C\uB9DD \uC9C1\uBB34/\uD3EC\uC9C0\uC158", name: "desiredPosition", value: formData.desiredPosition, onChange: handleInputChange, fullWidth: true, color: "primary", placeholder: "\uC608: \uC18C\uD504\uD2B8\uC6E8\uC5B4 \uAC1C\uBC1C\uC790, \uD68C\uACC4\uC0AC, \uB514\uC790\uC774\uB108 \uB4F1", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(WorkIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                } }) }), _jsx(Box, { sx: { mt: 3 }, children: _jsx(StyledTextField, { select: true, label: "\uBE44\uC790 \uC885\uB958", name: "visaType", value: formData.visaType, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(VisaIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: visaTypeOptions.map((option) => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }) })] }));
            case 3: // 취업 날짜 및 기간
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(CalendarTodayIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uCDE8\uC5C5 \uB0A0\uC9DC \uBC0F \uAE30\uAC04" })] }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uD76C\uB9DD \uADFC\uBB34 \uAE30\uAC04\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsxs(StyledTextField, { select: true, label: "\uD76C\uB9DD \uADFC\uBB34 \uAE30\uAC04", name: "employmentDuration", value: formData.employmentDuration, onChange: handleInputChange, fullWidth: true, required: true, sx: { mb: 1 }, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: [_jsx(MenuItem, { value: "short_term", children: "\uB2E8\uAE30 (3\uAC1C\uC6D4 \uBBF8\uB9CC)" }), _jsx(MenuItem, { value: "temporary", children: "\uC784\uC2DC\uC9C1 (3-6\uAC1C\uC6D4)" }), _jsx(MenuItem, { value: "contract", children: "\uACC4\uC57D\uC9C1 (6\uAC1C\uC6D4-1\uB144)" }), _jsx(MenuItem, { value: "long_term", children: "\uC7A5\uAE30 \uACC4\uC57D\uC9C1 (1-3\uB144)" }), _jsx(MenuItem, { value: "permanent", children: "\uC815\uADDC\uC9C1 (\uBB34\uAE30\uD55C)" })] })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 4
                            }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }, children: "\uADFC\uBB34 \uC2DC\uC791 \uD76C\uB9DD\uC77C" }), _jsx(StyledTextField, { label: "\uC2DC\uC791 \uB0A0\uC9DC", name: "startDate", type: "date", value: formData.startDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }, children: "\uADFC\uBB34 \uC885\uB8CC \uC608\uC815\uC77C (\uC815\uADDC\uC9C1\uC740 \uBE44\uC6CC\uB450\uC138\uC694)" }), _jsx(StyledTextField, { label: "\uC885\uB8CC \uB0A0\uC9DC", name: "endDate", type: "date", value: formData.endDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uD76C\uB9DD \uADFC\uBB34 \uC2DC\uAC04" }), _jsxs(StyledTextField, { select: true, label: "\uADFC\uBB34 \uC2DC\uAC04", name: "desiredWorkingHours", value: formData.desiredWorkingHours, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: [_jsx(MenuItem, { value: "full_time", children: "\uD480\uD0C0\uC784 (\uC8FC 40\uC2DC\uAC04)" }), _jsx(MenuItem, { value: "part_time", children: "\uD30C\uD2B8\uD0C0\uC784 (\uC8FC 20-30\uC2DC\uAC04)" }), _jsx(MenuItem, { value: "flexible", children: "\uC720\uC5F0\uADFC\uBB34\uC81C" }), _jsx(MenuItem, { value: "weekend", children: "\uC8FC\uB9D0 \uADFC\uBB34" }), _jsx(MenuItem, { value: "night_shift", children: "\uC57C\uAC04 \uADFC\uBB34" })] })] })] }));
            case 4: // 희망 조건
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(BusinessIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uD76C\uB9DD \uADFC\uBB34 \uC870\uAC74" })] }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uD76C\uB9DD \uADFC\uBB34 \uC9C0\uC5ED" }), _jsx(Autocomplete, { multiple: true, id: "desiredLocations", options: cityProvinceList.filter(city => !formData.desiredLocations.includes(city)), value: formData.desiredLocations, onChange: (event, newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            desiredLocations: newValue
                                        }));
                                    }, renderTags: (value, getTagProps) => value.map((option, index) => (_jsx(Chip, { label: option, ...getTagProps({ index }), sx: {
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
                                        } }))), renderInput: (params) => (_jsx(StyledTextField, { ...params, label: "\uD76C\uB9DD \uADFC\uBB34 \uC9C0\uC5ED", placeholder: "\uC9C0\uC5ED\uC744 \uAC80\uC0C9\uD558\uC138\uC694", color: "primary", InputProps: {
                                            ...params.InputProps,
                                            startAdornment: (_jsxs(_Fragment, { children: [_jsx(InputAdornment, { position: "start", children: _jsx(LocationOnIcon, { sx: { color: alpha(primaryColor, 0.7) } }) }), params.InputProps.startAdornment] })),
                                        } })) }), _jsx(Typography, { variant: "caption", sx: {
                                        color: 'text.secondary',
                                        display: 'block',
                                        mt: 1
                                    }, children: "\uCD5C\uC18C 1\uAC1C \uC774\uC0C1\uC758 \uC9C0\uC5ED\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694." })] }), _jsx(Box, { sx: { mb: 3 }, children: _jsx(StyledTextField, { label: "\uD76C\uB9DD \uC5F0\uBD09/\uAE09\uC5EC", name: "desiredSalary", value: formData.desiredSalary, onChange: handleInputChange, fullWidth: true, color: "primary", placeholder: "\uC608: 3000\uB9CC\uC6D0, \uD611\uC758 \uAC00\uB2A5 \uB4F1", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PaymentsIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                } }) })] }));
            default:
                return null;
        }
    };
    // 배경 애니메이션용 원 위치 생성
    const circleVariants = {
        animate: (i) => ({
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
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: 4,
                width: '100%',
                maxWidth: '700px',
                mx: 'auto',
                gap: 1.5,
            }, children: stepLabels.map((label, index) => {
                const isActive = currentStep === index + 1;
                const isCompleted = currentStep > index + 1;
                return (_jsxs(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: isCompleted ? 'pointer' : 'default',
                        opacity: isActive || isCompleted ? 1 : 0.6,
                        transition: 'all 0.3s ease',
                        px: 1,
                    }, onClick: () => isCompleted && setCurrentStep(index + 1), children: [_jsx(Box, { sx: {
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
                            }, children: isCompleted ? (_jsx(Typography, { sx: { fontWeight: 600 }, children: "\u2713" })) : (_jsx(Typography, { sx: { fontWeight: 600 }, children: index + 1 })) }), _jsx(Typography, { variant: "caption", sx: {
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? primaryColor : 'text.secondary',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                width: isMobile ? 60 : 70,
                            }, children: label })] }, index));
            }) }));
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
    return (_jsxs(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            py: 4,
            px: 2,
            background: `linear-gradient(135deg, ${alpha(primaryColor, 0.02)} 0%, ${alpha(primaryColor, 0.05)} 100%)`,
        }, children: [_jsx(AnimatedBackground, { children: [...Array(6)].map((_, i) => (_jsx(AnimatedCircle, { custom: i, variants: circleVariants, animate: "animate", style: {
                        width: `${150 + i * 100}px`,
                        height: `${150 + i * 100}px`,
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 80}%`,
                        border: `1px solid ${alpha(primaryColor, 0.03)}`,
                        opacity: 0.3 - i * 0.04,
                    } }, i))) }), _jsxs(Container, { maxWidth: "md", sx: { py: 2, zIndex: 1, width: '100%' }, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            mb: 4,
                            mt: 2,
                        }, children: [_jsx(IconButton, { onClick: handleBack, sx: {
                                    mr: 2,
                                    color: 'text.secondary',
                                    '&:hover': { color: primaryColor }
                                }, children: _jsx(ArrowBackIcon, {}) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h4", component: "h1", sx: {
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                            letterSpacing: '-0.01em',
                                        }, children: "\uCDE8\uC5C5 \uD504\uB85C\uD544 \uC124\uC815" }), _jsx(Typography, { variant: "body2", sx: {
                                            color: 'text.secondary',
                                            opacity: 0.85,
                                        }, children: "\uD55C\uAD6D \uCDE8\uC5C5\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC138\uC694" })] })] }), renderCustomStepper(), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: renderFormByStep() }, currentStep), _jsxs(Box, { sx: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 4,
                            mb: 6,
                        }, children: [_jsx(Button, { variant: "outlined", onClick: handleBack, startIcon: _jsx(ArrowBackIcon, {}), sx: {
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
                                }, children: "\uC774\uC804" }), _jsx(Button, { variant: "contained", onClick: currentStep === totalSteps ? handleSubmit : handleNext, endIcon: _jsx(ArrowForwardIcon, {}), disabled: isNextDisabled() || isSubmitting, sx: {
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
                                }, children: currentStep === totalSteps ? (isSubmitting ? '저장 중...' : '완료') : '다음' })] })] })] }));
};
export default JobProfile;
