import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useTheme, useMediaQuery, Paper, Autocomplete, Chip, Container, InputAdornment, Avatar, alpha, styled, Button, IconButton } from '@mui/material';
import CommonStep from './CommonSteps';
import { useThemeStore } from '../../theme/store/themeStore';
import { saveOnboardingData } from '../api/onboardingApi';
import { koreanUniversities, koreanAdministrativeDivisions } from '../data/koreaData';
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
    { code: 'ja', name: '日本語' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'th', name: 'ภาษาไทย' },
    { code: 'id', name: 'Bahasa Indonesia' },
];
// 학업 유형 옵션
const studyTypeOptions = [
    { value: 'degree', label: '학위 과정' },
    { value: 'exchange', label: '교환 학생' },
    { value: 'language', label: '어학 연수' },
    { value: 'research', label: '연구 과정' },
    { value: 'shortTerm', label: '단기 연수' },
    { value: 'other', label: '기타' },
];
// 전공 분야 옵션
const majorFieldOptions = [
    { value: 'arts', label: '예술' },
    { value: 'business', label: '경영학' },
    { value: 'engineering', label: '공학' },
    { value: 'humanities', label: '인문학' },
    { value: 'language', label: '언어학' },
    { value: 'law', label: '법학' },
    { value: 'medicine', label: '의학' },
    { value: 'naturalScience', label: '자연과학' },
    { value: 'socialScience', label: '사회과학' },
    { value: 'other', label: '기타' },
];
// 학위 과정 옵션
const academicLevelOptions = [
    { value: 'language', label: '어학 과정' },
    { value: 'bachelor', label: '학사 과정' },
    { value: 'master', label: '석사 과정' },
    { value: 'phd', label: '박사 과정' },
    { value: 'postdoc', label: '박사 후 과정' },
    { value: 'other', label: '기타' },
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
    { code: 'c3_1', name: 'C-3-1 (단기일반)' }, // 단기 어학연수 등
    { code: 'c3_4', name: 'C-3-4 (일반상용)' }, // 단기 비즈니스 연수
    { code: 'd1', name: 'D-1 (문화예술연수)' },
    { code: 'f1_13', name: 'F-1-13 (유학생부모)' },
    { code: 'unknown', name: '미정/모름' },
    { code: 'other', name: '기타' },
];
/**
 * 유학생 프로필 페이지
 */
