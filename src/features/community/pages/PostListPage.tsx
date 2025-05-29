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
import { useSnackbar } from 'notistack';

import SpringBackground from '../components/shared/SpringBackground';
import CategoryTabs from '../components/shared/CategoryTabs';
import PostList from '../components/post/PostList';
import RegionSelector from '../components/shared/RegionSelector';
import PostTypeSelector from '../components/shared/PostTypeSelector';

import useCommunityStore from '../store/communityStore';
import { Post } from '../types';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostApi } from '../api/postApi';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageStore } from '../../../features/theme/store/languageStore';

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
  sortBy: 'latest' | 'popular' | 'oldest';
  size: number;
  page: number;
  keyword?: string;
  searchActive?: boolean; // 검색 활성화 여부
}

const PostListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchType, setSearchType] = useState<string>(t('community.searchType.titleContent'));
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [selectedPostType, setSelectedPostType] = useState<SelectablePostType>('ALL');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

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

  // 내부값 → 표시값 변환 
  const getDisplayCategoryValue = (internalValue: string): string => {
    switch (internalValue) {
      case CATEGORY_INTERNAL_VALUES.ALL: return t('community.filters.all');
      case CATEGORY_INTERNAL_VALUES.TRAVEL: return t('community.categories.travel');
      case CATEGORY_INTERNAL_VALUES.LIVING: return t('community.categories.living');
      case CATEGORY_INTERNAL_VALUES.STUDY: return t('community.categories.study');
      case CATEGORY_INTERNAL_VALUES.JOB: return t('community.categories.job');
      default: return internalValue;
    }
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
  } = useCommunityStore();

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

    // selectedCategory를 내부값으로 강제 설정 (번역된 값이 올 수 있으므로)
    const currentCategory = selectedCategory;
    const internalCategory = getInternalCategoryValue(currentCategory);
    if (currentCategory !== internalCategory) {
      console.log('[DEBUG] selectedCategory 내부값으로 수정:', currentCategory, '->', internalCategory);
      setSelectedCategory(internalCategory);
    }

    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(
        categoryTags[filter.category as keyof typeof categoryTags] || []
      );
    }

    // 태그가 있으면 선택된 태그 상태 설정
    if (filter.tag) {
      setSelectedTags(filter.tag.split(','));
    }

    // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역)
    const initialFilter: LocalPostFilter = {
      ...filter,
      postType: '자유' as PostType,
      location: '자유',
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
    
    // 언어 변경 시에는 현재 필터 상태 유지 (번역 정규화 제거)
    
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
        fetchPosts(filter);
      }, 100);
    }
    
    // 언어 변경 시 초기 데이터 로드 플래그 리셋
    hasInitialDataLoaded.current = false;
  }, [language]);

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

    // 약간의 지연 후 데이터 로드 (UI 상태 변경 후)
    setTimeout(() => {
    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
      setIsTransitioning(false);
    }, 50);
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

    // 검색용 postType 설정
    let postTypeForSearch = selectedPostType === 'ALL' ? '자유' : (selectedPostType as PostType);

    // 검색 시 필터 상태 업데이트
    const searchFilter = {
      ...filter,
      page: 0,
      postType: postTypeForSearch,
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
      'Autor_ES': '작성자', // 스페인어 작성자 구분
      // 러시아어
      'Заголовок+Содержание': '제목_내용',
      'Заголовок': '제목',
      'Содержание': '내용',
      'Автор': '작성자',
      // 일본어
      'タイトル+内용': '제목_내용',
      'タイトル': '제목',
      '内容': '내용',
      '作成者': '작성자',
      // 중국어 간체
      '标题+内容': '제목_내용',
      '标题': '제목',
      '内容_CN': '내용', // 중국어 간체 내용 구분
      '作者_CN': '작성자', // 중국어 간체 작성자 구분
      // 중국어 번체
      '標題+內容': '제목_내용',
      '標題': '제목',
      '內容_TW': '내용', // 중국어 번체 내용 구분
      '作者_TW': '작성자', // 중국어 번체 작성자 구분
    };
    
    convertedSearchType = searchTypeMapping[searchType] || searchType;
    console.log('[DEBUG] 검색 타입 변환:', { 원본: searchType, 변환: convertedSearchType });

    const searchOptions = {
      page: 0,
      size: 6,
      postType: postTypeForSearch,
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

  // 게시글 타입(자유/모임) 변경 핸들러
  const handlePostTypeChange = (newPostType: 'ALL' | '자유' | '모임') => {
    if (!newPostType) return; // 값이 null이면 무시

    console.log('[DEBUG] 게시글 타입 변경 시작:', newPostType);

    // 이전 타입과 같으면 변경 없음
    if (
      (newPostType === 'ALL' && selectedPostType === 'ALL') ||
      (newPostType === '자유' && selectedPostType === '자유') ||
      (newPostType === '모임' && selectedPostType === '모임')
    ) {
      console.log('[DEBUG] 같은 게시글 타입 선택, 변경 없음');
      return;
    }

    // 즉시 UI 상태 변경으로 깜빡임 방지
    setIsTransitioning(true);

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
    } else {
      // 모임 게시글
      newFilter.postType = '모임' as PostType; // 명시적으로 타입 설정
      // 모임 게시글은 기존 지역 유지하거나 새로 설정
      if (newFilter.location === '자유') {
        newFilter.location = '전체'; // 기존에 자유였으면 전체로 변경
      }
      console.log(
        `[DEBUG] 모임 게시글 선택: postType을 '모임'로 설정, location: ${newFilter.location}`
      );
    }

    // 지역 선택기 업데이트
    setSelectedRegion(newFilter.location);

    // 페이지 초기화
    newFilter.page = 0;

    // 약간의 지연 후 데이터 로드 (UI 상태 변경 후)
    setTimeout(() => {
    // 필터 적용 (검색 상태 유지하면서)
    applyFilterWithSearchState(newFilter);
      setIsTransitioning(false);
    }, 50);
  };

  // 지역 변경 핸들러
  const handleRegionChange = (
    city: string | null,
    district: string | null,
    neighborhood: string | null
  ) => {
    const region = [city, district, neighborhood].filter(Boolean).join(' ');
    console.log('[DEBUG] 지역 변경:', region);

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
      {/* 디버깅 정보 패널 
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
          선택 카테고리: {selectedCategory} | 카테고리 타입: {typeof selectedCategory} | 게시글 수:{' '}
          {posts.length} <br />
          선택 게시글 타입: {selectedPostType} | 필터 게시글 타입: {filter.postType || 'ALL'} <br />
          로딩 상태: {postLoading ? 'LOADING...' : 'READY'} | 오류: {postError || 'NONE'}
        </Typography>
      </Paper>*/}

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
          value={location.pathname.includes('/groups') ? 'groups' : 'board'}
          exclusive
          onChange={(e, newType) => {
            if (newType === 'groups') {
              navigate('/community/groups');
            } else if (newType === 'board') {
              navigate('/community/board');
            }
          }}
          size="large"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50px',
            border: '2px solid rgba(255, 170, 165, 0.3)',
            boxShadow: '0 8px 24px rgba(255, 170, 165, 0.2)',
            '& .MuiToggleButton-root': {
              borderRadius: '50px',
              border: 'none',
              px: 4,
              py: 1.5,
              minWidth: '140px',
              fontSize: '1.1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 170, 165, 0.9)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 107, 0.9)',
                },
              },
              '&:not(.Mui-selected)': {
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(255, 235, 235, 0.5)',
                },
              },
            },
          }}
        >
          <ToggleButton value="groups">
            소모임
          </ToggleButton>
          <ToggleButton value="board">
            자유게시판
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
            <InputLabel id="search-type-label">{t('community.searchType.label')}</InputLabel>
            <Select
              labelId="search-type-label"
              id="search-type"
              value={searchType}
              onChange={handleSearchTypeChange}
              label={t('community.searchType.label')}
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
              <MenuItem value={t('community.searchType.title')}>{t('community.searchType.title')}</MenuItem>
              <MenuItem value={t('community.searchType.content')}>{t('community.searchType.content')}</MenuItem>
              <MenuItem value={t('community.searchType.author')}>{t('community.searchType.author')}</MenuItem>
            </Select>
          </FormControl>

          {/* 검색창 */}
          <TextField
            placeholder={t('community.search.placeholder')}
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
                  <IconButton size="small" onClick={handleSearch} title={t('community.actions.search')}>
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
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.postTypes.label')}
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
                  {t('community.postTypes.all')}
                </ToggleButton>
                <ToggleButton value="자유" sx={{ width: '33%' }}>
                  {t('community.postTypes.free')}
                </ToggleButton>
                <ToggleButton value="모임" sx={{ width: '33%' }}>
                  {t('community.postTypes.meeting')}
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
                  {t('community.filters.region')}
                </Typography>
                <RegionSelector onChange={handleRegionChange} />
              </Box>
            )}

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
                  {t('community.filters.all')}
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
            {t('buttons.reset')}
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

export default PostListPage;
