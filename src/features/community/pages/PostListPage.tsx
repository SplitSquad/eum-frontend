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
    console.log('PostListPage 컴포넌트 마운트, 게시글 목록 조회 시작');

    // 페이지 진입 시 검색 상태 초기화
    setIsSearchMode(false);
    setSearchTerm('');
    setSearchType(t('community.searchType.titleContent'));
    setSelectedTags([]); // 태그 선택도 초기화

    // selectedCategory를 내부값으로 강제 설정 (번역된 값이 올 수 있으므로)
    const currentCategory = selectedCategory;
    const internalCategory = getInternalCategoryValue(currentCategory);
    if (currentCategory !== internalCategory) {
      console.log(
        '[DEBUG] selectedCategory 내부값으로 수정:',
        currentCategory,
        '->',
        internalCategory
      );
      setSelectedCategory(internalCategory);
    }

    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(categoryTags[filter.category as keyof typeof categoryTags] || []);
    }

    // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역, 태그 없음)
    const initialFilter: LocalPostFilter = {
      ...filter,
      postType: '자유' as PostType,
      location: '자유',
      page: 0,
      size: 6,
    };
    // 태그 제거
    delete initialFilter.tag;
    setFilter(initialFilter);

    // 게시글 목록 조회 - 항상 최신 데이터 가져오기
    fetchPosts({
      ...initialFilter,
      _forceRefresh: Date.now() // 강제 새로고침으로 최신 데이터 가져오기
    });
    // 인기 게시글 로드
    fetchTopPosts(5);

    // 초기 데이터 로드 완료 플래그 설정
    initialDataLoadedRef.current = true;
    hasInitialDataLoaded.current = true;
  }, []);

  // 페이지 재진입 감지 - location.pathname이 변경될 때 새 데이터 로드 및 검색 상태 초기화
  useEffect(() => {
    if (hasInitialDataLoaded.current && location.pathname === '/community/board') {
      console.log('PostListPage - /community/board 경로로 복귀, 검색 상태 초기화 및 최신 데이터 로드');
      
      // 검색 상태 초기화
      setIsSearchMode(false);
      setSearchTerm('');
      setSearchType(t('community.searchType.titleContent'));
      setSelectedTags([]); // 태그 선택도 초기화
      
      // 약간의 지연 후 새로고침 (네비게이션 완료 후)
      setTimeout(() => {
        fetchPosts({
          ...filter,
          _forceRefresh: Date.now()
        });
      }, 100);
    }
  }, [location.pathname, t]);

  // 언어 변경 감지 및 검색 상태 유지
  useEffect(() => {
    // 초기 로드가 완료된 후에만 언어 변경에 반응
    if (!hasInitialDataLoaded.current) {
      return;
    }

    console.log('[DEBUG] 언어 변경 감지됨:', language);

    // 언어 변경 시 현재 카테고리를 내부값으로 변환하여 정규화
    const currentFilter = { ...filter };
    if (currentFilter.category) {
      const normalizedCategory = getInternalCategoryValue(currentFilter.category);
      currentFilter.category = normalizedCategory;
      console.log('[DEBUG] 언어 변경 시 카테고리 정규화:', {
        원본: filter.category,
        정규화됨: normalizedCategory
      });
    }

    // 검색 상태인 경우 검색 상태를 유지하면서 새로고침
    if (isSearchMode && searchTerm) {
      console.log('[DEBUG] 검색 상태에서 언어 변경 - 검색 상태 유지');
      
      // 약간의 지연 후 검색 재실행 (번역이 완료된 후)
      setTimeout(() => {
        setFilter(currentFilter);
        searchPosts(searchTerm, searchType, currentFilter);
      }, 100);
    } else {
      // 검색 상태가 아니면 일반 게시글 목록 새로고침
      setTimeout(() => {
        setFilter(currentFilter);
        fetchPosts({ 
          ...currentFilter, 
          _forceRefresh: true // 언어 변경 표시
        });
      }, 100);
    }
    
    // 언어 변경 시 초기 데이터 로드 플래그 리셋
    hasInitialDataLoaded.current = false;
  }, [language]);

  // 검색 타입 번역 매핑 (공통 사용)
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
    // 프랑스어
    'Titre+Contenu': '제목_내용',
    Titre: '제목',
    Contenu: '내용',
    Auteur: '작성자',
    // 독일어 & 스페인어 (둘 다 'Autor' 사용)
    'Titel+Inhalt': '제목_내용',
    'Título+Contenido': '제목_내용',
    Titel: '제목',
    Título: '제목',
    Inhalt: '내용',
    Contenido: '내용',
    Autor: '작성자', // 독일어와 스페인어 공통
    // 러시아어
    'Заголовок+Содержание': '제목_내용',
    Заголовок: '제목',
    Содержание: '내용',
    Автор: '작성자',
    // 일본어
    'タイトル・内용': '제목_내용',
    'タイトル+内용': '제목_내용',
    'タイトル+內容': '제목_내용',
    タイトル: '제목',
    '内容_JP': '내용', // 일본어 내용 (중국어와 구분)
    內容: '내용',
    作成者: '작성자',
    // 중국어 간체
    '标题+内容': '제목_내용',
    标题: '제목',
    '内容_CN': '내용', // 중국어 간체 내용
    '作者_CN': '작성자', // 중국어 간체 작성자
    // 중국어 번체
    '標題+內容': '제목_내용',
    標題: '제목',
    '內容_TW': '내용', // 중국어 번체 내용
    '作者_TW': '작성자', // 중국어 번체 작성자
    // 실제 번역 파일 값들 (중복 제거를 위해 별도 추가)
    作者: '작성자', // 중국어 (간체/번체 공통) 실제 번역값
  };

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
      // 검색 타입을 한국어로 변환 (공통 매핑 사용)
      const convertedSearchType = searchTypeMapping[searchType] || searchType;
      
      // 디버깅: 매핑 상태 확인
      console.log('[DEBUG] 검색 타입 매핑 디버깅:', {
        원본: searchType,
        변환: convertedSearchType,
        매핑존재여부: searchType in searchTypeMapping,
        매핑값: searchTypeMapping[searchType],
        작성자관련키들: Object.keys(searchTypeMapping).filter(key => key.includes('作') || key.includes('者') || key.includes('Author') || key.includes('Autor'))
      });
      
      console.log('[DEBUG] 필터 변경 시 검색 타입 변환:', {
        원본: searchType,
        변환: convertedSearchType
      });

      // 지역도 한국어로 변환
      const regionTranslationMap: Record<string, string> = {
        '전체': '전체', '자유': '자유',
        'All': '전체', 'Free': '자유',
        'Tout': '전체', 'Libre_FR': '자유',
        'Alle': '전체', 'Alles': '전체', 'Frei': '자유',
        'Todo': '전체', 'Todos': '전체', 'Libre_ES': '자유',
        'Всё': '전체', 'Все': '전체', 'Свободный': '자유',
        'すべて': '전체', '全て': '전체', '全体': '전체', '自由': '자유',
        '全部': '전체', '所有': '전체', '自由_CN': '자유',
        '全體': '전체', '自由_TW': '자유',
      };

      // updatedFilter에서 region을 가져와서 변환
      const currentRegion = updatedFilter.location || '전체';
      const convertedRegion = regionTranslationMap[currentRegion] || currentRegion;
      
      console.log('[DEBUG] 필터 변경 시 지역 변환:', {
        원본지역: currentRegion,
        변환지역: convertedRegion
      });
      console.log('[DEBUG] selectedRegion 상태값 확인:', {
        selectedRegion값: currentRegion,
        selectedRegion타입: typeof currentRegion,
        regionTranslationMap키들: Object.keys(regionTranslationMap).filter(key => key.includes('全') || key.includes('전체'))
      });

      // 검색 중이면 필터와 함께 검색 재실행
      console.log('[DEBUG] 검색 상태에서 필터 변경 - 세부 정보:', {
        현재필터: filter,
        새필터: newFilter,
        업데이트된필터: updatedFilter,
        검색어: searchTerm,
        검색타입: convertedSearchType,
        변환된지역: convertedRegion,
      });

      setFilter(updatedFilter);
      
      // 변환된 지역을 포함한 옵션으로 검색 실행
      const searchOptionsWithConvertedRegion = {
        ...updatedFilter,
        region: convertedRegion, // 변환된 지역 사용
      };
      
      searchPosts(searchTerm, convertedSearchType, searchOptionsWithConvertedRegion);
    } else {
      // 검색이 아니면 일반 게시글 목록 조회
      console.log('[DEBUG] 일반 상태에서 필터 변경:', updatedFilter);
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

    // 번역된 검색 타입을 한국어로 변환 (공통 매핑 사용)
    const convertedSearchType = searchTypeMapping[searchType] || searchType;
    
    console.log('[DEBUG] 검색 타입 변환:', { 원본: searchType, 변환: convertedSearchType });

    // 변환된 검색 타입을 상태에도 저장 (다른 검색 경로에서도 사용하기 위해)
    setSearchType(convertedSearchType);

    // 지역도 한국어로 변환
    const regionTranslationMap: Record<string, string> = {
      // 한국어 (원본값은 그대로)
      '전체': '전체',
      '자유': '자유',
      // 영어
      'All': '전체',
      'Free': '자유',
      // 프랑스어
      'Tout': '전체',
      'Libre_FR': '자유',
      // 독일어
      'Alle': '전체',
      'Alles': '전체',
      'Frei': '자유',
      // 스페인어
      'Todo': '전체',
      'Todos': '전체',
      'Libre_ES': '자유',
      // 러시아어
      'Всё': '전체',
      'Все': '전체',
      'Свободный': '자유',
      // 일본어
      'すべて': '전체',
      '全て': '전체',
      '全体': '전체', // 일본어/중국어 공통
      '自由': '자유',
      // 중국어 간체
      '全部': '전체',
      '所有': '전체',
      '自由_CN': '자유',
      // 중국어 번체
      '全體': '전체',
      '自由_TW': '자유',
    };

    const convertedRegion = regionTranslationMap[selectedRegion] || selectedRegion;
    
    console.log('[DEBUG] 지역 변환:', { 원본: selectedRegion, 변환: convertedRegion });

    const searchOptions = {
      page: 0,
      size: 6,
      postType: postTypeForSearch,
      region: convertedRegion, // 변환된 지역 사용
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
            value={location.pathname.includes('/groups') ? 'groups' : 'board'}
            exclusive
            onChange={(e, newType) => {
              if (newType === 'groups') {
                // 소모임으로 이동하기 전에 검색 상태 초기화
                setIsSearchMode(false);
                setSearchTerm('');
                setSearchType(t('community.searchType.titleContent'));
                // groups 페이지가 없으면 일단 board로 이동하되 URL 파라미터로 구분
                navigate('/community/board?type=groups');
              } else if (newType === 'board') {
                // 자유게시판으로 이동하기 전에 검색 상태 초기화
                setIsSearchMode(false);
                setSearchTerm('');
                setSearchType(t('community.searchType.titleContent'));
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
              <MenuItem value={t('community.searchType.titleContent')}>
                {t('community.searchType.titleContent')}
              </MenuItem>
              <MenuItem value={t('community.searchType.title')}>
                {t('community.searchType.title')}
              </MenuItem>
              <MenuItem value={t('community.searchType.content')}>
                {t('community.searchType.content')}
              </MenuItem>
              <MenuItem value={t('community.searchType.author')}>
                {t('community.searchType.author')}
              </MenuItem>
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
                  <IconButton
                    size="small"
                    onClick={handleSearch}
                    title={t('community.actions.search')}
                  >
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
                <ToggleButton
                  value={CATEGORY_INTERNAL_VALUES.ALL}
                  sx={{ minWidth: isMobile ? '30%' : '20%' }}
                >
                  {t('community.filters.all')}
                </ToggleButton>
                <ToggleButton
                  value={CATEGORY_INTERNAL_VALUES.TRAVEL}
                  sx={{ minWidth: isMobile ? '30%' : '20%' }}
                >
                  {t('community.categories.travel')}
                </ToggleButton>
                <ToggleButton
                  value={CATEGORY_INTERNAL_VALUES.LIVING}
                  sx={{ minWidth: isMobile ? '30%' : '20%' }}
                >
                  {t('community.categories.living')}
                </ToggleButton>
                <ToggleButton
                  value={CATEGORY_INTERNAL_VALUES.STUDY}
                  sx={{ minWidth: isMobile ? '30%' : '20%' }}
                >
                  {t('community.categories.study')}
                </ToggleButton>
                <ToggleButton
                  value={CATEGORY_INTERNAL_VALUES.JOB}
                  sx={{ minWidth: isMobile ? '30%' : '20%' }}
                >
                  {t('community.categories.job')}
                </ToggleButton>
              </ToggleButtonGroup>

              {/* 카테고리에 따른 태그 선택 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: '#555' }}
                >
                  {t('community.filters.tags')} <span style={{ fontSize: '0.9em', color: '#999', fontWeight: 400 }}>(하나만 선택 가능)</span>
                </Typography>
                {selectedTags.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      setSelectedTags([]);
                      const updatedFilter = { ...filter };
                      delete updatedFilter.tag;
                      updatedFilter.page = 0;
                      applyFilterWithSearchState(updatedFilter);
                    }}
                    sx={{
                      fontSize: '0.8rem',
                      color: '#FF6B6B',
                      minWidth: 'auto',
                      px: 1,
                      '&:hover': {
                        bgcolor: 'rgba(255, 170, 165, 0.1)',
                      },
                    }}
                  >
                    해제
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagSelect(tag)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: '20px',
                        borderColor: isSelected ? '#FF6B6B' : '#FFD7D7',
                        backgroundColor: isSelected
                          ? '#FFAAA5'
                          : 'transparent',
                        color: isSelected ? 'white' : '#666',
                        fontWeight: isSelected ? 600 : 400,
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(255, 170, 165, 0.3)' : 'none',
                        '&:hover': {
                          backgroundColor: isSelected
                            ? '#FF8B8B'
                            : 'rgba(255, 235, 235, 0.3)',
                          transform: 'scale(1.08)',
                          cursor: 'pointer',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    />
                  );
                })}
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
