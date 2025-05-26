import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  Tune as TuneIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';

import SpringBackground from '../components/shared/SpringBackground';
import PostList from '../components/post/PostList';
import RegionSelector from '../components/shared/RegionSelector';

import useCommunityStore from '../store/communityStore';
import { usePostStore } from '../store/postStore';
import { useTranslation } from '@/shared/i18n/index';

const PostTypeTab = styled(ToggleButton)(({ theme }) => ({
  minWidth: 100,
  fontWeight: 600,
  borderRadius: 4,
  '&.Mui-selected': {
    color: '#FF6B6B',
    backgroundColor: 'rgba(255,170,165,0.1)',
  },
}));

type PostType = '자유' | '모임' | '';
type SelectablePostType = 'ALL' | '자유' | '모임';

interface LocalPostFilter {
  category: keyof typeof categoryTags | string;
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
  travel: [
    'tourismExperience',
    'foodAndDining',
    'transportation',
    'accommodationAndLocalInfo',
    'embassyAndEmergency',
  ],
  living: [
    'realEstateContracts',
    'livingEnvironmentAndConvenience',
    'cultureAndLifestyle',
    'residenceMaintenance',
  ],
  study: [
    'academicsAndCampus',
    'studySupportAndFacilities',
    'administrationVisaAndDocuments',
    'dormAndHousing',
  ],
  job: ['resumeAndJobPrep', 'visaLawAndLabor', 'jobFairAndNetworking', 'partTimeJobs'],
  all: ['popular', 'recommended', 'infoSharing', 'questions', 'reviews'],
};

