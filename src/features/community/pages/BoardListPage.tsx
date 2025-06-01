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
import GroupIcon from '@mui/icons-material/Group';
import { styled } from '@mui/system';

import PostList from '../components/post/PostList';

import useCommunityStore from '../store/communityStore';
import { Post } from '../types';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostApi } from '../api/postApi';
import { PostType } from '../types-folder';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageStore } from '../../../features/theme/store/languageStore';
import { useLanguageContext } from '../../../features/theme/components/LanguageProvider';

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

const BoardListPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>(t('community.filters.all'));
  const [searchType, setSearchType] = useState<string>(t('community.searchType.titleContent'));
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  // 카테고리별 태그 매핑 - useState로 관리하여 언어 변경 시 자동 업데이트
  const [categoryTags, setCategoryTags] = useState<{[key: string]: string[]}>({
    travel: [],
    living: [],
    study: [],
    job: [],
    전체: [],
  });

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
  } = useCommunityStore();

  // 언어 변경 감지를 위한 ref
  const hasInitialDataLoaded = useRef(false);
  const { language } = useLanguageStore();

  // 태그 업데이트 함수를 useCallback으로 안정화
  const updateCategoryTags = useCallback(() => {
    const newCategoryTags = {
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
      전체: [], // 한국어 고정값 사용 (내부값)
    };

    setCategoryTags(newCategoryTags);
    console.log('[DEBUG] 언어 변경으로 카테고리 태그 업데이트:', newCategoryTags);

    // 현재 선택된 태그가 있으면 새로운 언어로 업데이트
    if (selectedTags.length > 0 && selectedCategory && selectedCategory !== '전체') {
      const newTags = newCategoryTags[selectedCategory as keyof typeof newCategoryTags] || [];
      console.log('[DEBUG] 선택된 태그 언어 업데이트:', {
        기존태그: selectedTags,
        새태그목록: newTags,
        카테고리: selectedCategory
      });
      
      // 기존 선택을 유지하되 새로운 언어의 첫 번째 태그로 업데이트 (임시 방안)
      if (newTags.length > 0 && selectedTags[0]) {
        setSelectedTags([newTags[0]]);
      }
    }
  }, [language, selectedTags, selectedCategory]); // 필요한 의존성만 포함

  // 언어 변경 시 카테고리 태그 업데이트
  useEffect(() => {
    updateCategoryTags();
  }, [updateCategoryTags]); // updateCategoryTags 변경 시에만 실행

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
    postType: (queryParams.get('postType') as PostType) || '자유',
  });

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    console.log('BoardListPage 컴포넌트 마운트, 게시글 목록 조회 시작');

    // 새 게시글 생성 플래그 확인 (localStorage)
    const newPostCreated = localStorage.getItem('newPostCreated');
    const newPostType = localStorage.getItem('newPostType');
    const isNewPostForThisPage = newPostCreated && newPostType === '자유';
    
    if (isNewPostForThisPage) {
      console.log('새 자유 게시글이 생성됨 - 강제 새로고침 실행');
      // 플래그 제거
      localStorage.removeItem('newPostCreated');
      localStorage.removeItem('newPostType');
    }

    // 항상 최신 데이터를 가져오도록 함

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
      postType: '자유' as PostType,
      location: '자유',
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
    if (location.pathname === '/community/board') {
      console.log('BoardListPage - /community/board 경로로 복귀, 최신 데이터 로드');
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

  // 언어 변경 감지 및 검색 상태 유지
  useEffect(() => {
    // 언어 변경 시 검색 상태가 아닐 때만 새로고침
    if (!isSearchMode) {
      console.log('[DEBUG] 언어 변경 감지됨, 게시글 목록 새로고침');

      // 검색 상태인 경우 검색 상태를 유지하면서 새로고침
      if (isSearchMode && searchTerm) {
        console.log('[DEBUG] 검색 상태에서 언어 변경 - 검색 상태 유지');

        // 약간의 지연 후 검색 재실행 (번역이 완료된 후)
        setTimeout(() => {
          handleSearch();
        }, 100);
      } else {
        // 검색 상태가 아니면 일반 게시글 목록 새로고침
        setTimeout(() => {
          fetchPosts({
            ...filter,
            _forceRefresh: Date.now()
          });
        }, 100);
      }
    }
  }, [currentLanguage]); // currentLanguage 의존성 사용

  // 검색 상태 표시를 위한 추가 컴포넌트
  const SearchStatusIndicator = () => {
    if (!isSearchMode || !searchTerm) return null;

    // 현재 적용된 필터 정보 표시
    const filterInfo: string[] = [];
    if (filter.category && filter.category !== t('community.filters.all')) {
      filterInfo.push(`${t('community.filters.category')}: ${filter.category}`);
    }
    if (filter.postType) {
      filterInfo.push(`${t('community.postTypes.all')}: ${filter.postType}`);
    }
    if (filter.location && filter.location !== '전체' && filter.location !== '자유') {
      filterInfo.push(`${t('community.filters.region')}: ${filter.location}`);
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
          "{searchTerm}" {t('community.messages.searchActive')}{' '}
          {searchType === t('community.searchType.titleContent')
            ? `(${t('community.searchType.titleContent')})`
            : `(${searchType})`}
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
          {t('community.actions.clearSearch')}
        </Button>
      </Box>
    );
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    console.log('[DEBUG] 카테고리 변경:', category);

    // 표시값을 내부값으로 변환
    const internalCategory = getInternalCategoryValue(category);
    console.log('[DEBUG] 내부 카테고리값:', internalCategory);

    // 이전 카테고리와 같으면 변경 없음
    if (internalCategory === selectedCategory) {
      console.log('[DEBUG] 같은 카테고리 선택, 변경 없음');
      return;
    }

    // 카테고리 상태 업데이트 (내부값으로)
    setSelectedCategory(internalCategory);

    // 카테고리에 맞는 태그 목록 설정
    if (internalCategory && internalCategory !== '전체') {
      setAvailableTags(categoryTags[internalCategory as keyof typeof categoryTags] || []);
    } else {
      setAvailableTags([]);
    }

    // 새 필터 생성 (내부값으로)
    const newFilter = {
      ...filter,
      category: internalCategory,
      page: 0,
    };

    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 필터 변경 시 검색 상태를 유지하는 함수
  const applyFilterWithSearchState = (newFilter: Partial<LocalPostFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };

    // 카테고리 값을 내부값으로 변환
    if (updatedFilter.category) {
      updatedFilter.category = getInternalCategoryValue(updatedFilter.category);
    }

    console.log('[DEBUG] 필터 적용 시 카테고리 변환:', {
      원본카테고리: newFilter.category,
      변환된카테고리: updatedFilter.category
    });

    if (isSearchMode && searchTerm) {
      // 검색 중이면 필터와 함께 검색 재실행
      setFilter(updatedFilter);
      
      // 검색 옵션을 제대로 구성하여 전달
      const searchOptions = {
        page: updatedFilter.page !== undefined ? updatedFilter.page : 0,
        size: updatedFilter.size || 6,
        postType: '자유' as PostType,
        region: selectedRegion,
        category: selectedCategory,
        tag: updatedFilter.tag,
        sort: updatedFilter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
      };

      console.log('[DEBUG] 필터 변경 시 검색 재실행 파라미터:', {
        keyword: searchTerm,
        searchType,
        ...searchOptions,
      });

      // postStore에 직접 요청
      try {
        const postApi = usePostStore.getState();
        postApi.searchPosts(searchTerm, searchType, searchOptions);
        console.log('필터 변경 시 검색 요청 전송 완료');
      } catch (error) {
        console.error('필터 변경 시 검색 중 오류 발생:', error);
      }
    } else {
      // 검색이 아니면 일반 게시글 목록 조회
      setFilter(updatedFilter);
      fetchPosts(updatedFilter);
    }
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

      // 번역된 태그를 한국어 원본 태그로 변환
      const originalTagName = getOriginalTagName(tag);
      console.log('[DEBUG] 태그 변환:', { 번역태그: tag, 원본태그: originalTagName });

      const updatedFilter = { ...filter };
      // 원본 태그명으로 설정 (백엔드에서 인식할 수 있는 한국어 태그)
      updatedFilter.tag = originalTagName;
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
      postType: '자유' as PostType,
    };
    setFilter(searchFilter);

    // 검색 타입 그대로 전달 (postApi.ts에서 변환 처리)
    const searchOptions = {
      page: 0,
      size: 6,
      postType: '자유' as PostType,
      region: selectedRegion,
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
      searchPosts(searchTerm, t('community.searchType.author'));
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
      page: 0,
    };

    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
  };

  // 내부 카테고리값 ↔ 표시값 매핑
  const CATEGORY_INTERNAL_VALUES = {
    ALL: '전체',
    TRAVEL: 'travel',
    LIVING: 'living',
    STUDY: 'study',
    JOB: 'job',
  } as const;

  // 표시값 → 내부값 변환
  const getInternalCategoryValue = (displayValue: string): string => {
    // 이미 내부값이면 그대로 반환
    if (Object.values(CATEGORY_INTERNAL_VALUES).includes(displayValue as any)) {
      return displayValue;
    }

    // 번역된 표시값을 내부값으로 변환
    if (displayValue === t('community.filters.all')) return CATEGORY_INTERNAL_VALUES.ALL;
    if (displayValue === t('community.categories.travel')) return CATEGORY_INTERNAL_VALUES.TRAVEL;
    if (displayValue === t('community.categories.living')) return CATEGORY_INTERNAL_VALUES.LIVING;
    if (displayValue === t('community.categories.study')) return CATEGORY_INTERNAL_VALUES.STUDY;
    if (displayValue === t('community.categories.job')) return CATEGORY_INTERNAL_VALUES.JOB;
    
    return displayValue; // 기본값
  };

  // 내부값 → 표시값 변환
  const getDisplayCategoryValue = (internalValue: string): string => {
    switch (internalValue) {
      case CATEGORY_INTERNAL_VALUES.ALL:
        return t('community.filters.all');
      case CATEGORY_INTERNAL_VALUES.TRAVEL:
        return t('community.categories.travel');
      case CATEGORY_INTERNAL_VALUES.LIVING:
        return t('community.categories.living');
      case CATEGORY_INTERNAL_VALUES.STUDY:
        return t('community.categories.study');
      case CATEGORY_INTERNAL_VALUES.JOB:
        return t('community.categories.job');
      default:
        return internalValue;
    }
  };

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
          {t('community.board.title')}
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
            value="board"
            exclusive
            onChange={(e, newType) => {
              if (newType === 'groups') {
                navigate('/community/group');
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
              },
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

          {/* 작성자 검색 버튼 */}
          <Button
            variant="outlined"
            onClick={handleAuthorSearch}
            startIcon={<PersonSearchIcon />}
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
            {t('community.actions.authorSearch')}
          </Button>
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
            {/* 지역 선택 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.filters.region')}
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedRegion}
                  onChange={e => handleRegionChange(e.target.value)}
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
                  <MenuItem value="전체">{t('community.filters.all')}</MenuItem>
                  <MenuItem value="자유">{t('community.postTypes.free')}</MenuItem>
                </Select>
              </FormControl>
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
    </Container>
  );
};

export default BoardListPage;
