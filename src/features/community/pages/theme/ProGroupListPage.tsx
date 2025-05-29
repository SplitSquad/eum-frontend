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
import { styled } from '@mui/system';

import SpringBackground from '../../components/shared/SpringBackground';
import CategoryTabs from '../../components/shared/CategoryTabs';
import PostList from '../../components/post/PostList';
import RegionSelector from '../../components/shared/RegionSelector';
import PostTypeSelector from '../../components/shared/PostTypeSelector';

import useCommunityStore from '../../store/communityStore';
import { Post } from '../../types';
import useAuthStore from '@/features/auth/store/authStore';
import { usePostStore } from '../../store/postStore';
import { PostApi } from '../../api/postApi';
import { PostType } from '../../types-folder';
import { useRegionStore } from '../../store/regionStore';
import { useTranslation } from '@/shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';

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
const proCard = {
  background: 'rgba(255,255,255,0.5)',
  border: '1.5px solid #222',
  borderRadius: 10,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
  marginBottom: 24,
  padding: 24,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
};
const proButton = {
  background: 'rgba(255,255,255,1)',
  border: '1.5px solid #222',
  borderRadius: 8,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  fontWeight: 600,
  color: '#222',
  padding: '10px 28px',
  margin: '0 8px',
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'background 0.2s, color 0.2s, border 0.2s',
  outline: 'none',
};
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

const ProGroupListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<string>(t('community.searchType.titleContent'));
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  // 태그 번역 역변환 함수 (번역된 태그 → 한국어 원본 태그)
  const getOriginalTagName = (translatedTag: string): string => {
    const tagReverseMapping: Record<string, string> = {
      // 관광/여행 관련
      [t('community.tags.tourism')]: '관광/체험',
      [t('community.tags.food')]: '식도락/맛집',
      [t('community.tags.transport')]: '교통/이동',
      [t('community.tags.accommodation')]: '숙소/지역정보',
      [t('community.tags.embassy')]: '대사관/응급',
      // 생활 관련
      [t('community.tags.realEstate')]: '부동산/계약',
      [t('community.tags.livingEnvironment')]: '생활환경/편의',
      [t('community.tags.culture')]: '문화/생활',
      [t('community.tags.housing')]: '주거지 관리/유지',
      // 학업 관련
      [t('community.tags.academic')]: '학사/캠퍼스',
      [t('community.tags.studySupport')]: '학업지원/시설',
      [t('community.tags.visa')]: '행정/비자/서류',
      [t('community.tags.dormitory')]: '기숙사/주거',
      // 취업 관련
      [t('community.tags.career')]: '이력/채용준비',
      [t('community.tags.labor')]: '비자/법률/노동',
      [t('community.tags.jobFair')]: '잡페어/네트워킹',
      [t('community.tags.partTime')]: '알바/파트타임',
    };

    return tagReverseMapping[translatedTag] || translatedTag;
  };

  // 카테고리별 태그 매핑
  const categoryTags = {
    travel: [
      t('community.tags.tourism'),
      t('community.tags.food'),
      t('community.tags.transport'),
      t('community.tags.accommodation'),
      t('community.tags.embassy'),
    ],
    living: [
      t('community.tags.realEstate'),
      t('community.tags.livingEnvironment'),
      t('community.tags.culture'),
      t('community.tags.housing'),
    ],
    study: [
      t('community.tags.academic'),
      t('community.tags.studySupport'),
      t('community.tags.visa'),
      t('community.tags.dormitory'),
    ],
    job: [
      t('community.tags.career'),
      t('community.tags.labor'),
      t('community.tags.jobFair'),
      t('community.tags.partTime'),
    ],
    전체: [],
  };

  // 현재 선택된 카테고리에 해당하는 태그 목록
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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
    topPosts,
  } = useCommunityStore();

  // 현재 URL에서 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);

  // URL 쿼리 파라미터에서 필터 상태 초기화
  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || t('community.filters.all'),
    location: queryParams.get('location') || t('community.filters.all'),
    tag: queryParams.get('tag') || '',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: queryParams.get('page') ? parseInt(queryParams.get('page') as string) - 1 : 0,
    size: 6,
    postType: (queryParams.get('postType') as PostType) || '모임',
  });

  // 컴포넌트 마운트 시 게시글 목록 조회를 위한 트래킹
  const initialDataLoadedRef = useRef(false);

  // 언어 변경 감지를 위한 ref
  const hasInitialDataLoaded = useRef(false);
  const { language } = useLanguageStore();

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    // 이미 데이터를 로드했으면 중복 요청 방지
    if (initialDataLoadedRef.current) {
      console.log('PostListPage - 이미 초기 데이터가 로드됨, 중복 요청 방지');
      return;
    }

    console.log('PostListPage 컴포넌트 마운트, 게시글 목록 조회 시작');

    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== t('community.filters.all')) {
      setAvailableTags(categoryTags[filter.category as keyof typeof categoryTags] || []);
    }

    // 태그가 있으면 선택된 태그 상태 설정
    if (filter.tag) {
      setSelectedTags(filter.tag.split(','));
    }

    // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역)
    const initialFilter = {
      ...filter,
      postType: '모임' as PostType,
      location: '전체',
      page: 0,
      size: 6,
    };
    setFilter(initialFilter);

    // 게시글 목록 조회
    fetchPosts(initialFilter);
    // 인기 게시글 로드
    fetchTopPosts(5);

    // 초기 데이터 로드 완료 플래그 설정
    initialDataLoadedRef.current = true;
    hasInitialDataLoaded.current = true;
  }, []);

  // 언어 변경 감지 및 검색 상태 유지
  useEffect(() => {
    // 초기 로드가 완료된 후에만 언어 변경에 반응
    if (!hasInitialDataLoaded.current) {
      return;
    }

    console.log('[DEBUG] 언어 변경 감지됨:', language);

    // 검색 상태인 경우 검색 상태를 유지하면서 새로고침
    if (isSearchMode && searchTerm) {
      console.log('[DEBUG] 검색 상태에서 언어 변경 - 검색 상태 유지');

      // 약간의 지연 후 검색 재실행 (번역이 완료된 후)
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
    // 언어 변경 시 초기 데이터 로드 플래그 리셋
    hasInitialDataLoaded.current = false;
  }, [language]);

  // 검색 상태 표시기 컴포넌트
  const SearchStatusIndicator = () => {
    if (!isSearchMode) return null;

    return (
      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: 'rgba(255, 235, 235, 0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 170, 165, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon sx={{ color: '#FF6B6B' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {t('community.messages.searchActive')}: "{searchTerm}" ({searchType})
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={() => {
            setIsSearchMode(false);
            setSearchTerm('');
            fetchPosts({
              ...filter,
              page: 0,
              resetSearch: true,
            });
          }}
          sx={{
            color: '#FF6B6B',
            textTransform: 'none',
            fontSize: '0.875rem',
          }}
        >
          {t('community.actions.clearSearch')}
        </Button>
      </Box>
    );
  };

  // 지역 문자열 생성 함수
  const getRegionString = () => {
    const { selectedCity, selectedDistrict, selectedNeighborhood } = useRegionStore.getState();
    return (
      [selectedCity, selectedDistrict, selectedNeighborhood].filter(Boolean).join(' ') || '전체'
    );
  };

  // 필터 적용 함수 (검색 상태 고려)
  const applyFilterWithSearchState = (newFilter: Partial<LocalPostFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);

    // URL 업데이트
    const params = new URLSearchParams();
    if (updatedFilter.category && updatedFilter.category !== '전체') {
      params.set('category', updatedFilter.category);
    }
    if (updatedFilter.location && updatedFilter.location !== '전체') {
      params.set('location', updatedFilter.location);
    }
    if (updatedFilter.tag) {
      params.set('tag', updatedFilter.tag);
    }
    if (updatedFilter.sortBy) {
      params.set('sortBy', updatedFilter.sortBy);
    }
    if (updatedFilter.page && updatedFilter.page > 0) {
      params.set('page', (updatedFilter.page + 1).toString());
    }
    if (updatedFilter.postType) {
      params.set('postType', updatedFilter.postType);
    }

    // URL 업데이트 (페이지 새로고침 없이)
    const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);

    // 검색 모드인지 확인하고 적절한 API 호출
    if (isSearchMode && searchTerm) {
      // 검색 모드일 때는 검색 API 사용
      searchPosts(searchTerm, searchType, updatedFilter);
    } else {
      // 일반 모드일 때는 일반 게시글 조회 API 사용
      fetchPosts(updatedFilter);
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    console.log('카테고리 변경:', category);

    // 이전 카테고리와 같으면 변경 없음
    if (category === selectedCategory) {
      console.log('같은 카테고리 선택, 변경 없음');
      return;
    }

    setSelectedCategory(category);

    // 카테고리에 맞는 태그 목록 업데이트
    setAvailableTags(categoryTags[category as keyof typeof categoryTags] || []);

    // 선택된 태그 초기화
    setSelectedTags([]);

    // 필터 업데이트
    const newFilter = {
      ...filter,
      category,
      tag: '', // 태그 초기화
      page: 0,
    };

    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    console.log('태그 선택:', tag);

    let newSelectedTags: string[];
    let originalTagNames: string[];

    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그면 제거
      newSelectedTags = selectedTags.filter(t => t !== tag);
      // 원본 태그명들로 변환
      originalTagNames = newSelectedTags.map(t => getOriginalTagName(t));
    } else {
      // 새로운 태그 추가
      newSelectedTags = [...selectedTags, tag];
      // 원본 태그명들로 변환
      originalTagNames = newSelectedTags.map(t => getOriginalTagName(t));
    }

    setSelectedTags(newSelectedTags);

    console.log('[DEBUG] 태그 변환:', {
      번역태그들: newSelectedTags,
      원본태그들: originalTagNames,
    });

    // 필터 업데이트 - 원본 태그명들로 설정
    const newFilter = {
      ...filter,
      tag: originalTagNames.join(','),
      page: 0,
    };

    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 검색 타입 변경 핸들러
  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    setSearchType(event.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      console.log('검색어가 비어있음');
      return;
    }

    console.log('검색 실행:', searchTerm, searchType);

    // 번역된 검색 타입을 한국어로 변환
    let convertedSearchType = searchType;
    const searchTypeMapping: Record<string, string> = {
      // 한국어 (이미 변환된 상태)
      '제목+내용': '제목_내용',
      제목: '제목',
      내용: '내용',
      작성자: '작성자',
      // 영어
      'Title+Content': '제목_내용',
      Title: '제목',
      Content: '내용',
      Author: '작성자',
    };

    convertedSearchType = searchTypeMapping[searchType] || searchType;
    console.log('[DEBUG] 검색 타입 변환:', { 원본: searchType, 변환: convertedSearchType });

    // 검색 모드 활성화
    setIsSearchMode(true);

    // 검색 API 호출
    searchPosts(searchTerm, convertedSearchType, {
      ...filter,
      page: 0, // 검색 시 첫 페이지로 이동
    });
  };

  // 작성자 검색 핸들러
  const handleAuthorSearch = () => {
    if (!searchTerm.trim()) {
      console.log('검색어가 비어있음');
      return;
    }

    console.log('작성자 검색 실행:', searchTerm);

    // 검색 타입을 작성자로 변경하고 검색 실행
    setSearchType(t('community.searchType.author'));
    setIsSearchMode(true);

    // 검색 API 호출 - 작성자는 항상 '작성자'로 변환
    searchPosts(searchTerm, '작성자', {
      ...filter,
      page: 0,
    });
  };

  // 엔터 키 검색 핸들러
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
    <div>
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
            fontFamily: '"Noto Sans KR", sans-serif',
          }}
        >
          {t('community.groups.title')}
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
          {t('community.posts.writePost')}
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
            {showFilters ? t('community.actions.hideFilters') : t('community.actions.showFilters')}
          </Button>

          {/* 정렬 버튼 */}
          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label={t('community.filters.sortBy')}
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
              {t('community.filters.latest')}
            </Button>
            <Button
              onClick={() => handleSortChange('popular')}
              sx={{
                fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal',
                bgcolor: filter.sortBy === 'popular' ? 'rgba(255, 235, 235, 0.4)' : 'transparent',
              }}
            >
              {t('community.filters.popular')}
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
            <InputLabel id="search-type-label">{t('community.searchType.titleContent')}</InputLabel>
            <Select
              labelId="search-type-label"
              id="search-type"
              value={searchType}
              onChange={handleSearchTypeChange}
              label={t('community.searchType.titleContent')}
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
              <MenuItem value={t('community.searchType.titleContent')}>
                {t('community.searchType.titleContent')}
              </MenuItem>
              <MenuItem value={t('community.searchType.author')}>
                {t('community.searchType.author')}
              </MenuItem>
            </Select>
          </FormControl>

          {/* 검색창 */}
          <TextField
            placeholder={t('community.searchPlaceholder')}
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
                  <IconButton size="small" onClick={handleSearch} title={t('common.search')}>
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
            {/* 지역 선택  */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.filters.region')}
              </Typography>
              <RegionSelector onChange={handleRegionChange} />
            </Box>

            {/* 카테고리와 태그 영역(통합) */}
            <Box sx={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.filters.category')}
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
                  {t('community.categories.all')}
                </ToggleButton>
                <ToggleButton value="travel" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.travel')}
                </ToggleButton>
                <ToggleButton value="living" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.living')}
                </ToggleButton>
                <ToggleButton value="study" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.study')}
                </ToggleButton>
                <ToggleButton value="job" sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.job')}
                </ToggleButton>
              </ToggleButtonGroup>

              {/* 카테고리에 따른 태그 선택 */}
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600, color: '#555', mt: 2 }}
              >
                {t('community.filters.tags')}
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
            {t('community.messages.loadingPosts')}
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
              {t('common.error')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {typeof postError === 'string'
                ? postError
                : t('community.messages.errorLoadingPosts')}
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
            {t('common.error')}
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
              {t('community.messages.noResults')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {t('community.messages.noResults')}
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
            {t('community.board.showAll')}
          </Button>
        </Box>
      ) : (
        /* 게시글 목록 */
        <Box sx={{ flex: 1, minHeight: '400px' }}>
          <PostList />
        </Box>
      )}
    </div>
  );
};

export default ProGroupListPage;
