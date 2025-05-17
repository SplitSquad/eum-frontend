import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingProps {
  size?: number;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 40, color = 'primary' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      py={4}
    >
      <CircularProgress size={size} color={color as any} />
    </Box>
  );
};

export default Loading; 