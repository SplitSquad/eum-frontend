import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  IconButton,
  styled,
  Collapse,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  ThumbDown as ThumbDownIcon,
  ThumbDownOutlined as ThumbDownOutlinedIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 반응 타입 정의
type ReactionType = 'LIKE' | 'DISLIKE' | 'CANCEL' | null;

// 인터페이스 정의
interface Reply {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes?: number;
  isLiked: boolean;
  isDisliked?: boolean;
  myReaction?: ReactionType;
}

interface ReplySectionProps {
  commentId: number;
  initialReplies?: Reply[];
  onAddReply: (commentId: number, content: string) => Promise<boolean>;
  onLikeReply: (commentId: number, replyId: number) => Promise<void>;
  onDislikeReply?: (commentId: number, replyId: number) => Promise<void>;
}

// 스타일드 컴포넌트
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(255, 182, 193, 0.15)',
  background: 'linear-gradient(to right, #fff, #fff9f9)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    right: '-10px',
    width: '100px',
    height: '100px',
    backgroundImage:
      'radial-gradient(circle, rgba(255, 182, 193, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
    zIndex: 0,
  },
}));

const ReplyItem = styled(Box)(({ theme }) => ({
  padding: '12px',
  marginBottom: '8px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(255, 182, 193, 0.2)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
  },
}));

const ReplyInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '& fieldset': {
      borderColor: 'rgba(255, 182, 193, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 182, 193, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffb6c1',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  backgroundColor: '#ffb6c1',
  color: 'white',
  minWidth: '40px',
  padding: '6px 14px',
  '&:hover': {
    backgroundColor: '#ff8da1',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 182, 193, 0.3)',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const ToggleButton = styled(Button)(({ theme }) => ({
  color: '#ff8da1',
  fontSize: '0.85rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 182, 193, 0.08)',
  },
}));

