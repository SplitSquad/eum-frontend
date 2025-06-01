import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useEffect } from 'react';
import useCommunityStore from '../store/communityStore';

interface ReplyFormProps {
  postId: number;
  commentId: number;
  onClose?: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ postId, commentId, onClose }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addReply } = useCommunityStore();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      await addReply(postId, commentId, content);
      setContent('');
      if (onClose) onClose();
    } catch (error) {
      console.error('답글 작성 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="답글을 입력하세요..."
        value={content}
        onChange={e => setContent(e.target.value)}
        multiline
        rows={2}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '& fieldset': {
              borderColor: '#FFD7D7',
            },
            '&:hover fieldset': {
              borderColor: '#FFAAA5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF9999',
            },
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#FFD7D7',
            color: '#888',
            '&:hover': {
              borderColor: '#FFAAA5',
              backgroundColor: 'rgba(255, 170, 165, 0.05)',
            },
          }}
        >
          취소
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
          sx={{
            backgroundColor: '#FFAAA5',
            '&:hover': {
              backgroundColor: '#FF9999',
            },
            boxShadow: '0 2px 4px rgba(255, 170, 165, 0.3)',
          }}
        >
          답글 작성
        </Button>
      </Box>
    </Box>
  );
};

export default ReplyForm;
