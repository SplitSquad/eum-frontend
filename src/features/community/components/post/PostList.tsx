import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Paper,
  Fade,
} from '@mui/material';
import PostCard from './PostCard';
import { PostSummary, PostType } from '../../types-folder/index';
// import { PostSummary, PostFilter } from '../../types'; // 타입 import 불가로 임시 주석 처리
import useCommunityStore from '../../store/communityStore';
import { usePostStore } from '../../store/postStore';
import { useTranslation } from '../../../../shared/i18n';
import { useLanguageStore } from '../../../../features/theme/store/languageStore';

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
type PostFilter = {
  page?: number;
  size?: number;
  sort?: string;
  postType?: PostType | string;
  region?: string;
  category?: string;
  tags?: string[];
  location?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular';
  searchBy?: string;
  keyword?: string;
  resetSearch?: boolean;
};

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
type PostFilter = {
  page?: number;
  size?: number;
  sort?: string;
  postType?: PostType | string;
  region?: string;
  category?: string;
  tags?: string[];
  location?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular';
  searchBy?: string;
  keyword?: string;
  resetSearch?: boolean;
};

interface PostListProps {
  title?: string;
  posts?: PostSummary[];
  loading?: boolean;
  error?: string | null;
  showPagination?: boolean;
  emptyMessage?: string;
}

/**
 * 게시글 목록 컴포넌트
 * 게시글 카드를 그리드 형태로 표시
 */
