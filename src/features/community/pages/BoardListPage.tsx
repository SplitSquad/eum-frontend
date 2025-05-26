import React, { useEffect, useState, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  FilterList as FilterListIcon,
  PersonSearch as PersonSearchIcon,
  ExpandLess as ExpandLessIcon,
  Tune as TuneIcon,
  Create as CreateIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';

import SpringBackground from '../components/shared/SpringBackground';
import CategoryTabs from '../components/shared/CategoryTabs';
import PostList from '../components/post/PostList';

import useCommunityStore from '../store/communityStore';
import useAuthStore from '../../../features/auth/store/authStore';
import { usePostStore } from '../store/postStore';
import { PostType } from '../types-folder';

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

type SelectablePostType = 'ALL' | '자유' | '모임';

interface LocalPostFilter {
  category: string;
  postType: PostType;
  location: string;
  tag?: string;
  sortBy: 'latest' | 'popular';
  size: number;
  page: number;
  keyword?: string;
  searchActive?: boolean;
}

const categoryTags = {
  travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
  living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
  study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
  job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
  전체: ['인기', '추천', '정보공유', '질문', '후기'],
};

export default function BoardListPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [searchType, setSearchType] = useState('제목_내용');
  const [isSearchMode, setIsSearchMode] = useState(false);
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
  const [filter, setFilter] = useState<LocalPostFilter>({
    category: queryParams.get('category') || '전체',
    location: queryParams.get('location') || '전체',
    tag: queryParams.get('tag') || '',
    sortBy: (queryParams.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: queryParams.get('page') ? parseInt(queryParams.get('page')!) - 1 : 0,
    size: 6,
    postType: (queryParams.get('postType') as PostType) || '자유',
  });

  const initialLoaded = useRef(false);
  useEffect(() => {
    if (initialLoaded.current) return;
    if (filter.category && filter.category !== '전체') {
      setAvailableTags(categoryTags[filter.category as keyof typeof categoryTags]);
    }
    if (filter.tag) setSelectedTags(filter.tag.split(','));
    const init: LocalPostFilter = {
      ...filter,
      postType: '자유',
      location: '자유',
      page: 0,
      size: 6,
    };
    setFilter(init);
    fetchPosts(init);
    fetchTopPosts(5);
    initialLoaded.current = true;
  }, []);

  const applyFilter = (newFilter: Partial<LocalPostFilter>) => {
    const updated = { ...filter, ...newFilter };
    setFilter(updated);
    if (isSearchMode && searchTerm.trim()) {
      searchPosts(searchTerm, searchType, {
        page: updated.page ?? 0,
        size: updated.size,
        postType: '자유',
        region: updated.location,
        category: updated.category,
        tag: updated.tag,
        sort: updated.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
      });
    } else {
      fetchPosts(updated);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setAvailableTags(categoryTags[cat as keyof typeof categoryTags]);
    applyFilter({ category: cat, page: 0 });
  };

  const handleTagSelect = (tag: string) => {
    const already = selectedTags.includes(tag);
    const tags = already ? [] : [tag];
    setSelectedTags(tags);
    applyFilter({ tag: already ? undefined : tag, page: 0 });
  };

  const handleSearchTypeChange = (e: SelectChangeEvent<string>) => setSearchType(e.target.value);
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setIsSearchMode(false);
      fetchPosts({ ...filter, page: 0, searchActive: false });
    } else {
      setIsSearchMode(true);
      applyFilter({ page: 0 });
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch();
  const handleCreate = () => navigate('/community/create');
  const toggleFilters = () => setShowFilters(v => !v);
  const handleSortChange = (sortBy: 'latest' | 'popular') => applyFilter({ sortBy, page: 0 });
  const handleRegionChange = (region: string) => {
    if (region !== selectedRegion) applyFilter({ location: region, page: 0 });
    setSelectedRegion(region);
  };

  const SearchStatus = () => {
    if (!isSearchMode || !searchTerm) return null;
    const parts: string[] = [];
    if (filter.category !== '전체') {
      parts.push(t('community.filter.category', { category: filter.category }));
    }
    parts.push(t(`community.postType.${filter.postType.toLowerCase()}`));
    if (filter.location !== '전체' && filter.location !== '자유') {
      parts.push(t('community.filter.location', { location: filter.location }));
    }
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,230,230,0.8)',
          p: 1,
          borderRadius: 1,
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <SearchIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="secondary.dark">
          {t('community.search.status', {
            term: searchTerm,
            type:
              searchType === '제목_내용'
                ? t('community.search.type.titleContent')
                : t(`community.search.type.${searchType.toLowerCase()}`),
          })}
          {parts.length > 0 && ` - ${parts.join(' / ')}`}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => {
            setIsSearchMode(false);
            setSearchTerm('');
            fetchPosts({ ...filter, page: 0, searchActive: false });
          }}
          startIcon={<ClearIcon />}
        >
          {t('community.search.cancel')}
        </Button>
      </Box>
    );
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
          sx={{ fontWeight: 600, color: '#555' }}
        >
          {t('community.boardTitle')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={handleCreate}
          sx={{ bgcolor: '#FFAAA5', '&:hover': { bgcolor: '#FF8B8B' }, borderRadius: '24px' }}
        >
          {t('community.createPost')}
        </Button>
      </Box>

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
            size="small"
            onClick={toggleFilters}
            startIcon={showFilters ? <ExpandLessIcon /> : <TuneIcon />}
            sx={{ textTransform: 'none', borderRadius: '20px', px: 2 }}
          >
            {showFilters ? t('community.hideFilters') : t('community.showFilters')}
          </Button>
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => handleSortChange('latest')}
              sx={{ fontWeight: filter.sortBy === 'latest' ? 'bold' : 'normal' }}
            >
              {t('sort.latest')}
            </Button>
            <Button
              onClick={() => handleSortChange('popular')}
              sx={{ fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal' }}
            >
              {t('sort.views')}
            </Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small">
            <InputLabel id="search-type-label">{t('community.search.typeLabel')}</InputLabel>
            <Select
              labelId="search-type-label"
              value={searchType}
              label={t('community.search.typeLabel')}
              onChange={handleSearchTypeChange}
            >
              <MenuItem value="제목_내용">{t('community.search.type.titleContent')}</MenuItem>
              <MenuItem value="제목">{t('community.search.type.title')}</MenuItem>
              <MenuItem value="내용">{t('community.search.type.content')}</MenuItem>
              <MenuItem value="작성자">{t('community.search.type.author')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            placeholder={t('community.search.placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
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
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.filter.postType')}
              </Typography>
              <ToggleButtonGroup
                value={selectedCategory as any}
                exclusive
                onChange={(_, v) => v && handleCategoryChange(v as string)}
                size="small"
                sx={{ width: '100%', flexWrap: 'wrap', gap: 1 }}
              >
                <ToggleButton value="전체">{t('common.all')}</ToggleButton>
                <ToggleButton value="travel">travel</ToggleButton>
                <ToggleButton value="living">living</ToggleButton>
                <ToggleButton value="study">study</ToggleButton>
                <ToggleButton value="job">job</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
                {t('community.filter.category')}
              </Typography>
              <ToggleButtonGroup
                value={selectedCategory as any}
                exclusive
                onChange={(_, v) => v && handleCategoryChange(v as string)}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 1 }}
              >
                {/* 동일한 버튼 집합 사용 */}
                <ToggleButton value="전체">{t('common.all')}</ToggleButton>
                <ToggleButton value="travel">travel</ToggleButton>
                <ToggleButton value="living">living</ToggleButton>
                <ToggleButton value="study">study</ToggleButton>
                <ToggleButton value="job">job</ToggleButton>
              </ToggleButtonGroup>

              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mt: 2, fontWeight: 600, color: '#555' }}
              >
                {t('community.filter.tags')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagSelect(tag)}
                    color={selectedTags.includes(tag) ? 'primary' : 'default'}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      <SearchStatus />

      {postLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={60} />
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
          }}
        >
          <Alert severity="error">{t('community.error.loadFailed')}</Alert>
          <Button onClick={() => fetchPosts(filter)} sx={{ mt: 2 }}>
            {t('common.retry')}
          </Button>
        </Box>
      ) : posts.length === 0 && isSearchMode ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <SearchIcon sx={{ fontSize: '3rem', color: '#FFAAA5', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('community.noResults.title')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('community.noResults.message')}
          </Typography>
          <Button onClick={() => fetchPosts({ ...filter, page: 0 })}>
            {t('community.noResults.backToList')}
          </Button>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: '400px' }}>
          <PostList />
        </Box>
      )}
    </Container>
  );
}
