import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import SpringBackground from '../components/shared/SpringBackground';
import CategoryTabs from '../components/shared/CategoryTabs';
import PostList from '../components/post/PostList';
import TagSelector from '../components/shared/TagSelector';

import useCommunityStore from '../store/communityStore';
import { CategoryType } from '../types';
import { tempLogin } from '../../../features/auth/api/tempAuthApi';
import useAuthStore from '../../../features/auth/store/authStore';
import { useToggle } from '@/shared/hooks/UseToggle';

import SearchBar from '@/search/components/SearchBar';
import FilterToggleButton from '@/search/components/FilterToggleButton';
import { useScrollToTop } from '@/shared/hooks/UseScrollToTop';

/**
 * 게시글 목록 페이지 컴포넌트
 * 커뮤니티의 게시글 목록을 표시하고 필터링, 검색 기능 제공
 */
const PostListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, toggleFilters] = useToggle(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    posts,
    postLoading,
    postError,
    selectedCategory,
    setSelectedCategory,
    fetchPosts,
    setPostFilter,
    searchPosts,
  } = useCommunityStore();

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    console.log('PostListPage 컴포넌트 마운트, 게시글 목록 조회 시작');
    console.log('현재 상태:', {
      selectedCategory,
      postsLength: posts.length,
      postsData: JSON.stringify(posts),
      loading: postLoading,
      error: postError,
    });
    fetchPosts();
  }, [fetchPosts]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  // 태그 선택 핸들러
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);

    // 태그가 있으면 필터 적용
    if (tags.length > 0) {
      setPostFilter({ tag: tags.join(',') });
    } else {
      setPostFilter({ tag: undefined });
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchPosts(searchTerm);
    } else {
      fetchPosts();
    }
  };

  // 키보드 엔터로 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 게시글 작성 페이지로 이동
  const handleCreatePost = async () => {
    try {
      console.log('글 작성 버튼 클릭됨');

      // AuthGuard 우회를 위해 임시 로그인 시도
      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        console.log('인증되지 않은 사용자, 임시 로그인 시도');
        // 임시 로그인 수행 (userId 1로 고정)
        const result = await tempLogin(1);
        console.log('임시 로그인 결과:', result);

        // 로컬 스토리지에 토큰이 저장되었는지 확인
        const token = localStorage.getItem('auth_token');
        if (token) {
          // 임시 사용자 정보 생성
          const user = {
            id: result.userId.toString(),
            email: `user${result.userId}@example.com`,
            name: `User ${result.userId}`,
            role: 'USER',
          };
          useAuthStore.getState().handleLogin(token, user);
          console.log('임시 로그인 완료:', user);
        } else {
          console.error('임시 로그인 실패: 토큰이 저장되지 않았습니다');
        }
      } else {
        console.log('이미 인증된 사용자');
      }

      // 글 작성 페이지로 이동 (올바른 경로 사용)
      navigate('/community/create');
    } catch (error) {
      console.error('글 작성 페이지 이동 중 오류:', error);
      alert(
        '로그인 처리 중 오류가 발생했습니다.\n개발자 도구 콘솔(F12)에서 자세한 오류를 확인하세요.'
      );
    }
  };

  // 맨 위로 스크롤
  const scrollToTop = useScrollToTop();

  return (
    <SpringBackground>
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* 디버깅 정보 패널 */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #FF9999',
          }}
        >
          <Typography variant="h6" gutterBottom>
            DEBUG: 페이지 상태
          </Typography>
          <Typography variant="body2">
            선택 카테고리: {selectedCategory} | 게시글 수: {posts.length} <br />
            로딩 상태: {postLoading ? 'LOADING...' : 'READY'} | 오류: {postError || 'NONE'}
          </Typography>
        </Paper>

        {/* 페이지 헤더 */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#555',
              position: 'relative',
            }}
          >
            커뮤니티
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            {/* 검색창 */}
            <SearchBar
              value={searchTerm}
              placeholder="게시글 검색..."
              onChange={setSearchTerm}
              onSearch={handleSearch}
              width={isMobile ? '100%' : 240}
            />

            {/* 필터 버튼 */}
            <FilterToggleButton active={showFilters} onClick={toggleFilters} />
            {/* 게시글 작성 버튼 */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreatePost}
              sx={{
                borderRadius: '20px',
                bgcolor: '#FFAAA5',
                '&:hover': {
                  bgcolor: '#FF9999',
                },
                boxShadow: '0 4px 8px rgba(255, 170, 165, 0.3)',
                px: 2,
              }}
            >
              {isMobile ? '작성' : '글 작성하기'}
            </Button>
          </Box>
        </Box>

        {/* 카테고리 탭 */}
        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {/* 필터 영역 */}
        {showFilters && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 235, 235, 0.8)',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#666',
              }}
            >
              태그로 필터링
            </Typography>

            <TagSelector selectedTags={selectedTags} onChange={handleTagsChange} maxSelection={3} />
          </Box>
        )}

        {/* 로딩 상태 표시 */}
        {postLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 6,
              my: 4,
              flexGrow: 1,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
            }}
          >
            <CircularProgress size={60} sx={{ color: '#FFAAA5', mb: 3 }} />
            <Typography variant="h6" color="textSecondary">
              게시글을 불러오는 중...
            </Typography>
          </Box>
        ) : (
          /* 게시글 목록 */
          <Box sx={{ flex: 1, minHeight: '400px' }}>
            <PostList />
          </Box>
        )}
      </Container>

      {/* 맨 위로 이동 버튼 */}
      <IconButton size="large" onClick={scrollToTop} sx={{}}>
        <ArrowUpwardIcon />
      </IconButton>
    </SpringBackground>
  );
};

export default PostListPage;
