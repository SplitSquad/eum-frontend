import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import useAuthStore from '../../auth/store/authStore';
import { useTranslation } from '../../../shared/i18n';

// 신고 대상 유형
export type ReportTargetType = 'POST' | 'COMMENT' | 'REPLY';

// 서비스 유형
export type ServiceType = 'COMMUNITY' | 'DISCUSSION' | 'DEBATE';

// 신고 컴포넌트 props
export interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  targetId: number; // 게시글/댓글/답글 ID
  targetType: ReportTargetType; // 대상 유형 (게시글/댓글/답글)
  serviceType: ServiceType; // 서비스 유형 (커뮤니티/토론)
  reportedUserId: number; // 신고 대상 사용자 ID
}

// 신고 사유 키 목록 (번역에서 사용)
const REPORT_REASON_KEYS = [
  'inappropriate',
  'spam',
  'copyright',
  'personal_attack',
  'illegal',
  'other',
];

/**
 * 신고 다이얼로그 컴포넌트
 * 게시글, 댓글, 답글 등 신고에 사용할 수 있는 공통 컴포넌트
 */
const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  targetId,
  targetType,
  serviceType,
  reportedUserId,
}) => {
  // 번역 훅
  const { t } = useTranslation();

  // 상태 관리
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Snackbar 알림
  const { enqueueSnackbar } = useSnackbar();

  // 인증 정보
  const authStore = useAuthStore();
  const token = authStore.token;

  // 신고 사유 변경 핸들러
  const handleReasonChange = (e: SelectChangeEvent<string>) => {
    setReportReason(e.target.value);
    setError(null);
  };

  // 신고 설명 변경 핸들러
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportDescription(e.target.value);
  };

  // 신고 다이얼로그 초기화
  const resetDialog = () => {
    setReportReason('');
    setReportDescription('');
    setError(null);
  };

  // 다이얼로그 닫기 핸들러
  const handleClose = () => {
    resetDialog();
    onClose();
  };

  // 신고 제출 핸들러
  const handleSubmitReport = async () => {
    // 사유 선택 필수
    if (!reportReason) {
      setError(t('report.reasonRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 신고 API 요청
      const reportData = {
        reportedId: reportedUserId,
        reportContent: `${reportReason}${reportDescription ? ': ' + reportDescription : ''}`,
        serviceType: serviceType,
        targetType: targetType,
        contentId: targetId,
      };

      console.log('신고 데이터 전송:', reportData);

      // axios 인스턴스를 import하여 사용하는 대신, 환경 변수를 직접 사용하여 전체 URL 지정
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      await axios.post(`${API_BASE_URL}/users/profile/report`, reportData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // 신고 성공
      enqueueSnackbar(t('report.success'), { variant: 'success' });
      handleClose();
    } catch (error: any) {
      console.error('신고 처리 실패:', error);

      // 에러 메시지 처리
      if (error.response?.status === 400 && error.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'warning' });
        handleClose(); // 이미 신고한 경우 다이얼로그 닫기
      } else {
        setError(t('report.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('report.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          {t('report.description')}
        </Typography>

        <FormControl fullWidth margin="normal" error={!!error}>
          <InputLabel>{t('report.reasonLabel')}</InputLabel>
          <Select
            value={reportReason}
            onChange={handleReasonChange}
            label={t('report.reasonLabel')}
            disabled={isSubmitting}
          >
            {REPORT_REASON_KEYS.map(reasonKey => (
              <MenuItem key={reasonKey} value={reasonKey}>
                {t(`report.reasons.${reasonKey}`)}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label={t('report.additionalDescription')}
          multiline
          rows={4}
          value={reportDescription}
          onChange={handleDescriptionChange}
          placeholder={t('report.placeholder')}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('report.cancel')}
        </Button>
        <Button
          onClick={handleSubmitReport}
          color="error"
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? t('report.submitting') : t('report.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog; 