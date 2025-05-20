import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { Container, Box, TextField, IconButton, InputAdornment, Typography, Button, useMediaQuery, useTheme, Divider, CircularProgress, Paper, Select, MenuItem, FormControl, InputLabel, Tab, Collapse, ToggleButtonGroup, ToggleButton, ButtonGroup, Chip, } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';
import PostList from '../components/post/PostList';
import useCommunityStore from '../store/communityStore';
import { usePostStore } from '../store/postStore';
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
const BoardListPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();
    // 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [searchType, setSearchType] = useState('제목_내용');
    const [isSearchMode, setIsSearchMode] = useState(false);
    // 카테고리별 태그 매핑
    const categoryTags = {
        travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
        living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
        study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
        job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
        전체: ['인기', '추천', '정보공유', '질문', '후기'],
    };
    // 현재 선택된 카테고리에 해당하는 태그 목록
    const [availableTags, setAvailableTags] = useState(categoryTags['전체']);
    const { posts, postLoading, postError, selectedCategory, setSelectedCategory, fetchPosts, setPostFilter, searchPosts, fetchTopPosts, } = useCommunityStore();
    // 현재 URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(location.search);
    // URL 쿼리 파라미터에서 필터 상태 초기화
    const [filter, setFilter] = useState({
        category: queryParams.get('category') || '전체',
        location: queryParams.get('location') || '전체',
        tag: queryParams.get('tag') || '',
        sortBy: queryParams.get('sortBy') || 'latest',
        page: queryParams.get('page') ? parseInt(queryParams.get('page')) - 1 : 0,
        size: 6,
        postType: queryParams.get('postType') || '자유',
    });
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
            setAvailableTags(categoryTags[filter.category] || categoryTags['전체']);
        }
        // 태그가 있으면 선택된 태그 상태 설정
        if (filter.tag) {
            setSelectedTags(filter.tag.split(','));
        }
        // 초기 로드 시 명시적으로 기본 필터 설정 (자유 게시글, 자유 지역)
        const initialFilter = {
            ...filter,
            postType: '자유',
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
    }, []);
    // 검색 상태 표시를 위한 추가 컴포넌트
    const SearchStatusIndicator = () => {
        if (!isSearchMode || !searchTerm)
            return null;
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
        return (_jsxs(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255, 230, 230, 0.8)',
                p: 1,
                borderRadius: 1,
                mb: 2,
                gap: 1,
                flexWrap: 'wrap',
            }, children: [_jsx(SearchIcon, { color: "secondary", fontSize: "small" }), _jsxs(Typography, { variant: "body2", color: "secondary.dark", children: ["\"", searchTerm, "\" \uAC80\uC0C9 \uC911 ", searchType === '제목_내용' ? '(제목+내용)' : `(${searchType})`, filterInfo.length > 0 && _jsxs("span", { children: [" - ", filterInfo.join(' / ')] })] }), _jsx(Box, { sx: { flexGrow: 1 } }), _jsx(Button, { size: "small", variant: "outlined", color: "secondary", onClick: () => {
                        setIsSearchMode(false);
                        setSearchTerm('');
                        fetchPosts({
                            ...filter,
                            page: 0,
                            resetSearch: true, // 검색 상태만 초기화
                        });
                    }, startIcon: _jsx(ClearIcon, {}), children: "\uAC80\uC0C9 \uCDE8\uC18C" })] }));
    };
    // 필터 변경 시 검색 상태를 유지하는 함수
    const applyFilterWithSearchState = (newFilter) => {
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
                postType: '자유',
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
            }
            catch (error) {
                console.error('검색 중 오류 발생:', error);
            }
        }
        else {
            // 검색 중이 아니면 일반 필터 적용
            setFilter(updatedFilter);
            fetchPosts(updatedFilter);
        }
    };
    // 카테고리 변경 핸들러
    const handleCategoryChange = (category) => {
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
            setAvailableTags(categoryTags[category] || categoryTags['전체']);
        }
        else {
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
    const handleTagSelect = (tag) => {
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
        }
        else {
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
    const handleSearchTypeChange = (event) => {
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
        let postTypeForSearch = '자유';
        // 검색 시 필터 상태 업데이트
        const searchFilter = {
            ...filter,
            page: 0,
            postType: postTypeForSearch,
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
        }
        catch (error) {
            console.error('검색 중 오류 발생:', error);
        }
    };
    // 작성자 검색 핸들러
    const handleAuthorSearch = () => {
        console.log('[DEBUG] 작성자 검색 실행:', searchTerm);
        if (searchTerm.trim()) {
            // 작성자 이름으로 검색 - 명시적으로 '작성자' 타입 지정
            searchPosts(searchTerm, '작성자');
        }
        else {
            fetchPosts(filter);
        }
    };
    // 키보드 엔터로 검색
    const handleKeyPress = (e) => {
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
    const handleSortChange = (sortBy) => {
        console.log('정렬 방식 변경:', sortBy);
        // 검색 상태 고려하여 필터 적용
        applyFilterWithSearchState({ sortBy, page: 0 });
    };
    // 지역 변경 핸들러
    const handleRegionChange = (region) => {
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
    return (_jsxs(Container, { maxWidth: "lg", sx: {
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            zIndex: 5,
        }, children: [_jsxs(Box, { sx: {
                    mb: 3,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 2,
                }, children: [_jsx(Typography, { variant: isMobile ? 'h5' : 'h4', component: "h1", sx: {
                            fontWeight: 600,
                            color: '#555',
                            fontFamily: '"Noto Sans KR", sans-serif',
                        }, children: "\uC774\uC57C\uAE30 \uAC8C\uC2DC\uD310" }), _jsx(Button, { variant: "contained", startIcon: _jsx(CreateIcon, {}), onClick: handleCreatePost, sx: {
                            bgcolor: '#FFAAA5',
                            '&:hover': {
                                bgcolor: '#FF8B8B',
                            },
                            borderRadius: '24px',
                            boxShadow: '0 2px 8px rgba(255, 170, 165, 0.5)',
                            color: 'white',
                            fontWeight: 600,
                        }, children: "\uAE00\uC4F0\uAE30" })] }), _jsxs(Paper, { elevation: 0, sx: {
                    mb: 3,
                    p: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 170, 165, 0.3)',
                    boxShadow: '0 8px 20px rgba(255, 170, 165, 0.15)',
                    backdropFilter: 'blur(8px)',
                }, children: [_jsxs(Box, { sx: {
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                        }, children: [_jsx(Button, { variant: "outlined", onClick: toggleFilters, startIcon: showFilters ? _jsx(ExpandLessIcon, {}) : _jsx(TuneIcon, {}), size: "small", sx: {
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
                                }, children: showFilters ? '필터 접기' : '필터 열기' }), _jsxs(ButtonGroup, { variant: "outlined", size: "small", "aria-label": "\uAC8C\uC2DC\uAE00 \uC815\uB82C \uBC29\uC2DD", sx: {
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
                                }, children: [_jsx(Button, { onClick: () => handleSortChange('latest'), sx: {
                                            fontWeight: filter.sortBy === 'latest' ? 'bold' : 'normal',
                                            bgcolor: filter.sortBy === 'latest' ? 'rgba(255, 235, 235, 0.4)' : 'transparent',
                                        }, children: "\uCD5C\uC2E0\uC21C" }), _jsx(Button, { onClick: () => handleSortChange('popular'), sx: {
                                            fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal',
                                            bgcolor: filter.sortBy === 'popular' ? 'rgba(255, 235, 235, 0.4)' : 'transparent',
                                        }, children: "\uC778\uAE30\uC21C" })] })] }), _jsxs(Box, { sx: {
                            mb: 2,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                        }, children: [_jsxs(FormControl, { variant: "outlined", size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { id: "search-type-label", children: "\uAC80\uC0C9 \uC720\uD615" }), _jsxs(Select, { labelId: "search-type-label", id: "search-type", value: searchType, onChange: handleSearchTypeChange, label: "\uAC80\uC0C9 \uC720\uD615", sx: {
                                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FFD7D7',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FFAAA5',
                                            },
                                            borderRadius: '8px',
                                        }, children: [_jsx(MenuItem, { value: "\uC81C\uBAA9_\uB0B4\uC6A9", children: "\uC81C\uBAA9+\uB0B4\uC6A9" }), _jsx(MenuItem, { value: "\uC81C\uBAA9", children: "\uC81C\uBAA9\uB9CC" }), _jsx(MenuItem, { value: "\uB0B4\uC6A9", children: "\uB0B4\uC6A9\uB9CC" }), _jsx(MenuItem, { value: "\uC791\uC131\uC790", children: "\uC791\uC131\uC790" })] })] }), _jsx(TextField, { placeholder: "\uAC8C\uC2DC\uAE00 \uAC80\uC0C9...", variant: "outlined", size: "small", value: searchTerm, onChange: e => setSearchTerm(e.target.value), onKeyPress: handleKeyPress, sx: {
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
                                }, InputProps: {
                                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { size: "small", onClick: handleSearch, title: "\uAC80\uC0C9", children: _jsx(SearchIcon, { fontSize: "small", sx: { color: '#FF9999' } }) }) })),
                                } })] }), _jsxs(Collapse, { in: showFilters, children: [_jsx(Divider, { sx: { mb: 2, borderColor: 'rgba(255, 170, 165, 0.2)' } }), _jsx(Box, { sx: {
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 2,
                                }, children: _jsxs(Box, { sx: { gridColumn: isMobile ? 'auto' : '1 / -1' }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, sx: { fontWeight: 600, color: '#555' }, children: "\uCE74\uD14C\uACE0\uB9AC \uC120\uD0DD" }), _jsxs(ToggleButtonGroup, { color: "primary", value: selectedCategory, exclusive: true, onChange: (e, newValue) => newValue && handleCategoryChange(newValue), size: "small", sx: {
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
                                            }, children: [_jsx(ToggleButton, { value: "\uC804\uCCB4", sx: { minWidth: isMobile ? '30%' : '20%' }, children: "\uC804\uCCB4" }), _jsx(ToggleButton, { value: "travel", sx: { minWidth: isMobile ? '30%' : '20%' }, children: "travel" }), _jsx(ToggleButton, { value: "living", sx: { minWidth: isMobile ? '30%' : '20%' }, children: "living" }), _jsx(ToggleButton, { value: "study", sx: { minWidth: isMobile ? '30%' : '20%' }, children: "study" }), _jsx(ToggleButton, { value: "job", sx: { minWidth: isMobile ? '30%' : '20%' }, children: "job" })] }), _jsx(Typography, { variant: "subtitle2", gutterBottom: true, sx: { fontWeight: 600, color: '#555', mt: 2 }, children: "\uC138\uBD80 \uD0DC\uADF8 \uC120\uD0DD" }), _jsx(Box, { sx: {
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                mt: 1,
                                            }, children: availableTags.map(tag => (_jsx(Chip, { label: tag, onClick: () => handleTagSelect(tag), color: selectedTags.includes(tag) ? 'primary' : 'default', variant: selectedTags.includes(tag) ? 'filled' : 'outlined', sx: {
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
                                                } }, tag))) })] }) })] })] }), _jsx(SearchStatusIndicator, {}), postLoading ? (_jsxs(Box, { sx: {
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
                }, children: [_jsx(CircularProgress, { size: 60, sx: { color: '#FFAAA5', mb: 3 } }), _jsx(Typography, { variant: "h6", color: "textSecondary", children: "\uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." })] })) : postError ? (
            // 오류 발생 시 메시지 표시
            _jsxs(Box, { sx: {
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
                }, children: [_jsxs(Box, { sx: { mb: 3, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h5", color: "error", gutterBottom: true, children: "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4" }), _jsx(Typography, { variant: "body1", color: "textSecondary", children: typeof postError === 'string'
                                    ? postError
                                    : '게시글을 불러오는 중 문제가 발생했습니다.' })] }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: () => {
                            setIsSearchMode(false);
                            setSearchTerm('');
                            fetchPosts({
                                ...filter,
                                page: 0,
                                resetSearch: true,
                            });
                        }, children: "\uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30" })] })) : posts.length === 0 && isSearchMode ? (
            // 검색 결과가 없을 때 메시지 표시
            _jsxs(Box, { sx: {
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
                }, children: [_jsxs(Box, { sx: { mb: 3, textAlign: 'center' }, children: [_jsx(SearchIcon, { sx: { fontSize: '3rem', color: '#FFAAA5', mb: 2 } }), _jsx(Typography, { variant: "h5", color: "textSecondary", gutterBottom: true, children: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx(Typography, { variant: "body1", color: "textSecondary", children: "\uB2E4\uB978 \uAC80\uC0C9\uC5B4\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uBCF4\uC138\uC694." })] }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: () => {
                            setIsSearchMode(false);
                            setSearchTerm('');
                            fetchPosts({
                                ...filter,
                                page: 0,
                                resetSearch: true,
                            });
                        }, children: "\uC804\uCCB4 \uAC8C\uC2DC\uAE00 \uBCF4\uAE30" })] })) : (
            /* 게시글 목록 */
            _jsx(Box, { sx: { flex: 1, minHeight: '400px' }, children: _jsx(PostList, {}) }))] }));
};
export default BoardListPage;
