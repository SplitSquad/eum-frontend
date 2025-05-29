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

import PostList from '../components/post/PostList';

import useCommunityStore from '../store/communityStore';
import { Post } from '../types';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostApi } from '../api/postApi';
import { PostType } from '../types-folder';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageStore } from '../../../features/theme/store/languageStore';
import { useCommunityPageState } from '../hooks/useCommunityPageState';
import { debugLog, debugError } from '../../../shared/utils/debug';
import { CommunityErrorBoundary } from '../components/shared/CommunityErrorBoundary';
import { PostListSkeleton, InlineLoading } from '../components/shared/LoadingStates';

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
  sortBy: 'latest' | 'popular' | 'oldest';
  size: number;
  page: number;
  keyword?: string;
  searchActive?: boolean; // 검색 활성화 여부
}

const BoardListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // 기타 상태 관리
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchType, setSearchType] = useState<string>(t('community.searchType.titleContent'));
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pageTransitioning, setPageTransitioning] = useState<boolean>(false); // 페이지 전환 로딩 상태

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
    travel: [t('community.tags.tourism'), t('community.tags.food'), t('community.tags.transport'), t('community.tags.accommodation'), t('community.tags.embassy')],
    living: [t('community.tags.realEstate'), t('community.tags.livingEnvironment'), t('community.tags.culture'), t('community.tags.housing')],
    study: [t('community.tags.academic'), t('community.tags.studySupport'), t('community.tags.visa'), t('community.tags.dormitory')],
    job: [t('community.tags.career'), t('community.tags.labor'), t('community.tags.jobFair'), t('community.tags.partTime')],
    '전체': [], // 한국어 고정값 사용 (내부값)
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
    return displayValue; // 기본값
  };

  // availableTags는 이제 커스텀 훅에서 관리됨

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

  // 커스텀 훅으로 상태 관리
  const {
    selectedTags, setSelectedTags,
    isSearchMode, setIsSearchMode,
    searchTerm, setSearchTerm,
    availableTags, setAvailableTags,
  } = useCommunityPageState('board', setSelectedCategory, fetchPosts, fetchTopPosts);

  // selectedCategory를 내부값으로 강제 설정하는 useEffect 추가
  useEffect(() => {
    const currentCategory = selectedCategory;
    const internalCategory = getInternalCategoryValue(currentCategory);
    if (currentCategory !== internalCategory) {
      console.log('[DEBUG] BoardListPage - selectedCategory 내부값으로 수정:', currentCategory, '->', internalCategory);
      setSelectedCategory(internalCategory);
    }
  }, [selectedCategory, setSelectedCategory]);

  // 현재 URL에서 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);

  // URL 쿼리 파라미터에서 필터 상태 초기화 (상수 사용)
  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || '전체',
    location: queryParams.get('location') || '자유',
    tag: queryParams.get('tag') || undefined,
    postType: (queryParams.get('postType') as PostType) || '자유',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular' | 'oldest') || 'latest',
    size: 6,
    page: parseInt(queryParams.get('page') || '1') - 1, // URL은 1부터 시작, 내부는 0부터
  });

  // 검색 상태 표시를 위한 추가 컴포넌트
  const SearchStatusIndicator = () => {
    if (!isSearchMode || !searchTerm) return null;

    // 현재 적용된 필터 정보 표시
    const filterInfo: string[] = [];
    if (filter.category && filter.category !== '전체') {
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
          "{searchTerm}" {t('community.messages.searchActive')} {searchType === t('community.searchType.titleContent') ? `(${t('community.searchType.titleContent')})` : `(${searchType})`}
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
        postType: '자유' as PostType,
        region: updatedFilter.location,
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
    console.log('[DEBUG] ===== 카테고리 변경 시작 =====');
    console.log('[DEBUG] 이전 카테고리:', selectedCategory);
    console.log('[DEBUG] 새 카테고리:', category);

    // 표시값을 내부값으로 변환
    const internalCategory = getInternalCategoryValue(category);
    console.log('[DEBUG] 내부 카테고리값:', internalCategory);

    // 이전 카테고리와 같으면 변경 없음
    if (internalCategory === selectedCategory) {
      console.log('[DEBUG] 같은 카테고리 선택, 변경 없음');
      return;
    }

    // 즉시 UI 상태 변경으로 깜빡임 방지
    setIsTransitioning(true);
    
    // 검색 모드 해제
    setIsSearchMode(false);
    setSearchTerm('');

    // 선택된 태그 완전 초기화
    setSelectedTags([]);

    // 카테고리 상태 업데이트 (내부값으로)
    setSelectedCategory(internalCategory);

    // 카테고리에 맞는 태그 목록 설정
    if (internalCategory && internalCategory !== '전체') {
      const newAvailableTags = categoryTags[internalCategory as keyof typeof categoryTags] || [];
      setAvailableTags(newAvailableTags);
    } else {
      setAvailableTags([]);
    }

    // 완전히 새로운 필터 생성 (이전 필터와 완전 분리)
    const newFilter: LocalPostFilter = {
      category: internalCategory, // 내부값 사용
      postType: '자유',
      location: '자유',
      tag: undefined, // 태그 명시적으로 초기화
      sortBy: 'latest',
      size: 6,
      page: 0,
    };

    setFilter(newFilter);

    // 약간의 지연 후 데이터 로드 (UI 상태 변경 후)
    setTimeout(() => {
      fetchPosts(newFilter);
      setIsTransitioning(false);
    }, 50);
    
    console.log('[DEBUG] ===== 카테고리 변경 완료 =====');
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    console.log('[DEBUG] 태그 선택:', tag);

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
      원본태그들: originalTagNames 
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

    // 번역된 검색 타입을 한국어로 변환
    let convertedSearchType = searchType;
    const searchTypeMapping: Record<string, string> = {
      // 한국어 (이미 변환된 상태)
      '제목+내용': '제목_내용',
      '제목': '제목',
      '내용': '내용',
      '작성자': '작성자',
      // 영어
      'Title+Content': '제목_내용',
      'Title': '제목',
      'Content': '내용',
      'Author': '작성자',
      // 프랑스어
      'Titre+Contenu': '제목_내용',
      'Titre': '제목',
      'Contenu': '내용',
      'Auteur': '작성자',
      // 독일어
      'Titel+Inhalt': '제목_내용',
      'Titel': '제목',
      'Inhalt': '내용',
      'Autor': '작성자',
      // 스페인어
      'Título+Contenido': '제목_내용',
      'Título': '제목',
      'Contenido': '내용',
      'Autor_ES': '작성자',
      // 러시아어
      'Заголовок+Содержание': '제목_내용',
      'Заголовок': '제목',
      'Содержание': '내용',
      'Автор': '작성자',
      // 일본어
      'タイトル+内容': '제목_내용',
      'タイトル': '제목',
      '内容': '내용',
      '作成者': '작성자',
      // 중국어 간체
      '标题+内容': '제목_내용',
      '标题': '제목',
      '内容_CN': '내용',
      '作者_CN': '작성자',
      // 중국어 번체
      '標題+內容': '제목_내용',
      '標題': '제목',
      '內容_TW': '내용',
      '作者_TW': '작성자',
    };
    
    convertedSearchType = searchTypeMapping[searchType] || searchType;
    console.log('[DEBUG] 검색 타입 변환:', { 원본: searchType, 변환: convertedSearchType });

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
      searchType: convertedSearchType,
      ...searchOptions,
    });

    // 검색 요청 직접 실행
    try {
      const postApi = usePostStore.getState();
      postApi.searchPosts(searchTerm, convertedSearchType, searchOptions);
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
  const handleSortChange = (sortBy: 'latest' | 'popular' | 'oldest') => {
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

  return (
    <CommunityErrorBoundary>
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

      {/* 커뮤니티 타입 전환 버튼 */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={location.pathname === '/community/board' ? 'board' : 'groups'}
          exclusive
          onChange={(e, newType) => {
            if (newType && newType !== (location.pathname === '/community/board' ? 'board' : 'groups')) {
              setPageTransitioning(true);
              
              // 즉시 네비게이션으로 더 빠른 전환
              if (newType === 'groups') {
                navigate('/community/groups');
              } else if (newType === 'board') {
                navigate('/community/board');
              }
              
              // 전환 상태 빠르게 해제
              setTimeout(() => {
                setPageTransitioning(false);
              }, 50);
            }
          }}
          aria-label="community type"
          size="large"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50px',
            border: '2px solid rgba(255, 170, 165, 0.3)',
            boxShadow: '0 8px 24px rgba(255, 170, 165, 0.2)',
            opacity: pageTransitioning ? 0.8 : 1,
            transform: pageTransitioning ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.2s ease-out',
            '& .MuiToggleButton-root': {
              borderRadius: '50px',
              border: 'none',
              px: 4,
              py: 1.5,
              minWidth: '140px',
              fontSize: '1.1rem',
              fontWeight: 600,
              transition: 'all 0.2s ease-out',
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 170, 165, 0.9)',
                color: 'white',
                transform: 'scale(1.02)',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 107, 0.9)',
                },
              },
              '&:not(.Mui-selected)': {
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(255, 235, 235, 0.5)',
                  transform: 'scale(1.01)',
                },
              },
            },
          }}
        >
          <ToggleButton value="groups">
            소모임 {pageTransitioning && location.pathname.includes('/board') && 
              <CircularProgress size={16} sx={{ ml: 1, color: 'inherit' }} />}
          </ToggleButton>
          <ToggleButton value="board">
            자유게시판 {pageTransitioning && location.pathname.includes('/groups') && 
              <CircularProgress size={16} sx={{ ml: 1, color: 'inherit' }} />}
          </ToggleButton>
        </ToggleButtonGroup>
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
              <MenuItem value={t('community.searchType.titleContent')}>{t('community.searchType.titleContent')}</MenuItem>
              <MenuItem value={t('community.searchType.author')}>{t('community.searchType.author')}</MenuItem>
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
                <ToggleButton value={CATEGORY_INTERNAL_VALUES.ALL} sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.all')}
                </ToggleButton>
                <ToggleButton value={CATEGORY_INTERNAL_VALUES.TRAVEL} sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.travel')}
                </ToggleButton>
                <ToggleButton value={CATEGORY_INTERNAL_VALUES.LIVING} sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.living')}
                </ToggleButton>
                <ToggleButton value={CATEGORY_INTERNAL_VALUES.STUDY} sx={{ minWidth: isMobile ? '30%' : '20%' }}>
                  {t('community.categories.study')}
                </ToggleButton>
                <ToggleButton value={CATEGORY_INTERNAL_VALUES.JOB} sx={{ minWidth: isMobile ? '30%' : '20%' }}>
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
      {postLoading || isTransitioning ? (
        <PostListSkeleton count={6} />
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
    </CommunityErrorBoundary>
  );
};

export default BoardListPage;
