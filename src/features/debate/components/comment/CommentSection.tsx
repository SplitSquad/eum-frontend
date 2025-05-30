import React, { useState } from 'react';
import { useDebateStore } from '../../store';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Pagination from '../shared/Pagination';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SortIcon from '@mui/icons-material/Sort';
import { DebateComment } from '../../types';
import { useTranslation } from '@/shared/i18n';

interface CommentSectionProps {
  debateId: number;
}

// 스타일 컴포넌트
const CommentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  boxShadow: 'none',
  padding: theme.spacing(1, 2),
  fontSize: '0.9rem',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
  },
}));

const EmptyCommentsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  borderRadius: 8,
  backgroundColor: 'rgba(245, 245, 245, 0.7)',
}));

const CommentListContainer = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '& > div + div': {
    marginTop: theme.spacing(2),
  },
}));

const CommentSection: React.FC<CommentSectionProps> = ({ debateId }) => {
  const { comments, totalComments, commentPages, currentCommentPage, isLoading, getComments } =
    useDebateStore();
  const { t } = useTranslation();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [localComments, setLocalComments] = useState<DebateComment[]>([]);

  // 새 댓글 추가 성공 핸들러
  const handleCommentSuccess = (newComment: any) => {
    // 임시 ID인 경우 (음수) - 낙관적 UI 업데이트를 위한 로컬 댓글
    if (newComment && newComment.id < 0) {
      setLocalComments(prev => [newComment, ...prev]);
      setShowCommentForm(false);
    }
    // 서버에서 실제 데이터를 받은 경우 - API 호출 완료
    else {
      // 댓글 작성 폼 닫기
      setShowCommentForm(false);

      // 서버 데이터 다시 가져오기
      getComments(debateId, currentCommentPage || 1);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    // 페이지 변경 시 로컬 댓글 초기화
    setLocalComments([]);
    getComments(debateId, page);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSortBy(value);

    // 정렬 변경 시 로컬 댓글 초기화
    setLocalComments([]);

    // 서버에서 새로 데이터 가져오기 (정렬 옵션은 백엔드에서 처리)
    getComments(debateId, 1);
  };

  // 댓글이 없는 경우
  const renderEmptyComments = () => (
    <EmptyCommentsBox>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('debate.comment.empty')}
      </Typography>
      <ActionButton
        onClick={() => setShowCommentForm(true)}
        variant="contained"
        color="primary"
        startIcon={<AddCommentIcon />}
        sx={{ mt: 2 }}
      >
        {t('debate.comment.add')}
      </ActionButton>
    </EmptyCommentsBox>
  );

  // 서버 댓글과 로컬 댓글 통합
  const allComments = [...localComments, ...comments];

  return (
    <CommentContainer elevation={0}>
      <HeaderBox>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {totalComments + localComments.length} {t('debate.comment.reply')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* 정렬 옵션 선택 */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="comment-sort-label">{t('debate.comment.order')}</InputLabel>
            <Select
              labelId="comment-sort-label"
              value={sortBy}
              onChange={handleSortChange}
              label="정렬"
              startAdornment={<SortIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />}
            >
              <MenuItem value="latest">{t('debate.comment.newest')}</MenuItem>
              <MenuItem value="oldest">{t('debate.comment.oldest')}</MenuItem>
              <MenuItem value="popular">{t('debate.comment.mostLiked')}</MenuItem>
            </Select>
          </FormControl>

          {/* 댓글 작성 버튼 */}
          <ActionButton
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant="contained"
            color={showCommentForm ? 'inherit' : 'primary'}
            startIcon={<AddCommentIcon />}
            sx={{
              fontWeight: 'medium',
              boxShadow: showCommentForm ? 'none' : 2,
              '&:hover': {
                boxShadow: showCommentForm ? 'none' : 3,
              },
            }}
          >
            {showCommentForm ? t('debate.comment.cancel') : t('debate.comment.add')}
          </ActionButton>
        </Box>
      </HeaderBox>

      {/* 구분선 */}
      <Divider sx={{ mb: 3 }} />

      {/* 댓글 작성 폼 */}
      {showCommentForm && (
        <Box sx={{ mb: 4 }}>
          <CommentForm debateId={debateId} onSuccess={handleCommentSuccess} />
        </Box>
      )}

      {/* 댓글 목록 */}
      <Box sx={{ mt: 2 }}>
        {isLoading && comments.length === 0 && localComments.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" size={40} />
          </Box>
        ) : allComments.length === 0 ? (
          renderEmptyComments()
        ) : (
          <CommentListContainer spacing={3}>
            {allComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                debateId={debateId}
                onUpdate={() => {
                  // 댓글 목록 업데이트가 필요한 경우만 서버 API 호출 (댓글 삭제, 수정 등)
                  // 대댓글만 업데이트 되었을 때는 불필요한 댓글 목록 다시 로드 방지
                  // 제발 이거로 되어야만 한다....
                  console.log(
                    '댓글 업데이트 이벤트 발생 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨'
                  );

                  // 기존 코드를 주석 처리하여 불필요한 API 호출 방지
                  /*
                  console.log('댓글 업데이트 필요 - 목록 다시 불러오기');
                  if (currentCommentPage) {
                    getComments(debateId, currentCommentPage);
                  }
                  */
                }}
              />
            ))}
          </CommentListContainer>
        )}
      </Box>

      {/* 페이지네이션 */}
      {commentPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentCommentPage}
            totalPages={commentPages}
            onPageChange={handlePageChange}
            siblingCount={1} // 현재 페이지 양쪽의 페이지 번호 표시 개수
          />
        </Box>
      )}

      {/* 페이지 정보 표시 */}
      {/* {totalComments > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('debate.comment.total')} {totalComments}{' '}
            {currentCommentPage === 1 ? 1 : (currentCommentPage - 1) * 10 + 1}-
            {Math.min(currentCommentPage * 10, totalComments)} {t('debate.comment.of')}{' '}
          </Typography>
        </Box>
      )} */}
    </CommentContainer>
  );
};

export default CommentSection;
