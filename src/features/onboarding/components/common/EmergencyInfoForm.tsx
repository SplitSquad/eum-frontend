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

/**
 * 응급 상황 설정 폼 컴포넌트
 */
const EmergencyInfoForm: React.FC<EmergencyInfoFormProps> = ({
  emergencyContact,
  medicalConditions,
  foodAllergies,
  receiveEmergencyAlerts,
  onEmergencyContactChange,
  onMedicalConditionsChange,
  onFoodAllergiesChange,
  onReceiveEmergencyAlertsChange,
  title = '응급 상황 설정',
  subtitle = '응급 상황 발생 시를 대비한 정보를 입력해주세요.',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();

  // 계절에 따른 색상 가져오기
  const getColorByTheme = () => {
    switch (season) {
      case 'spring':
        return '#FFAAA5';
      default:
        return '#FFAAA5';
    }
  };

  const primaryColor = getColorByTheme();

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}

      {/* CSS Grid로 1컬럼 / 2컬럼 레이아웃 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* 비상 연락처 */}
        <Box>
          <TextField
            label="비상 연락처"
            fullWidth
            value={emergencyContact}
            onChange={e => onEmergencyContactChange(e.target.value)}
            placeholder="연락 가능한 사람의 이름과 전화번호를 입력하세요"
            variant="outlined"
            margin="normal"
            helperText="응급 상황 시 연락할 가족이나 친구의 연락처를 입력하세요"
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
              },
              '& .MuiInputLabel-outlined.Mui-focused': {
                color: primaryColor,
              },
            }}
          />
        </Box>

        {/* 건강 상태 */}
        <Box>
          <TextField
            label="건강 상태 및 복용 중인 약물"
            fullWidth
            multiline
            rows={2}
            value={medicalConditions}
            onChange={e => onMedicalConditionsChange(e.target.value)}
            placeholder="건강 상태, 질환, 복용 중인 약물 등을 입력하세요"
            variant="outlined"
            margin="normal"
            helperText="알레르기, 지병, 복용 중인 약물 등 의료진이 알아야 할 정보를 입력하세요"
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
              },
              '& .MuiInputLabel-outlined.Mui-focused': {
                color: primaryColor,
              },
            }}
          />
        </Box>

        {/* 음식 알레르기 */}
        <Box>
          <TextField
            label="음식 알레르기"
            fullWidth
            multiline
            rows={2}
            value={foodAllergies}
            onChange={e => onFoodAllergiesChange(e.target.value)}
            placeholder="알레르기가 있는 음식을 입력하세요"
            variant="outlined"
            margin="normal"
            helperText="알레르기 반응이 있는 음식이나 음식물을 입력하세요"
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
              },
              '& .MuiInputLabel-outlined.Mui-focused': {
                color: primaryColor,
              },
            }}
          />
        </Box>

        {/* 응급 알림 수신 설정 */}
        <Box>
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
            label={
              <Box>
                <Typography variant="body1">응급 상황 알림 수신</Typography>
                <Typography variant="body2" color="text.secondary">
                  재난, 사고 등 응급 상황에 대한 알림을 수신합니다.
                </Typography>
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmergencyInfoForm;
