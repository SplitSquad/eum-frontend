import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from '@/shared/i18n';

/**
 * 로딩 화면 컴포넌트
 */
const Loading: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        // 모바일에서 패딩을 약간 추가하여 화면 가장자리와 간격 확보
        px: { xs: 2, sm: 0 },
      }}
    >
      <CircularProgress
        // 색상은 기존대로 반투명 회색 계열 유지
        sx={{
          color: 'rgba(173, 173, 173, 0.8)',
          // 모바일에서는 크기를 작게, 태블릿/데스크톱에서는 기본 크기 유지
          width: { xs: 40, sm: 60, md: 80 },
          height: { xs: 40, sm: 60, md: 80 },
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          // variant="h6" 기본 폰트 크기를 오버라이딩하여 반응형 적용
          fontSize: { xs: '0.9rem', sm: '1.25rem', md: '1.5rem' },
        }}
      >
        {t('common.loading')}
      </Typography>
    </Box>
  );
};

export default Loading;
