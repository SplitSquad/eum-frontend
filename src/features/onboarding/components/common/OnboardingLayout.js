import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Paper, Typography, Stepper, Step, StepLabel, useTheme, useMediaQuery } from '@mui/material';
import { useThemeStore } from '../../../theme/store/themeStore';
import SeasonalBackground from '../../../theme/components/SeasonalBackground';
/**
 * 온보딩 페이지 공통 레이아웃
 */
const OnboardingLayout = ({ children, title, subtitle, currentStep, totalSteps, stepLabels = [], }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
    // 계절에 따른 스타일 변경
    const getColorByTheme = () => {
        switch (season) {
            case 'spring':
                return {
                    primary: '#FFAAA5',
                    secondary: '#FFD7D7',
                    paper: 'rgba(255, 255, 255, 0.9)',
                    border: 'rgba(255, 235, 235, 0.8)',
                    gradient: 'linear-gradient(135deg, rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%)',
                };
            case 'summer':
                return {
                    primary: '#77AADD',
                    secondary: '#A9D7F6',
                    paper: 'rgba(255, 255, 255, 0.9)',
                    border: 'rgba(230, 240, 255, 0.8)',
                    gradient: 'linear-gradient(135deg, rgba(230, 245, 255, 0.7) 0%, rgba(210, 235, 255, 0.7) 100%)',
                };
            case 'autumn':
                return {
                    primary: '#E8846B',
                    secondary: '#FFDAC1',
                    paper: 'rgba(255, 255, 255, 0.9)',
                    border: 'rgba(255, 235, 215, 0.8)',
                    gradient: 'linear-gradient(135deg, rgba(255, 245, 230, 0.7) 0%, rgba(255, 235, 220, 0.7) 100%)',
                };
            case 'winter':
                return {
                    primary: '#8795B5',
                    secondary: '#D6E1FF',
                    paper: 'rgba(255, 255, 255, 0.9)',
                    border: 'rgba(230, 235, 250, 0.8)',
                    gradient: 'linear-gradient(135deg, rgba(245, 250, 255, 0.7) 0%, rgba(235, 240, 255, 0.7) 100%)',
                };
            default:
                return {
                    primary: '#FFAAA5',
                    secondary: '#FFD7D7',
                    paper: 'rgba(255, 255, 255, 0.9)',
                    border: 'rgba(255, 235, 235, 0.8)',
                    gradient: 'linear-gradient(135deg, rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%)',
                };
        }
    };
    const colors = getColorByTheme();
    // 스텝 레이블 생성
    const steps = Array.from({ length: totalSteps }, (_, index) => {
        if (stepLabels && stepLabels[index]) {
            return stepLabels[index];
        }
        return `단계 ${index + 1}`;
    });
    return (_jsx(SeasonalBackground, { children: _jsx(Container, { maxWidth: "md", sx: { py: { xs: 2, md: 4 } }, children: _jsxs(Paper, { elevation: 3, sx: {
                    p: { xs: 2, md: 4 },
                    borderRadius: 2,
                    background: colors.paper,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.05)`,
                    position: 'relative',
                }, children: [_jsxs(Box, { mb: 4, textAlign: "center", children: [_jsx(Typography, { variant: isMobile ? 'h5' : 'h4', component: "h1", fontWeight: "bold", color: "text.primary", gutterBottom: true, children: title }), subtitle && (_jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mt: 1 }, children: subtitle }))] }), totalSteps > 1 && (_jsx(Stepper, { activeStep: currentStep - 1, alternativeLabel: !isMobile, orientation: isMobile ? 'vertical' : 'horizontal', sx: { mb: 4 }, children: steps.map((label, index) => (_jsx(Step, { children: _jsx(StepLabel, { sx: {
                                    '& .MuiStepLabel-label': {
                                        color: index < currentStep ? colors.primary : 'text.secondary',
                                        fontWeight: index < currentStep ? 'bold' : 'normal',
                                    },
                                    '& .MuiStepIcon-root': {
                                        color: index < currentStep ? colors.primary : colors.secondary,
                                    },
                                    '& .MuiStepIcon-root.Mui-active': {
                                        color: colors.primary,
                                    },
                                }, children: label }) }, label))) })), _jsx(Box, { children: children })] }) }) }));
};
export default OnboardingLayout;
