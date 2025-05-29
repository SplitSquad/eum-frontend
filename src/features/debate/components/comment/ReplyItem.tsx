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
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import FlagDisplay from '../../../../shared/components/FlagDisplay';

interface ReplyItemProps {
  reply: DebateReply;
  onUpdate: () => void;
}

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
    countryName
  } = reply;

  const { updateReply, deleteReply } = useDebateStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(initialContent); // 로컬에서 관리할 내용 상태

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
      alert('대댓글 수정 중 오류가 발생했습니다.');
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
    
    if (window.confirm('정말 답글을 삭제하시겠습니까?')) {
      try {
        setIsSubmitting(true);
        await deleteReply(id);
        
        // 리다이렉션 방지를 위해 onUpdate 호출 제거
        console.log('답글 삭제 성공 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
        // onUpdate();
      } catch (error) {
        console.error('답글 삭제 실패:', error);
        alert('답글 삭제 중 오류가 발생했습니다.');
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
          <Avatar 
            src={userProfileImage} 
            alt={userName}
            sx={{ width: 32, height: 32 }}
          >
            {userName.charAt(0)}
          </Avatar>
          
          {/* 내용 영역 */}
          <Box sx={{ flexGrow: 1 }}>
            {/* 작성자 정보 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" fontSize="0.85rem">
                  {userName}
                </Typography>
                
                {countryName && (
                  <FlagDisplay nation={countryName} size="small" inline={true} />
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatDateTime(createdAt)}
                  {getEditedMark(createdAt, updatedAt)}
                </Typography>
              </Box>
              
              <Box>
                <IconButton size="small" onClick={toggleEdit} sx={{ p: 0.5 }}>
                  <EditIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                </IconButton>
                <IconButton size="small" onClick={handleDelete} sx={{ p: 0.5 }}>
                  <DeleteIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              </Box>
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
                  onChange={(e) => setEditText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, fontSize: '0.85rem' }}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                  onClick={(e) => e.stopPropagation()}
                />
                <Stack 
                  direction="row" 
                  spacing={1} 
                  justifyContent="flex-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={cancelEdit}
                    sx={{ py: 0.25, px: 1, minWidth: 'auto', fontSize: '0.75rem' }}
                    disabled={isSubmitting}
                    disableRipple
                  >
                    취소
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={handleEdit}
                    sx={{ py: 0.25, px: 1, minWidth: 'auto', fontSize: '0.75rem' }}
                    disabled={isSubmitting}
                    disableRipple
                  >
                    {isSubmitting ? '저장 중...' : '저장'}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography variant="body2" fontSize="0.85rem" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
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
    </StyledCard>
  );
};

export default ReplyItem; 