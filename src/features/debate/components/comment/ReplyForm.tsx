import React, { useState, useRef } from 'react';
import { useDebateStore } from '../../store';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useTranslation } from '@/shared/i18n';

interface ReplyFormProps {
  commentId: number;
  onSuccess?: (newReply?: any) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ commentId, onSuccess }) => {
  const { createReply } = useDebateStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textFieldRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // 대댓글 제출 함수 - Promise 반환 및 비동기 처리 개선
  const submitReply = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    // 이벤트 차단 강화 - 리다이렉션 방지
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    // 유효성 검사
    if (!content.trim()) {
      setError('답글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 500) {
      setError('답글은 최대 500자까지 입력 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 비동기 요청 실행 및 await로 완료 대기
      const result = await createReply(commentId, content);
      console.log('답글 작성 결과:', result);

      // 성공 시 입력창 초기화
      setContent('');

      // 성공 콜백 호출
      if (onSuccess) {
        console.log('ReplyForm: 성공 콜백 호출 전');
        onSuccess(result);
        console.log('ReplyForm: 성공 콜백 호출 후');
      }
    } catch (err) {
      console.error('답글 작성 실패:', err);
      setError('답글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }

    setContent('');
    setError('');

    if (onSuccess) onSuccess();
  };

  // Ctrl+Enter로 제출
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }

      submitReply(e);
    }
  };

  // 클릭 이벤트 핸들러 - 버블링 방지
  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      <Box sx={{ mb: 2 }} onClick={handleClick}>
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          placeholder={t('debate.reply.placeholder')}
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          error={!!error}
          helperText={error}
          sx={{ mb: 1 }}
          InputProps={{
            sx: { borderRadius: 1.5 },
          }}
          onClick={handleClick}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
          onClick={handleClick}
        >
          <Typography variant="caption" color="text.secondary">
            {content.length}/500
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }} onClick={handleClick}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleCancel}
              disabled={isSubmitting}
              type="button"
            >
              {t('debate.comment.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={e => submitReply(e)}
              disabled={isSubmitting || !content.trim()}
              type="button"
            >
              {isSubmitting ? t('debate.reply.saving') : t('debate.reply.add')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReplyForm;