const PostList: React.FC<PostListProps> = ({
  title,
  posts: propPosts,
  loading: propLoading,
  error: propError,
  showPagination = true,
  emptyMessage,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // 초기 로드 상태를 추적하는 ref
  const hasInitialDataLoaded = useRef(false);

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

  // 언어 변경 시 초기 로드 상태 초기화
  useEffect(() => {
    if (language !== lastLanguage) {
      console.log('[DEBUG] PostList - 언어 변경으로 초기 로드 상태 초기화');
      hasInitialDataLoaded.current = false;
      setLastLanguage(language);
    }
  }, [language, lastLanguage]);

  // 초기 데이터 로드 - 한 번만 실행되도록 수정
  useEffect(() => {
    // 외부에서 데이터를 받은 경우 스토어 사용 안함
    if (propPosts) return;

    // 이미 데이터를 로드했으면 중복 요청 방지
    if (hasInitialDataLoaded.current) {
      console.log('[DEBUG] PostList - 이미 초기 데이터가 로드됨, 중복 요청 방지');
      return;
    }

    // 데이터가 없고, 로딩 중이 아닐 때만 데이터 가져오기
    if (storePosts.length === 0 && !postLoading) {
      console.log('[DEBUG] PostList - 초기 데이터 로드 시작');
      fetchPosts();
      hasInitialDataLoaded.current = true;
    }
  }, [propPosts, fetchPosts, storePosts.length, postLoading]);

  // postPageInfo가 변경될 때 현재 페이지 업데이트
  useEffect(() => {
    if (propPosts) return;

    // postPageInfo.page는 0-based이므로 UI에 표시할 때는 1을 더함
    const uiPage = postPageInfo.page + 1;
    console.log('[DEBUG] postPageInfo 변경 감지 - 페이지 동기화:', uiPage);
    setCurrentPage(uiPage);
  }, [propPosts, postPageInfo]);

  // 필터 변경 시 효과 (페이지는 1로 리셋)
  useEffect(() => {
    // 외부에서 데이터를 받은 경우 필터 변경에 반응하지 않음
    if (propPosts) return;

    // 페이지 정보 변경이 아닌 다른 필터 변경 시에만 페이지 초기화
    if (postFilter.page === 0) {
      setCurrentPage(1);
    }
  }, [propPosts, postFilter]);

  // 페이지 변경 처리
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    console.log('[DEBUG] 페이지 변경 요청:', page);

    // 외부에서 posts를 받은 경우 페이지네이션 처리 안함
    if (propPosts) {
      console.log('[DEBUG] 외부 posts 사용 중, 페이지네이션 무시');
      return;
    }

    // 현재 페이지와 같으면 무시
    if (page === currentPage) {
      console.log('[DEBUG] 같은 페이지 요청, 무시');
      return;
    }

    // UI 상태 즉시 업데이트
    setCurrentPage(page);

    // 스토어의 필터 업데이트 및 데이터 요청
    const newFilter = {
      ...postFilter,
      page: page - 1, // 0-based로 변환
    };

    console.log('[DEBUG] 새 필터로 데이터 요청:', newFilter);
    setPostFilter(newFilter);
    fetchPosts(newFilter);
  };

  // 게시글 목록 조회 함수 (필터 변경 시 사용)
  const handleFilterChange = (newFilter: Partial<PostFilter>) => {
    console.log('[DEBUG] 필터 변경:', newFilter);

    // 필터 변경 시 첫 페이지로 이동
    (fetchPosts as any)({
      ...postFilter,
      ...newFilter,
      page: 0, // 필터 변경 시 첫 페이지로 이동
      size: 6, // 페이지 크기 명시적으로 6으로 설정
    });
  };

  // 최종적으로 표시될 posts, loading, error
  const posts = propPosts || storePosts;
  const loading = propLoading !== undefined ? propLoading : postLoading;
  const error = propError !== undefined ? propError : postError;
  const totalPages = (propPosts ? Math.ceil(propPosts.length / 6) : postPageInfo.totalPages) || 1;
  const totalItems = propPosts ? propPosts.length : postPageInfo.totalElements;

  // 이전 게시글 데이터 저장 - 로딩 중에도 이전 데이터 표시
  const [prevPosts, setPrevPosts] = useState<PostSummary[]>([]);

  // 로딩 시작 시 이전 게시글 저장 - 언어 변경 시에도 데이터 유지
  useEffect(() => {
    if (!loading && posts.length > 0) {
      setPrevPosts(posts);
    }
  }, [loading, posts]);

  // 언어 변경 시에도 이전 데이터 유지하기 위한 추가 로직
  useEffect(() => {
    // 로딩이 시작되었지만 posts가 비어있고 prevPosts가 있는 경우
    // (언어 변경으로 인한 캐시 초기화 상황)
    if (loading && posts.length === 0 && prevPosts.length > 0) {
      console.log('[DEBUG] 언어 변경으로 인한 로딩 중 - 이전 데이터 유지');
      // prevPosts를 그대로 유지 (업데이트하지 않음)
    }
  }, [loading, posts.length, prevPosts.length]);

  // 디버깅을 위한 임시 게시글 데이터
  const mockPosts: PostSummary[] = [
    {
      postId: 999,
      title: t('community.posts.testPost'),
      content: t('community.posts.testPostContent'),
      category: '모임',
      tags: [{ tagId: 1, name: t('community.tags.test'), category: '자유' }],
      writer: {
        userId: 1,
        nickname: t('community.posts.testUser'),
        profileImage: '',
        role: 'USER',
      },
      createdAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
      status: 'ACTIVE',
    },
  ];

  // 실제로 표시할 게시글 결정
  // 언어 변경 시에는 항상 기존 데이터를 우선 표시
  const displayPosts = (() => {
    // 로딩 중인 경우
    if (loading) {
      // 이전 데이터가 있으면 이전 데이터 사용
      if (prevPosts.length > 0) {
        return prevPosts;
      }
      // 현재 데이터가 있으면 현재 데이터 사용
      if (posts.length > 0) {
        return posts;
      }
      // 둘 다 없으면 빈 배열
      return [];
    }

    // 로딩이 끝난 경우
    if (posts && posts.length > 0) {
      return posts;
    }

    // 새로운 데이터가 없고 이전 데이터가 있으면 이전 데이터 유지
    if (prevPosts.length > 0) {
      console.log('[DEBUG] 새 데이터 없음 - 이전 데이터 유지:', prevPosts.length, '개');
      return prevPosts;
    }

    // 모든 데이터가 없으면 빈 배열
    return [];
  })();

  // 로딩 중이지만 표시할 데이터가 있는 경우
  const isDataAvailableDuringLoading = loading && prevPosts.length > 0;

  // 기본 emptyMessage 설정
  const defaultEmptyMessage = t('community.messages.noPosts');

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/*<Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 170, 165, 0.3)',
        }}
      >*/}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'right',
          color: '#888',
          fontSize: '0.97rem',
          paddingBottom: '6px',
        }}
      >
        {loading && !isDataAvailableDuringLoading
          ? t('community.messages.loadingPosts')
          : error
            ? `${t('common.error')}: ${error}`
            : t('community.messages.totalPosts', {
                count: (totalItems || displayPosts.length).toString(),
              })}
      </Typography>
      {/*</Paper>*/}

      {title && (
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: '#555',
            position: 'relative',
            display: 'inline-block',
          }}
        >
          {title}
        </Typography>
      )}

      {/* 전체 화면 로딩은 초기 로딩시에만 표시 */}
      {loading && !isDataAvailableDuringLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} sx={{ color: '#FF9999' }} />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Fade in={true} style={{ transitionDuration: '300ms' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 3,
            width: '100%',
            opacity: isDataAvailableDuringLoading ? 0.7 : 1, // 로딩 중일 때 살짝 투명하게
          }}
        >
          {displayPosts.map(post => (
            <PostCard key={post.postId} post={post as PostSummary} />
          ))}
        </Box>
      </Fade>

      {!loading && !error && displayPosts.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            backgroundColor: 'rgba(255, 240, 240, 0.5)',
            borderRadius: '8px',
            border: '1px dashed #FFAAA5',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {emptyMessage || defaultEmptyMessage}
          </Typography>
        </Box>
      )}

      {showPagination && totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            '& .MuiPagination-ul': {
              '& .MuiPaginationItem-root': {
                color: '#555',
                '&.Mui-selected': {
                  backgroundColor: '#FFD7D7',
                  fontWeight: 'bold',
                },
              },
            },
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            showFirstButton
            showLastButton
          />

          {/* 작은 로딩 인디케이터 - 페이지 전환 중에만 표시 */}
          {isDataAvailableDuringLoading && (
            <CircularProgress size={20} sx={{ color: '#FF9999', ml: 2 }} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostList;
