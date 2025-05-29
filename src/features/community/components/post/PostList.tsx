import React, { useEffect, useState, useRef } from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Pagination,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';

import PostCard from './PostCard';
import { PostSummary } from '../../types-folder';
import { usePostStore } from '../../store/postStore';
import { useTranslation } from '../../../../shared/i18n';
import { useLanguageStore } from '../../../../features/theme/store/languageStore';

// PostList Props 타입 정의
interface PostListProps {
  title?: string;
  posts?: PostSummary[];
  loading?: boolean;
  error?: string | null;
  showPagination?: boolean;
  emptyMessage?: string;
  onCardClick?: (post: PostSummary) => void;
  hideImage?: boolean;
}

// 스타일 컴포넌트
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: 0,
  minHeight: '400px', // 최소 높이 보장
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
}));

/**
 * 게시글 목록 컴포넌트 (최적화 버전)
 * 게시글 카드를 그리드 형태로 표시하며 부드러운 전환 제공
 */
const PostList: React.FC<PostListProps> = ({
  title,
  posts: propPosts,
  loading: propLoading,
  error: propError,
  showPagination = true,
  emptyMessage,
  onCardClick,
  hideImage = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 스토어에서 상태와 액션을 가져옴
  const {
    posts: storePosts,
    postLoading,
    postError,
    postPageInfo,
    postFilter,
    setPostFilter,
    fetchPosts,
  } = usePostStore();

  // 현재 페이지 로컬 상태 (UI 표시용)
  const [currentPage, setCurrentPage] = useState(1);

  // 언어 변경 감지를 위한 상태
  const { language } = useLanguageStore();
  const [lastLanguage, setLastLanguage] = useState(language);

  // 이전 데이터 보존을 위한 상태 (깜빡임 방지)
  const [displayPosts, setDisplayPosts] = useState<PostSummary[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 초기 로드 추적
  const hasInitialLoad = useRef(false);

  // 실제 사용할 데이터 결정
  const posts = propPosts || storePosts;
  const loading = propLoading !== undefined ? propLoading : postLoading;
  const error = propError !== undefined ? propError : postError;

  // 언어 변경 시 초기 로드 상태 초기화
  useEffect(() => {
    if (language !== lastLanguage) {
      console.log('[DEBUG] PostList - 언어 변경으로 상태 초기화');
      hasInitialLoad.current = false;
      setLastLanguage(language);
    }
  }, [language, lastLanguage]);

  // 게시글 데이터 변경 시 표시 데이터 업데이트 (부드러운 전환)
  useEffect(() => {
    if (!loading && posts && posts.length > 0) {
      // 로딩이 끝나고 새 데이터가 있으면 업데이트
      setDisplayPosts(posts);
      setIsTransitioning(false);
      hasInitialLoad.current = true;
    } else if (loading && displayPosts.length > 0) {
      // 로딩 중이지만 기존 데이터가 있으면 전환 상태로 설정
      setIsTransitioning(true);
    } else if (!loading && (!posts || posts.length === 0) && !hasInitialLoad.current) {
      // 첫 로드에서 데이터가 없으면 빈 배열
      setDisplayPosts([]);
      hasInitialLoad.current = true;
    }
  }, [posts, loading]);

  // postPageInfo가 변경될 때 현재 페이지 업데이트
  useEffect(() => {
    if (!propPosts) {
      const uiPage = postPageInfo.page + 1;
      setCurrentPage(uiPage);
    }
  }, [propPosts, postPageInfo]);

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    if (propPosts) return; // 외부 데이터 사용 시 페이지네이션 비활성화

    const newFilter = { ...postFilter, page: page - 1 };
    setPostFilter(newFilter);
    fetchPosts();
    setCurrentPage(page);

    // 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (propPosts) return;
    fetchPosts();
  };

  // 총 페이지 수 계산
  const totalPages = propPosts 
    ? Math.ceil(propPosts.length / (postFilter.size || 6))
    : postPageInfo.totalPages;
  const totalItems = propPosts ? propPosts.length : postPageInfo.totalElements;

  // 기본 emptyMessage 설정
  const defaultEmptyMessage = t('community.messages.noPosts');

  // 에러 상태 렌더링
  if (error) {
    return (
      <StyledContainer>
        <EmptyStateBox>
          <Typography variant="h6" color="error" gutterBottom>
            {t('community.errors.loadFailed')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            {t('buttons.retry')}
          </Button>
        </EmptyStateBox>
      </StyledContainer>
    );
  }

  // 빈 상태 렌더링 (첫 로드에서만)
  if (!loading && displayPosts.length === 0 && hasInitialLoad.current) {
    return (
      <StyledContainer>
        <EmptyStateBox>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {emptyMessage || defaultEmptyMessage}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {t('buttons.refresh')}
          </Button>
        </EmptyStateBox>
      </StyledContainer>
    );
  }

  // 첫 로드 중 상태 (스켈레톤 대신 심플한 로딩)
  if (loading && !hasInitialLoad.current && displayPosts.length === 0) {
    return (
      <StyledContainer>
        <EmptyStateBox>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t('community.loading.posts')}
          </Typography>
        </EmptyStateBox>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* 제목 */}
      {title && (
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}

      {/* 게시글 그리드 - 부드러운 전환 효과 */}
      <Box position="relative">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr', // 모바일: 1열
              sm: 'repeat(2, 1fr)', // 태블릿: 2열 
              md: 'repeat(3, 1fr)', // 데스크톱: 3열
            },
            gap: { xs: 2, sm: 2.5, md: 3 }, // 반응형 간격
            width: '100%',
            minHeight: '300px', // 깜빡임 방지를 위한 최소 높이
            opacity: isTransitioning ? 0.3 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {displayPosts.map((post, index) => (
            <Box
              key={post.postId}
              sx={{
                opacity: isTransitioning ? 0.4 : 1,
                transform: isTransitioning ? 'scale(0.96) translateY(8px)' : 'scale(1) translateY(0)',
                transition: `all 0.25s cubic-bezier(0.4, 0, 0.2, 1)`,
                transitionDelay: `${index * 30}ms`, // 더 빠른 순차 애니메이션
              }}
            >
              <PostCard
                post={post}
                hideImage={hideImage}
                onClick={onCardClick}
              />
            </Box>
          ))}
        </Box>

        {/* 로딩 오버레이 (전환 중에만 표시) */}
        {isTransitioning && (
          <LoadingOverlay>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                boxShadow: '0 4px 20px rgba(255, 170, 165, 0.3)',
              }}
            >
              <CircularProgress size={20} thickness={4} sx={{ color: '#FFAAA5' }} />
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                전환 중...
              </Typography>
            </Box>
          </LoadingOverlay>
        )}
      </Box>

      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            disabled={loading}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* 총 게시글 수 표시 */}
      {totalItems > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            {t('community.pagination.totalItems', { count: totalItems })}
          </Typography>
        </Box>
      )}
    </StyledContainer>
  );
};

export default PostList;
