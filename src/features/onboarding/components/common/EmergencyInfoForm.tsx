import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useThemeStore } from '../../../theme/store/themeStore';
import { useTranslation } from '@/shared/i18n';

interface EmergencyInfoFormProps {
  emergencyContact: string;
  medicalConditions: string;
  foodAllergies: string;
  receiveEmergencyAlerts: boolean;
  onEmergencyContactChange: (value: string) => void;
  onMedicalConditionsChange: (value: string) => void;
  onFoodAllergiesChange: (value: string) => void;
  onReceiveEmergencyAlertsChange: (value: boolean) => void;
  title?: string;
  subtitle?: string;
}

const EmergencyInfoForm: React.FC<EmergencyInfoFormProps> = ({
  emergencyContact,
  medicalConditions,
  foodAllergies,
  receiveEmergencyAlerts,
  onEmergencyContactChange,
  onMedicalConditionsChange,
  onFoodAllergiesChange,
  onReceiveEmergencyAlertsChange,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // 고정된 그레이 컬러
  const primaryColor = '#636363';

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {t('onboarding.emergency.title')}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        {t('onboarding.emergency.description')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* Emergency Contact */}
        <TextField
          label={t('onboarding.emergency.contactLabel')}
          fullWidth
          value={emergencyContact}
          onChange={e => onEmergencyContactChange(e.target.value)}
          placeholder={t('onboarding.emergency.contactPlaceholder')}
          variant="outlined"
          margin="normal"
          helperText={t('onboarding.emergency.contactHelper')}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: primaryColor,
            },
          }}
        />

        {/* Medical Conditions */}
        <TextField
          label={t('onboarding.emergency.medicalLabel')}
          fullWidth
          multiline
          rows={2}
          value={medicalConditions}
          onChange={e => onMedicalConditionsChange(e.target.value)}
          placeholder={t('onboarding.emergency.medicalPlaceholder')}
          variant="outlined"
          margin="normal"
          helperText={t('onboarding.emergency.medicalHelper')}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: primaryColor,
            },
          }}
        />

        {/* Food Allergies */}
        <TextField
          label={t('onboarding.emergency.foodLabel')}
          fullWidth
          multiline
          rows={2}
          value={foodAllergies}
          onChange={e => onFoodAllergiesChange(e.target.value)}
          placeholder={t('onboarding.emergency.foodPlaceholder')}
          variant="outlined"
          margin="normal"
          helperText={t('onboarding.emergency.foodHelper')}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: primaryColor,
            },
          }}
        />

        {/* Receive Emergency Alerts */}
        <FormControlLabel
          control={
            <Switch
              checked={receiveEmergencyAlerts}
              onChange={e => onReceiveEmergencyAlertsChange(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: primaryColor,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: `${primaryColor}aa`,
                },
              }}
            />
          }
          label={t('onboarding.emergency.alertLabel')}
        />
      </Box>
    </Box>
  );
};

export default EmergencyInfoForm;
