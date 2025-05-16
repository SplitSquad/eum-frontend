import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControlLabel, Switch, TextField, Typography, useMediaQuery, useTheme, } from '@mui/material';
import { useThemeStore } from '../../../theme/store/themeStore';
/**
 * 응급 상황 설정 폼 컴포넌트
 */
const EmergencyInfoForm = ({ emergencyContact, medicalConditions, foodAllergies, receiveEmergencyAlerts, onEmergencyContactChange, onMedicalConditionsChange, onFoodAllergiesChange, onReceiveEmergencyAlertsChange, title = '응급 상황 설정', subtitle = '응급 상황 발생 시를 대비한 정보를 입력해주세요.', }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
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
    return (_jsxs(Box, { sx: { mb: 4 }, children: [title && (_jsx(Typography, { variant: "h6", sx: { mb: 1, fontWeight: 600 }, children: title })), subtitle && (_jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: subtitle })), _jsxs(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                }, children: [_jsx(Box, { children: _jsx(TextField, { label: "\uBE44\uC0C1 \uC5F0\uB77D\uCC98", fullWidth: true, value: emergencyContact, onChange: e => onEmergencyContactChange(e.target.value), placeholder: "\uC5F0\uB77D \uAC00\uB2A5\uD55C \uC0AC\uB78C\uC758 \uC774\uB984\uACFC \uC804\uD654\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694", variant: "outlined", margin: "normal", helperText: "\uC751\uAE09 \uC0C1\uD669 \uC2DC \uC5F0\uB77D\uD560 \uAC00\uC871\uC774\uB098 \uCE5C\uAD6C\uC758 \uC5F0\uB77D\uCC98\uB97C \uC785\uB825\uD558\uC138\uC694", sx: {
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: primaryColor,
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: primaryColor,
                                },
                            } }) }), _jsx(Box, { children: _jsx(TextField, { label: "\uAC74\uAC15 \uC0C1\uD0DC \uBC0F \uBCF5\uC6A9 \uC911\uC778 \uC57D\uBB3C", fullWidth: true, multiline: true, rows: 2, value: medicalConditions, onChange: e => onMedicalConditionsChange(e.target.value), placeholder: "\uAC74\uAC15 \uC0C1\uD0DC, \uC9C8\uD658, \uBCF5\uC6A9 \uC911\uC778 \uC57D\uBB3C \uB4F1\uC744 \uC785\uB825\uD558\uC138\uC694", variant: "outlined", margin: "normal", helperText: "\uC54C\uB808\uB974\uAE30, \uC9C0\uBCD1, \uBCF5\uC6A9 \uC911\uC778 \uC57D\uBB3C \uB4F1 \uC758\uB8CC\uC9C4\uC774 \uC54C\uC544\uC57C \uD560 \uC815\uBCF4\uB97C \uC785\uB825\uD558\uC138\uC694", sx: {
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: primaryColor,
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: primaryColor,
                                },
                            } }) }), _jsx(Box, { children: _jsx(TextField, { label: "\uC74C\uC2DD \uC54C\uB808\uB974\uAE30", fullWidth: true, multiline: true, rows: 2, value: foodAllergies, onChange: e => onFoodAllergiesChange(e.target.value), placeholder: "\uC54C\uB808\uB974\uAE30\uAC00 \uC788\uB294 \uC74C\uC2DD\uC744 \uC785\uB825\uD558\uC138\uC694", variant: "outlined", margin: "normal", helperText: "\uC54C\uB808\uB974\uAE30 \uBC18\uC751\uC774 \uC788\uB294 \uC74C\uC2DD\uC774\uB098 \uC74C\uC2DD\uBB3C\uC744 \uC785\uB825\uD558\uC138\uC694", sx: {
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: primaryColor,
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: primaryColor,
                                },
                            } }) }), _jsx(Box, { children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: receiveEmergencyAlerts, onChange: e => onReceiveEmergencyAlertsChange(e.target.checked), sx: {
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: primaryColor,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: `${primaryColor}aa`,
                                    },
                                } }), label: _jsxs(Box, { children: [_jsx(Typography, { variant: "body1", children: "\uC751\uAE09 \uC0C1\uD669 \uC54C\uB9BC \uC218\uC2E0" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "\uC7AC\uB09C, \uC0AC\uACE0 \uB4F1 \uC751\uAE09 \uC0C1\uD669\uC5D0 \uB300\uD55C \uC54C\uB9BC\uC744 \uC218\uC2E0\uD569\uB2C8\uB2E4." })] }) }) })] })] }));
};
export default EmergencyInfoForm;
