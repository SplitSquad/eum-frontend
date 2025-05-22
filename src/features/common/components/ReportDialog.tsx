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

// 신고 사유 목록
const REPORT_REASONS = [
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'spam', label: '스팸 / 광고' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'personal_attack', label: '인신공격 / 혐오 발언' },
  { value: 'illegal', label: '불법 정보' },
  { value: 'other', label: '기타' },
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
      setError('신고 사유를 선택해주세요');
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
      enqueueSnackbar('신고가 접수되었습니다', { variant: 'success' });
      handleClose();
    } catch (error: any) {
      console.error('신고 처리 실패:', error);

      // 에러 메시지 처리
      if (error.response?.status === 400 && error.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'warning' });
        handleClose(); // 이미 신고한 경우 다이얼로그 닫기
      } else {
        setError('신고 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>콘텐츠 신고하기</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          신고 사유를 선택하고 추가 설명을 입력해주세요. 허위 신고의 경우 서비스 이용에 제한이 있을
          수 있습니다.
        </Typography>

        <FormControl fullWidth margin="normal" error={!!error}>
          <InputLabel>신고 사유</InputLabel>
          <Select
            value={reportReason}
            onChange={handleReasonChange}
            label="신고 사유"
            disabled={isSubmitting}
          >
            {REPORT_REASONS.map(reason => (
              <MenuItem key={reason.value} value={reason.value}>
                {reason.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="추가 설명 (선택사항)"
          multiline
          rows={4}
          value={reportDescription}
          onChange={handleDescriptionChange}
          placeholder="신고 사유에 대한 자세한 설명을 입력해주세요"
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          취소
        </Button>
        <Button
          onClick={handleSubmitReport}
          color="error"
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? '처리 중...' : '신고하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog; 