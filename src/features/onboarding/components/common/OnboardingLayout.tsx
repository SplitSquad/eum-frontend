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
import { useThemeStore } from '../../../theme/store/themeStore';
import SeasonalBackground from '../../../theme/components/SeasonalBackground';

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
  const { season } = useThemeStore();

  // 계절에 따른 스타일 변경
  const getColorByTheme = () => {
    switch (season) {
      case 'spring':
        return {
          primary: '#FFAAA5',
          secondary: '#FFD7D7',
          paper: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(255, 235, 235, 0.8)',
          gradient:
            'linear-gradient(135deg, rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%)',
        };

      default:
        return {
          primary: '#FFAAA5',
          secondary: '#FFD7D7',
          paper: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(255, 235, 235, 0.8)',
          gradient:
            'linear-gradient(135deg, rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%)',
        };
    }
  };

  const colors = getColorByTheme();

  // 스텝 레이블 생성
  const steps = Array.from({ length: totalSteps }, (_, index) => {
    if (stepLabels && stepLabels[index]) {
      return stepLabels[index];
    }
    return `단계 ${index + 1}`;
  });

  return (
    <SeasonalBackground>
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            background: colors.paper,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.border}`,
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
                        color: index < currentStep ? colors.primary : 'text.secondary',
                        fontWeight: index < currentStep ? 'bold' : 'normal',
                      },
                      '& .MuiStepIcon-root': {
                        color: index < currentStep ? colors.primary : colors.secondary,
                      },
                      '& .MuiStepIcon-root.Mui-active': {
                        color: colors.primary,
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
    </SeasonalBackground>
  );
};

export default OnboardingLayout;
