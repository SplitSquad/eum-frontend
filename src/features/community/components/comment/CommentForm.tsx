import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { useCommentForm } from '../../hooks';

interface CommentFormProps {
  initialValue: string;
  onSubmit: (content: string) => Promise<boolean | undefined>;
  onCancel?: () => void;
  buttonText?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  initialValue,
  onSubmit,
  onCancel,
  buttonText = '등록',
  autoFocus = false,
}) => {
  const commentForm = useCommentForm(initialValue, async content => {
    const result = await onSubmit(content);
    return result;
  });

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="댓글을 작성해주세요"
        value={commentForm.content}
        onChange={e => commentForm.handleChange(e.target.value)}
        variant="outlined"
        autoFocus={autoFocus}
        error={!!commentForm.error}
        helperText={commentForm.error}
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {onCancel && (
          <Button size="small" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          onClick={commentForm.handleSubmit}
          disabled={commentForm.isEmpty || commentForm.isSubmitting}
        >
          {commentForm.isSubmitting ? (
            <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
          ) : null}
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;
