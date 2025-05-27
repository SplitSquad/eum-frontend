import React from 'react';
import { Typography, Box } from '@mui/material';

interface PageHeaderTextProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  detail?: React.ReactNode;
  isMobile?: boolean;
}

const PageHeaderText: React.FC<PageHeaderTextProps> = ({ children, action, detail, isMobile }) => (
  <Box
    sx={{
      mb: 3,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: 2,
    }}
  >
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          color: '#555',
          fontFamily: '"Noto Sans KR", sans-serif',
        }}
      >
        {children}
      </Typography>
      {detail && (
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: '#888',
            mt: 0.5,
            fontSize: '1rem',
          }}
        >
          {detail}
        </Typography>
      )}
    </Box>
    {action && <Box sx={{ mt: isMobile ? 2 : 0 }}>{action}</Box>}
  </Box>
);

export default PageHeaderText;
