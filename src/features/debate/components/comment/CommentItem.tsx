import React, { useState } from 'react';
import { DebateComment, ReactionType } from '../../types';
import { useDebateStore } from '../../store';
import ReactionButtons from '../shared/ReactionButtons';
import ReplyItem from './ReplyItem';
import ReplyForm from './ReplyForm';
import CommentApi from '../../api/commentApi';
import { formatDateTime, getEditedMark } from '../../../../utils/dateFormat';
import { 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  TextField, 
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
  Collapse,
  Divider,
  Stack,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FlagIcon from '@mui/icons-material/Flag';
import { grey } from '@mui/material/colors';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { reactToComment } from '../../api/debateApi';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
import { useAuthStore } from '../../../auth';

interface CommentItemProps {
  comment: DebateComment;
  onUpdate: () => void;
  debateId: number;
}

// 스타일 컴포넌트
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  cursor: 'default', // 기본 커서 스타일 설정
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  marginRight: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  cursor: 'default', // 기본 커서 스타일 설정
}));

const Username = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '0.9rem',
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: grey[600],
  fontSize: '0.8rem',
}));

const StanceChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'stance'
})<{ stance?: 'pro' | 'con' }>(({ theme, stance }) => ({
  borderRadius: 12,
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(stance === 'pro' ? {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    color: '#4caf50',
  } : {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
    color: '#f44336',
  }),
}));

const CountryChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  height: 24,
  fontSize: '0.75rem',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.secondary,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
}));

const ReplyButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
}));

const ReplyListContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));

const ReactionButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1.5),
  marginRight: theme.spacing(1),
  borderRadius: 20,
  textTransform: 'none',
}));

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, debateId }) => {
  // Safely destructure with defaults
  const { 
    id, 
    userId, 
    userName = '', 
    userProfileImage, 
    content = '', 
    createdAt = new Date().toISOString(), 
    updatedAt,
    reactions = { like: 0, dislike: 0 },
    stance,
    replyCount = 0,
    countryCode,
    countryName,
    isState,
  } = comment || {};

  // Store access
  const { getReplies = () => Promise.resolve(), createReply, deleteComment, replies = {} } = useDebateStore();
  
  // API 직접 호출
  const { updateComment } = CommentApi;

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 현재 사용자의 반응 상태 (myReaction이 없는 경우 대비)
  const myReaction = isState 
    ? (isState === '좋아요' ? ReactionType.LIKE : 
       isState === '싫어요' ? ReactionType.DISLIKE : undefined)
    : undefined;

  // 리액션 상태 관리
  const [likeButtonState, setLikeButtonState] = useState<'default' | 'primary'>(
    myReaction === ReactionType.LIKE ? 'primary' : 'default'
  );
  const [dislikeButtonState, setDislikeButtonState] = useState<'default' | 'error'>(
    myReaction === ReactionType.DISLIKE ? 'error' : 'default'
  );
  
  // 좋아요/싫어요 수 상태 관리
  const [likeCount, setLikeCount] = useState(reactions?.like || 0);
  const [dislikeCount, setDislikeCount] = useState(reactions?.dislike || 0);
  
  // 현재 사용자의 반응 상태
  const [currentReaction, setCurrentReaction] = useState<ReactionType | undefined>(myReaction);
  
  // 메뉴 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // 댓글 수정 핸들러 - 낙관적 UI 업데이트 적용
  const handleEdit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!editText.trim() || editText === content) {
      setIsEditing(false);
      setEditText(content);
      return;
    }
    
    setIsSubmitting(true);
    
    // 낙관적 UI 업데이트 (먼저 로컬 상태 업데이트)
    setLocalContent(editText);
    setIsEditing(false);
    
    try {
      // 백엔드 API 호출
      const success = await updateComment(id, editText);
      
      if (success) {
        // 성공 시 부모 컴포넌트에 알림 - 리다이렉션 방지를 위해 제거
        console.log('댓글 수정 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
        // onUpdate();
      } else {
        // 실패 시 원래 내용으로 복원
        setLocalContent(content);
        alert('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      setLocalContent(content);
      alert('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제 핸들러 - 낙관적 UI 업데이트는 어려움(삭제는 바로 UI에서 사라져야 함)
  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!window.confirm('정말로 댓글을 삭제하시겠습니까?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 백엔드 API 호출
      if (typeof deleteComment === 'function') {
        await deleteComment(id);
        // 성공 시 부모 컴포넌트에 알림 - 리다이렉션 방지를 위해 제거
        console.log('댓글 삭제 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
        // onUpdate();
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 답글 토글 함수 - 이벤트 전파 방지 추가
  const handleToggleReplies = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowReplies(!showReplies);
    
    // 답글이 있고, 아직 로드되지 않았을 때만 API 호출
    if (!showReplies && replyCount > 0) {
      const loadReplies = async (): Promise<void> => {
        // 이미 replies 객체에 해당 댓글에 대한 답글이 있는지 확인
        if (!replies || !id || !replies[id] || replies[id].length === 0) {
          setIsReplyLoading(true);
          try {
            if (typeof getReplies === 'function') {
              // 서버에서 대댓글 가져오기
              await getReplies(id);
            }
          } catch (error) {
            console.error('답글 로딩 오류:', error);
          } finally {
            setIsReplyLoading(false);
          }
        } else {
          // 이미 로드된 경우 로딩 표시 필요 없음
          console.log(`댓글 ${id}의 대댓글이 이미 로드되어 있어 서버 호출 생략`);
        }
      };
      
      // 대댓글 로드
      loadReplies().catch(error => console.error('답글 로딩 실패:', error));
    }
  };

  // 답글 작성 폼 토글 함수 - 이벤트 전파 방지 추가
  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowReplyForm(!showReplyForm);
    if (!showReplies && showReplyForm === false) {
      setShowReplies(true);
    }
  };

  // 답글 제출 함수
  const submitReply = async (replyContent: string): Promise<void> => {
    if (!replyContent.trim()) return;
    
    try {
      // 서버에 답글 제출
      if (typeof createReply === 'function' && id && debateId) {
        // 답글 작성 중임을 표시하는 로딩 상태 설정
        setIsSubmitting(true);
        
        try {
          // 답글 생성 API 호출 - store의 createReply 함수 사용
          await createReply(id, replyContent);
          
          // 성공적으로 생성되면 답글 폼 닫기
          setShowReplyForm(false);
          
          // 답글 목록 펼치기
          setShowReplies(true);
          
          // 부모 컴포넌트에 변경 알림 - 리다이렉션 방지를 위해 제거
          // onUpdate();
        } catch (error) {
          console.error('답글 생성 API 호출 실패:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 아이템의 클릭 이벤트를 막아 부모 컴포넌트로의 전파 방지
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 사용자 정보
  const { user } = useAuthStore();

  // 안전하게 댓글 목록 가져오기
  const commentReplies = replies && id && replies[id] ? replies[id] : [];

  // 메뉴 열기
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 댓글 좋아요/싫어요 처리
  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (!id) return;
      
      // 백엔드 API 호출 
      const reactionType = type === 'like' ? ReactionType.LIKE : ReactionType.DISLIKE;
      
      // 먼저 UI 상태 업데이트 (낙관적 UI 업데이트)
      // 이미 같은 상태면 취소
      if (currentReaction === reactionType) {
        setCurrentReaction(undefined);
        if (type === 'like') {
          setLikeCount(prevCount => Math.max(0, prevCount - 1));
          setLikeButtonState('default');
        } else {
          setDislikeCount(prevCount => Math.max(0, prevCount - 1));
          setDislikeButtonState('default');
        }
      } 
      // 다른 상태로 변경
      else {
        // 이전에 다른 버튼이 활성화되어 있었다면 취소
        if (currentReaction === ReactionType.LIKE && type === 'dislike') {
          setLikeCount(prevCount => Math.max(0, prevCount - 1));
          setLikeButtonState('default');
          setDislikeCount(prevCount => prevCount + 1);
          setDislikeButtonState('error');
        } else if (currentReaction === ReactionType.DISLIKE && type === 'like') {
          setDislikeCount(prevCount => Math.max(0, prevCount - 1));
          setDislikeButtonState('default');
          setLikeCount(prevCount => prevCount + 1);
          setLikeButtonState('primary');
        } else {
          // 기존 상태가 없는 경우
          if (type === 'like') {
            setLikeCount(prevCount => prevCount + 1);
            setLikeButtonState('primary');
          } else {
            setDislikeCount(prevCount => prevCount + 1);
            setDislikeButtonState('error');
          }
        }
        setCurrentReaction(reactionType);
      }
        
      // 서버 API 호출
      const response = await reactToComment(id, reactionType);
      
      // 서버 응답 처리
      if (response) {
        const { like = 0, dislike = 0 } = response;
        
        // UI 상태 업데이트
        setLikeCount(like);
        setDislikeCount(dislike);
        
        // API 응답 구조에 따라 isState가 존재하는지 확인
        if ('isState' in response) {
          const newState = response.isState ? 
            (response.isState === '좋아요' ? ReactionType.LIKE : 
             response.isState === '싫어요' ? ReactionType.DISLIKE : undefined) 
            : undefined;
          
          setCurrentReaction(newState);
          
          // 버튼 상태 업데이트
          setLikeButtonState(newState === ReactionType.LIKE ? 'primary' : 'default');
          setDislikeButtonState(newState === ReactionType.DISLIKE ? 'error' : 'default');
        }
      }
    } catch (error) {
      console.error('댓글 반응 처리 실패:', error);
      // 에러 발생 시 UI 상태 복원 로직 구현 가능
    }
  };

  // 내가 작성한 댓글인지 확인
  const isMyComment = (authorId?: number) => {
    if (!authorId || !user?.id) return false;
    return authorId === (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id);
  };

  // 내가 작성한 답글인지 확인 
  const isMyReply = (replyAuthorId?: number) => {
    if (!replyAuthorId || !user?.id) return false;
    return replyAuthorId === (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id);
  };

  // 메뉴 아이콘 표시 여부 - 사용자 확인 로직 간소화
  const isAuthor = user && userId !== undefined && 
    user.id !== undefined && String(user.id) === String(userId);

  return (
    <StyledCard variant="outlined" onClick={handleCardClick}>
      <CardHeader
        avatar={
          <Avatar src={userProfileImage} alt={userName} onClick={(e) => { e.stopPropagation(); }}>
            {userName ? userName.charAt(0) : '?'}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            <Typography variant="subtitle2">{userName || '익명'}</Typography>
            {countryName && (
              <CountryChip 
                icon={<FlagIcon fontSize="small" />} 
                label={countryName}
                size="small"
              />
            )}
            {stance && (
              <StanceChip 
                label={stance === 'pro' ? '찬성' : '반대'}
                stance={stance}
                size="small"
              />
            )}
          </Box>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(createdAt)}
            {getEditedMark(createdAt, updatedAt)}
          </Typography>
        }
        action={
          <Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsEditing(true); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDelete(); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent sx={{ py: 1 }} onClick={(e) => { e.stopPropagation(); }}>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsEditing(false);
                  setEditText(content);
                }}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button 
                variant="contained" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleEdit();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {localContent}
          </Typography>
        )}
      </CardContent>
      
      <CardActions 
        sx={{ flexWrap: 'wrap', px: 2, pb: 1.5, pt: 0 }}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <ReactionButtons 
            targetId={id} 
            targetType="comment" 
            reactions={reactions}
            isState={comment.isState}
            size="sm"
          />
        </Box>
        
        <Box>
          <ActionButton
            size="small"
            startIcon={<ReplyIcon />}
            onClick={handleReplyClick}
            color={showReplyForm ? "secondary" : "primary"}
          >
            {showReplyForm ? '취소' : '답글 작성'}
          </ActionButton>
          
          {replyCount > 0 && (
            <ActionButton
              size="small"
              startIcon={showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleToggleReplies}
              color="inherit"
              sx={{ pointerEvents: 'auto' }}
            >
              {showReplies ? '답글 숨기기' : `답글 ${replyCount}개`}
            </ActionButton>
          )}
        </Box>
      </CardActions>
      
      {/* 답글 작성 폼 */}
      <Collapse in={showReplyForm} timeout="auto" unmountOnExit onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
        <Box sx={{ px: 2, pb: 2 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
          <ReplyForm 
            commentId={id} 
            onSuccess={() => {
              setShowReplyForm(false);
              getReplies(id);
              // 리다이렉션 방지를 위해 onUpdate 호출 제거
              // onUpdate();
            }}
          />
        </Box>
      </Collapse>
      
      {/* 답글 목록 */}
      <Collapse in={showReplies} timeout="auto" unmountOnExit onClick={(e) => { e.stopPropagation(); }}>
        <ReplyListContainer>
          {isReplyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <CircularProgress size={16} thickness={4} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">답글을 불러오는 중...</Typography>
            </Box>
          ) : commentReplies.length > 0 ? (
            <Stack spacing={1.5}>
              {commentReplies.map((reply: any) => (
                <ReplyItem 
                  key={reply.id} 
                  reply={reply} 
                  onUpdate={() => {
                    getReplies(id);
                    // 리다이렉션 방지를 위해 onUpdate 호출 제거
                    // onUpdate();
                  }} 
                />
              ))}
            </Stack>
          ) : replyCount > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">답글을 불러오는 중...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">등록된 답글이 없습니다</Typography>
            </Box>
          )}
        </ReplyListContainer>
      </Collapse>
    </StyledCard>
  );
};

export default CommentItem; 