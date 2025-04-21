import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * 로딩 화면 컴포넌트
 */
const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <CircularProgress sx={{ color: 'rgba(255, 170, 165, 0.8)', mb: 2 }} />
      <Typography variant="h6" color="textSecondary">
        로딩 중...
      </Typography>
    </Box>
  );
};

export default Loading;
