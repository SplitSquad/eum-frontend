import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { styled } from '@mui/system';


import CategoryTabs from '../components/shared/CategoryTabs';
import PostList from '../components/post/PostList';
import RegionSelector from '../components/shared/RegionSelector';
import PostTypeSelector from '../components/shared/PostTypeSelector';

import useCommunityStore from '../store/communityStore';
import { Post } from '../types';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostApi } from '../api/postApi';
import { PostType } from '../types-folder';
import { useRegionStore } from '../store/regionStore';
import PageHeaderText from '@/components/layout/PageHeaderText';

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

const GroupListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<string>('제목_내용');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  // 카테고리별 태그 매핑
  const categoryTags = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
    전체: ['인기', '추천', '정보공유', '질문', '후기'],
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

  // URL 쿼리 파라미터에서 필터 상태 초기화
  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || '전체',
    location: queryParams.get('location') || '전체',
    tag: queryParams.get('tag') || '',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: queryParams.get('page') ? parseInt(queryParams.get('page') as string) - 1 : 0,
    size: 6,
    postType: (queryParams.get('postType') as PostType) || '모임',
  });


  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    console.log('GroupListPage 컴포넌트 마운트, 게시글 목록 조회 시작');

    // 새 게시글 생성 플래그 확인 (localStorage)
    const newPostCreated = localStorage.getItem('newPostCreated');
    const newPostType = localStorage.getItem('newPostType');
    const isNewPostForThisPage = newPostCreated && newPostType === '모임';
    
    if (isNewPostForThisPage) {
      console.log('새 모임 게시글이 생성됨 - 강제 새로고침 실행');
      // 플래그 제거
      localStorage.removeItem('newPostCreated');
      localStorage.removeItem('newPostType');
    }


  // 컴포넌트 마운트 시 게시글 목록 조회를 위한 트래킹
  const initialDataLoadedRef = useRef(false);

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    // 이미 데이터를 로드했으면 중복 요청 방지
    if (initialDataLoadedRef.current) {
      console.log('PostListPage - 이미 초기 데이터가 로드됨, 중복 요청 방지');
      return;
    }

    console.log('PostListPage 컴포넌트 마운트, 게시글 목록 조회 시작');


    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(
        categoryTags[filter.category as keyof typeof categoryTags] || categoryTags['전체']
      );
    }

    // 태그가 있으면 선택된 태그 상태 설정
    if (filter.tag) {
      setSelectedTags(filter.tag.split(','));
    }


    // 초기 로드 시 명시적으로 기본 필터 설정 (모임 게시글, 전체 지역)

    // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역)

    const initialFilter = {
      ...filter,
      postType: '모임' as PostType,
      location: '전체',
      page: 0,
      size: 6,
    };
    setFilter(initialFilter);

    // 게시글 목록 조회 - 항상 최신 데이터 가져오기 (캐시 무시)
    fetchPosts({
      ...initialFilter,
      _forceRefresh: Date.now() // 매번 새로운 타임스탬프로 캐시 무효화
    });
    // 인기 게시글 로드
    fetchTopPosts(5);
  }, []);

  // 페이지 재진입 감지 - location.pathname이 변경될 때 새 데이터 로드
  useEffect(() => {
    if (location.pathname === '/community/groups') {
      console.log('GroupListPage - /community/groups 경로로 복귀, 최신 데이터 로드');
      if (!isSearchMode) {
        // 약간의 지연 후 새로고침 (네비게이션 완료 후)
        setTimeout(() => {
          fetchPosts({
            ...filter,
            _forceRefresh: Date.now()
          });
        }, 100);
      }
    }
  }, [location.pathname, filter, isSearchMode]);

    // 게시글 목록 조회
    fetchPosts(initialFilter);
    // 인기 게시글 로드
    fetchTopPosts(5);

    // 초기 데이터 로드 완료 플래그 설정
    initialDataLoadedRef.current = true;
  }, []);


  // 검색 상태 표시를 위한 추가 컴포넌트
  const SearchStatusIndicator = () => {
    if (!isSearchMode || !searchTerm) return null;

    // 현재 적용된 필터 정보 표시
    const filterInfo: string[] = [];
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
          flexWrap: 'wrap',
        }}
      >
        <SearchIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="secondary.dark">
          "{searchTerm}" 검색 중 {searchType === '제목_내용' ? '(제목+내용)' : `(${searchType})`}
          {filterInfo.length > 0 && <span> - {filterInfo.join(' / ')}</span>}
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
              resetSearch: true, // 검색 상태만 초기화
            });
          }}
          startIcon={<ClearIcon />}
        >
          검색 취소
        </Button>
      </Box>
    );
  };

  // Helper function for region string with default
  const getRegionString = () => {
    const region = [selectedCity, selectedDistrict, selectedNeighborhood].filter(Boolean).join(' ');
    return region && region.trim() !== '' ? region : '전체';
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
        검색타입: searchType,
      });

      // UI용 필터 상태 먼저 업데이트 (로딩 상태 표시용)
      setFilter(updatedFilter);

      // searchPosts 함수 호출 - 필터 변경 사항 적용하여 재검색
      const searchOptions = {
        page: updatedFilter.page !== undefined ? updatedFilter.page : 0,
        size: updatedFilter.size || 6,
        postType: '모임',
        region: getRegionString(),
        category: updatedFilter.category,
        tag: updatedFilter.tag,
        sort: updatedFilter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
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
      page: 0,
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
      fetchPosts({ ...filter, page: 0, resetSearch: true });
      return;
    }

    // 검색 모드 활성화
    setIsSearchMode(true);

    // 검색 시 필터 상태 업데이트
    const searchFilter = {
      ...filter,
      page: 0,
      postType: '모임' as PostType,
    };
    setFilter(searchFilter);

    // 검색 타입 그대로 전달 (postApi.ts에서 변환 처리)
    const searchOptions = {
      page: 0,
      size: 6,
      postType: '모임' as PostType,
      region: getRegionString(),
      category: selectedCategory,
      tag: filter.tag,
      sort: filter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
    };

    console.log('[DEBUG] 검색 API 파라미터:', {
      keyword: searchTerm,
      searchType,
      ...searchOptions,
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
  const handleCreatePost = () => {
    console.log('글 작성 버튼 클릭됨');
    navigate('/community/create');
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

  // 지역 변경 핸들러
  const { selectedCity, selectedDistrict, selectedNeighborhood } = useRegionStore();

  const handleRegionChange = (
    city: string | null,
    district: string | null,
    neighborhood: string | null
  ) => {
    const region = [city, district, neighborhood].filter(Boolean).join(' ');
    // 필터 업데이트
    const newFilter = {
      ...filter,
      location: region || '전체',
      page: 0,
    };
    applyFilterWithSearchState(newFilter);
  };

  return (

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

    <div>

      {/* 페이지 헤더 */}
      <PageHeaderText
        isMobile={isMobile}
        action={
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
        }
      >
        모임 게시판
      </PageHeaderText>


      {/* 커뮤니티 타입 전환 버튼 - 더 눈에 띄도록 개선 */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: '60px',
            p: 0.5,
            bgcolor: 'white',
            border: '3px solid #FFAAA5',
            boxShadow: '0 12px 40px rgba(255, 170, 165, 0.3)',
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value="groups"
            exclusive
            onChange={(e, newType) => {
              if (newType === 'board') {
                navigate('/community/board');
              }
            }}
            size="large"
            sx={{
              borderRadius: '50px',
              '& .MuiToggleButton-root': {
                borderRadius: '50px',
                border: 'none',
                px: 5,
                py: 2,
                minWidth: '160px',
                fontSize: '1.2rem',
                fontWeight: 700,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: '#FFAAA5',
                  color: 'white',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(255, 170, 165, 0.4)',
                  '&:hover': {
                    bgcolor: '#FF8B8B',
                    transform: 'scale(1.08)',
                  },
                },
                '&:not(.Mui-selected)': {
                  color: '#999',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 170, 165, 0.1)',
                    color: '#666',
                    transform: 'scale(1.02)',
                  },
                },

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

            <ToggleButton value="groups">
              📱 소모임
            </ToggleButton>
            <ToggleButton value="board">
              💬 자유게시판
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
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
              gridTemplateColumns: { xs: '1fr', sm: '1.2fr 2fr' },
              gap: 2,
            }}
          >
            {/* 지역 선택 (왼쪽) */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                지역 선택
              </Typography>
              <RegionSelector onChange={handleRegionChange} />
            </Box>

            {/* 오른쪽: 카테고리 선택(상단) + 태그 칩(하단) */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                카테고리 선택
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={selectedCategory}
                exclusive
                onChange={(e, newValue) => newValue && handleCategoryChange(newValue)}
                size="small"
                sx={{
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
                  mt: 1,
                }}
              >
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
                        ? 'rgba(255, 170, 165, 0.2)'
                        : 'transparent',
                      color: selectedTags.includes(tag) ? '#FF6B6B' : '#666',
                      '&:hover': {
                        backgroundColor: selectedTags.includes(tag)
                          ? 'rgba(255, 170, 165, 0.3)'
                          : 'rgba(255, 235, 235, 0.2)',
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
              {typeof postError === 'string'
                ? postError
                : '게시글을 불러오는 중 문제가 발생했습니다.'}
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
                resetSearch: true,
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
                resetSearch: true,
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

    </div>

  );
};

export default GroupListPage;
