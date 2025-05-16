import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useTheme, useMediaQuery, Paper, Autocomplete, Chip, Container, InputAdornment, alpha, styled, Button, IconButton, Avatar, } from '@mui/material';
import CommonStep from './CommonSteps';
import { useThemeStore } from '../../theme/store/themeStore';
import { saveOnboardingData } from '../api/onboardingApi';
import { koreanCities } from '../data/koreaData';
import { motion } from 'framer-motion';
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
const GradientButton = styled(Button)(({ theme, gradientcolors }) => ({
    background: gradientcolors ||
        `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
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
    { code: 'ja', name: '日本語' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'th', name: 'ภาษาไทย' },
    { code: 'id', name: 'Bahasa Indonesia' },
];
// 여행 목적 옵션
const travelPurposeOptions = [
    { code: 'sightseeing', name: '관광 명소 방문' },
    { code: 'food', name: '음식 체험' },
    { code: 'shopping', name: '쇼핑' },
    { code: 'culture', name: '문화 체험' },
    { code: 'nature', name: '자연 및 야외 활동' },
    { code: 'relaxation', name: '휴양' },
    { code: 'entertainment', name: '엔터테인먼트/이벤트' },
    { code: 'history', name: '역사 탐방' },
    { code: 'photography', name: '사진 촬영' },
    { code: 'nightlife', name: '나이트라이프' },
];
// 비자 종류 옵션 (여행 관련 비자 위주로)
const visaTypeOptions = [
    { code: 'b1', name: 'B-1 (비자면제)' },
    { code: 'b2_1', name: 'B-2-1 (일반무비자)' },
    { code: 'b2_2', name: 'B-2-2 (제주무비자)' },
    { code: 'c3_1', name: 'C-3-1 (단기일반)' },
    { code: 'c3_2', name: 'C-3-2 (단체관광)' },
    { code: 'c3_3', name: 'C-3-3 (의료관광)' },
    { code: 'c3_4', name: 'C-3-4 (일반상용)' },
    { code: 'c3_5', name: 'C-3-5 (협정단기상용)' },
    { code: 'c3_6', name: 'C-3-6 (단기상용)' },
    { code: 'c3_8', name: 'C-3-8 (동포방문)' },
    { code: 'c3_9', name: 'C-3-9 (일반관광)' },
    { code: 'c3_10', name: 'C-3-10 (순수환승)' },
    { code: 'h1', name: 'H-1 (관광취업)' },
    { code: 'k_eta', name: 'K-ETA (전자여행허가)' },
    { code: 'unknown', name: '미정/모름' },
    { code: 'other', name: '기타' },
];
// 여행 유형 옵션
const travelTypeOptions = [
    { value: 'leisure', label: '관광 여행' },
    { value: 'business', label: '비즈니스 여행' },
    { value: 'visiting', label: '친구/가족 방문' },
    { value: 'medical', label: '의료 관광' },
    { value: 'education', label: '교육/연수' },
    { value: 'other', label: '기타' },
];
// 여행 기간 옵션
const travelDurationOptions = [
    { value: 'short', label: '단기 (1주일 이내)' },
    { value: 'medium', label: '중기 (1주일~1개월)' },
    { value: 'long', label: '장기 (1개월~3개월)' },
    { value: 'extended', label: '장기체류 (3개월 이상)' },
];
// 여행 동반자 옵션
const travelCompanionsOptions = [
    { value: 'alone', label: '혼자' },
    { value: 'couple', label: '커플/부부' },
    { value: 'family', label: '가족' },
    { value: 'friends', label: '친구들' },
    { value: 'group', label: '단체/그룹' },
];
/**
 * 여행 목적 프로필 페이지
 */
const TravelProfile = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
    // 현재 스텝
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // 데이터 스테이트
    const [formData, setFormData] = useState({
        name: '',
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
    const getColorByTheme = () => {
        switch (season) {
            case 'spring':
                return '#FFAAA5';
            case 'summer':
                return '#77AADD';
            case 'autumn':
                return '#E8846B';
            case 'winter':
                return '#8795B5';
            default:
                return '#FFAAA5';
        }
    };
    const primaryColor = getColorByTheme();
    // 스텝 라벨 정의
    const stepLabels = [
        '여행자 프로필',
        '여행 일정',
        '관심 도시',
        '여행 목적',
        '언어 능력',
        '관심사',
        '응급 상황',
    ];
    // 스텝 아이콘 정의
    const stepIcons = [
        _jsx(PersonIcon, {}),
        _jsx(CalendarTodayIcon, {}),
        _jsx(LocationOnIcon, {}),
        _jsx(ExploreIcon, {}),
        _jsx(TranslateIcon, {}),
        _jsx(FavoriteIcon, {}),
        _jsx(HealthAndSafetyIcon, {}),
    ];
    // 총 스텝 수
    const totalSteps = stepLabels.length;
    // 현재 스텝에 해당하는 공통 컴포넌트 타입
    const getCommonStepType = () => {
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
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
    // 배경 애니메이션용 원 위치 생성
    const circleVariants = {
        animate: (i) => ({
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
            return (_jsx(CommonStep, { stepType: commonStepType, languageData: formData.language, emergencyData: formData.emergencyInfo, interests: formData.interests, onLanguageChange: handleLanguageChange, onEmergencyChange: handleEmergencyChange, onInterestsChange: handleInterestsChange }));
        }
        switch (currentStep) {
            case 1: // 여행자 세부 프로필
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(PersonIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC5EC\uD589\uC790 \uC138\uBD80 \uD504\uB85C\uD544" })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 2,
                            }, children: [_jsx(StyledTextField, { label: "\uC774\uB984", name: "name", value: formData.name, onChange: handleInputChange, fullWidth: true, required: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    } }), _jsx(Box, { children: _jsxs(FormControl, { component: "fieldset", fullWidth: true, children: [_jsx(FormLabel, { id: "gender-label", sx: {
                                                    color: 'text.secondary',
                                                    '&.Mui-focused': { color: primaryColor },
                                                    mb: 1,
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
                                mb: 2,
                            }, children: [_jsx(StyledTextField, { label: "\uB098\uC774", name: "age", value: formData.age, onChange: handleInputChange, fullWidth: true, color: "primary", type: "number" }), _jsx(StyledTextField, { label: "\uAD6D\uC801", name: "nationality", value: formData.nationality, onChange: handleInputChange, fullWidth: true, color: "primary" })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 2,
                            }, children: [_jsx(StyledTextField, { select: true, label: "UI \uC5B8\uC5B4 \uC120\uD0DD", name: "uiLanguage", value: formData.uiLanguage, onChange: handleInputChange, fullWidth: true, helperText: "\uC571\uC5D0\uC11C \uC0AC\uC6A9\uD560 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694", color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(TranslateIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: uiLanguageOptions.map(option => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }), _jsx(StyledTextField, { select: true, label: "\uC5EC\uD589 \uC720\uD615", name: "travelType", value: formData.travelType, onChange: handleInputChange, fullWidth: true, required: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(ExploreIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: travelTypeOptions.map(option => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                            }, children: [_jsx(StyledTextField, { select: true, label: "\uC5EC\uD589 \uAE30\uAC04", name: "travelDuration", value: formData.travelDuration, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: travelDurationOptions.map(option => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) }), _jsx(StyledTextField, { select: true, label: "\uC5EC\uD589 \uB3D9\uBC18\uC790", name: "travelCompanions", value: formData.travelCompanions, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(GroupIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: travelCompanionsOptions.map(option => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) })] }), _jsx(Box, { sx: { mt: 3 }, children: _jsx(StyledTextField, { select: true, label: "\uBE44\uC790 \uC885\uB958", name: "visaType", value: formData.visaType, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(VisaIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: visaTypeOptions.map(option => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }) })] }));
            case 2: // 여행 기간 일정
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(CalendarTodayIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC5EC\uD589 \uAE30\uAC04 \uC77C\uC815" })] }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uC5EC\uD589 \uAE30\uAC04\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsxs(StyledTextField, { select: true, label: "\uC5EC\uD589 \uC608\uC0C1 \uAE30\uAC04", name: "travelDuration", value: formData.travelDuration, onChange: handleInputChange, fullWidth: true, color: "primary", required: true, sx: { mb: 1 }, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: [_jsx(MenuItem, { value: "under_1week", children: "1\uC8FC\uC77C \uBBF8\uB9CC" }), _jsx(MenuItem, { value: "1week_2weeks", children: "1~2\uC8FC" }), _jsx(MenuItem, { value: "2weeks_1month", children: "2\uC8FC~1\uAC1C\uC6D4" }), _jsx(MenuItem, { value: "1month_3months", children: "1~3\uAC1C\uC6D4" }), _jsx(MenuItem, { value: "over_3months", children: "3\uAC1C\uC6D4 \uC774\uC0C1" })] }), _jsx(Typography, { variant: "caption", sx: {
                                        color: 'text.secondary',
                                        display: 'block',
                                        mt: 0.5,
                                    }, children: "\uC5EC\uD589 \uAE30\uAC04\uC5D0 \uB530\uB77C \uD544\uC694\uD55C \uC815\uBCF4\uC640 \uC900\uBE44\uBB3C\uC774 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4" })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 4,
                            }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500,
                                            }, children: "\uCD9C\uBC1C \uC608\uC815\uC77C" }), _jsx(StyledTextField, { label: "\uCD9C\uBC1C \uB0A0\uC9DC", name: "startDate", type: "date", value: formData.startDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500,
                                            }, children: "\uADC0\uAD6D \uC608\uC815\uC77C" }), _jsx(StyledTextField, { label: "\uADC0\uAD6D \uB0A0\uC9DC", name: "endDate", type: "date", value: formData.endDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uC785\uAD6D \uBE44\uC790" }), _jsx(StyledTextField, { select: true, label: "\uBE44\uC790 \uC885\uB958", name: "visaType", value: formData.visaType, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(VisaIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: visaTypeOptions.map(option => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }), _jsx(Typography, { variant: "caption", sx: {
                                        color: 'text.secondary',
                                        display: 'block',
                                        mt: 0.5,
                                    }, children: "\uD55C\uAD6D \uBC29\uBB38\uC5D0 \uC0AC\uC6A9\uD560 \uBE44\uC790 \uC885\uB958\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694" })] })] }));
            case 3: // 관심 도시 설정
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(LocationOnIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uAD00\uC2EC \uB3C4\uC2DC \uC124\uC815" })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { mb: 2, color: 'text.secondary' }, children: "\uD55C\uAD6D\uC5D0\uC11C \uBC29\uBB38\uD558\uACE0 \uC2F6\uC740 \uB3C4\uC2DC\uB098 \uAD00\uAD11\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC5EC\uB7EC \uAC1C\uB97C \uC120\uD0DD\uD560 \uC218 \uC788\uC73C\uBA70, \uC120\uD0DD\uD55C \uB3C4\uC2DC\uC5D0 \uB530\uB77C \uB9DE\uCDA4\uD615 \uC815\uBCF4\uB97C \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4." }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500,
                                            }, children: "\uC778\uAE30 \uB3C4\uC2DC" }), _jsx(Box, { sx: {
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                mb: 2,
                                            }, children: ['서울', '부산', '제주', '인천', '경주', '강릉'].map(city => (_jsx(Chip, { label: city, clickable: true, color: formData.interestedCities.includes(city) ? 'primary' : 'default', sx: {
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
                                                }, onClick: () => {
                                                    if (formData.interestedCities.includes(city)) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            interestedCities: prev.interestedCities.filter(c => c !== city),
                                                        }));
                                                    }
                                                    else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            interestedCities: [...prev.interestedCities, city],
                                                        }));
                                                    }
                                                } }, city))) })] }), _jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uBAA8\uB4E0 \uB3C4\uC2DC \uAC80\uC0C9" }), _jsx(Autocomplete, { multiple: true, id: "interestedCities", options: koreanCities.filter(city => !formData.interestedCities.includes(city)), value: formData.interestedCities, onChange: (event, newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            interestedCities: newValue,
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
                                        } }))), renderInput: params => (_jsx(StyledTextField, { ...params, label: "\uAD00\uC2EC \uC788\uB294 \uB3C4\uC2DC\uB098 \uAD00\uAD11\uC9C0", placeholder: "\uB3C4\uC2DC\uB97C \uAC80\uC0C9\uD558\uC138\uC694", color: "primary", InputProps: {
                                            ...params.InputProps,
                                            startAdornment: (_jsxs(_Fragment, { children: [_jsx(InputAdornment, { position: "start", children: _jsx(LocationOnIcon, { sx: { color: alpha(primaryColor, 0.7) } }) }), params.InputProps.startAdornment] })),
                                        } })) }), _jsx(Typography, { variant: "caption", sx: {
                                        color: 'text.secondary',
                                        display: 'block',
                                        mt: 1,
                                    }, children: "\uCD5C\uC18C 1\uAC1C \uC774\uC0C1\uC758 \uB3C4\uC2DC\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uB3C4\uC2DC\uB294 \uC5B8\uC81C\uB4E0\uC9C0 \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] }), formData.interestedCities.length > 0 && (_jsxs(Box, { sx: { mt: 4 }, children: [_jsxs(Typography, { variant: "subtitle2", sx: {
                                        mb: 2,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                    }, children: ["\uC120\uD0DD\uD55C \uB3C4\uC2DC (", formData.interestedCities.length, ")"] }), _jsx(Box, { sx: {
                                        display: 'grid',
                                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                                        gap: 2,
                                    }, children: formData.interestedCities.map(city => (_jsxs(Box, { sx: {
                                            p: 1.5,
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(primaryColor, 0.2)}`,
                                            backgroundColor: alpha(primaryColor, 0.05),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(LocationOnIcon, { sx: {
                                                            fontSize: '1.2rem',
                                                            color: primaryColor,
                                                            mr: 1,
                                                        } }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: city })] }), _jsx(IconButton, { size: "small", onClick: () => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        interestedCities: prev.interestedCities.filter(c => c !== city),
                                                    }));
                                                }, sx: {
                                                    p: 0.5,
                                                    color: 'text.secondary',
                                                    '&:hover': {
                                                        color: theme.palette.error.main,
                                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                    },
                                                }, children: "\u2715" })] }, city))) })] }))] }));
            case 4: // 여행 목적 선택
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(ExploreIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC5EC\uD589 \uBAA9\uC801 \uC120\uD0DD" })] }), _jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: "\uD55C\uAD6D \uC5EC\uD589\uC5D0\uC11C \uAC00\uC7A5 \uAD00\uC2EC \uC788\uB294 \uD65C\uB3D9\uC774\uB098 \uACBD\uD5D8\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC5EC\uB7EC \uAC1C\uB97C \uC120\uD0DD\uD560 \uC218 \uC788\uC73C\uBA70, \uC120\uD0DD\uD55C \uBAA9\uC801\uC5D0 \uB9DE\uB294 \uB9DE\uCDA4\uD615 \uC815\uBCF4\uB97C \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4." }), _jsx(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                                gap: 2,
                                mb: 4,
                            }, children: travelPurposeOptions.map(option => {
                                const isSelected = formData.travelPurposes.includes(option.code);
                                return (_jsxs(Box, { onClick: () => {
                                        if (isSelected) {
                                            setFormData(prev => ({
                                                ...prev,
                                                travelPurposes: prev.travelPurposes.filter(code => code !== option.code),
                                            }));
                                        }
                                        else {
                                            setFormData(prev => ({
                                                ...prev,
                                                travelPurposes: [...prev.travelPurposes, option.code],
                                            }));
                                        }
                                    }, sx: {
                                        p: 2,
                                        borderRadius: 2,
                                        border: `1px solid ${isSelected ? alpha(primaryColor, 0.3) : alpha(theme.palette.grey[300], 0.7)}`,
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
                                    }, children: [_jsx(Box, { sx: {
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
                                            }, children: isSelected ? (_jsx(Typography, { sx: { fontWeight: 600, color: primaryColor }, children: "\u2713" })) : null }), _jsx(Typography, { variant: "body2", sx: {
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? primaryColor : 'text.primary',
                                                mb: 0.5,
                                            }, children: option.name })] }, option.code));
                            }) }), _jsx(Typography, { variant: "caption", sx: {
                                color: 'text.secondary',
                                display: 'block',
                            }, children: "\uCD5C\uC18C 1\uAC1C \uC774\uC0C1\uC758 \uC5EC\uD589 \uBAA9\uC801\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC5B8\uC81C\uB4E0\uC9C0 \uBCC0\uACBD \uAC00\uB2A5\uD569\uB2C8\uB2E4." })] }));
            case 5: // 언어 능력
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(TranslateIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC5B8\uC5B4 \uB2A5\uB825" })] }), _jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: "\uD55C\uAD6D\uC5B4 \uAD6C\uC0AC \uB2A5\uB825\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC5B8\uC5B4 \uB2A5\uB825\uC5D0 \uB530\uB77C \uC5EC\uD589 \uAC00\uC774\uB4DC\uC640 \uBC88\uC5ED \uC9C0\uC6D0\uC744 \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4." }), _jsx(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                gap: 2,
                                mb: 4,
                            }, children: [
                                { value: 'basic', label: '기본', description: '인사와 간단한 표현 가능' },
                                {
                                    value: 'intermediate',
                                    label: '중급',
                                    description: '일상 대화와 간단한 의사소통 가능',
                                },
                                {
                                    value: 'advanced',
                                    label: '고급',
                                    description: '대부분의 상황에서 자연스러운 대화 가능',
                                },
                            ].map(option => {
                                const isSelected = formData.language.koreanLevel === option.value;
                                return (_jsxs(Box, { onClick: () => {
                                        setFormData(prev => ({
                                            ...prev,
                                            language: {
                                                ...prev.language,
                                                koreanLevel: option.value,
                                            },
                                        }));
                                    }, sx: {
                                        p: 3,
                                        borderRadius: 2,
                                        border: `1px solid ${isSelected ? alpha(primaryColor, 0.3) : alpha(theme.palette.grey[300], 0.7)}`,
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
                                    }, children: [_jsx(Box, { sx: {
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
                                            }, children: isSelected ? (_jsx(Typography, { sx: { fontWeight: 600, color: primaryColor }, children: "\u2713" })) : null }), _jsx(Typography, { variant: "subtitle1", sx: {
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? primaryColor : 'text.primary',
                                                mb: 1,
                                            }, children: option.label }), _jsx(Typography, { variant: "body2", sx: {
                                                color: 'text.secondary',
                                                fontSize: '0.875rem',
                                            }, children: option.description })] }, option.value));
                            }) }), _jsx(Typography, { variant: "caption", sx: {
                                color: 'text.secondary',
                                display: 'block',
                            }, children: "\uD55C\uAD6D\uC5B4 \uC2E4\uB825\uC774 \uC5C6\uC5B4\uB3C4 \uAD1C\uCC2E\uC2B5\uB2C8\uB2E4. \uC5EC\uD589\uC5D0 \uD544\uC694\uD55C \uBC88\uC5ED \uBC0F \uC5B8\uC5B4 \uC9C0\uC6D0 \uC815\uBCF4\uB97C \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4." })] }));
            case 6: // 관심사 선택
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(FavoriteIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uAD00\uC2EC\uC0AC \uC120\uD0DD" })] }), _jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: "\uC5EC\uD589\uC5D0\uC11C \uAD00\uC2EC \uC788\uB294 \uBD84\uC57C\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC120\uD0DD\uD55C \uAD00\uC2EC\uC0AC\uC5D0 \uB9DE\uB294 \uB9DE\uCDA4\uD615 \uC815\uBCF4\uC640 \uCD94\uCC9C\uC744 \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4." }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 2,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uAD00\uC2EC\uC0AC \uC120\uD0DD (\uC5EC\uB7EC \uAC1C \uC120\uD0DD \uAC00\uB2A5)" }), _jsx(Box, { sx: {
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 1.5,
                                    }, children: [
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
                                        return (_jsx(Chip, { icon: _jsx(Box, { component: "span", sx: { mr: 0.5 }, children: interest.icon }), label: interest.value, clickable: true, onClick: () => {
                                                if (isSelected) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        interests: prev.interests.filter(i => i !== interest.value),
                                                    }));
                                                }
                                                else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        interests: [...prev.interests, interest.value],
                                                    }));
                                                }
                                            }, sx: {
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
                                            } }, interest.value));
                                    }) })] }), formData.interests.length > 0 && (_jsxs(Box, { sx: { mt: 4 }, children: [_jsxs(Typography, { variant: "subtitle2", sx: {
                                        mb: 2,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                    }, children: ["\uC120\uD0DD\uD55C \uAD00\uC2EC\uC0AC (", formData.interests.length, ")"] }), _jsxs(Box, { sx: {
                                        p: 2,
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(primaryColor, 0.2)}`,
                                        backgroundColor: alpha(primaryColor, 0.05),
                                    }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500, mb: 1.5 }, children: "\uB2E4\uC74C \uAD00\uC2EC\uC0AC\uC5D0 \uB9DE\uB294 \uC815\uBCF4\uB97C \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4:" }), _jsx(Box, { sx: {
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                            }, children: formData.interests.map(interest => (_jsx(Chip, { label: interest, size: "small", sx: {
                                                    backgroundColor: alpha(primaryColor, 0.2),
                                                    color: primaryColor,
                                                    fontWeight: 500,
                                                } }, interest))) })] })] })), _jsx(Typography, { variant: "caption", sx: {
                                color: 'text.secondary',
                                display: 'block',
                                mt: 2,
                            }, children: "\uCD5C\uC18C 1\uAC1C \uC774\uC0C1\uC758 \uAD00\uC2EC\uC0AC\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC5B8\uC81C\uB4E0\uC9C0 \uBCC0\uACBD \uAC00\uB2A5\uD569\uB2C8\uB2E4." })] }));
            case 7: // 응급 상황 설정
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                    }, children: _jsx(HealthAndSafetyIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC751\uAE09 \uC0C1\uD669 \uC124\uC815" })] }), _jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: "\uC751\uAE09 \uC0C1\uD669\uC5D0 \uB300\uBE44\uD55C \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694. \uC774 \uC815\uBCF4\uB294 \uC5EC\uD589 \uC911 \uC751\uAE09 \uC0C1\uD669\uC774 \uBC1C\uC0DD\uD588\uC744 \uB54C \uB3C4\uC6C0\uC744 \uB4DC\uB9AC\uAE30 \uC704\uD574 \uC0AC\uC6A9\uB429\uB2C8\uB2E4." }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uBE44\uC0C1 \uC5F0\uB77D\uCC98" }), _jsx(StyledTextField, { label: "\uBE44\uC0C1 \uC5F0\uB77D\uCC98", name: "emergencyInfo.contact", value: formData.emergencyInfo.contact, onChange: handleInputChange, fullWidth: true, required: true, color: "primary", placeholder: "+82-10-1234-5678", helperText: "\uC751\uAE09 \uC0C1\uD669 \uC2DC \uC5F0\uB77D \uAC00\uB2A5\uD55C \uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694", sx: { mb: 3 }, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Box, { sx: { color: alpha(primaryColor, 0.7) }, children: "\uD83D\uDCDE" }) })),
                                    } }), _jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uC758\uB8CC \uC815\uBCF4" }), _jsx(StyledTextField, { label: "\uC758\uB8CC \uC870\uAC74", name: "emergencyInfo.medicalConditions", value: formData.emergencyInfo.medicalConditions, onChange: handleInputChange, multiline: true, rows: 2, fullWidth: true, color: "primary", placeholder: "\uC54C\uB808\uB974\uAE30, \uC9C8\uD658, \uBCF5\uC6A9\uC911\uC778 \uC57D\uBB3C \uB4F1", helperText: "\uC911\uC694\uD55C \uC758\uB8CC \uC815\uBCF4\uAC00 \uC5C6\uB2E4\uBA74 '\uC5C6\uC74C'\uC774\uB77C\uACE0 \uC785\uB825\uD574\uC8FC\uC138\uC694", sx: { mb: 3 }, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Box, { sx: { color: alpha(primaryColor, 0.7) }, children: "\uD83C\uDFE5" }) })),
                                    } }), _jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }, children: "\uC74C\uC2DD \uC54C\uB808\uB974\uAE30" }), _jsx(StyledTextField, { label: "\uC74C\uC2DD \uC54C\uB808\uB974\uAE30", name: "emergencyInfo.foodAllergies", value: formData.emergencyInfo.foodAllergies, onChange: handleInputChange, multiline: true, rows: 2, fullWidth: true, color: "primary", placeholder: "\uACAC\uACFC\uB958, \uD574\uC0B0\uBB3C, \uAE00\uB8E8\uD150 \uB4F1", helperText: "\uC74C\uC2DD \uC54C\uB808\uB974\uAE30\uAC00 \uC5C6\uB2E4\uBA74 '\uC5C6\uC74C'\uC774\uB77C\uACE0 \uC785\uB825\uD574\uC8FC\uC138\uC694", sx: { mb: 3 }, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Box, { sx: { color: alpha(primaryColor, 0.7) }, children: "\uD83C\uDF7D\uFE0F" }) })),
                                    } }), _jsxs(Box, { sx: {
                                        p: 2,
                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                    }, children: [_jsx(Box, { component: "span", sx: {
                                                mr: 1.5,
                                                color: theme.palette.info.main,
                                                fontSize: '1.2rem',
                                                mt: 0.5,
                                            }, children: "\u2139\uFE0F" }), _jsxs(Typography, { variant: "body2", sx: { color: 'text.secondary' }, children: ["\uC751\uAE09 \uC0C1\uD669 \uC815\uBCF4\uB294 \uAC1C\uC778 \uD504\uB85C\uD544\uC5D0\uB9CC \uC800\uC7A5\uB418\uBA70, \uB3D9\uC758 \uC5C6\uC774 \uC81C3\uC790\uC5D0\uAC8C \uACF5\uC720\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD55C\uAD6D\uC5D0\uC11C \uC5EC\uD589 \uC911 \uC751\uAE09 \uC0C1\uD669 \uBC1C\uC0DD \uC2DC ", _jsx("strong", { children: "119" }), "\uB85C \uC804\uD654\uD558\uC138\uC694."] })] }), _jsxs(Box, { sx: {
                                        mt: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }, children: [_jsx(FormControlLabel, { control: _jsx(Radio, { checked: formData.emergencyInfo.receiveEmergencyAlerts, onChange: e => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        emergencyInfo: {
                                                            ...prev.emergencyInfo,
                                                            receiveEmergencyAlerts: e.target.checked,
                                                        },
                                                    }));
                                                }, sx: {
                                                    color: theme.palette.grey[400],
                                                    '&.Mui-checked': { color: primaryColor },
                                                } }), label: "" }), _jsx(Typography, { variant: "body2", children: "\uC751\uAE09 \uC0C1\uD669 \uC54C\uB9BC \uC218\uC2E0 \uB3D9\uC758 (\uAE30\uC0C1 \uD2B9\uBCF4, \uC9C0\uC5ED \uC7AC\uB09C \uC815\uBCF4 \uB4F1)" })] })] })] }));
            default:
                return null;
        }
    };
    // 다음 버튼 비활성화 여부 확인
    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: // 여행자 세부 프로필
                return !formData.name || !formData.gender || !formData.nationality || !formData.travelType;
            case 2: // 여행 기간 일정
                return !formData.travelDuration;
            case 3: // 관심 도시 설정
                return formData.interestedCities.length === 0;
            case 4: // 여행 목적 선택
                return formData.travelPurposes.length === 0;
            case 5: // 언어 능력
                return !formData.language.koreanLevel;
            case 6: // 관심사 선택
                return formData.interests.length === 0;
            case 7: // 응급 상황 설정
                return (!formData.emergencyInfo.contact ||
                    !formData.emergencyInfo.medicalConditions ||
                    !formData.emergencyInfo.foodAllergies);
            default:
                return false;
        }
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
                                boxShadow: isActive ? `0 4px 12px ${alpha(primaryColor, 0.3)}` : 'none',
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
                                    '&:hover': { color: primaryColor },
                                }, children: _jsx(ArrowBackIcon, {}) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h4", component: "h1", sx: {
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                            letterSpacing: '-0.01em',
                                        }, children: "\uC5EC\uD589 \uD504\uB85C\uD544 \uC124\uC815" }), _jsx(Typography, { variant: "body2", sx: {
                                            color: 'text.secondary',
                                            opacity: 0.85,
                                        }, children: "\uD55C\uAD6D \uC5EC\uD589\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC138\uC694" })] })] }), renderCustomStepper(), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: renderFormByStep() }, currentStep), _jsxs(Box, { sx: {
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
export default TravelProfile;