const StudyProfile = () => {
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
        '유학생 세부 프로필',
        '학업 정보',
        '유학 일정',
        '학교/지역 선택',
        '언어 능력',
        '관심사 선택',
        '응급 상황 설정',
    ];
    // 스텝 아이콘 정의
    const stepIcons = [
        _jsx(PersonIcon, {}),
        _jsx(SchoolIcon, {}),
        _jsx(CalendarTodayIcon, {}),
        _jsx(LocationOnIcon, {}),
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
            }
            catch (saveError) {
                // 로그인하지 않은 상태이거나 API 오류가 발생한 경우 여기서 처리
                console.warn('온보딩 데이터 저장 실패. 테스트 모드에서는 무시합니다:', saveError);
                // 에러를 throw하지 않고 계속 진행
            }
            // 메인 페이지로 이동
            navigate('/');
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
                ease: "easeInOut",
                delay: i * 0.3
            }
        })
    };
    // 현재 단계에 따른 폼 렌더링
    const renderFormByStep = () => {
        const commonStepType = getCommonStepType();
        if (commonStepType) {
            return (_jsx(CommonStep, { stepType: commonStepType, languageData: formData.language, emergencyData: formData.emergencyInfo, interests: formData.interests, onLanguageChange: handleLanguageChange, onEmergencyChange: handleEmergencyChange, onInterestsChange: handleInterestsChange }));
        }
        switch (currentStep) {
            case 1: // 유학생 세부 프로필
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(PersonIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC720\uD559\uC0DD \uC138\uBD80 \uD504\uB85C\uD544" })] }), _jsxs(Box, { sx: {
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
            case 2: // 학업 정보
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(SchoolIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uD559\uC5C5 \uC815\uBCF4" })] }), _jsx(Box, { sx: { mb: 3 }, children: _jsx(StyledTextField, { select: true, label: "\uC720\uD559 \uC720\uD615", name: "studyType", value: formData.studyType, onChange: handleInputChange, fullWidth: true, required: true, sx: { mb: 2 }, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SchoolIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: studyTypeOptions.map((option) => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) }) }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 3
                            }, children: [_jsx(StyledTextField, { select: true, label: "\uC804\uACF5 \uBD84\uC57C", name: "majorField", value: formData.majorField, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LibraryBooksIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: majorFieldOptions.map((option) => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) }), _jsx(StyledTextField, { select: true, label: "\uD559\uC704 \uACFC\uC815", name: "academicLevel", value: formData.academicLevel, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SchoolIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: academicLevelOptions.map((option) => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) })] }), _jsx(Box, { sx: { mt: 3 }, children: _jsx(StyledTextField, { select: true, label: "\uBE44\uC790 \uC885\uB958", name: "visaType", value: formData.visaType, onChange: handleInputChange, fullWidth: true, color: "primary", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(VisaIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                }, children: visaTypeOptions.map((option) => (_jsx(MenuItem, { value: option.code, children: option.name }, option.code))) }) })] }));
            case 3: // 유학 일정
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(CalendarTodayIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uC720\uD559 \uC77C\uC815" })] }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uC608\uC0C1 \uC720\uD559 \uAE30\uAC04\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsxs(StyledTextField, { select: true, label: "\uC608\uC0C1 \uC720\uD559 \uAE30\uAC04", name: "studyDuration", value: formData.studyDuration, onChange: handleInputChange, fullWidth: true, required: true, sx: { mb: 1 }, color: "primary", InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                    }, children: [_jsx(MenuItem, { value: "under_6months", children: "6\uAC1C\uC6D4 \uBBF8\uB9CC" }), _jsx(MenuItem, { value: "6months_1year", children: "6\uAC1C\uC6D4~1\uB144" }), _jsx(MenuItem, { value: "1year_2years", children: "1~2\uB144" }), _jsx(MenuItem, { value: "2years_4years", children: "2~4\uB144" }), _jsx(MenuItem, { value: "over_4years", children: "4\uB144 \uC774\uC0C1" })] })] }), _jsxs(Box, { sx: {
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                mb: 4
                            }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }, children: "\uC2DC\uC791 \uC608\uC815\uC77C" }), _jsx(StyledTextField, { label: "\uC2DC\uC791 \uB0A0\uC9DC", name: "startDate", type: "date", value: formData.startDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                                mb: 1,
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }, children: "\uC885\uB8CC \uC608\uC815\uC77C" }), _jsx(StyledTextField, { label: "\uC885\uB8CC \uB0A0\uC9DC", name: "endDate", type: "date", value: formData.endDate, onChange: handleInputChange, fullWidth: true, color: "primary", InputLabelProps: { shrink: true }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CalendarTodayIcon, { sx: { color: alpha(primaryColor, 0.7) } }) })),
                                            } })] })] })] }));
            case 4: // 학교/지역 선택
                return (_jsxs(StyledPaper, { elevation: 0, sx: { p: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: alpha(primaryColor, 0.2),
                                        color: primaryColor,
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }, children: _jsx(LocationOnIcon, {}) }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600, color: 'text.primary' }, children: "\uD559\uAD50/\uC9C0\uC5ED \uC120\uD0DD" })] }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uD76C\uB9DD\uD558\uB294 \uB300\uD559\uAD50" }), _jsx(Autocomplete, { multiple: true, id: "preferredUniversities", options: koreanUniversities.filter(uni => !formData.preferredUniversities.includes(uni)), value: formData.preferredUniversities, onChange: (event, newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            preferredUniversities: newValue
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
                                        } }))), renderInput: (params) => (_jsx(StyledTextField, { ...params, label: "\uD76C\uB9DD \uB300\uD559\uAD50", placeholder: "\uB300\uD559\uAD50\uB97C \uAC80\uC0C9\uD558\uC138\uC694", color: "primary", InputProps: {
                                            ...params.InputProps,
                                            startAdornment: (_jsxs(_Fragment, { children: [_jsx(InputAdornment, { position: "start", children: _jsx(SchoolIcon, { sx: { color: alpha(primaryColor, 0.7) } }) }), params.InputProps.startAdornment] })),
                                        } })) })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", sx: {
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }, children: "\uD76C\uB9DD \uC9C0\uC5ED" }), _jsx(Autocomplete, { multiple: true, id: "preferredRegions", options: cityProvinceList.filter(city => !formData.preferredRegions.includes(city)), value: formData.preferredRegions, onChange: (event, newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            preferredRegions: newValue
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
                                        } }))), renderInput: (params) => (_jsx(StyledTextField, { ...params, label: "\uD76C\uB9DD \uC9C0\uC5ED", placeholder: "\uC9C0\uC5ED\uC744 \uAC80\uC0C9\uD558\uC138\uC694", color: "primary", InputProps: {
                                            ...params.InputProps,
                                            startAdornment: (_jsxs(_Fragment, { children: [_jsx(InputAdornment, { position: "start", children: _jsx(LocationOnIcon, { sx: { color: alpha(primaryColor, 0.7) } }) }), params.InputProps.startAdornment] })),
                                        } })) })] })] }));
            default:
                return null;
        }
    };
    // 다음 버튼 비활성화 여부 확인
    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: // 유학생 세부 프로필
                return !formData.name || !formData.gender || !formData.nationality;
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
                                        }, children: "\uC720\uD559 \uD504\uB85C\uD544 \uC124\uC815" }), _jsx(Typography, { variant: "body2", sx: {
                                            color: 'text.secondary',
                                            opacity: 0.85,
                                        }, children: "\uD55C\uAD6D \uC720\uD559\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC138\uC694" })] })] }), renderCustomStepper(), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: renderFormByStep() }, currentStep), _jsxs(Box, { sx: {
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
export default StudyProfile;
