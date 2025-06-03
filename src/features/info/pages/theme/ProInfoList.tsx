import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/shared/i18n';
import { useInfoStore } from '@/features/info/store/infoStroe';
import {
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  IconButton,
  Container,
  Divider,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';
import hexagonImg from '@/assets/icons/common/육각문양.png';
import squareImg from '@/assets/icons/common/네모문양.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const categoryKeys = [
  'all',
  'education',
  'transportation',
  'finance',
  'visa',
  'shopping',
  'healthcare',
  'housing',
  'employment',
];

const getTranslatedCategories = (t: any) =>
  categoryKeys.map(key => ({ key, label: t(`infoPage.categories.${key}`) }));

const getCategoryKey = (koreanCategory: string): string => {
  const categoryMap: { [key: string]: string } = {
    '비자/법률': 'visa',
    '취업/직장': 'employment',
    '주거/부동산': 'housing',
    교육: 'education',
    '의료/건강': 'healthcare',
    '금융/세금': 'finance',
    교통: 'transportation',
    쇼핑: 'shopping',
  };
  return categoryMap[koreanCategory] || 'all';
};

const extractTextFromContent = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractText).join('');
      }
      return '';
    };
    return extractText(parsed).slice(0, 80);
  } catch {
    return content.slice(0, 80);
  }
};

const proCard = {
  background: 'rgba(255,255,255,0.5)',
  border: '1.5px solid #222',
  borderRadius: 10,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
  marginBottom: 24,
  padding: 24,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  backdropFilter: 'blur(10px)',
};
const proButton = {
  background: 'rgba(255,255,255,1)',
  border: '1.5px solid #222',
  borderRadius: 8,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  fontWeight: 600,
  color: '#222',
  padding: '10px 28px',
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'background 0.2s, color 0.2s, border 0.2s',
  outline: 'none',
};
const proButtonActive = {
  background: '#222',
  color: '#fff',
  border: '1.5px solid #222',
};