const ReplySection: React.FC<ReplySectionProps> = ({
  commentId,
  initialReplies = [],
  onAddReply,
  onLikeReply,
  onDislikeReply,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [newReply, setNewReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReplies(initialReplies);
  }, [initialReplies]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddReply = async () => {
    if (!newReply.trim() || submitting) return;

    setSubmitting(true);
    try {
      const success = await onAddReply(commentId, newReply);
      if (success) {
        setNewReply('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = async (replyId: number) => {
    // 이미 좋아요 상태면 좋아요 취소
    const reply = replies.find(r => r.id === replyId);
    if (!reply) return;

    let updatedReplies: Reply[] = [...replies];

    try {
      // 이미 같은 반응이 있으면 취소
      if (reply.myReaction === 'LIKE') {
        // 좋아요 취소 로직
        updatedReplies = replies.map(r =>
          r.id === replyId ? { ...r, likes: r.likes - 1, isLiked: false, myReaction: null } : r
        ) as Reply[];
      }
      // 싫어요 상태였다면 싫어요 취소하고 좋아요 추가
      else if (reply.myReaction === 'DISLIKE') {
        updatedReplies = replies.map(r =>
          r.id === replyId
            ? {
                ...r,
                likes: r.likes + 1,
                dislikes: (r.dislikes || 0) - 1,
                isLiked: true,
                isDisliked: false,
                myReaction: 'LIKE',
              }
            : r
        ) as Reply[];
      }
      // 아무 반응도 없었던 경우, 좋아요 추가
      else {
        updatedReplies = replies.map(r =>
          r.id === replyId ? { ...r, likes: r.likes + 1, isLiked: true, myReaction: 'LIKE' } : r
        ) as Reply[];
      }

      // 먼저 UI 업데이트
      setReplies(updatedReplies);

      // 서버 요청 (에러가 발생해도 UI는 유지)
      await onLikeReply(commentId, replyId);
    } catch (error) {
      console.error('대댓글 좋아요 처리 중 오류 발생:', error);
      // 에러 발생 시 원래대로 복원하지 않고 UI 상태 유지
    }
  };

  const handleDislikeReply = async (replyId: number) => {
    if (!onDislikeReply) return;

    // 해당 댓글 찾기
    const reply = replies.find(r => r.id === replyId);
    if (!reply) return;

    let updatedReplies: Reply[] = [...replies];

    try {
      // 이미 싫어요 상태면 싫어요 취소
      if (reply.myReaction === 'DISLIKE') {
        updatedReplies = replies.map(r =>
          r.id === replyId
            ? { ...r, dislikes: (r.dislikes || 0) - 1, isDisliked: false, myReaction: null }
            : r
        ) as Reply[];
      }
      // 좋아요 상태였다면 좋아요 취소하고 싫어요 추가
      else if (reply.myReaction === 'LIKE') {
        updatedReplies = replies.map(r =>
          r.id === replyId
            ? {
                ...r,
                likes: r.likes - 1,
                dislikes: (r.dislikes || 0) + 1,
                isLiked: false,
                isDisliked: true,
                myReaction: 'DISLIKE',
              }
            : r
        ) as Reply[];
      }
      // 아무 반응도 없었던 경우, 싫어요 추가
      else {
        updatedReplies = replies.map(r =>
          r.id === replyId
            ? { ...r, dislikes: (r.dislikes || 0) + 1, isDisliked: true, myReaction: 'DISLIKE' }
            : r
        ) as Reply[];
      }

      // 먼저 UI 업데이트
      setReplies(updatedReplies);

      // 서버 요청 (에러가 발생해도 UI는 유지)
      await onDislikeReply(commentId, replyId);
    } catch (error) {
      console.error('대댓글 싫어요 처리 중 오류 발생:', error);
      // 에러 발생 시 원래대로 복원하지 않고 UI 상태 유지
    }
  };

  // 전체 내용 표시 여부를 토글
  const toggleContent = (replyId: number) => {
    // 실제 구현에서는 상태 관리를 통해 각 대댓글의 전체 내용 표시 여부를 관리
    console.log('Toggle content for reply:', replyId);
  };

  return (
    <StyledPaper>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          댓글에 달린 답글 {replies.length}개
        </Typography>
        <ToggleButton
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={handleToggleExpand}
        >
          {expanded ? '접기' : '펼치기'}
        </ToggleButton>
      </Box>

      <Collapse in={expanded}>
        <Box mb={2}>
          {replies.map(reply => (
            <ReplyItem key={reply.id}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <Avatar
                  src={reply.authorAvatar}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1.5,
                    border: '1px solid rgba(255, 182, 193, 0.3)',
                  }}
                >
                  {!reply.authorAvatar && reply.authorName.charAt(0)}
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="500">
                      {reply.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {formatDistanceToNow(reply.createdAt, { addSuffix: true, locale: ko })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                    {reply.content}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" ml={5.5} gap={1}>
                <Button
                  size="small"
                  variant={reply.myReaction === 'LIKE' ? 'contained' : 'outlined'}
                  startIcon={
                    reply.myReaction === 'LIKE' ? (
                      <ThumbUpIcon fontSize="small" />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="small" />
                    )
                  }
                  onClick={() => handleLikeReply(reply.id)}
                  sx={{
                    bgcolor:
                      reply.myReaction === 'LIKE' ? 'rgba(255, 170, 165, 0.2)' : 'transparent',
                    border: '1px solid rgba(255, 170, 165, 0.5)',
                    borderRadius: '20px',
                    color: '#666',
                    fontSize: '0.85rem',
                    padding: '4px 10px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 170, 165, 0.3)',
                    },
                  }}
                >
                  좋아요 {reply.likes || 0}
                </Button>

                <Button
                  size="small"
                  variant={reply.myReaction === 'DISLIKE' ? 'contained' : 'outlined'}
                  startIcon={
                    reply.myReaction === 'DISLIKE' ? (
                      <ThumbDownIcon fontSize="small" />
                    ) : (
                      <ThumbDownOutlinedIcon fontSize="small" />
                    )
                  }
                  onClick={() => handleDislikeReply(reply.id)}
                  sx={{
                    bgcolor:
                      reply.myReaction === 'DISLIKE' ? 'rgba(255, 170, 165, 0.2)' : 'transparent',
                    border: '1px solid rgba(255, 170, 165, 0.5)',
                    borderRadius: '20px',
                    color: '#666',
                    fontSize: '0.85rem',
                    padding: '4px 10px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 170, 165, 0.3)',
                    },
                  }}
                >
                  싫어요 {reply.dislikes || 0}
                </Button>
              </Box>
            </ReplyItem>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 182, 193, 0.2)', my: 2 }} />
      </Collapse>

      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#ffb6c1' }}>
          {/* 현재 사용자 이니셜 또는 아바타 */}U
        </Avatar>
        <ReplyInput
          fullWidth
          size="small"
          placeholder="답글을 입력하세요..."
          value={newReply}
          onChange={e => setNewReply(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddReply();
            }
          }}
        />
        <StyledButton
          disabled={submitting || !newReply.trim()}
          onClick={handleAddReply}
          endIcon={<SendIcon />}
        >
          등록
        </StyledButton>
      </Box>
    </StyledPaper>
  );
};

export default ReplySection;
