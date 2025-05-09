import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText } from '@mui/material';
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

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * UI 언어 선택 컴포넌트
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  label = '언어 선택',
  helperText,
  required = false,
  disabled = false,
}) => {
  // 선택 변경 핸들러
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <StyledFormControl fullWidth required={required} disabled={disabled}>
      <InputLabel id="language-select-label">{label}</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <span style={{ marginRight: '8px' }}>{lang.flag}</span>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

export default LanguageSelector; 