export default function InfoListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const season = useThemeStore(state => state.season);

  const {
    posts,
    popularPosts,
    categoryCounts,
    loading,
    error,
    total,
    filter,
    fetchPosts,
    fetchPopularPosts,
    fetchCategoryCounts,
    setFilter,
  } = useInfoStore();

  const categories = getTranslatedCategories(t);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const hasInitialDataLoaded = useRef(false);
  const size = 8;
  const blockSize = 5;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const role = parsed?.state?.user?.role;
        setIsAdmin(role === 'ROLE_ADMIN');
      } catch {}
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedIds');
    if (saved) {
      try {
        setBookmarkedIds(JSON.parse(saved));
      } catch {
        localStorage.removeItem('bookmarkedIds');
      }
    }
  }, []);

  useEffect(() => {
    if (hasInitialDataLoaded.current) return;
    fetchCategoryCounts();
    fetchPopularPosts();
    fetchPosts();

    const stateCategory = location.state?.selectedCategory;
    if (stateCategory && categoryKeys.includes(stateCategory)) {
      setSelectedCategory(stateCategory);
    }

    const handleFocus = () => {
      if (localStorage.getItem('needRefreshCategories') === 'true') {
        localStorage.removeItem('needRefreshCategories');
        fetchCategoryCounts();
        fetchPopularPosts();
      }
    };
    window.addEventListener('focus', handleFocus);
    hasInitialDataLoaded.current = true;
    return () => window.removeEventListener('focus', handleFocus);
  }, [location.state]);

  useEffect(() => {
    fetchPosts({
      category: selectedCategory,
      keyword,
      page: page - 1,
      size,
      sortBy,
    });
    if (page === 1 && selectedCategory === 'all') {
      fetchCategoryCounts();
    }
  }, [selectedCategory, keyword, page, sortBy]);

  const handleBookmark = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token') || '';
      await fetch(`${API_BASE}/information/${id}`, {
        method: 'POST',
        headers: { Authorization: token },
      });
      setBookmarkedIds(prev => {
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
        localStorage.setItem('bookmarkedIds', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('북마크 실패:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchTerm.trim());
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setKeyword('');
    setSearchTerm('');
  };

  const handleSortChange = (newSort: 'latest' | 'popular') => {
    setSortBy(newSort);
    setPage(1);
  };

  const totalPages = Math.ceil(total / size);
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  // 모바일: 검색+글쓰기 버트 컴포넌트
  const MobileActions: React.FC = () => (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {isAdmin && (
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={() => {
            navigate('create');
            localStorage.setItem('needRefreshCategories', 'true');
          }}
          sx={{
            backgroundColor: '#222',
            color: '#fff',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#444' },
          }}
        >
          {t('infoPage.actions.write')}
        </Button>
      )}
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  // 모바일: 토글 상태 관리 (초기 상태 false로 변경)
  const [openPopular, setOpenPopular] = useState(false);
  const [openUseful, setOpenUseful] = useState(false);

  // 모바일: 사이드바 컴포넌트 (토글 버튼 추가)
  const MobileSidebar: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 검색 바 */}
      <form onSubmit={handleSearch}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <TextField
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('infoPage.searchPlaceholder')}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                bgcolor: '#fafafa',
                borderRadius: 1,
              },
            }}
          />
        </Box>
      </form>

      {/* 카테고리 버튼 - 한 줄, 가로 스크롤, 버튼 균등 분할 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          gap: 1,
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid #e5e7eb',
          borderRadius: 1,
          p: 1,
        }}
      >
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            style={{
              display: 'inline-flex',
              flex: '0 0 auto',
              minWidth: 'unset',
              width: 'auto',
              whiteSpace: 'nowrap',
              padding: '4px 12px',
              background: selectedCategory === cat.key ? '#222' : '#f3f4f6',
              color: selectedCategory === cat.key ? '#fff' : '#222',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: 8,
              border: selectedCategory === cat.key ? '1.5px solid #222' : '1.5px solid #e5e7eb',
              transition: 'all 0.15s',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: 'none',
            }}
          >
            {cat.label}
          </button>
        ))}
      </Box>

      {/* 인기 정보 (토글 타이틀+내용) - 한 줄 리스트 스타일 */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            py: 0.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('infoPage.sidebar.popularInfo')}
          </Typography>
          <IconButton size="small" onClick={() => setOpenPopular(prev => !prev)}>
            {openPopular ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        {openPopular && (
          <Box
            sx={{
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid #e5e7eb',
              borderRadius: 1,
              p: 1,
            }}
          >
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {popularPosts.map((post, idx) => (
                <Box
                  component="li"
                  key={post.informationId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                    borderBottom: idx === popularPosts.length - 1 ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`${post.informationId}`)}
                >
                  <Typography sx={{ fontWeight: 700, color: '#bbb', minWidth: 20 }}>
                    {idx + 1}
                  </Typography>
                  <Box component="img" src={hexagonImg} alt="logo" sx={{ width: 24, height: 24 }} />
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: 14,
                      color: '#111',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#888', ml: 0.5 }}>
                    {post.views}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* 유용한 웹사이트 (토글 타이틀+내용) */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            py: 0.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('infoPage.sidebar.usefulSites')}
          </Typography>
          <IconButton size="small" onClick={() => setOpenUseful(prev => !prev)}>
            {openUseful ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        {openUseful && (
          <Box
            sx={{
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid #e5e7eb',
              borderRadius: 1,
              p: 1,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                {
                  href: 'https://www.hikorea.go.kr',
                  title: t('infoPage.sidebar.hikorea.title'),
                  subtitle: t('infoPage.sidebar.hikorea.subtitle'),
                },
                {
                  href: 'https://www.nhis.or.kr',
                  title: t('infoPage.sidebar.nhis.title'),
                  subtitle: t('infoPage.sidebar.nhis.subtitle'),
                },
                {
                  href: 'https://www.work.go.kr',
                  title: t('infoPage.sidebar.worknet.title'),
                  subtitle: t('infoPage.sidebar.worknet.subtitle'),
                },
              ].map(site => (
                <Box
                  key={site.href}
                  component="a"
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 1,
                    textDecoration: 'none',
                    color: '#111',
                    '&:hover': { borderColor: '#222' },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {site.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                      {site.subtitle}
                    </Typography>
                  </Box>
                  <Box component="svg" width={16} height={16} color="#bbb" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* 최근 검색어 */}
      {keyword && (
        <Box
          sx={{
            background: 'rgba(255,255,255,0.5)',
            border: '1.5px solid #e5e7eb',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {t('infoPage.sidebar.currentSearch')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`"${keyword}"`}
              sx={{
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setKeyword('');
                setSearchTerm('');
                setPage(1);
              }}
            >
              <Box
                component="svg"
                width={16}
                height={16}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </Box>
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 헤더 */}
      <Box sx={{ borderBottom: '1.5px solid #e5e7eb' }}>
        <Container sx={{ maxWidth: 1120 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: '#111',
                    fontFamily: proCard.fontFamily,
                  }}
                >
                  {t('infoPage.title')}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  mt: 0.5,
                  fontFamily: proCard.fontFamily,
                }}
              >
                {t('infoPage.description')}
              </Typography>
            </Box>
            {/*!isMobile && isAdmin && (
              <Button
                variant="outlined"
                startIcon={<CreateIcon />}
                onClick={() => {
                  navigate('create');
                  localStorage.setItem('needRefreshCategories', 'true');
                }}
                sx={{
                  ...proButton,
                  px: 3,
                  py: 1,
                  fontSize: 16,
                }}
              >
                {t('infoPage.actions.write')}
              </Button>
            )*/}
          </Box>
        </Container>
      </Box>

      <Container sx={{ maxWidth: 1120, py: 4 }}>
        {isMobile ? (
          <>
            {/* 모바일 레이아웃 */}
            <MobileActions />
            <MobileSidebar />
            <Divider sx={{ my: 2 }} />
            {/* 글 목록 */}
            <Box>
              {loading ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1, color: '#888', fontFamily: proCard.fontFamily }}>
                    {t('infoPage.content.loading')}
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#e53e3e', fontFamily: proCard.fontFamily }}>
                    {error}
                  </Typography>
                </Box>
              ) : posts.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#888', fontFamily: proCard.fontFamily }}>
                    {t('infoPage.content.noData')}
                  </Typography>
                </Box>
              ) : (
                posts.map(post => (
                  <Box
                    key={post.informationId}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'rgba(255,255,255,0.5)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
                      backdropFilter: 'blur(4px)',
                      p: 2,
                      mb: 2,
                      cursor: 'pointer',
                      position: 'relative',
                      fontFamily: proCard.fontFamily,
                      '&:hover': {
                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
                      },
                    }}
                    onClick={() => navigate(`${post.informationId}`)}
                  >
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleBookmark(post.informationId);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.85)',
                        border: '1.5px solid #bbb',
                        borderRadius: '50%',
                        p: 0.5,
                        zIndex: 2,
                        '&:hover': { borderColor: '#222' },
                      }}
                    >
                      {bookmarkedIds.includes(post.informationId) ? (
                        <BookmarkIcon sx={{ color: '#222', fontSize: 20 }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ color: '#bbb', fontSize: 20 }} />
                      )}
                    </IconButton>
                    <Chip
                      label={t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                      sx={{
                        bgcolor: '#f3f4f6',
                        color: '#666',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, mb: 0.5 }}>
                      {post.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666',
                        fontSize: '0.875rem',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {extractTextFromContent(post.content || '')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, fontSize: '0.75rem', color: '#aaa' }}>
                      <Typography>{post.userName}</Typography>
                      <Typography>{new Date(post.createdAt).toLocaleDateString()}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          component="svg"
                          width={14}
                          height={14}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </Box>
                        <Typography>{post.views}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            {/* 모바일 페이지네이션 */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                {startPage > 1 && (
                  <Button
                    onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                    sx={{ ...proButton, fontSize: 12, p: '4px 8px' }}
                  >
                    {t('infoPage.pagination.previous')}
                  </Button>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
                  <Button
                    key={p}
                    onClick={() => setPage(p)}
                    sx={{
                      ...proButton,
                      fontSize: 12,
                      p: '4px 8px',
                      ...(p === page ? proButtonActive : {}),
                    }}
                  >
                    {p}
                  </Button>
                ))}
                {endPage < totalPages && (
                  <Button
                    onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                    sx={{ ...proButton, fontSize: 12, p: '4px 8px' }}
                  >
                    {t('infoPage.pagination.next')}
                  </Button>
                )}
              </Box>
            )}
          </>
        ) : (
          <>
            {/* PC 레이아웃 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* 메인 컨텐츠 */}
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={squareImg}
                      alt="logo"
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111' }}>
                      {selectedCategory === 'all'
                        ? t('infoPage.content.allInfo')
                        : categories.find(cat => cat.key === selectedCategory)?.label ||
                          selectedCategory}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      select
                      value={sortBy}
                      onChange={e => handleSortChange(e.target.value as 'latest' | 'popular')}
                      size="small"
                      variant="outlined"
                      sx={{
                        width: 120,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          border: '1.5px solid #222',
                          bgcolor: '#fff',
                          fontWeight: 600,
                        },
                      }}
                    >
                      <MenuItem value="latest">{t('infoPage.sorting.latest')}</MenuItem>
                      <MenuItem value="popular">{t('infoPage.sorting.popular')}</MenuItem>
                    </TextField>
                    {isAdmin && (
                      <Button
                        variant="outlined"
                        startIcon={<CreateIcon />}
                        onClick={() => {
                          navigate('create');
                          localStorage.setItem('needRefreshCategories', 'true');
                        }}
                        sx={{
                          ...proButton,
                          p: '6px 16px',
                          fontSize: 14,
                        }}
                      >
                        {t('infoPage.actions.write')}
                      </Button>
                    )}
                    <button
                      onClick={() => handleCategoryChange('all')}
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
                      {t('infoPage.actions.viewAll')}
                    </button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 1, color: '#888' }}>
                      {t('infoPage.content.loading')}
                    </Typography>
                  </Box>
                ) : error ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#e53e3e' }}>{error}</Typography>
                  </Box>
                ) : posts.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#888' }}>{t('infoPage.content.noData')}</Typography>
                  </Box>
                ) : (
                  posts.map(post => (
                    <Box
                      key={post.informationId}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'rgba(255,255,255,0.5)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(4px)',
                        p: 2,
                        mb: 2,
                        cursor: 'pointer',
                        position: 'relative',
                        fontFamily: proCard.fontFamily,
                        '&:hover': {
                          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
                        },
                      }}
                      onClick={() => navigate(`${post.informationId}`)}
                    >
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          handleBookmark(post.informationId);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.85)',
                          border: '1.5px solid #bbb',
                          borderRadius: '50%',
                          p: 0.5,
                          zIndex: 2,
                          '&:hover': { borderColor: '#222' },
                        }}
                      >
                        {bookmarkedIds.includes(post.informationId) ? (
                          <BookmarkIcon sx={{ color: '#222', fontSize: 20 }} />
                        ) : (
                          <BookmarkBorderIcon sx={{ color: '#bbb', fontSize: 20 }} />
                        )}
                      </IconButton>
                      <Chip
                        label={t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                        sx={{
                          bgcolor: '#f3f4f6',
                          color: '#666',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          borderRadius: 1,
                          mb: 1,
                        }}
                      />
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, mb: 0.5 }}>
                        {post.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#666',
                          fontSize: '0.875rem',
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {extractTextFromContent(post.content || '')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, fontSize: '0.75rem', color: '#aaa' }}>
                        <Typography>{post.userName}</Typography>
                        <Typography>{new Date(post.createdAt).toLocaleDateString()}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            component="svg"
                            width={14}
                            height={14}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </Box>
                          <Typography>{post.views}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    {startPage > 1 && (
                      <Button
                        onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                        sx={{ ...proButton, fontSize: 12, p: '4px 8px' }}
                      >
                        {t('infoPage.pagination.previous')}
                      </Button>
                    )}
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
                      p => (
                        <Button
                          key={p}
                          onClick={() => setPage(p)}
                          sx={{
                            ...proButton,
                            fontSize: 12,
                            p: '4px 8px',
                            ...(p === page ? proButtonActive : {}),
                          }}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    {endPage < totalPages && (
                      <Button
                        onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                        sx={{ ...proButton, fontSize: 12, p: '4px 8px' }}
                      >
                        {t('infoPage.pagination.next')}
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              {/* 세로 구분선 */}
              <Box
                sx={{
                  width: 2,
                  background: 'linear-gradient(to bottom, #fff 0%, #e5e7eb 100%)',
                  borderRadius: 1,
                }}
              />

              {/* 사이드바 */}
              <Box
                component="aside"
                sx={{
                  width: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'sticky',
                  top: 200,
                  alignSelf: 'flex-start',
                  height: 'fit-content',
                }}
              >
                {/* 검색바 */}
                <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                  <TextField
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('infoPage.searchPlaceholder')}
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: '#fafafa',
                        borderRadius: 1,
                        border: '1.5px solid #bbb',
                      },
                    }}
                  />
                </Box>

                {/* 카테고리 뱃지 */}
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: 1,
                    border: '1.5px solid #e5e7eb',
                    p: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      gridColumn: '1 / -1',
                      fontWeight: 700,
                      fontSize: 15,
                      color: '#222',
                      mb: 1,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {t('infoPage.categorySelectTitle')}
                  </Typography>
                  {categories.slice(1).map(category => (
                    <Button
                      key={category.key}
                      onClick={() => handleCategoryChange(category.key)}
                      sx={{
                        bgcolor: selectedCategory === category.key ? '#222' : '#f3f4f6',
                        color: selectedCategory === category.key ? '#fff' : '#222',
                        border:
                          selectedCategory === category.key
                            ? '1.5px solid #222'
                            : '1.5px solid #e5e7eb',
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 12,
                        p: '4px 8px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        transition: 'all 0.15s',
                      }}
                    >
                      {category.label}
                    </Button>
                  ))}
                </Box>

                {/* 인기 정보 */}
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 1,
                    border: '1.5px solid #e5e7eb',
                    p: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1 }}>
                    {t('infoPage.sidebar.popularInfo')}
                  </Typography>
                  {popularPosts.map((post, idx) => (
                    <Box
                      key={post.informationId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.5,
                        borderBottom:
                          idx === popularPosts.length - 1 ? 'none' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`${post.informationId}`)}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#bbb', minWidth: 24 }}>
                        {idx + 1}
                      </Typography>
                      <Box
                        component="img"
                        src={hexagonImg}
                        alt="hexagon"
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: 14,
                          color: '#111',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#888' }}>{post.views}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* 유용한 웹사이트 */}
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 1,
                    border: '1.5px solid #e5e7eb',
                    p: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
                    {t('infoPage.sidebar.usefulSites')}
                  </Typography>
                  {[
                    {
                      href: 'https://www.hikorea.go.kr',
                      title: t('infoPage.sidebar.hikorea.title'),
                      subtitle: t('infoPage.sidebar.hikorea.subtitle'),
                    },
                    {
                      href: 'https://www.nhis.or.kr',
                      title: t('infoPage.sidebar.nhis.title'),
                      subtitle: t('infoPage.sidebar.nhis.subtitle'),
                    },
                    {
                      href: 'https://www.work.go.kr',
                      title: t('infoPage.sidebar.worknet.title'),
                      subtitle: t('infoPage.sidebar.worknet.subtitle'),
                    },
                  ].map(site => (
                    <Box
                      key={site.href}
                      component="a"
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 1,
                        textDecoration: 'none',
                        color: '#111',
                        '&:hover': { borderColor: '#222' },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{site.title}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#888' }}>
                          {site.subtitle}
                        </Typography>
                      </Box>
                      <Box component="svg" width={16} height={16} color="#bbb" viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* 최근 검색어 */}
                {keyword && (
                  <Box
                    sx={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
                      {t('infoPage.sidebar.currentSearch')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`"${keyword}"`}
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setKeyword('');
                          setSearchTerm('');
                          setPage(1);
                        }}
                      >
                        <Box
                          component="svg"
                          width={16}
                          height={16}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </Box>
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Container>
    </div>
  );
}
