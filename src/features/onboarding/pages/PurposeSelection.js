import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Card, CardContent, CardActionArea, useTheme, useMediaQuery, styled, Button, alpha, } from '@mui/material';
import { useThemeStore } from '../../theme/store/themeStore';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { mainCategories } from '../components/common/CommonTags';
import { motion } from 'framer-motion';
// Material UI의 Grid를 스타일링된 버전으로 재정의
//const Grid = styled(Box)(({ theme }) => ({}));
const MotionCard = styled(motion.div)(({ theme }) => ({
    height: '100%',
    width: '100%',
    perspective: '1000px',
}));
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    height: '100%',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: '1px solid rgba(230, 230, 230, 0.7)',
}));
const CardOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
    zIndex: 1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
}));
const IconWrapper = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    transition: 'all 0.3s ease',
}));
const PurposeCard = ({ id, name, selected, onClick, icon, description, themeColor, imageSrc }) => {
    const theme = useTheme();
    const cardVariants = {
        unselected: { scale: 1, y: 0 },
        selected: { scale: 1.03, y: -5 },
    };
    return (_jsx(MotionCard, { initial: "unselected", animate: selected ? 'selected' : 'unselected', variants: cardVariants, transition: { type: 'spring', stiffness: 300, damping: 20 }, whileHover: { scale: 1.02, y: -8 }, children: _jsx(StyledCard, { elevation: selected ? 4 : 0, sx: {
                border: selected ? `1px solid ${themeColor}` : '1px solid rgba(230, 230, 230, 0.7)',
                '&:hover': {
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
                },
                background: imageSrc ? `url(${imageSrc})` : 'transparent',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }, children: _jsxs(CardActionArea, { onClick: onClick, sx: {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: 3, md: 4 },
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: imageSrc
                        ? alpha(theme.palette.background.paper, 0.85)
                        : theme.palette.background.paper,
                }, children: [_jsx(Box, { className: "card-overlay", sx: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            background: `linear-gradient(135deg, ${alpha(themeColor, 0.05)} 0%, ${alpha(themeColor, 0.1)} 100%)`,
                        } }), _jsx(IconWrapper, { sx: {
                            backgroundColor: selected ? themeColor : alpha(themeColor, 0.1),
                            color: selected ? 'white' : themeColor,
                            transform: selected ? 'scale(1.1)' : 'scale(1)',
                            width: 70,
                            height: 70,
                        }, children: icon }), _jsxs(CardContent, { sx: {
                            width: '100%',
                            textAlign: 'center',
                            padding: theme.spacing(2, 1, 1),
                        }, children: [_jsx(Typography, { variant: "h5", component: "h2", fontWeight: "600", gutterBottom: true, sx: {
                                    color: selected ? themeColor : 'text.primary',
                                    transition: 'color 0.3s ease',
                                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                                    letterSpacing: '-0.01em',
                                }, children: name }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: {
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    height: '4.5em',
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                    opacity: 0.85,
                                }, children: description }), selected && (_jsx(Button, { variant: "outlined", color: "primary", size: "small", endIcon: _jsx(ArrowForwardIcon, {}), sx: {
                                    borderColor: themeColor,
                                    color: themeColor,
                                    '&:hover': {
                                        borderColor: themeColor,
                                        backgroundColor: alpha(themeColor, 0.1),
                                    },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    padding: '6px 16px',
                                    textTransform: 'none',
                                }, children: "\uC120\uD0DD\uD558\uAE30" }))] })] }) }) }));
};
// 목적별 이미지 매핑
const purposeImageMap = {
    study: '/images/purpose/study-background.jpg',
    travel: '/images/purpose/travel-background.jpg',
    living: '/images/purpose/living-background.jpg',
    job: '/images/purpose/job-background.jpg',
};
// 배경 애니메이션 컴포넌트
const AnimatedBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
}));
// 애니메이션 원 컴포넌트
const AnimatedCircle = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
}));
/**
 * 온보딩 목적 선택 페이지
 */
