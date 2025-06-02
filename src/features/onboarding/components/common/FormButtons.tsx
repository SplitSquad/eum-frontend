import React from 'react';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from '../../../../shared/i18n';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

interface FormButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  isNextDisabled?: boolean;
}

/**
 * 온보딩 폼의 다음/이전/완료 버튼 컴포넌트
 */
const FormButtons: React.FC<FormButtonsProps> = ({
  onBack,
  onNext,
  onSubmit,
  nextLabel,
  backLabel,
  submitLabel,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  isNextDisabled = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 고정된 그레이 컬러
  const primaryColor = '#636363';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 4,
        pt: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* 이전 버튼 */}
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        startIcon={<ArrowBackIcon />}
        sx={{
          borderColor: primaryColor,
          color: primaryColor,
          '&:hover': {
            borderColor: primaryColor,
            backgroundColor: '#ededed',
          },
          visibility: isFirstStep ? 'hidden' : 'visible',
        }}
      >
        {backLabel || t('buttons.back')}
      </Button>

      {/* 다음/완료 버튼 */}
      <Button
        variant="contained"
        onClick={isLastStep ? onSubmit : onNext}
        disabled={isNextDisabled || isSubmitting}
        endIcon={isLastStep ? <CheckIcon /> : <ArrowForwardIcon />}
        sx={{
          bgcolor: primaryColor,
          color: '#fff',
          '&:hover': {
            bgcolor: '#222',
          },
          ml: 'auto',
        }}
      >
        {isSubmitting
          ? t('onboarding.saving')
          : isLastStep
            ? submitLabel || t('buttons.finish')
            : nextLabel || t('buttons.next')}
      </Button>
    </Box>
  );
};

export default FormButtons;
