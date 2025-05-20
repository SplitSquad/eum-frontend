import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import LanguageSelector from './common/LanguageSelector';
import { getPreferredLanguage, savePreferredLanguage } from '../utils/languageUtils';
/**
 * 언어 설정 컴포넌트
 * 온보딩 과정에서 사용자가 UI 언어를 선택할 수 있게 해줍니다.
 */
const LanguageSettings = ({ onNext, onBack, showTitle = true, showButtons = true, initialValue, onLanguageChange, }) => {
    // 언어 상태 관리
    const [selectedLanguage, setSelectedLanguage] = useState(initialValue || getPreferredLanguage());
    // 언어 변경 핸들러
    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        savePreferredLanguage(language);
        if (onLanguageChange) {
            onLanguageChange(language);
        }
    };
    // 다음 버튼 핸들러
    const handleNext = () => {
        if (onNext) {
            onNext(selectedLanguage);
        }
    };
    // 초기값이 변경되면 상태 업데이트
    useEffect(() => {
        if (initialValue) {
            setSelectedLanguage(initialValue);
        }
    }, [initialValue]);
    return (_jsxs(Paper, { elevation: 3, sx: {
            padding: 3,
            borderRadius: 2,
            maxWidth: 600,
            margin: '0 auto'
        }, children: [showTitle && (_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { mb: 3 }, children: "\uC5B8\uC5B4 \uC124\uC815" })), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body1", sx: { mb: 2 }, children: "\uC120\uD638\uD558\uB294 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC120\uD0DD\uD55C \uC5B8\uC5B4\uB85C \uC0AC\uC774\uD2B8\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4." }), _jsx(LanguageSelector, { value: selectedLanguage, onChange: handleLanguageChange, label: "UI \uC5B8\uC5B4", helperText: "\uC0AC\uC774\uD2B8\uC5D0 \uD45C\uC2DC\uB420 \uC5B8\uC5B4\uC785\uB2C8\uB2E4" })] }), showButtons && (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 3 }, children: [onBack && (_jsx(Button, { variant: "outlined", onClick: onBack, children: "\uC774\uC804" })), _jsx(Button, { variant: "contained", color: "primary", onClick: handleNext, children: "\uB2E4\uC74C" })] }))] }));
};
export default LanguageSettings;
