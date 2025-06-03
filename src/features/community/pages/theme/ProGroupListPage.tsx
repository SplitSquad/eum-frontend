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
import flowerImg from '@/assets/icons/common/연꽃.png';
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

  const {
    posts,
    postLoading,
    postError,
    fetchPosts,
    setPostFilter,
    searchPosts,
    fetchTopPosts,
    topPosts,
    resetPostsState,
  } = useCommunityStore();

  // 🔥 소모임 페이지별 독립적인 selectedCategory 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 🔥 컴포넌트 마운트 즉시 이전 페이지 데이터 초기화 (헤더 네비게이션 대응)
  React.useLayoutEffect(() => {
    // useLayoutEffect는 DOM 변경 전에 동기적으로 실행되어 깜빡임 방지
    const currentPosts = usePostStore.getState().posts;
    if (currentPosts.length > 0) {
      // 이전 페이지의 posts가 있다면 즉시 초기화
      resetPostsState();
      usePostStore.setState({ postLoading: true, posts: [] });
    }

    // 🔥 소모임 진입 시 상태 즉시 초기화 (다른 페이지에서 오는 경우 대응)
    console.log(
      'ProGroupListPage - Already initializing or data loaded, preventing duplicate request'
    );
    setSelectedCategory('전체');
    setSelectedTags([]);
    setAvailableTags([]);
  }, [resetPostsState]);

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

  // 카테고리별 태그 매핑 - useState로 관리하여 언어 변경 시 자동 업데이트
  const [categoryTags, setCategoryTags] = useState<{ [key: string]: string[] }>({
    travel: [],
    living: [],
    study: [],
    job: [],
    전체: [],
  });

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
    console.log('ProGroup 언어 변경으로 카테고리 태그 업데이트:', newCategoryTags);
  }, [language]); // language 변경 시에만 재생성

  // 언어 변경 시 카테고리 태그 업데이트
  useEffect(() => {
    updateCategoryTags();
  }, [updateCategoryTags]); // updateCategoryTags 변경 시에만 실행

  // 현재 선택된 카테고리에 해당하는 태그 목록
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 카테고리 또는 카테고리 태그가 변경될 때 사용 가능한 태그 목록 업데이트
  useEffect(() => {
    if (selectedCategory && selectedCategory !== '전체') {
      const newAvailableTags = categoryTags[selectedCategory as keyof typeof categoryTags] || [];
      setAvailableTags(newAvailableTags);
      console.log('ProGroup 카테고리/언어 변경으로 태그 목록 업데이트:', {
        카테고리: selectedCategory,
        새태그목록: newAvailableTags,
      });
    } else {
      setAvailableTags([]);
    }
  }, [selectedCategory, categoryTags]); // selectedCategory와 categoryTags 변경 시 실행

  // 현재 URL에서 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);

  // URL 쿼리 파라미터에서 필터 상태 초기화
  const [filter, setFilter] = useState<LocalPostFilter>(() => {
    // localStorage에서 소모임 전용 검색 상태 복구
    const savedState = localStorage.getItem('proGroupSearch');
    const saved = savedState ? JSON.parse(savedState) : {};

    return {
      category: queryParams.get('category') || saved.category || t('community.filters.all'),
      location: queryParams.get('location') || saved.location || t('community.filters.all'),
      tag: queryParams.get('tag') || saved.tag || '',
      sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || saved.sortBy || 'latest',
      page: queryParams.get('page') ? parseInt(queryParams.get('page') as string) - 1 : 0,
      size: 6,
      postType: '모임', // ProGroupListPage는 항상 모임 게시글
    };
  });

  // 검색 상태를 localStorage에 저장하는 함수
  const saveSearchState = (searchTerm: string, searchType: string, isActive: boolean) => {
    const searchState = {
      searchTerm,
      searchType,
      isSearchMode: isActive,
      category: filter.category,
      location: filter.location,
      tag: filter.tag,
      sortBy: filter.sortBy,
      selectedTags: selectedTags, // 태그 상태도 저장
      timestamp: Date.now(),
    };
    localStorage.setItem('proGroupSearch', JSON.stringify(searchState));
  };

  // 컴포넌트 마운트 시 게시글 목록 조회를 위한 트래킹
  const initialDataLoadedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    // 이미 초기화 중이거나 데이터를 로드했으면 중복 요청 방지
    if (isInitializingRef.current || initialDataLoadedRef.current) {
      console.log(
        'ProGroupListPage - Already initializing or data loaded, preventing duplicate request'
      );
      return;
    }

    // 초기화 시작
    isInitializingRef.current = true;
    console.log('ProGroupListPage component mounted, starting post list fetch');

    // 🔥 페이지 진입 시 태그 상태 무조건 초기화
    console.log('ProGroupListPage - 소모임 진입 - 태그 상태 초기화');
    setSelectedTags([]);

    // localStorage에서 저장된 검색 상태 복구
    const savedState = localStorage.getItem('proGroupSearch');
    if (savedState) {
      try {
        const saved = JSON.parse(savedState);
        // 1시간 이내의 검색 상태만 복구
        if (saved.timestamp && Date.now() - saved.timestamp < 60 * 60 * 1000) {
          if (saved.isSearchMode && saved.searchTerm) {
            setSearchTerm(saved.searchTerm);
            setSearchType(saved.searchType || t('community.searchType.titleContent'));
            setIsSearchMode(true);
            console.log('ProGroup 검색 상태 복구:', saved);

            // postStore에도 소모임 검색 상태 설정
            const postStore = usePostStore.getState();
            postStore.searchStates['모임'] = {
              active: true,
              term: saved.searchTerm,
              type: saved.searchType || t('community.searchType.titleContent'),
            };
          }

          // 🔥 소모임 전용 태그 상태만 복구 (검색 상태가 활성화된 경우에만)
          if (
            saved.isSearchMode &&
            saved.selectedTags &&
            Array.isArray(saved.selectedTags) &&
            saved.selectedTags.length > 0 &&
            saved.category &&
            saved.category !== '전체' &&
            saved.category !== t('community.filters.all')
          ) {
            console.log('ProGroup 검색 모드 - 태그 상태 복구:', saved.selectedTags);
            // 카테고리가 유효한 경우에만 태그 상태 복구
            setSelectedTags(saved.selectedTags);
          } else {
            // 조건을 만족하지 않으면 태그 상태 명시적 초기화
            console.log('ProGroup - 태그 상태 복구 조건 불만족, 명시적 초기화');
            setSelectedTags([]);
          }
        } else {
          // 만료된 상태 제거
          localStorage.removeItem('proGroupSearch');
        }
      } catch (error) {
        console.error('Error during search:', error);
        localStorage.removeItem('proGroupSearch');
      }
    }

    // postStore에서 소모임 검색 상태 확인
    const storeSearchState = usePostStore.getState().searchStates['모임'];
    if (storeSearchState?.active && storeSearchState?.term && !isSearchMode) {
      setSearchTerm(storeSearchState.term);
      setSearchType(storeSearchState.type || t('community.searchType.titleContent'));
      setIsSearchMode(true);
      console.log('postStore에서 소모임 검색 상태 복구:', storeSearchState);
    } else {
      // 소모임이 아닌 다른 postType의 검색 상태가 활성화되어 있다면 초기화
      const otherPostTypes = Object.keys(usePostStore.getState().searchStates).filter(
        pt => pt !== '모임'
      );
      const hasOtherActiveSearch = otherPostTypes.some(
        pt => usePostStore.getState().searchStates[pt].active
      );

      if (hasOtherActiveSearch) {
        console.log('다른 postType의 검색 상태 감지, 소모임 검색 상태 초기화');
        // 소모임 검색 상태만 초기화
        const postStore = usePostStore.getState();
        postStore.searchStates['모임'] = {
          active: false,
          term: '',
          type: '',
        };
      }
    }

    // 현재 카테고리에 맞는 태그 목록 설정
    if (filter.category && filter.category !== t('community.filters.all')) {
      setAvailableTags(categoryTags[filter.category as keyof typeof categoryTags] || []);
    }

    // 태그가 있으면 선택된 태그 상태 설정
    if (filter.tag) {
      setSelectedTags(filter.tag.split(','));
    }

    // 초기 로드 시 명시적으로 기본 필터 설정 (모임 게시글, 전체 지역)
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
    isInitializingRef.current = false;
  }, []); // 의존성 배열을 비워서 마운트 시에만 실행

  // 언어 변경 감지 및 검색 상태 유지 (언어 의존성만 포함)
  useEffect(() => {
    // 초기 로드가 완료되지 않았거나 초기화 중이면 무시
    if (!initialDataLoadedRef.current || isInitializingRef.current) {
      return;
    }

    console.log('언어 변경 감지됨:', language);

    // 검색 상태인 경우 검색 상태를 유지하면서 새로고침
    if (isSearchMode && searchTerm) {
      console.log('검색 상태에서 언어 변경 - 검색 상태 유지');

      // 약간의 지연 후 검색 재실행 (번역이 완료된 후)
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  }, [language]); // 언어 변경에만 반응

  // 컴포넌트 언마운트 시 정리 작업 (뒤로가기 무한 로딩 방지)
  useEffect(() => {
    return () => {
      console.log('ProGroupListPage 언마운트 - 로딩 상태 정리');
      // 언마운트 시 로딩 상태만 false로 설정 (데이터는 유지)
      const postStore = usePostStore.getState();
      if (postStore.postLoading) {
        usePostStore.setState({ postLoading: false });
      }
    };
  }, []);

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
            setSelectedTags([]); // 태그 상태도 초기화
            saveSearchState('', searchType, false); // 검색 상태 초기화

            // postStore에서도 소모임 검색 상태 초기화
            const postStore = usePostStore.getState();
            postStore.searchStates['모임'] = {
              active: false,
              term: '',
              type: '',
            };

            fetchPosts({
              ...filter,
              page: 0,
              tag: undefined, // 태그 필터도 제거
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

  // 지역 문자열 생성 함수 수정
  const getRegionString = () => {
    const { selectedCity, selectedDistrict, selectedNeighborhood } = useRegionStore.getState();
    const region = [selectedCity, selectedDistrict, selectedNeighborhood].filter(Boolean).join(' ');
    return region || '전체';
  };

  // 필터 적용 함수 (검색 상태 고려) 수정
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
      const searchOptions = {
        page: updatedFilter.page !== undefined ? updatedFilter.page : 0,
        size: updatedFilter.size || 6,
        postType: '모임' as PostType,
        region: updatedFilter.location || '전체',
        category: updatedFilter.category,
        tag: updatedFilter.tag,
        sort: updatedFilter.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
      };

      console.log('검색 API 파라미터:', searchOptions);

      try {
        const postApi = usePostStore.getState();
        postApi.searchPosts(searchTerm, searchType, searchOptions);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      }
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

    // 카테고리 상태 업데이트
    setSelectedCategory(category);

    // 🔥 태그 상태 완전 초기화 (카테고리가 바뀌면 태그도 무조건 초기화)
    console.log('카테고리 변경으로 태그 완전 초기화');
    setSelectedTags([]);

    // 카테고리에 맞는 태그 목록 즉시 설정
    const newAvailableTags =
      category && category !== t('community.filters.all')
        ? categoryTags[category as keyof typeof categoryTags] || []
        : [];
    setAvailableTags(newAvailableTags);
    console.log('새 카테고리의 사용 가능한 태그:', newAvailableTags);

    // 필터 업데이트 - 태그 완전 제거
    const newFilter = {
      ...filter,
      category,
      tag: undefined, // 태그 완전 제거
      page: 0,
    };

    console.log('카테고리 변경 후 새 필터 (태그 제거됨):', newFilter);

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

    console.log('태그 변환:', {
      번역태그들: newSelectedTags,
      원본태그들: originalTagNames,
    });

    // 필터 업데이트 - 원본 태그명들로 설정
    const newFilter = {
      ...filter,
      tag: originalTagNames.length > 0 ? originalTagNames.join(',') : undefined,
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
      console.log('Search term is empty');
      setIsSearchMode(false);
      saveSearchState('', searchType, false); // 검색 상태 초기화

      // postStore에서도 소모임 검색 상태 초기화
      const postStore = usePostStore.getState();
      postStore.searchStates['모임'] = {
        active: false,
        term: '',
        type: '',
      };

      fetchPosts({ ...filter, page: 0, resetSearch: true });
      return;
    }

    console.log('Search execution:', searchTerm, searchType);

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
    console.log('검색 타입 변환:', { 원본: searchType, 변환: convertedSearchType });

    // 검색 모드 활성화
    setIsSearchMode(true);
    saveSearchState(searchTerm, searchType, true); // 검색 상태 저장

    // postStore에도 소모임 검색 상태 설정
    const postStore = usePostStore.getState();
    postStore.searchStates['모임'] = {
      active: true,
      term: searchTerm,
      type: searchType,
    };

    // 검색 API 호출
    searchPosts(searchTerm, convertedSearchType, {
      ...filter,
      page: 0, // 검색 시 첫 페이지로 이동
    });
  };

  // 작성자 검색 핸들러
  const handleAuthorSearch = () => {
    if (!searchTerm.trim()) {
      console.log('Search term is empty');
      return;
    }

    console.log('Author search execution:', searchTerm);

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
    console.log('Write post button clicked');
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
    console.log('Sort method changed:', sortBy);

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
    console.log('지역 변경:', { city, district, neighborhood, region });

    // 필터 업데이트
    const newFilter = {
      ...filter,
      location: region || '전체',
      page: 0,
    };

    // 검색 상태 고려하여 필터 적용
    applyFilterWithSearchState(newFilter);
  };

  const isTagActive = selectedCategory !== '전체';

  // 페이지 전환 시 이전 데이터가 보이는 것을 방지하는 핸들러
  const handleNavigateToBoard = () => {
    // 1. 즉시 posts 데이터 초기화 및 로딩 상태 설정
    resetPostsState();

    // 2. postStore에서도 로딩 상태 즉시 설정
    usePostStore.setState({ postLoading: true, posts: [] });

    // 3. 모든 상태 즉시 초기화
    setSelectedCategory('전체');
    setSelectedTags([]);
    setAvailableTags([]);

    // 4. 약간의 지연 후 네비게이션 (초기화가 UI에 반영될 시간)
    setTimeout(() => {
      navigate('/community/board');
    }, 50);
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{ borderBottom: '1.5px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 16px',
            }}
          >
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: '#111',
                    fontFamily: '"Noto Sans KR", sans-serif',
                  }}
                >
                  {t('community.groups.title')}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 6,
                }}
              >
                <p
                  style={{
                    color: '#666',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    margin: 0,
                    flex: 1,
                    marginRight: 32,
                  }}
                >
                  {t('community.groups.description')}
                </p>
                {!isMobile && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '320px',
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      style={{
                        minWidth: 120,
                        background: '#fafafa',
                        borderRadius: 8,
                        border: '1.5px solid #bbb',
                        color: '#222',
                      }}
                    >
                      <InputLabel id="search-type-label">
                        {t('community.searchType.titleContent')}
                      </InputLabel>
                      <Select
                        labelId="search-type-label"
                        id="search-type"
                        value={searchType}
                        onChange={handleSearchTypeChange}
                        label={t('community.searchType.titleContent')}
                        style={{ background: '#fafafa', borderRadius: 8, color: '#222' }}
                      >
                        <MenuItem value={t('community.searchType.titleContent')}>
                          {t('community.searchType.titleContent')}
                        </MenuItem>
                        <MenuItem value={t('community.searchType.author')}>
                          {t('community.searchType.author')}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      placeholder={t('community.searchPlaceholder')}
                      variant="outlined"
                      size="small"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        background: '#fafafa',
                        borderRadius: 8,
                        border: '1.5px solid #bbb',
                        color: '#222',
                        minWidth: 160,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={handleSearch}
                              title={t('common.search')}
                            >
                              <SearchIcon fontSize="small" sx={{ color: '#888' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 커뮤니티 타입 전환 버튼 - Pro 테마용 
      <div
        style={{
          borderBottom: '1.5px solid #e5e7eb',
          paddingBottom: '24px',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              border: '1.5px solid #222',
              borderRadius: '50px',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}
          >
            <button
              style={{
                ...proButton,
                margin: 0,
                padding: '12px 32px',
                borderRadius: 0,
                border: 'none',
                backgroundColor: '#222',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                cursor: 'default',
              }}
            >
              {t('common.smallGroups')}
            </button>
            <button
              onClick={() => navigate('/community/board')}
              style={{
                ...proButton,
                margin: 0,
                padding: '12px 32px',
                borderRadius: 0,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.1)';
                e.currentTarget.style.color = '#222';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#666';
              }}
            >
              {t('common.communicationBoard')}
            </button>
          </div>
        </div>
      </div>*/}

      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: isMobile ? '16px 4vw' : '32px 16px',
          height: 'auto',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 0 : 8,
            alignItems: 'flex-start',
            minWidth: 0,
            width: '100%',
            height: 'auto',
          }}
        >
          {/* 메인 컨텐츠 */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              paddingRight: isMobile ? 0 : 32,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* 카테고리/아이콘 영역 */}
            {isMobile ? (
              <div style={{ width: '100%', marginBottom: 24 }}>
                {/* 아이콘+텍스트+Communication Board 버튼 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  <img
                    src={flowerImg}
                    alt="logo"
                    style={{ height: 22, width: 22, objectFit: 'contain', verticalAlign: 'middle' }}
                  />
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#111',
                      fontFamily: proCard.fontFamily,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {selectedCategory === '전체'
                      ? t('infoPage.content.allInfo')
                      : t(`community.categories.${selectedCategory}`) || selectedCategory}
                  </h2>
                  <button
                    onClick={handleNavigateToBoard}
                    style={{
                      ...proButton,
                      padding: '6px 0',
                      fontSize: 15,
                      width: 'auto',
                      minWidth: 90,
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: '#f7f7f7',
                      color: '#333',
                      fontWeight: 600,
                      margin: 0,
                      boxShadow: 'none',
                      transition: 'background 0.2s, color 0.2s',
                      outline: 'none',
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.07)';
                      e.currentTarget.style.color = '#111';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#f7f7f7';
                      e.currentTarget.style.color = '#333';
                    }}
                  >
                    {t('common.communicationBoard')}
                  </button>
                </div>
              </div>
            ) : (
              // 데스크탑 기존 레이아웃
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 24,
                  width: '100%',
                  minWidth: 0,
                }}
              >
                {/* 왼쪽: 카테고리 아이콘과 텍스트 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <img
                    src={flowerImg}
                    alt="logo"
                    style={{ height: 22, width: 22, objectFit: 'contain', verticalAlign: 'middle' }}
                  />
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#111',
                      fontFamily: proCard.fontFamily,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {selectedCategory === '전체'
                      ? t('infoPage.content.allInfo')
                      : t(`community.categories.${selectedCategory}`) || selectedCategory}
                  </h2>
                </div>
                {/* 오른쪽: 글쓰기 버튼과 정렬 드롭다운 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                    justifyContent: 'flex-end',
                    minWidth: 0,
                  }}
                >
                  <button
                    onClick={handleNavigateToBoard}
                    style={{
                      ...proButton,
                      padding: '6px 16px',
                      fontSize: 14,
                      background: '#222',
                      color: '#fff',
                      border: '1.5px solid #222',
                      borderRadius: 6,
                      margin: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#000';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#222';
                    }}
                  >
                    {t('common.communicationBoard')}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    style={{
                      ...proButton,
                      padding: '6px 16px',
                      fontSize: 14,
                      background: selectedCategory === 'all' ? '#222' : '#f3f4f6',
                      color: selectedCategory === 'all' ? '#fff' : '#222',
                      border:
                        selectedCategory === 'all' ? '1.5px solid #222' : '1.5px solid #e5e7eb',
                      borderRadius: 6,
                      margin: 0,
                    }}
                  >
                    {t('community.posts.writePost')}
                  </button>
                  <select
                    value={filter.sortBy}
                    onChange={e => handleSortChange(e.target.value as 'latest' | 'popular')}
                    style={{
                      padding: '6px 16px',
                      fontSize: 14,
                      border: '1.5px solid #222',
                      borderRadius: 6,
                      background: '#fff',
                      color: '#222',
                      fontWeight: 600,
                      fontFamily: proCard.fontFamily,
                      outline: 'none',
                      cursor: 'pointer',
                      minWidth: 100,
                      marginRight: 0,
                    }}
                  >
                    <option value="latest">{t('community.filters.latest')}</option>
                    <option value="popular">{t('community.filters.popular')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* 필터 영역 */}
            <Divider sx={{ mb: 2, borderColor: '#e5e7eb' }} />

            {/* 모바일에서만 Divider 아래에 검색바 */}
            {isMobile && (
              <div style={{ display: 'flex', gap: 8, width: '100%', margin: '12px 0 12px 0' }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{
                    minWidth: 120,
                    background: '#fafafa',
                    borderRadius: 8,
                    border: '1.5px solid #bbb',
                    color: '#222',
                    flex: 1,
                  }}
                >
                  <InputLabel id="search-type-label">
                    {t('community.searchType.titleContent')}
                  </InputLabel>
                  <Select
                    labelId="search-type-label"
                    id="search-type"
                    value={searchType}
                    onChange={handleSearchTypeChange}
                    label={t('community.searchType.titleContent')}
                    style={{ background: '#fafafa', borderRadius: 8, color: '#222' }}
                  >
                    <MenuItem value={t('community.searchType.titleContent')}>
                      {t('community.searchType.titleContent')}
                    </MenuItem>
                    <MenuItem value={t('community.searchType.author')}>
                      {t('community.searchType.author')}
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  placeholder={t('community.searchPlaceholder')}
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    background: '#fafafa',
                    borderRadius: 8,
                    border: '1.5px solid #bbb',
                    color: '#222',
                    minWidth: 120,
                    flex: 2,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleSearch} title={t('common.search')}>
                          <SearchIcon fontSize="small" sx={{ color: '#888' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}

            {/* 카테고리와 태그 영역(분리) */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                width: '100%',
                minWidth: 0,
                margin: 0,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1.2fr 2fr' },
                  gap: 2,
                  alignItems: 'start',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                {/* 지역 선택 (왼쪽) */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: '#222' }}
                  >
                    {t('community.filters.region')}
                  </Typography>
                  <RegionSelector onChange={handleRegionChange} />
                </Box>
                {/* 오른쪽: 카테고리 선택(상단) + 태그 칩(하단) */}
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#222', mb: 1, textAlign: 'left' }}
                  >
                    {t('community.filters.category')}
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={selectedCategory}
                    exclusive
                    onChange={(e, newValue) => newValue && handleCategoryChange(newValue)}
                    size="small"
                    sx={{
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                      overflowX: isMobile ? 'visible' : 'auto',
                      mb: 2,
                      minWidth: 0,
                      '& .MuiToggleButton-root': {
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        mb: 0,
                        minWidth: isMobile ? 70 : 80,
                        whiteSpace: 'nowrap',
                        '&.Mui-selected': {
                          bgcolor: '#fafafa',
                          color: '#222',
                          fontWeight: 'bold',
                        },
                        '&:hover': {
                          bgcolor: '#fafafa',
                        },
                      },
                      '& .MuiToggleButtonGroup-grouped': {
                        borderRadius: '8px !important',
                        mx: 0.5,
                      },
                    }}
                  >
                    <ToggleButton value="전체">{t('community.categories.all')}</ToggleButton>
                    <ToggleButton value="travel">{t('community.categories.travel')}</ToggleButton>
                    <ToggleButton value="living">{t('community.categories.living')}</ToggleButton>
                    <ToggleButton value="study">{t('community.categories.study')}</ToggleButton>
                    <ToggleButton value="job">{t('community.categories.job')}</ToggleButton>
                  </ToggleButtonGroup>
                  {selectedCategory !== '전체' && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: '#222', mt: 1, mb: 0.5, textAlign: 'left' }}
                      >
                        {t('community.filters.tags')}
                      </Typography>
                      <Box
                        key={`proGroupTags-${selectedCategory}-${selectedTags.length}-${Date.now() % 1000}`}
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 0.5,
                          minWidth: 0,
                        }}
                      >
                        {availableTags.map(tag => (
                          <Chip
                            key={`proGroupTag-${tag}-${selectedTags.includes(tag) ? 'selected' : 'unselected'}`}
                            label={tag}
                            onClick={isTagActive ? () => handleTagSelect(tag) : undefined}
                            color={selectedTags.includes(tag) ? 'primary' : 'default'}
                            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                            disabled={!isTagActive}
                            sx={{
                              borderRadius: '16px',
                              borderColor: selectedTags.includes(tag) ? '#222' : '#e5e7eb',
                              backgroundColor: selectedTags.includes(tag)
                                ? '#fafafa'
                                : 'transparent',
                              color: selectedTags.includes(tag) ? '#222' : '#666',
                              opacity: isTagActive ? 1 : 0.5,
                              cursor: isTagActive ? 'pointer' : 'not-allowed',
                              '&:hover': {
                                backgroundColor: selectedTags.includes(tag)
                                  ? '#fafafa'
                                  : 'rgba(255, 235, 235, 0.2)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* 검색 상태 표시기 */}
            <SearchStatusIndicator />
          </div>
        </div>
      </div>
      {/* 상단 필터링 및 검색 영역 */}

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
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 20px rgba(226, 225, 225, 0.15)',
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
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 20px rgba(226, 225, 225, 0.15)',
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
              setSelectedTags([]); // 태그 상태도 초기화
              saveSearchState('', searchType, false); // 검색 상태 초기화

              // postStore에서도 소모임 검색 상태 초기화
              const postStore = usePostStore.getState();
              postStore.searchStates['모임'] = {
                active: false,
                term: '',
                type: '',
              };

              fetchPosts({
                ...filter,
                page: 0,
                tag: undefined, // 태그 필터도 제거
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
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 20px rgba(226, 225, 225, 0.15)',
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <SearchIcon sx={{ fontSize: '3rem', color: '#222', mb: 2 }} />
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
              setSelectedTags([]); // 태그 상태도 초기화
              saveSearchState('', searchType, false); // 검색 상태 초기화

              // postStore에서도 소모임 검색 상태 초기화
              const postStore = usePostStore.getState();
              postStore.searchStates['모임'] = {
                active: false,
                term: '',
                type: '',
              };

              fetchPosts({
                ...filter,
                page: 0,
                tag: undefined, // 태그 필터도 제거
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
          {isMobile && (
            <div style={{ display: 'flex', gap: 8, width: '100%', margin: '16px 0 24px 0' }}>
              <button
                onClick={handleCreatePost}
                style={{
                  ...proButton,
                  padding: '6px 16px',
                  fontSize: 14,
                  background: selectedCategory === 'all' ? '#222' : '#f3f4f6',
                  color: selectedCategory === 'all' ? '#fff' : '#222',
                  border: selectedCategory === 'all' ? '1.5px solid #222' : '1.5px solid #e5e7eb',
                  borderRadius: 6,
                  margin: 0,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {t('community.posts.writePost')}
              </button>
              <select
                value={filter.sortBy}
                onChange={e => handleSortChange(e.target.value as 'latest' | 'popular')}
                style={{
                  padding: '6px 16px',
                  fontSize: 14,
                  border: '1.5px solid #222',
                  borderRadius: 6,
                  background: '#fff',
                  color: '#222',
                  fontWeight: 600,
                  fontFamily: proCard.fontFamily,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: 100,
                  marginRight: 0,
                }}
              >
                <option value="latest">{t('community.filters.latest')}</option>
                <option value="popular">{t('community.filters.popular')}</option>
              </select>
            </div>
          )}
          <PostList isGroup={true} />
        </Box>
      )}
    </div>
  );
};

export default ProGroupListPage;