const PurposeSelection = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
    const [selectedPurpose, setSelectedPurpose] = useState(null);
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
    const themeColor = getColorByTheme();
    // 목적 아이콘 매핑
    const purposeIconMap = {
        study: _jsx(SchoolIcon, { sx: { fontSize: 40 } }),
        travel: _jsx(FlightIcon, { sx: { fontSize: 40 } }),
        living: _jsx(HomeIcon, { sx: { fontSize: 40 } }),
        job: _jsx(WorkIcon, { sx: { fontSize: 40 } }),
    };
    // 목적 설명 매핑
    const purposeDescriptionMap = {
        study: '한국에서 학업을 계획하고 있어요. 유학, 어학연수 등을 위한 정보를 제공합니다.',
        travel: '한국 여행을 계획하고 있어요. 관광, 맛집, 교통 등 여행에 필요한 정보를 제공합니다.',
        living: '한국에서 거주할 예정이에요. 주거, 생활, 정착에 관한 정보를 제공합니다.',
        job: '한국에서 취업 또는 일할 계획이에요. 취업 정보와 비자, 커리어 관련 정보를 제공합니다.',
    };
    // 다음 단계로 이동
    const handleNext = () => {
        if (selectedPurpose) {
            navigate(`/onboarding/${selectedPurpose}`);
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
    return (_jsxs(Box, { sx: {
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            py: 6,
        }, children: [_jsx(AnimatedBackground, { children: [...Array(6)].map((_, i) => (_jsx(AnimatedCircle, { custom: i, variants: circleVariants, animate: "animate", style: {
                        width: `${150 + i * 100}px`,
                        height: `${150 + i * 100}px`,
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 80}%`,
                        border: `1px solid ${alpha(themeColor, 0.03)}`,
                        opacity: 0.3 - i * 0.04,
                    } }, i))) }), _jsxs(Container, { maxWidth: "md", sx: { py: 4, zIndex: 1 }, children: [_jsxs(Box, { textAlign: "center", mb: 6, children: [_jsx(Typography, { variant: "h3", component: "h1", fontWeight: "600", mb: 2, sx: {
                                    color: 'text.primary',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                                    letterSpacing: '-0.02em',
                                }, children: "\uC5B4\uB5A4 \uBAA9\uC801\uC73C\uB85C \uD55C\uAD6D\uC5D0 \uBC29\uBB38\uD558\uC2DC\uB098\uC694?" }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", sx: {
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    fontWeight: 400,
                                    letterSpacing: '-0.01em',
                                    opacity: 0.85,
                                }, children: "\uAC00\uC7A5 \uC801\uD569\uD55C \uC635\uC158\uC744 \uC120\uD0DD\uD558\uBA74 \uB9DE\uCDA4\uD615 \uC815\uBCF4\uB97C \uC81C\uACF5\uD574\uB4DC\uB9BD\uB2C8\uB2E4" })] }), _jsx(Box, { sx: {
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: { xs: 3, md: 4 },
                            width: '100%',
                            maxWidth: '900px',
                            mx: 'auto',
                        }, children: mainCategories.map(category => (_jsx(Box, { sx: {
                                height: { xs: '280px', md: '330px' },
                            }, children: _jsx(PurposeCard, { id: category.id, name: category.name, selected: selectedPurpose === category.id, onClick: () => setSelectedPurpose(category.id), icon: purposeIconMap[category.id], description: purposeDescriptionMap[category.id], themeColor: themeColor, imageSrc: purposeImageMap[category.id] }) }, category.id))) }), _jsx(Box, { sx: { mt: 6, textAlign: 'center' }, children: _jsx(Button, { variant: "contained", size: "large", disabled: !selectedPurpose, onClick: handleNext, sx: {
                                bgcolor: themeColor,
                                color: 'white',
                                px: { xs: 4, md: 5 },
                                py: { xs: 1.3, md: 1.5 },
                                borderRadius: '50px',
                                fontWeight: 600,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                boxShadow: `0 6px 16px ${alpha(themeColor, 0.25)}`,
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha(themeColor, 0.9),
                                    boxShadow: `0 8px 20px ${alpha(themeColor, 0.35)}`,
                                    transform: 'translateY(-2px)',
                                },
                                '&.Mui-disabled': {
                                    bgcolor: alpha(theme.palette.grey[300], 0.7),
                                    color: theme.palette.grey[500],
                                },
                            }, children: selectedPurpose ? '계속하기' : '목적을 선택해주세요' }) })] })] }));
};
export default PurposeSelection;