export default function PostListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('제목_내용');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedPostType, setSelectedPostType] = useState<SelectablePostType>('ALL');
  const [availableTags, setAvailableTags] = useState<string[]>(categoryTags.all);

  const query = new URLSearchParams(location.search);
  const initCat = query.get('category') || 'all';
  const initCatKey = initCat === '전체' ? 'all' : (initCat as keyof typeof categoryTags);

  const [filter, setFilter] = useState<LocalPostFilter>({
    category: initCatKey,
    postType: (query.get('postType') as PostType) || '',
    location: query.get('location') || '전체',
    tag: query.get('tag') || '',
    sortBy: (query.get('sortBy') as 'latest' | 'popular') || 'latest',
    page: query.get('page') ? parseInt(query.get('page')!) - 1 : 0,
    size: 6,
  });

  const initialLoaded = useRef(false);
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

  useEffect(() => {
    if (initialLoaded.current) return;
    setAvailableTags(
      categoryTags[filter.category as keyof typeof categoryTags] || categoryTags.all
    );
    if (filter.tag) setSelectedTags(filter.tag.split(','));
    const init = { ...filter, postType: '자유' as PostType, location: '자유', page: 0, size: 6 };
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
        postType: selectedPostType === 'ALL' ? '자유' : (selectedPostType as PostType),
        category: updated.category,
        tag: updated.tag,
        sort: updated.sortBy === 'popular' ? 'views,desc' : 'createdAt,desc',
        region: updated.location,
      });
    } else {
      fetchPosts(updated);
    }
  };

  const handleCategoryChange = (cat: keyof typeof categoryTags) => {
    setSelectedCategory(cat);
    setAvailableTags(categoryTags[cat]);
    applyFilter({ category: cat, page: 0 });
  };

  const handleTagSelect = (tag: string) => {
    const already = selectedTags.includes(tag);
    const nextTags = already ? [] : [tag];
    setSelectedTags(nextTags);
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
  const handleKey = (e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch();
  const handleCreate = () => navigate('/community/create');
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters(v => !v);
  const handleSort = (s: 'latest' | 'popular') => applyFilter({ sortBy: s, page: 0 });
  const handlePostType = (_: any, newType: SelectablePostType) => {
    if (!newType || newType === selectedPostType) return;
    setSelectedPostType(newType);
    const nf: Partial<LocalPostFilter> = { page: 0 };
    if (newType === 'ALL' || newType === '자유') {
      nf.postType = '자유';
      nf.location = '자유';
    } else {
      nf.postType = '모임';
      nf.location = filter.location === '자유' ? '전체' : filter.location;
    }
    setSelectedRegion(nf.location!);
    applyFilter(nf);
  };
  const handleRegionChange = (c: string | null, d: string | null, n: string | null) => {
    const region = [c, d, n].filter(Boolean).join(' ');
    if (region !== selectedRegion) {
      setSelectedRegion(region);
      applyFilter({ location: region, page: 0 });
    }
  };

  const SearchStatus = () => {
    if (!isSearchMode || !searchTerm) return null;
    const parts: string[] = [];
    if (filter.category !== 'all') parts.push(`${t('common.category')}: ${filter.category}`);
    if (filter.postType) parts.push(`${t('common.type')}: ${filter.postType}`);
    if (filter.location && filter.location !== '전체' && filter.location !== '자유')
      parts.push(`${t('common.region')}: ${filter.location}`);
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,230,230,0.8)',
          p: 1,
          borderRadius: 1,
          mb: 2,
          gap: 1,
        }}
      >
        <SearchIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="secondary.dark">
          "{searchTerm}" {t('common.searching')}{' '}
          {searchType === '제목_내용' ? t('common.titleAndContent') : `(${searchType})`}
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
          {t('common.cancel')}
        </Button>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, position: 'relative', zIndex: 5 }}>
      {/* header */}
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
          {t('common.communicationBoard')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={handleCreate}
          sx={{ bgcolor: '#FFAAA5', '&:hover': { bgcolor: '#FF8B8B' }, borderRadius: '24px' }}
        >
          {t('create')}
        </Button>
      </Box>

      {/* filters/search */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          bgcolor: 'rgba(255,255,255,0.85)',
          borderRadius: 2,
          border: '1px solid rgba(255,170,165,0.3)',
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={showFilters ? <ExpandLessIcon /> : <TuneIcon />}
            onClick={toggleFilters}
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            {showFilters ? t('common.hideFilters') : t('common.showFilters')}
          </Button>
          <ButtonGroup size="small" variant="outlined">
            <Button
              onClick={() => handleSort('latest')}
              sx={{ fontWeight: filter.sortBy === 'latest' ? 'bold' : 'normal' }}
            >
              {t('sort.latest')}
            </Button>
            <Button
              onClick={() => handleSort('popular')}
              sx={{ fontWeight: filter.sortBy === 'popular' ? 'bold' : 'normal' }}
            >
              {t('sort.views')}
            </Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small">
            <InputLabel id="search-type-label">{t('common.searchType')}</InputLabel>
            <Select
              labelId="search-type-label"
              value={searchType}
              label={t('common.searchType')}
              onChange={handleSearchTypeChange}
            >
              <MenuItem value="제목_내용">{t('common.titleAndContent')}</MenuItem>
              <MenuItem value="제목">{t('common.title')}</MenuItem>
              <MenuItem value="내용">{t('common.content')}</MenuItem>
              <MenuItem value="작성자">{t('common.author')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={handleKey}
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
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))',
            }}
          >
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('common.postType')}
              </Typography>
              <ToggleButtonGroup
                value={selectedPostType}
                exclusive
                onChange={handlePostType}
                size="small"
              >
                <ToggleButton value="ALL">{t('common.all')}</ToggleButton>
                <ToggleButton value="자유">{t('common.freePosts')}</ToggleButton>
                <ToggleButton value="모임">{t('common.eventPosts')}</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {selectedPostType === '모임' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('common.selectRegion')}
                </Typography>
                <RegionSelector onChange={handleRegionChange} />
              </Box>
            )}

            <Box sx={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('common.selectCategory')}
              </Typography>
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={(_, v) => v && handleCategoryChange(v as keyof typeof categoryTags)}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 1 }}
              >
                <ToggleButton value="all">{t('common.all')}</ToggleButton>
                <ToggleButton value="travel">travel</ToggleButton>
                <ToggleButton value="living">living</ToggleButton>
                <ToggleButton value="study">study</ToggleButton>
                <ToggleButton value="job">job</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                {t('common.selectTags')}
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
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {t('common.errorOccurred')}
          </Typography>
          <Button onClick={() => fetchPosts(filter)}>{t('common.retry')}</Button>
        </Box>
      ) : posts.length === 0 && isSearchMode ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <SearchIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('common.noResults')}
          </Typography>
          <Button onClick={() => fetchPosts({ ...filter, page: 0 })}>{t('common.viewAll')}</Button>
        </Box>
      ) : (
        <Box sx={{ minHeight: 400 }}>
          <PostList />
        </Box>
      )}
    </Container>
  );
}
