/**
 * 실제 국기 이미지를 표시하는 컴포넌트
 * 이미지 로드 실패 시 이모지로 폴백
 */

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getFlagImageUrl, getCountryByCode, getCountryByName } from '../utils/countryUtils';

export interface FlagDisplayProps {
  /** 국가 코드 또는 국가명 */
  nation: string;
  /** 국기 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 국가명을 함께 표시할지 여부 */
  showName?: boolean;
  /** 인라인 표시 (한 줄) 여부 */
  inline?: boolean;
  /** 추가 스타일 */
  sx?: any;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({
  nation,
  size = 'small',
  showName = true,
  inline = true,
  sx = {}
}) => {
  const [imageError, setImageError] = useState(false);

  if (!nation || nation.trim() === '') {
    return (
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          display: inline ? 'inline-flex' : 'flex',
          alignItems: 'center',
          ...sx 
        }}
      >
        🌍 {showName ? '' : ''}
      </Typography>
    );
  }

  // 국가 정보 찾기 (코드 또는 이름으로)
  const country = getCountryByCode(nation) || getCountryByName(nation);
  const countryCode = country?.code || nation.toUpperCase();
  const countryName = country?.name || nation;

  // 크기별 설정
  const sizeConfig = {
    small: { width: '20px', fontSize: '0.75rem' },
    medium: { width: '24px', fontSize: '0.875rem' },
    large: { width: '32px', fontSize: '1rem' }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box
      sx={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        gap: 0.5,
        ...sx
      }}
    >
      {!imageError ? (
        <img
          src={getFlagImageUrl(countryCode, size)}
          alt={`${countryName} 국기`}
          title={countryName}
          style={{
            width: sizeConfig[size].width,
            height: 'auto',
            borderRadius: '2px',
            verticalAlign: 'middle'
          }}
          onError={handleImageError}
        />
      ) : (
        <Typography
          component="span"
          sx={{
            fontSize: sizeConfig[size].fontSize,
            lineHeight: 1,
            verticalAlign: 'middle'
          }}
        >
          {country?.flag || '🌍'}
        </Typography>
      )}
      
      {showName && (
        <Typography
          component="span"
          variant="caption"
          sx={{
            fontSize: sizeConfig[size].fontSize,
            color: 'text.secondary'
          }}
        >
          {countryName}
        </Typography>
      )}
    </Box>
  );
};

export default FlagDisplay; 