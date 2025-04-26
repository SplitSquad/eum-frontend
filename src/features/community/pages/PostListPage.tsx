import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';

import SpringBackground from '../components/shared/SpringBackground';
import PostList from '../components/post/PostList';
import RegionSelector from '../components/shared/RegionSelector';
import SearchBar from '@/search/components/SearchBar';

import useCommunityStore from '../store/communityStore';
import { tempLogin } from '../../../features/auth/api/tempAuthApi';
import useAuthStore from '../../../features/auth/store/authStore';
import { useToggle } from '@/shared/hooks/UseToggle';
import { useScrollToTop } from '@/shared/hooks/UseScrollToTop';
import { usePostStore } from '../store/postStore';

type SelectablePostType = 'ALL' | '자유' | '모임';

interface LocalPostFilter {
  category: string;
  postType: string;
  location: string;
  tag?: string;
  sortBy: 'latest' | 'popular';
  size: number;
  page: number;
  keyword?: string;
  searchActive?: boolean;
}

const PostListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToTop = useScrollToTop();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, toggleFilters] = useToggle(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchType, setSearchType] = useState<string>('제목_내용');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [selectedPostType, setSelectedPostType] = useState<SelectablePostType>('ALL');

  const categoryTags = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
    전체: ['인기', '추천', '정보공유', '질문', '후기'],
  };
  const [availableTags, setAvailableTags] = useState<string[]>(categoryTags['전체']);

  const {
    posts,
    postLoading,
    postError,
    selectedCategory,
    setSelectedCategory,
    fetchPosts,
    searchPosts,
    fetchTopPosts,
  } = useCommunityStore();

  const queryParams = new URLSearchParams(location.search);
  const initialPostType = (() => {
    const p = queryParams.get('postType');
    return p === '자유' || p === '모임' ? (p as SelectablePostType) : 'ALL';
  })();

  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || '전체',
    location: queryParams.get('location') || '전체',
    tag: queryParams.get('tag') || '',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: queryParams.has('page') ? parseInt(queryParams.get('page')!, 10) - 1 : 0,
    size: 6,
    postType: queryParams.get('postType') || '',
  });

  useEffect(() => {
    setSelectedPostType(initialPostType);
  }, [initialPostType]);

  useEffect(() => {
    // 태그 목록 설정
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(
        categoryTags[filter.category as keyof typeof categoryTags] || categoryTags['전체']
      );
    }
    // 초기 필터
    const initial = { ...filter, postType: '자유', location: '자유', page: 0 };
    setFilter(initial);
    fetchPosts(initial);
    fetchTopPosts(5);
  }, []);

  const SearchStatusIndicator = () => {
    if (!isSearchMode || !searchTerm) return null;
    const infos: string[] = [];
    if (filter.category && filter.category !== '전체') infos.push(`카테고리: ${filter.category}`);
    if (filter.postType) infos.push(`타입: ${filter.postType}`);
    if (filter.location && filter.location !== '전체' && filter.location !== '자유')
      infos.push(`지역: ${filter.location}`);
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,230,230,0.8)',
          p: 1,
          borderRadius: 1,
          mb: 2,
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <SearchIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="secondary.dark">
          "{searchTerm}" 검색 중 {searchType === '제목_내용' ? '(제목+내용)' : `(${searchType})`}
          {infos.length > 0 && <span> - {infos.join(' / ')}</span>}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          startIcon={<ClearIcon />}
          onClick={() => {
            setIsSearchMode(false);
            setSearchTerm('');
            fetchPosts({ ...filter, page: 0, searchActive: false });
          }}
        >
          검색 취소
        </Button>
      </Box>
    );
  };

  const applyFilterWithSearchState = (newF: Partial<LocalPostFilter>) => {
    const updated = { ...filter, ...newF };
    if (isSearchMode && searchTerm) {
      setFilter(updated);
      const postTypeVal =
        selectedPostType === 'ALL'
          ? '자유'
          : selectedPostType === '모임'
            ? '모임'
            : selectedPostType;
      const opts = {
        page: updated.page ?? 0,
        size: updated.size,
        postType: postTypeVal,
        region: updated.location,
        category: updated.category,
        tag: updated.tag,
        sort: updated.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
      };
      usePostStore.getState().searchPosts(searchTerm, searchType, opts);
    } else {
      setFilter(updated);
      fetchPosts(updated);
    }
  };

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    setAvailableTags(
      cat !== '전체' ? categoryTags[cat as keyof typeof categoryTags] : categoryTags['전체']
    );
    applyFilterWithSearchState({ category: cat, page: 0 });
  };

  const handleTagSelect = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    setSelectedTags(isSelected ? [] : [tag]);
    const newF = { ...filter, page: 0 } as LocalPostFilter;
    if (isSelected) delete newF.tag;
    else newF.tag = tag;
    applyFilterWithSearchState(newF);
  };

  const handleSearchTypeChange = (e: SelectChangeEvent<string>) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setIsSearchMode(false);
      fetchPosts({ ...filter, page: 0, searchActive: false });
      return;
    }
    setIsSearchMode(true);
    const postTypeVal = selectedPostType === 'ALL' ? '자유' : selectedPostType;
    const sf = { ...filter, postType: postTypeVal, page: 0 };
    setFilter(sf);
    usePostStore.getState().searchPosts(searchTerm, searchType, {
      page: 0,
      size: 6,
      postType: postTypeVal,
      region: selectedRegion,
      category: selectedCategory,
      tag: filter.tag,
      sort: filter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCreatePost = async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      const result = await tempLogin(1);
      const token = localStorage.getItem('auth_token');
      if (token) {
        useAuthStore.getState().handleLogin(token, {
          id: result.userId.toString(),
          email: `user${result.userId}@example.com`,
          name: `User ${result.userId}`,
          role: 'USER',
        });
      }
    }
    navigate('/community/create');
  };

  const handleSortChange = (sortBy: 'latest' | 'popular') => {
    applyFilterWithSearchState({ sortBy, page: 0 });
  };

  const handlePostTypeChange = (newPostType: SelectablePostType) => {
    if (newPostType === selectedPostType) return;
    setSelectedPostType(newPostType);
    const f = { ...filter, page: 0 } as LocalPostFilter;
    if (newPostType === 'ALL' || newPostType === '자유') {
      f.postType = '자유';
      f.location = '자유';
    } else {
      f.postType = '모임';
      if (f.location === '자유') f.location = '전체';
    }
    setSelectedRegion(f.location);
    applyFilterWithSearchState(f);
  };

  const handleRegionChange = (region: string) => {
    if (region === selectedRegion) return;
    setSelectedRegion(region);
    applyFilterWithSearchState({ location: region, page: 0 });
  };

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
        {/* DEBUG PANEL */}
        <Paper
          elevation={1}
          sx={{ p: 2, mb: 3, bgcolor: 'rgba(255,255,255,0.8)', border: '1px solid #FF9999' }}
        >
          <Typography variant="h6" gutterBottom>
            DEBUG: 페이지 상태
          </Typography>
          <Typography variant="body2">
            선택 카테고리: {selectedCategory} | 게시글 수: {posts.length}
            <br />
            선택 타입: {selectedPostType} | 필터 타입: {filter.postType || 'ALL'}
            <br />
            로딩: {postLoading ? 'LOADING...' : 'READY'} | 오류: {postError || 'NONE'}
          </Typography>
        </Paper>

        {/* HEADER */}
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
            sx={{ fontWeight: 600, color: '#555', fontFamily: '"Noto Sans KR", sans-serif' }}
          >
            커뮤니티 게시판
          </Typography>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={handleCreatePost}
            sx={{
              bgcolor: '#FFAAA5',
              '&:hover': { bgcolor: '#FF8B8B' },
              borderRadius: '24px',
              boxShadow: '0 2px 8px rgba(255,170,165,0.5)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            글쓰기
          </Button>
        </Box>

        {/* FILTER & SEARCH */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'rgba(255,255,255,0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255,170,165,0.3)',
            boxShadow: '0 8px 20px rgba(255,170,165,0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={toggleFilters}
              startIcon={showFilters ? <ExpandLessIcon /> : <TuneIcon />}
              size="small"
              sx={{
                textTransform: 'none',
                borderColor: '#FFD7D7',
                color: '#666',
                fontWeight: 500,
                '&:hover': { borderColor: '#FFAAA5', bgcolor: 'rgba(255,235,235,0.2)' },
                borderRadius: '20px',
                px: 2,
              }}
            >
              {showFilters ? '필터 접기' : '필터 열기'}
            </Button>
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="게시글 정렬 방식"
              sx={{
                '& .MuiButton-outlined': {
                  borderColor: '#FFD7D7',
                  color: '#666',
                  '&:hover': { borderColor: '#FFAAA5', bgcolor: 'rgba(255,235,235,0.2)' },
                  borderRadius: '20px',
                },
                '& .MuiButtonGroup-grouped:not(:last-of-type)': { borderColor: '#FFD7D7' },
              }}
            >
              <Button
                onClick={() => handleSortChange('latest')}
                sx={{
                  fontWeight: filter.sortBy === 'latest' ? 'bold' : 'normal',
                  bgcolor: filter.sortBy === 'latest' ? 'rgba(255,235,235,0.4)' : 'transparent',
                }}
              >
                최신순
              </Button>
              <Button
                onClick={() => handleSortChange('popular')}
                sx={{
                  fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal',
                  bgcolor: filter.sortBy === 'popular' ? 'rgba(255,235,235,0.4)' : 'transparent',
                }}
              >
                인기순
              </Button>
            </ButtonGroup>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="search-type-label">검색 유형</InputLabel>
              <Select
                labelId="search-type-label"
                id="search-type"
                value={searchType}
                onChange={handleSearchTypeChange}
                label="검색 유형"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.5)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD7D7' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFAAA5' },
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="제목_내용">제목+내용</MenuItem>
                <MenuItem value="제목">제목만</MenuItem>
                <MenuItem value="내용">내용만</MenuItem>
                <MenuItem value="작성자">작성자</MenuItem>
              </Select>
            </FormControl>
            <SearchBar
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#FFD7D7' },
                  '&:hover fieldset': { borderColor: '#FFAAA5' },
                  '&.Mui-focused fieldset': { borderColor: '#FF9999' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearch} title="검색">
                      <SearchIcon fontSize="small" sx={{ color: '#FF9999' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Collapse in={showFilters}>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,170,165,0.2)' }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#555' }}
                >
                  게시글 타입
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={selectedPostType}
                  exclusive
                  onChange={(_, v) => v && handlePostTypeChange(v as SelectablePostType)}
                  size="small"
                  sx={{
                    width: '100%',
                    '& .MuiToggleButton-root': {
                      borderRadius: '8px',
                      border: '1px solid #FFD7D7',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,170,165,0.2)',
                        color: '#FF6B6B',
                        fontWeight: 'bold',
                      },
                      '&:hover': { bgcolor: 'rgba(255,235,235,0.4)' },
                    },
                    '& .MuiToggleButtonGroup-grouped': { borderRadius: '8px !important', mx: 0.5 },
                  }}
                >
                  <ToggleButton value="ALL" sx={{ width: '33%' }}>
                    전체
                  </ToggleButton>
                  <ToggleButton value="자유" sx={{ width: '33%' }}>
                    자유 게시글
                  </ToggleButton>
                  <ToggleButton value="모임" sx={{ width: '33%' }}>
                    모임 게시글
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {selectedPostType === '모임' && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: '#555' }}
                  >
                    지역 선택
                  </Typography>
                  <RegionSelector selectedRegion={selectedRegion} onChange={handleRegionChange} />
                </Box>
              )}

              <Box sx={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#555' }}
                >
                  카테고리 선택
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={selectedCategory}
                  exclusive
                  onChange={(_, v) => v && handleCategoryChange(v as string)}
                  size="small"
                  sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      borderRadius: '8px',
                      border: '1px solid #FFD7D7',
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,170,165,0.2)',
                        color: '#FF6B6B',
                        fontWeight: 'bold',
                      },
                      '&:hover': { bgcolor: 'rgba(255,235,235,0.4)' },
                    },
                    '& .MuiToggleButtonGroup-grouped': { borderRadius: '8px !important', mx: 0.5 },
                  }}
                >
                  <ToggleButton value="전체" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                    전체
                  </ToggleButton>
                  <ToggleButton value="travel" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                    travel
                  </ToggleButton>
                  <ToggleButton value="living" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                    living
                  </ToggleButton>
                  <ToggleButton value="study" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                    study
                  </ToggleButton>
                  <ToggleButton value="job" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                    job
                  </ToggleButton>
                </ToggleButtonGroup>

                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#555', mt: 2 }}
                >
                  세부 태그 선택
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {availableTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagSelect(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: '16px',
                        borderColor: selectedTags.includes(tag) ? '#FF6B6B' : '#FFD7D7',
                        backgroundColor: selectedTags.includes(tag)
                          ? 'rgba(255,170,165,0.2)'
                          : 'transparent',
                        color: selectedTags.includes(tag) ? '#FF6B6B' : '#666',
                        '&:hover': {
                          backgroundColor: selectedTags.includes(tag)
                            ? 'rgba(255,170,165,0.3)'
                            : 'rgba(255,235,235,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Paper>

        <SearchStatusIndicator />

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
              borderRadius: '16px',
              border: '1px solid rgba(255,170,165,0.2)',
              boxShadow: '0 8px 20px rgba(255,170,165,0.1)',
            }}
          >
            <CircularProgress size={60} sx={{ color: '#FFAAA5', mb: 3 }} />
            <Typography variant="h6" color="textSecondary">
              게시글을 불러오는 중...
            </Typography>
          </Box>
        ) : postError ? (
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
              borderRadius: '16px',
              border: '1px solid rgba(255,170,165,0.2)',
              boxShadow: '0 8px 20px rgba(255,170,165,0.1)',
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              오류가 발생했습니다
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {typeof postError === 'string' ? postError : '문제가 발생했습니다.'}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => fetchPosts({ ...filter, page: 0 })}
            >
              다시 시도하기
            </Button>
          </Box>
        ) : posts.length === 0 && isSearchMode ? (
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
              borderRadius: '16px',
              border: '1px solid rgba(255,170,165,0.2)',
              boxShadow: '0 8px 20px rgba(255,170,165,0.1)',
            }}
          >
            <SearchIcon sx={{ fontSize: '3rem', color: '#FFAAA5', mb: 2 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body1" color="textSecondary">
              다른 검색어로 시도해보세요.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => fetchPosts({ ...filter, page: 0 })}
            >
              전체 게시글 보기
            </Button>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: '400px' }}>
            <PostList />
          </Box>
        )}
      </Container>

      <IconButton size="large" onClick={scrollToTop}>
        <ExpandLessIcon />
      </IconButton>
    </SpringBackground>
  );
};

export default PostListPage;
