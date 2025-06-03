import React, { useState } from 'react';
import { DebateReply } from '../../types';
import { useDebateStore } from '../../store';
import ReactionButtons from '../shared/ReactionButtons';
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
  Chip,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlagDisplay from '../../../../shared/components/FlagDisplay';
import { useAuthStore } from '../../../auth';
import ReportDialog, {
  ReportTargetType,
  ServiceType,
} from '../../../common/components/ReportDialog';
import { useTranslation } from '@/shared/i18n';

interface ReplyItemProps {
  reply: DebateReply;
  onUpdate: () => void;
}

const { t } = useTranslation();
// 스타일 컴포넌트
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  transition: 'all 0.2s ease',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

const CountryChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  height: 20,
  fontSize: '0.7rem',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.secondary,
}));

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onUpdate }) => {
  const {
    id,
    userId,
    userName,
    userProfileImage,
    content: initialContent,
    createdAt,
    updatedAt,
    reactions,
    countryCode,
    countryName,
    stance,
    nation,
  } = reply;

  const { updateReply, deleteReply } = useDebateStore();
  const { user } = useAuthStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(initialContent); // 로컬에서 관리할 내용 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // content에서 stance 정보 추출
  let extractedStance: 'pro' | 'con' | null =
    stance === 'pro' ? 'pro' : stance === 'con' ? 'con' : null;

  // 내가 작성한 답글인지 확인
  const isMyReply = userId && ((user as any)?.id ?? (user as any)?.userId) === userId;

  // 관리자 권한 확인
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // 수정/삭제 권한 확인 (본인 또는 관리자)
  const canEditOrDelete = isMyReply || isAdmin;

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
      alert('Login is required.');
      return;
    }
    setReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  // 대댓글 수정 핸들러
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

    // 수정 직후 UI 먼저 업데이트 (낙관적 UI 업데이트)
    const originalContent = content;

    try {
      // 낙관적 UI 업데이트 - 먼저 로컬 상태 업데이트
      setContent(editText);
      setIsEditing(false);

      // 수정 작업은 동기적으로 완료될 때까지 기다림
      const result = await updateReply(id, editText);
      console.log('답글 수정 완료:', result);

      // 부모 컴포넌트에 변경 알림 - 리다이렉션 방지를 위해 제거
      console.log('답글 수정 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
      // onUpdate();
    } catch (error) {
      console.error('대댓글 수정 실패:', error);
      alert('An error occurred while editing reply.');
      // 실패 시 원래 내용으로 복원
      setContent(originalContent);
      setEditText(originalContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 대댓글 삭제 핸들러
  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        setIsSubmitting(true);
        await deleteReply(id);

        // 리다이렉션 방지를 위해 onUpdate 호출 제거
        console.log('답글 삭제 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
        // onUpdate();
      } catch (error) {
        console.error('답글 삭제 실패:', error);
        alert('An error occurred while deleting reply.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 편집 모드 토글
  const toggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    handleMenuClose();
  };

  // 편집 취소
  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditText(content);
  };

  // 키보드 이벤트 핸들러 (Ctrl+Enter로 제출)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      handleEdit();
    }
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* 프로필 영역 */}
          <Avatar src={userProfileImage} alt={userName} sx={{ width: 32, height: 32 }}>
            {userName.charAt(0)}
          </Avatar>

          {/* 내용 영역 */}
          <Box sx={{ flexGrow: 1 }}>
            {/* 작성자 정보 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" fontSize="0.85rem">
                  {userName}
                </Typography>

                {/* 국가/국기 표시 */}
                {nation && (
                  <FlagDisplay nation={nation} size="small" showName={false} sx={{ mr: 0.5 }} />
                )}

                {/* 입장 표시 - 댓글 내용에서 추출한 stance 사용 */}
                <StanceChip
                  label={
                    extractedStance === 'con'
                      ? t('debate.reply.con')
                      : extractedStance === 'pro'
                        ? t('debate.reply.pro')
                        : t('debate.reply.none')
                  }
                  stance={extractedStance || undefined}
                  size="small"
                />

                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatDateTime(createdAt)}
                  {getEditedMark(createdAt, updatedAt)}
                </Typography>
              </Box>

              {/* 본인이 작성했거나 관리자인 경우 수정/삭제 버튼, 아니면 신고 버튼 */}
              {user && (
                <>
                  {canEditOrDelete ? (
                    <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                      <MoreVertIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={handleOpenReportDialog}
                      sx={{
                        p: 0.5,
                        '&:hover': {
                          color: 'error.main',
                        },
                      }}
                    >
                      <FlagIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  )}
                </>
              )}

              {/* 수정/삭제 메뉴 */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={e => e.stopPropagation()}
              >
                <MenuItem onClick={toggleEdit}>Edit</MenuItem>
                <MenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleMenuClose();
                    handleDelete();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Box>

            {/* 댓글 내용 */}
            {isEditing ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, fontSize: '0.85rem' }}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                  onClick={e => e.stopPropagation()}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="flex-end"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelEdit}
                    sx={{ py: 0.25, px: 1, minWidth: 'auto', fontSize: '0.75rem' }}
                    disabled={isSubmitting}
                    disableRipple
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleEdit}
                    sx={{ py: 0.25, px: 1, minWidth: 'auto', fontSize: '0.75rem' }}
                    disabled={isSubmitting}
                    disableRipple
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography
                variant="body2"
                fontSize="0.85rem"
                color="text.primary"
                sx={{ whiteSpace: 'pre-wrap' }}
              >
                {content}
              </Typography>
            )}

            {/* 감정표현 */}
            <Box sx={{ mt: 1 }}>
              <ReactionButtons
                targetId={id}
                targetType="reply"
                reactions={reactions}
                isState={reply.isState}
                size="sm"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>

      {/* 신고 다이얼로그 */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        targetId={id}
        targetType={'REPLY'}
        serviceType={'DEBATE'}
        reportedUserId={userId || 0}
      />
    </StyledCard>
  );
};

export default ReplyItem;
