import React, { useEffect, useState, useCallback } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tabs,
  Tab,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';

import SpringBackground from '../components/shared/SpringBackground';
import CategoryTabs from '../components/shared/CategoryTabs';
import PostList from '../components/post/PostList';
import RegionSelector from '../components/shared/RegionSelector';
import PostTypeSelector from '../components/shared/PostTypeSelector';

import useCommunityStore from '../store/communityStore';
import { Post } from '../types';
import { tempLogin } from '../../../features/auth/api/tempAuthApi';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostApi } from '../api/postApi';

/**
 * 게시글 목록 페이지 컴포넌트
 * 커뮤니티의 게시글 목록을 표시하고 필터링, 검색 기능 제공
 */

// 추가: 포스트 타입 선택 탭 스타일
const PostTypeTab = styled(Tab)(({ theme }) => ({
  minWidth: '100px',
  fontWeight: 600,
  borderRadius: '4px',
  padding: '8px 16px',
  color: '#666',
  '&.Mui-selected': {
    color: '#FF6B6B',
    backgroundColor: 'rgba(255, 170, 165, 0.1)',
  },
}));

const PostTypeRoot = styled(Box)(({ theme }) => ({
  marginBottom: '20px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

const PostTypeLabel = styled(Typography)(({ theme }) => ({
  marginRight: '16px',
  fontWeight: 600,
  color: '#666',
}));

// 게시글 타입 정의
type PostType = '자유' | '모임' | '전체' | '';

// 선택 가능한 게시글 타입 (UI 표시용)
type SelectablePostType = 'ALL' | '자유' | '모임';

// PostFilter 타입 정의
interface LocalPostFilter {
  category: string;
  postType: PostType;
  location: string;
  tag?: string;
  sortBy: 'latest' | 'popular';
  size: number;
  page: number;
  keyword?: string;
  searchActive?: boolean; // 검색 활성화 여부
}

const PostListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchType, setSearchType] = useState<string>('제목_내용');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [selectedPostType, setSelectedPostType] = useState<SelectablePostType>('ALL');

  // 카테고리별 태그 매핑
  const categoryTags = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
    '전체': ['인기', '추천', '정보공유', '질문', '후기']
  };
  
  // 현재 선택된 카테고리에 해당하는 태그 목록
  const [availableTags, setAvailableTags] = useState<string[]>(categoryTags['전체']);

  const {
    posts,
    postLoading,
    postError,
    selectedCategory,
    setSelectedCategory,
    fetchPosts,
    setPostFilter,
    searchPosts,
    fetchTopPosts,
  } = useCommunityStore();

  // 현재 URL에서 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  
  // 초기 포스트 타입 결정
  const initialPostType = (() => {
    const postTypeParam = queryParams.get('postType');
    if (postTypeParam === '자유') return '자유';
    if (postTypeParam === '모임') return '모임';
    return 'ALL';
  })();

  // URL 쿼리 파라미터에서 필터 상태 초기화
  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || '전체',
    location: queryParams.get('location') || '전체',
    tag: queryParams.get('tag') || '',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: queryParams.get('page') ? parseInt(queryParams.get('page') as string) - 1 : 0,
    size: 6,
    postType: (queryParams.get('postType') as PostType) || '',
  });

  // 초기 상태 설정
  useEffect(() => {
    setSelectedPostType(initialPostType);
  }, [initialPostType]);

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    console.log('PostListPage 컴포넌트 마운트, 게시글 목록 조회 시작');
    
    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(categoryTags[filter.category as keyof typeof categoryTags] || categoryTags['전체']);
    }
    
    // 태그가 있으면 선택된 태그 상태 설정
    if (filter.tag) {
      setSelectedTags(filter.tag.split(','));
    }
    
    // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역)
    const initialFilter = {
      ...filter,
      postType: '자유' as PostType,
      location: '자유',
      page: 0,
      size: 6
    };
    setFilter(initialFilter);
    
    // 게시글 목록 조회
    fetchPosts(initialFilter);
    // 인기 게시글 로드
    fetchTopPosts(5);
  }, []);

  // 검색 상태 표시를 위한 추가 컴포넌트
  const SearchStatusIndicator = () => {
    if (!isSearchMode || !searchTerm) return null;
    
    // 현재 적용된 필터 정보 표시
    const filterInfo = [];
    if (filter.category && filter.category !== '전체') {
      filterInfo.push(`카테고리: ${filter.category}`);
    }
    if (filter.postType) {
      filterInfo.push(`타입: ${filter.postType}`);
    }
    if (filter.location && filter.location !== '전체' && filter.location !== '자유') {
      filterInfo.push(`지역: ${filter.location}`);
    }
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'rgba(255, 230, 230, 0.8)', 
          p: 1, 
          borderRadius: 1,
          mb: 2,
          gap: 1,
          flexWrap: 'wrap'
        }}
      >
        <SearchIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="secondary.dark">
          "{searchTerm}" 검색 중 {searchType === '제목_내용' ? '(제목+내용)' : `(${searchType})`}
          {filterInfo.length > 0 && (
            <span> - {filterInfo.join(' / ')}</span>
          )}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          size="small" 
          variant="outlined" 
          color="secondary"
          onClick={() => {
            setIsSearchMode(false);
            setSearchTerm('');
            fetchPosts({
              ...filter,
              page: 0,
              resetSearch: true // 검색 상태만 초기화
            });
          }}
          startIcon={<ClearIcon />}
        >
          검색 취소
        </Button>
      </Box>
    );
  };

  // 필터 변경 시 검색 상태를 유지하는 함수
  const applyFilterWithSearchState = (newFilter: Partial<LocalPostFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    
    if (isSearchMode && searchTerm) {
      // 검색 중이면 필터와 함께 검색 재실행
      console.log('[DEBUG] 검색 상태에서 필터 변경 - 세부 정보:', {
        현재필터: filter,
        새필터: newFilter,
        병합필터: updatedFilter,
        검색어: searchTerm,
        검색타입: searchType
      });
      
      // postType 처리
      let postTypeValue = updatedFilter.postType || '자유';
      if (selectedPostType === 'ALL') {
        postTypeValue = '자유';
      } else if (selectedPostType === '모임') {
        postTypeValue = '모임';
      } else {
        postTypeValue = selectedPostType;
      }
      
      // UI용 필터 상태 먼저 업데이트 (로딩 상태 표시용)
      setFilter(updatedFilter);
      
      // searchPosts 함수 호출 - 필터 변경 사항 적용하여 재검색
      const searchOptions = {
        page: updatedFilter.page !== undefined ? updatedFilter.page : 0,
        size: updatedFilter.size || 6,
        postType: postTypeValue,
        region: updatedFilter.location,
        category: updatedFilter.category,
        tag: updatedFilter.tag,
        sort: updatedFilter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc'
      };
      
      console.log('[DEBUG] 검색 API 파라미터:', searchOptions);
      
      // 이번에는 서버에 직접 API 요청 (postApi 직접 사용)
      try {
        const postApi = usePostStore.getState();
        postApi.searchPosts(searchTerm, searchType, searchOptions);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      }
    } else {
      // 검색 중이 아니면 일반 필터 적용
      setFilter(updatedFilter);
      fetchPosts(updatedFilter);
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    console.log('[DEBUG] 카테고리 변경:', category);
    
    // 이전 카테고리와 같으면 변경 없음
    if (category === selectedCategory) {
      console.log('[DEBUG] 같은 카테고리 선택, 변경 없음');
      return;
    }
    
    // 카테고리 상태 업데이트
    setSelectedCategory(category);
    
    // 카테고리에 맞는 태그 목록 설정
    if (category && category !== '전체') {
      setAvailableTags(categoryTags[category as keyof typeof categoryTags] || categoryTags['전체']);
    } else {
      setAvailableTags(categoryTags['전체']);
    }
    
    // 새 필터 생성
    const newFilter = { 
      ...filter, 
      category, 
      page: 0
    };
    
    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    console.log('[DEBUG] 태그 선택:', tag);
    
    // 이미 선택된 태그면 취소
    if (selectedTags.includes(tag)) {
      console.log('[DEBUG] 태그 선택 취소');
      setSelectedTags([]);
      
      // 필터에서 태그 제거
      const updatedFilter = { ...filter };
      delete updatedFilter.tag;
      updatedFilter.page = 0;
      
      // 필터 적용 (검색 상태 유지하면서)
      applyFilterWithSearchState(updatedFilter);
    } else {
      // 새 태그 선택
      setSelectedTags([tag]);
      
      const updatedFilter = { ...filter };
      // 태그 설정
      updatedFilter.tag = tag;
      // 페이지 초기화
      updatedFilter.page = 0;
      
      // 필터 적용 (검색 상태 유지하면서)
      applyFilterWithSearchState(updatedFilter);
    }
  };

  // 검색 타입 변경 핸들러
  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    setSearchType(event.target.value);
  };

  // 검색 핸들러 - 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    console.log('[검색 시작] 검색어:', searchTerm, '검색 타입:', searchType);
    
    // 검색어가 비어있으면 전체 게시글 목록 가져오기
    if (!searchTerm.trim()) {
      console.log('검색어가 비어있어 전체 목록을 불러옵니다.');
      setIsSearchMode(false);
      fetchPosts({...filter, page: 0, resetSearch: true});
      return;
    }
    
    // 검색 모드 활성화
    setIsSearchMode(true);
    
    // 검색용 postType 설정
    let postTypeForSearch = 
      selectedPostType === 'ALL' ? '자유' : 
      selectedPostType as PostType;
    
    // 검색 시 필터 상태 업데이트
    const searchFilter = {
      ...filter,
      page: 0,
      postType: postTypeForSearch
    };
    setFilter(searchFilter);
    
    // 검색 타입 그대로 전달 (postApi.ts에서 변환 처리)
    const searchOptions = {
      page: 0,
      size: 6,
      postType: postTypeForSearch,
      region: selectedRegion,
      category: selectedCategory,
      tag: filter.tag,
      sort: filter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc'
    };
    
    console.log('[DEBUG] 검색 API 파라미터:', {
      keyword: searchTerm,
      searchType,
      ...searchOptions
    });

    // 검색 요청 직접 실행
    try {
      const postApi = usePostStore.getState();
      postApi.searchPosts(searchTerm, searchType, searchOptions);
      console.log('검색 요청 전송 완료');
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  // 작성자 검색 핸들러
  const handleAuthorSearch = () => {
    console.log('[DEBUG] 작성자 검색 실행:', searchTerm);
    if (searchTerm.trim()) {
      // 작성자 이름으로 검색 - 명시적으로 '작성자' 타입 지정
      searchPosts(searchTerm, '작성자');
    } else {
      fetchPosts(filter);
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

  // 필터 토글
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 정렬 방식 변경 핸들러
  const handleSortChange = (sortBy: 'latest' | 'popular') => {
    console.log('정렬 방식 변경:', sortBy);
    
    // 검색 상태 고려하여 필터 적용
    applyFilterWithSearchState({ sortBy, page: 0 });
  };

  // 게시글 타입(자유/모임) 변경 핸들러
  const handlePostTypeChange = (newPostType: 'ALL' | '자유' | '모임') => {
    if (!newPostType) return; // 값이 null이면 무시
    
    console.log('[DEBUG] 게시글 타입 변경 시작:', newPostType);
    
    // 이전 타입과 같으면 변경 없음
    if ((newPostType === 'ALL' && selectedPostType === 'ALL') ||
        (newPostType === '자유' && selectedPostType === '자유') ||
        (newPostType === '모임' && selectedPostType === '모임')) {
      console.log('[DEBUG] 같은 게시글 타입 선택, 변경 없음');
      return;
    }
    
    // 상태 업데이트
    setSelectedPostType(newPostType);
    
    // 필터 업데이트
    const newFilter = { ...filter };
    
    if (newPostType === 'ALL') {
      // 전체 선택 시 자유 게시글로 기본 설정 (백엔드 요구사항)
      newFilter.postType = '자유' as PostType;
      // 자유 게시글에는 자유 지역 설정
      newFilter.location = '자유';
      console.log('[DEBUG] 전체 게시글 선택: postType을 "자유"로 설정, location을 "자유"로 설정');
    } else if (newPostType === '자유') {
      newFilter.postType = '자유' as PostType; // 명시적으로 타입 설정
      // 자유 게시글에는 무조건 자유 지역
      newFilter.location = '자유';
      console.log(`[DEBUG] 자유 게시글 선택: postType을 '자유'로 설정, location을 "자유"로 설정`);
    } else { // 모임 게시글
      newFilter.postType = '모임' as PostType; // 명시적으로 타입 설정 
      // 모임 게시글은 기존 지역 유지하거나 새로 설정
      if (newFilter.location === '자유') {
        newFilter.location = '전체'; // 기존에 자유였으면 전체로 변경
      }
      console.log(`[DEBUG] 모임 게시글 선택: postType을 '모임'로 설정, location: ${newFilter.location}`);
    }
    
    // 지역 선택기 업데이트
    setSelectedRegion(newFilter.location);
    
    // 페이지 초기화
    newFilter.page = 0;
    
    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 지역 변경 핸들러
  const handleRegionChange = (region: string) => {
    console.log('[DEBUG] 지역 변경:', region);
    
    // 이전 지역과 같으면 변경 없음
    if (region === selectedRegion) {
      console.log('[DEBUG] 같은 지역 선택, 변경 없음');
      return;
    }
    
    setSelectedRegion(region);
    
    // 필터 업데이트
    const newFilter = { 
      ...filter, 
      location: region, 
      page: 0
    };
    
    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
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
            선택 카테고리: {selectedCategory} | 카테고리 타입: {typeof selectedCategory} | 게시글
            수: {posts.length} <br />
            선택 게시글 타입: {selectedPostType} | 필터 게시글 타입: {filter.postType || 'ALL'} <br />
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
              fontWeight: 600,
              color: '#555',
              fontFamily: '"Noto Sans KR", sans-serif',
            }}
          >
            커뮤니티 게시판
          </Typography>

          {/* 글쓰기 버튼 */}
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={handleCreatePost}
            sx={{
              bgcolor: '#FFAAA5',
              '&:hover': {
                bgcolor: '#FF8B8B',
              },
              borderRadius: '24px',
              boxShadow: '0 2px 8px rgba(255, 170, 165, 0.5)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            글쓰기
          </Button>
        </Box>

        {/* 상단 필터링 및 검색 영역 */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 170, 165, 0.3)',
            boxShadow: '0 8px 20px rgba(255, 170, 165, 0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* 필터 토글 버튼과 정렬 버튼 */}
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
            {/* 필터 토글 버튼 */}
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
                '&:hover': {
                  borderColor: '#FFAAA5',
                  bgcolor: 'rgba(255, 235, 235, 0.2)',
                },
                borderRadius: '20px',
                px: 2,
              }}
            >
              {showFilters ? '필터 접기' : '필터 열기'}
            </Button>

            {/* 정렬 버튼 */}
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="게시글 정렬 방식"
              sx={{
                '& .MuiButton-outlined': {
                  borderColor: '#FFD7D7',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#FFAAA5',
                    bgcolor: 'rgba(255, 235, 235, 0.2)',
                  },
                  borderRadius: '20px',
                },
                '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                  borderColor: '#FFD7D7',
                },
              }}
            >
              <Button
                onClick={() => handleSortChange('latest')}
                sx={{
                  fontWeight: filter.sortBy === 'latest' ? 'bold' : 'normal',
                  bgcolor: filter.sortBy === 'latest' ? 'rgba(255, 235, 235, 0.4)' : 'transparent',
                }}
              >
                최신순
              </Button>
              <Button
                onClick={() => handleSortChange('popular')}
                sx={{
                  fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal',
                  bgcolor: filter.sortBy === 'popular' ? 'rgba(255, 235, 235, 0.4)' : 'transparent',
                }}
              >
                인기순
              </Button>
            </ButtonGroup>
          </Box>

          {/* 검색 필드 */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            {/* 검색 타입 선택 */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="search-type-label">검색 유형</InputLabel>
              <Select
                labelId="search-type-label"
                id="search-type"
                value={searchType}
                onChange={handleSearchTypeChange}
                label="검색 유형"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD7D7',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFAAA5',
                  },
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="제목_내용">제목+내용</MenuItem>
                <MenuItem value="제목">제목만</MenuItem>
                <MenuItem value="내용">내용만</MenuItem>
                <MenuItem value="작성자">작성자</MenuItem>
              </Select>
            </FormControl>

            {/* 검색창 */}
            <TextField
              placeholder="게시글 검색..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px',
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

          {/* 필터 영역 */}
          <Collapse in={showFilters}>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 170, 165, 0.2)' }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
              }}
            >
              {/* 게시글 타입(자유/모임) 선택 */}
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
                  onChange={(e, newPostType) => newPostType && handlePostTypeChange(newPostType)}
                  size="small"
                  sx={{
                    width: '100%',
                    '& .MuiToggleButton-root': {
                      borderRadius: '8px',
                      border: '1px solid #FFD7D7',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255, 170, 165, 0.2)',
                        color: '#FF6B6B',
                        fontWeight: 'bold',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 235, 235, 0.4)',
                      },
                    },
                    '& .MuiToggleButtonGroup-grouped': {
                      borderRadius: '8px !important',
                      mx: 0.5,
                    },
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

              {/* 지역 선택 (모임 게시글일 경우에만 표시) */}
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

              {/* 카테고리와 태그 영역(통합) */}
              <Box sx={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#555' }}
                >
                  카테고리 선택
                </Typography>
                
                {/* 카테고리 선택 버튼 */}
                <ToggleButtonGroup
                  color="primary"
                  value={selectedCategory}
                  exclusive
                  onChange={(e, newValue) => newValue && handleCategoryChange(newValue)}
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
                        bgcolor: 'rgba(255, 170, 165, 0.2)',
                        color: '#FF6B6B',
                        fontWeight: 'bold',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 235, 235, 0.4)',
                      },
                    },
                    '& .MuiToggleButtonGroup-grouped': {
                      borderRadius: '8px !important',
                      mx: 0.5,
                    },
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
                
                {/* 카테고리에 따른 태그 선택 */}
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: '#555', mt: 2 }}
                >
                  세부 태그 선택
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mt: 1 
                  }}
                >
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagSelect(tag)}
                      color={selectedTags.includes(tag) ? "primary" : "default"}
                      variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                      sx={{
                        borderRadius: '16px',
                        borderColor: selectedTags.includes(tag) ? '#FF6B6B' : '#FFD7D7',
                        backgroundColor: selectedTags.includes(tag) ? 'rgba(255, 170, 165, 0.2)' : 'transparent',
                        color: selectedTags.includes(tag) ? '#FF6B6B' : '#666',
                        '&:hover': {
                          backgroundColor: selectedTags.includes(tag) ? 'rgba(255, 170, 165, 0.3)' : 'rgba(255, 235, 235, 0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Paper>

        {/* 검색 상태 표시기 */}
        <SearchStatusIndicator />

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
              borderRadius: '16px',
              border: '1px solid rgba(255, 170, 165, 0.2)',
              boxShadow: '0 8px 20px rgba(255, 170, 165, 0.1)',
            }}
          >
            <CircularProgress size={60} sx={{ color: '#FFAAA5', mb: 3 }} />
            <Typography variant="h6" color="textSecondary">
              게시글을 불러오는 중...
            </Typography>
          </Box>
        ) : postError ? (
          // 오류 발생 시 메시지 표시
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
              border: '1px solid rgba(255, 170, 165, 0.2)',
              boxShadow: '0 8px 20px rgba(255, 170, 165, 0.1)',
            }}
          >
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom>
                오류가 발생했습니다
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {typeof postError === 'string' ? postError : '게시글을 불러오는 중 문제가 발생했습니다.'}
              </Typography>
            </Box>
            <Button 
              variant="outlined"
              color="secondary"
              onClick={() => {
                setIsSearchMode(false);
                setSearchTerm('');
                fetchPosts({
                  ...filter,
                  page: 0,
                  resetSearch: true
                });
              }}
            >
              다시 시도하기
            </Button>
          </Box>
        ) : posts.length === 0 && isSearchMode ? (
          // 검색 결과가 없을 때 메시지 표시
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
              border: '1px solid rgba(255, 170, 165, 0.2)',
              boxShadow: '0 8px 20px rgba(255, 170, 165, 0.1)',
            }}
          >
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: '3rem', color: '#FFAAA5', mb: 2 }} />
              <Typography variant="h5" color="textSecondary" gutterBottom>
                검색 결과가 없습니다
              </Typography>
              <Typography variant="body1" color="textSecondary">
                다른 검색어로 다시 시도해보세요.
              </Typography>
            </Box>
            <Button 
              variant="outlined"
              color="secondary"
              onClick={() => {
                setIsSearchMode(false);
                setSearchTerm('');
                fetchPosts({
                  ...filter,
                  page: 0,
                  resetSearch: true
                });
              }}
            >
              전체 게시글 보기
            </Button>
          </Box>
        ) : (
          /* 게시글 목록 */
          <Box sx={{ flex: 1, minHeight: '400px' }}>
            <PostList />
          </Box>
        )}
      </Container>

      {/* 맨 위로 이동 버튼 */}
      <IconButton
        size="large"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: 'rgba(255, 170, 165, 0.9)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#FF9999',
          },
          zIndex: 10,
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>
    </SpringBackground>
  );
};

export default PostListPage;
