import React, { ReactNode } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

/**
 * 온보딩 페이지 공통 레이아웃
 */
const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  stepLabels = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 스텝 레이블 생성
  const steps = Array.from({ length: totalSteps }, (_, index) => {
    if (stepLabels && stepLabels[index]) {
      return stepLabels[index];
    }
    return `단계 ${index + 1}`;
  });

  // 고정된 그레이 계열 팔레트
  const colors = {
    background: { paper: '#fafbfc', default: '#e0e0e0' },
    primary: { main: '#636363' },
    secondary: { main: '#bdbdbd' },
    text: { primary: '#222', secondary: '#888' },
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          background: colors.background.paper,
          border: `1px solid ${colors.background.default}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.05)`,
          position: 'relative',
        }}
      >
        {/* 헤더 영역 */}
        <Box mb={4} textAlign="center">
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* 스텝 진행 표시 */}
        {totalSteps > 1 && (
          <Stepper
            activeStep={currentStep - 1}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ mb: 4 }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: index < currentStep ? colors.primary.main : colors.text.secondary,
                      fontWeight: index < currentStep ? 'bold' : 'normal',
                    },
                    '& .MuiStepIcon-root': {
                      color: index < currentStep ? colors.primary.main : colors.secondary.main,
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: colors.primary.main,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* 콘텐츠 영역 */}
        <Box>{children}</Box>
      </Paper>
    </Container>
  );
};

export default OnboardingLayout;
