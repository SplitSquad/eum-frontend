import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface VoteProgressProps {
  proCount: number;
  conCount: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

// 스타일 컴포넌트
const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  height: 16,
  borderRadius: 8,
  overflow: 'hidden',
}));

const ProSection = styled(Box)<{ width: string }>(({ theme, width }) => ({
  width,
  backgroundColor: theme.palette.success.light,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.success.contrastText,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  transition: 'width 0.5s ease-in-out',
  '&:not(:last-child)': {
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
  },
}));

const ConSection = styled(Box)<{ width: string }>(({ theme, width }) => ({
  width,
  backgroundColor: theme.palette.error.light,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.error.contrastText,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  transition: 'width 0.5s ease-in-out',
}));

/**
 * 투표 진행 상황 표시 컴포넌트
 * 찬성과 반대의 비율을 시각적으로 표시
 */
const VoteProgress: React.FC<VoteProgressProps> = ({
  proCount,
  conCount,
  size = 'md',
  showPercentage = true,
}) => {
  const total = proCount + conCount;
  const proPercentage = total > 0 ? Math.round((proCount / total) * 100) : 0;
  const conPercentage = total > 0 ? Math.round((conCount / total) * 100) : 0;

  // 크기에 따른 높이 조정
  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 8;
      case 'lg':
        return 24;
      case 'md':
      default:
        return 16;
    }
  };

  // 텍스트 크기 조정
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return '0.625rem';
      case 'lg':
        return '0.875rem';
      case 'md':
      default:
        return '0.75rem';
    }
  };

  return (
    <ProgressContainer sx={{ height: getHeight() }}>
      <ProSection 
        width={`${proPercentage}%`} 
        sx={{ 
          fontSize: getFontSize(),
          minWidth: proPercentage === 0 ? '0%' : '20%'
        }}
      >
        {showPercentage && proPercentage > 10 && `${proPercentage}%`}
      </ProSection>
      <ConSection 
        width={`${conPercentage}%`}
        sx={{ 
          fontSize: getFontSize(),
          minWidth: conPercentage === 0 ? '0%' : '20%'
        }}
      >
        {showPercentage && conPercentage > 10 && `${conPercentage}%`}
      </ConSection>
    </ProgressContainer>
  );
};

export default VoteProgress; 