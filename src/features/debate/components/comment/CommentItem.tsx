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
  MenuItem,
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
import ReportDialog, {
  ReportTargetType,
  ServiceType,
} from '../../../common/components/ReportDialog';
import FlagDisplay from '../../../../shared/components/FlagDisplay';
import FlagIconSvg from '@/shared/components/FlagIconSvg';
//import 'flag-icons/css/flag-icons.min.css';

interface CommentItemProps {
  comment: DebateComment;
  onUpdate: () => void;
  debateId: number;
}

// User 타입 정의가 있다면 아래와 같이 수정
interface User {
  id?: number | string;
  userId?: number | string;
  nickname?: string;
  name?: string;
  profileImage?: string;
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
  shouldForwardProp: prop => prop !== 'stance',
})<{ stance?: 'pro' | 'con' | null }>(({ theme, stance }) => ({
  borderRadius: 16,
  height: 26,
  fontSize: '0.75rem',
  fontWeight: 700,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
  },
  ...(stance === 'pro'
    ? {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        color: '#2e7d32',
        border: '1px solid rgba(76, 175, 80, 0.5)',
      }
    : stance === 'con'
      ? {
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#d32f2f',
          border: '1px solid rgba(244, 67, 54, 0.5)',
        }
      : {
          backgroundColor: 'rgba(158, 158, 158, 0.15)',
          color: '#616161',
          border: '1px solid rgba(158, 158, 158, 0.5)',
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
    nation,
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

  // content에서 stance 정보 추출
  let extractedStance: 'pro' | 'con' | null =
    stance === 'pro' ? 'pro' : stance === 'con' ? 'con' : null;
  let displayContent = content || '';

  // 댓글 내용에서 stance 프리픽스 확인 및 추출
  // if (displayContent.startsWith('【반대】')) {
  //   extractedStance = 'con';
  //   displayContent = displayContent.replace('【반대】 ', '');
  // } else if (displayContent.startsWith('【찬성】')) {
  //   extractedStance = 'pro';
  //   displayContent = displayContent.replace('【찬성】 ', '');
  // }

  // localContent는 이미 초기값으로 설정되었으므로 추가 작업 필요 없음

  // 추가 디버그 로그
  // console.log(
  //   `[DEBUG] 토론 댓글 ID: ${id}, 작성자 ID: ${userId}, 작성자 이름: ${userName}, 찬반 입장: ${extractedStance}, 원본: ${content}, 표시: ${displayContent}, 국가 코드: ${nation}, `
  // );

  // Store access
  const {
    getReplies = () => Promise.resolve(),
    createReply,
    deleteComment,
    replies = {},
  } = useDebateStore();

  // API 직접 호출
  const { updateComment } = CommentApi;

  // Auth store
  const { user } = useAuthStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(displayContent);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [localContent, setLocalContent] = useState(displayContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Report dialog states
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const navigate = useNavigate();
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 현재 사용자의 반응 상태 (myReaction이 없는 경우 대비)
  const myReaction = isState
    ? isState === '좋아요'
      ? ReactionType.LIKE
      : isState === '싫어요'
        ? ReactionType.DISLIKE
        : undefined
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
  const [currentReaction, setCurrentReaction] = useState<ReactionType | undefined>(myReaction);

  // 내가 작성한 댓글인지 확인
  const isMyComment = (authorId?: number) => {
    if (!authorId || !((user as any)?.id ?? (user as any)?.userId)) return false;
    return (
      authorId ===
      (typeof ((user as any)?.id ?? (user as any)?.userId) === 'string'
        ? parseInt(((user as any)?.id ?? (user as any)?.userId) as string, 10)
        : ((user as any)?.id ?? (user as any)?.userId))
    );
  };

  // 내가 작성한 답글인지 확인
  const isMyReply = (replyAuthorId?: number) => {
    if (!replyAuthorId || !((user as any)?.id ?? (user as any)?.userId)) return false;
    return (
      replyAuthorId ===
      (typeof ((user as any)?.id ?? (user as any)?.userId) === 'string'
        ? parseInt(((user as any)?.id ?? (user as any)?.userId) as string, 10)
        : ((user as any)?.id ?? (user as any)?.userId))
    );
  };

  // 메뉴 관련 핸들러
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 신고 대화상자 핸들러
  const handleOpenReportDialog = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 신고 전 userId 확인
    console.log(`[DEBUG] 신고 대상 작성자 정보:`, {
      userId,
      id,
      userName,
      commentUserId: comment.userId,
    });

    // API에서 직접 받은 댓글 작성자 ID 사용 (없으면 0으로 대체)
    const reportedUserId = comment.userId || userId || 0;
    console.log(`[DEBUG] 신고에 사용될 작성자 ID: ${reportedUserId}`);

    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  // 현재 사용자가 작성자이거나 관리자인지 확인
  const isMyCommentOrAdmin =
    userId &&
    ((user && ((user as any)?.id ?? (user as any)?.userId) === userId) || // 작성자인 경우
      (user && user.role === 'ROLE_ADMIN')); // 관리자인 경우

  // 댓글 수정 핸들러 - 낙관적 UI 업데이트 적용
  const handleEdit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!editText.trim() || editText === displayContent) {
      setIsEditing(false);
      setEditText(displayContent);
      return;
    }

    setIsSubmitting(true);

    // 낙관적 UI 업데이트 (먼저 로컬 상태 업데이트)
    setLocalContent(editText);
    setIsEditing(false);

    try {
      // 댓글 수정 시 순수한 내용만 전송 (stance 접두사 제거)
      const updatedContent = editText; // 접두사 없이 순수한 내용만 사용

      // 백엔드 API 호출
      const success = await updateComment(id, updatedContent);

      if (success) {
        // 성공 시 부모 컴포넌트에 알림 - 리다이렉션 방지를 위해 제거
        console.log('댓글 수정 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
        // onUpdate();
      } else {
        // 실패 시 원래 내용으로 복원
        setLocalContent(displayContent);
        alert('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      setLocalContent(displayContent);
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

  // 안전하게 댓글 목록 가져오기
  const commentReplies = replies && id && replies[id] ? replies[id] : [];

  return (
    <StyledCard variant="outlined" onClick={handleCardClick}>
      <CardHeader
        avatar={
          <Avatar
            src={userProfileImage}
            alt={userName}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {userName ? userName.charAt(0) : '?'}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            <Typography variant="subtitle2">{userName || '익명'}</Typography>

            {/* 국가/국기 표시 */}
            {nation && (
              <FlagDisplay nation={nation} size="small" showName={false} sx={{ mr: 0.5 }} />
            )}

            {/* 입장 표시 - 댓글 내용에서 추출한 stance 사용 */}
            <StanceChip
              label={
                extractedStance === 'con' ? '반대' : extractedStance === 'pro' ? '찬성' : '미투표'
              }
              stance={extractedStance || undefined}
              size="small"
            />
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
            {user &&
              (isMyCommentOrAdmin ? (
                <IconButton size="small" onClick={handleMenuOpen} aria-label="더 보기">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenReportDialog();
                  }}
                  aria-label="신고"
                  sx={{ '&:hover': { color: 'error.main' } }}
                >
                  <FlagIcon fontSize="small" />
                </IconButton>
              ))}

            {/* 댓글 메뉴 */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={e => e.stopPropagation()}
            >
              <MenuItem
                onClick={e => {
                  e.stopPropagation();
                  handleMenuClose();
                  setIsEditing(true);
                }}
              >
                수정
              </MenuItem>
              <MenuItem
                onClick={e => {
                  e.stopPropagation();
                  handleMenuClose();
                  handleDelete();
                }}
              >
                삭제
              </MenuItem>
            </Menu>
          </Box>
        }
      />

      <CardContent
        sx={{ py: 1 }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={e => {
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
                onClick={e => {
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
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
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
            color={showReplyForm ? 'secondary' : 'primary'}
            type="button"
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
              type="button"
            >
              {showReplies ? '답글 숨기기' : `답글 ${replyCount}개`}
            </ActionButton>
          )}
        </Box>
      </CardActions>

      {/* 답글 작성 폼 */}
      <Collapse
        in={showReplyForm}
        timeout="auto"
        unmountOnExit
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Box
          sx={{ px: 2, pb: 2 }}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
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
      <Collapse
        in={showReplies}
        timeout="auto"
        unmountOnExit
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <ReplyListContainer>
          {isReplyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <CircularProgress size={16} thickness={4} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                답글을 불러오는 중...
              </Typography>
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
              <Typography variant="body2" color="text.secondary">
                답글을 불러오는 중...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                등록된 답글이 없습니다
              </Typography>
            </Box>
          )}
        </ReplyListContainer>
      </Collapse>

      {/* 신고 다이얼로그 */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        targetId={id}
        targetType={'COMMENT'}
        serviceType={'DEBATE'}
        reportedUserId={comment.userId || userId || 0}
      />
    </StyledCard>
  );
};

export default CommentItem;
