import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { useThemeStore } from '../../../theme/store/themeStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
/**
 * 온보딩 폼의 다음/이전/완료 버튼 컴포넌트
 */
const FormButtons = ({ onBack, onNext, onSubmit, nextLabel = '다음', backLabel = '이전', submitLabel = '완료', isFirstStep = false, isLastStep = false, isSubmitting = false, isNextDisabled = false, }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
    // 계절에 따른 버튼 색상
    const getPrimaryColor = () => {
        switch (season) {
            case 'spring': return '#FFAAA5';
            case 'summer': return '#77AADD';
            case 'autumn': return '#E8846B';
            case 'winter': return '#8795B5';
            default: return '#FFAAA5';
        }
    };
    const primaryColor = getPrimaryColor();
    return (_jsxs(Box, { sx: {
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
        }, children: [_jsx(Button, { variant: "outlined", onClick: onBack, disabled: isFirstStep || isSubmitting, startIcon: _jsx(ArrowBackIcon, {}), sx: {
                    borderColor: primaryColor,
                    color: primaryColor,
                    '&:hover': {
                        borderColor: primaryColor,
                        backgroundColor: `${primaryColor}10`,
                    },
                    visibility: isFirstStep ? 'hidden' : 'visible',
                }, children: backLabel }), _jsx(Button, { variant: "contained", onClick: isLastStep ? onSubmit : onNext, disabled: isNextDisabled || isSubmitting, endIcon: isLastStep ? _jsx(CheckIcon, {}) : _jsx(ArrowForwardIcon, {}), sx: {
                    bgcolor: primaryColor,
                    '&:hover': {
                        bgcolor: theme.palette.mode === 'light'
                            ? `${primaryColor}dd`
                            : `${primaryColor}bb`,
                    },
                    ml: 'auto',
                }, children: isSubmitting
                    ? '저장 중...'
                    : isLastStep
                        ? submitLabel
                        : nextLabel })] }));
};
export default FormButtons;
