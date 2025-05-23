import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag'; // 신고 아이콘 추가
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import useCommunityStore from '../../store/communityStore';
import { Comment, User, ReactionType } from '../../types';
import useAuthStore from '../../../auth/store/authStore';
import ReplyForm from '../ReplyForm';
import ReportDialog, { ReportTargetType } from '../../../common/components/ReportDialog';
import { useComments } from '../../hooks';

// 스타일링된 컴포넌트
const CommentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const ReplyBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginLeft: theme.spacing(6),
  marginBottom: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 250, 250, 0.7)',
  borderLeft: '2px solid #FFAAA5',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 250, 250, 0.9)',
  },
}));

const ReactionButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#888',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  color: '#888',
  textTransform: 'none',
  fontSize: '0.75rem',
  padding: '2px 8px',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(255, 170, 165, 0.1)',
  },
}));

interface CommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
  parentId?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  isReply = false,
  parentId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // 신고 다이얼로그 관련 상태
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // 커스텀 훅 사용
  const { updateComment, deleteComment, replyComment, reactToComment } = useComments(postId);

  // 기존 스토어 사용 (훅으로 대체되지 않은 기능이 있을 수 있음)
  const communityStore = useCommunityStore();
  const { user: currentUser } = useAuthStore();

  // 현재 사용자가 댓글 작성자인지 확인
  const isCommentAuthor =
    ((currentUser as any)?.id ?? (currentUser as any)?.userId)?.toString() ===
    ((comment.writer as any)?.id ?? (comment.writer as any)?.userId)?.toString();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleMenuClick 실행됨', isCommentAuthor);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReplyButtonClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReaction = async (type: ReactionType) => {
    try {
      if (!currentUser) {
        alert('좋아요/싫어요를 남기려면 로그인이 필요합니다.');
        return;
      }

      console.log(`댓글 ${type} 반응 추가 시도:`, { commentId: comment.commentId, type });

      // 커스텀 훅 사용
      await reactToComment(comment.commentId, type);
    } catch (error) {
      console.error('댓글 반응 추가 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!isCommentAuthor) {
        alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
        return;
      }

      // 커스텀 훅 사용
      await deleteComment(comment.commentId);
      handleMenuClose();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleToggleReplies = () => {
    setRepliesVisible(!repliesVisible);
  };

  const handleEditStart = () => {
    setEditMode(true);
    setEditedContent(comment.content);
    console.log('handleEditStart', comment.content);
    handleMenuClose();
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  const handleEditSubmit = async () => {
    if (editedContent.trim()) {
      try {
        // 커스텀 훅 사용
        await updateComment(comment.commentId, editedContent.trim());
        setEditMode(false);
      } catch (error) {
        console.error('댓글 수정 실패:', error);
      }
    }
  };

  const handleReplyFormClose = () => {
    setShowReplyForm(false);
  };

  // 신고 다이얼로그 열기
  const handleOpenReportDialog = () => {
    if (!comment.writer?.userId) {
      console.error('댓글 작성자 정보가 없습니다.');
      return;
    }
    setReportDialogOpen(true);
  };

  // 신고 다이얼로그 닫기
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  const formattedDate = comment.createdAt
    ? format(new Date(comment.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
    : '날짜 없음';

  const CommentContainer = isReply ? ReplyBox : CommentBox;

  return (
    <>
      <CommentContainer>
        {/* 댓글 헤더 (작성자 정보) */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={comment.writer?.profileImage}
              alt={comment.writer?.nickname || '사용자'}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#555' }}>
                {comment.writer?.nickname || '사용자'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {formattedDate} {isReply && <span style={{ color: '#FFAAA5' }}>(답글)</span>}
              </Typography>
            </Box>
          </Box>

          {isCommentAuthor && (
            <IconButton size="small" onClick={handleMenuClick} sx={{ color: '#888' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleEditStart} sx={{ color: '#2196F3' }}>
              수정하기
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
              삭제하기
            </MenuItem>
          </Menu>
        </Box>

        {/* 댓글 내용 */}
        {editMode ? (
          <Box sx={{ mt: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
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
                onClick={handleEditCancel}
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
                onClick={handleEditSubmit}
                disabled={!editedContent.trim()}
                sx={{
                  backgroundColor: '#FFAAA5',
                  '&:hover': {
                    backgroundColor: '#FF9999',
                  },
                  boxShadow: '0 2px 4px rgba(255, 170, 165, 0.3)',
                }}
              >
                수정완료
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              mb: 1,
            }}
          >
            {comment.content}
          </Typography>
        )}

        {/* 댓글 푸터 (좋아요, 답글) */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <ReactionButton size="small" onClick={() => handleReaction(ReactionType.LIKE)}>
              {comment.myReaction === ReactionType.LIKE ? (
                <ThumbUpIcon fontSize="small" sx={{ color: '#4CAF50' }} />
              ) : (
                <ThumbUpAltOutlinedIcon fontSize="small" />
              )}
            </ReactionButton>
            <Typography variant="caption" sx={{ mx: 0.5, color: '#888' }}>
              {comment.likeCount || 0}
            </Typography>

            <ReactionButton size="small" onClick={() => handleReaction(ReactionType.DISLIKE)}>
              {comment.myReaction === ReactionType.DISLIKE ? (
                <ThumbDownIcon fontSize="small" sx={{ color: '#F44336' }} />
              ) : (
                <ThumbDownAltOutlinedIcon fontSize="small" />
              )}
            </ReactionButton>
            <Typography variant="caption" sx={{ mx: 0.5, color: '#888' }}>
              {comment.dislikeCount || 0}
            </Typography>
          </Box>

          <ActionButton
            startIcon={<ReplyIcon fontSize="small" />}
            onClick={handleReplyButtonClick}
            variant="text"
            sx={{
              backgroundColor: showReplyForm ? 'rgba(255, 170, 165, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 170, 165, 0.2)',
              },
              mr: 1,
            }}
          >
            답글 작성 {comment.replies?.length ? `(${comment.replies.length})` : ''}
          </ActionButton>

          {/* 신고 버튼 - 작성자가 아닌 경우에만 표시 */}
          {currentUser && !isCommentAuthor && (
            <ActionButton
              startIcon={<FlagIcon fontSize="small" />}
              onClick={handleOpenReportDialog}
              variant="text"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(245, 124, 0, 0.1)',
                  color: '#f57c00',
                },
              }}
            >
              신고
            </ActionButton>
          )}
        </Box>

        {/* 새로운 ReplyForm 컴포넌트 사용 */}
        {showReplyForm && (
          <ReplyForm postId={postId} commentId={comment.commentId} onClose={handleReplyFormClose} />
        )}
      </CommentContainer>

      {/* 대댓글 목록 */}
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <>
          {comment.replies.length > 0 && (
            <Box sx={{ pl: 2, mb: 1 }}>
              <ActionButton onClick={handleToggleReplies} sx={{ ml: 4 }}>
                {repliesVisible ? '답글 숨기기' : `${comment.replies.length}개의 답글 보기`}
              </ActionButton>
            </Box>
          )}

          <Collapse in={repliesVisible}>
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.commentId}
                comment={reply}
                postId={postId}
                isReply={true}
                parentId={comment.commentId}
              />
            ))}
          </Collapse>
        </>
      )}

      {/* 신고 다이얼로그 */}
      {comment.writer?.userId && (
        <ReportDialog
          open={reportDialogOpen}
          onClose={handleCloseReportDialog}
          targetId={comment.commentId}
          targetType={isReply ? 'REPLY' : 'COMMENT'}
          serviceType="COMMUNITY"
          reportedUserId={Number(comment.writer.userId)}
        />
      )}
    </>
  );
};

export default CommentItem;
