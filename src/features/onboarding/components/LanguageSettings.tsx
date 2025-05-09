import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import LanguageSelector from './common/LanguageSelector';
import { getPreferredLanguage, savePreferredLanguage } from '../utils/languageUtils';

interface LanguageSettingsProps {
  onNext?: (language: string) => void;
  onBack?: () => void;
  showTitle?: boolean;
  showButtons?: boolean;
  initialValue?: string;
  onLanguageChange?: (language: string) => void;
}

/**
 * 언어 설정 컴포넌트
 * 온보딩 과정에서 사용자가 UI 언어를 선택할 수 있게 해줍니다.
 */
const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  onNext,
  onBack,
  showTitle = true,
  showButtons = true,
  initialValue,
  onLanguageChange,
}) => {
  // 언어 상태 관리
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialValue || getPreferredLanguage()
  );

  // 언어 변경 핸들러
  const handleLanguageChange = (language: string) => {
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

  return (
    <Paper 
      elevation={3}
      sx={{ 
        padding: 3, 
        borderRadius: 2,
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      {showTitle && (
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          언어 설정
        </Typography>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          선호하는 언어를 선택해주세요. 선택한 언어로 사이트가 표시됩니다.
        </Typography>

        <LanguageSelector
          value={selectedLanguage}
          onChange={handleLanguageChange}
          label="UI 언어"
          helperText="사이트에 표시될 언어입니다"
        />
      </Box>

      {showButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {onBack && (
            <Button 
              variant="outlined" 
              onClick={onBack}
            >
              이전
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNext}
          >
            다음
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default LanguageSettings; 