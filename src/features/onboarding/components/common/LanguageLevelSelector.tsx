import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { languageLevels } from '../../components/common/CommonTags';
import styled from '@emotion/styled';

interface LanguageLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  subtitle?: string;
}

// 스타일드 컴포넌트
const LevelCard = styled(Paper)<{ isSelected: boolean }>`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid ${props => (props.isSelected ? '#636363' : 'transparent')};
  background-color: ${props => (props.isSelected ? '#fafbfc' : '#fff')};
  transition: all 0.3s ease;
  &:hover {
    border-color: #636363;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

/**
 * 한국어 수준 선택 컴포넌트
 */
const LanguageLevelSelector: React.FC<LanguageLevelSelectorProps> = ({
  value,
  onChange,
  title = '한국어 능력',
  subtitle = '본인의 한국어 수준을 선택해주세요.',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 고정된 그레이 컬러
  const primaryColor = '#636363';

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}

      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={value} onChange={e => onChange(e.target.value)}>
          {languageLevels.map(level => (
            <LevelCard
              key={level.id}
              isSelected={value === level.id}
              elevation={value === level.id ? 2 : 0}
            >
              <FormControlLabel
                value={level.id}
                control={
                  <Radio
                    sx={{
                      color: '#bdbdbd',
                      '&.Mui-checked': { color: primaryColor },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {level.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {level.description}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </LevelCard>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default LanguageLevelSelector;
