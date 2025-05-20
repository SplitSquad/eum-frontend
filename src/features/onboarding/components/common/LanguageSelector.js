import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];
// 스타일링된 FormControl
const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    minWidth: 200,
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));
/**
 * UI 언어 선택 컴포넌트
 */
const LanguageSelector = ({ value, onChange, label = '언어 선택', helperText, required = false, disabled = false, }) => {
    // 선택 변경 핸들러
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    return (_jsxs(StyledFormControl, { fullWidth: true, required: required, disabled: disabled, children: [_jsx(InputLabel, { id: "language-select-label", children: label }), _jsx(Select, { labelId: "language-select-label", id: "language-select", value: value, label: label, onChange: handleChange, children: SUPPORTED_LANGUAGES.map((lang) => (_jsxs(MenuItem, { value: lang.code, children: [_jsx("span", { style: { marginRight: '8px' }, children: lang.flag }), lang.name] }, lang.code))) }), helperText && _jsx(FormHelperText, { children: helperText })] }));
};
export default LanguageSelector;
