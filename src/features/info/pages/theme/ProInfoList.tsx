import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/shared/i18n';
import { useInfoStore } from '@/features/info/store/infoStroe';
import {
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Pagination,
  CircularProgress,
  Alert,
  Collapse,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';
import hexagonImg from '@/assets/icons/common/육각문양.png';
import patternImg from '@/assets/icons/common/문양.png';
import squareImg from '@/assets/icons/common/네모문양.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 카테고리 키 목록 - 번역 키와 연결됨
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

// 번역된 카테고리 목록을 생성하는 함수
const getTranslatedCategories = (t: any) => {
  return categoryKeys.map(key => ({
    key,
    label: t(`infoPage.categories.${key}`),
  }));
};

// 한국어 카테고리를 영어 키로 변환
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

// 콘텐츠에서 텍스트 추출 함수
const extractTextFromContent = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.text || '';
      }
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
  margin: '0 8px',
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
const proInput = {
  width: '70%',
  padding: '12px 16px',
  border: '1.5px solid #bbb',
  borderRadius: 8,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  fontSize: 16,
  marginRight: 12,
  background: '#fafafa',
  color: '#222',
};

export default function InfoListPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const season = useThemeStore(state => state.season);

  // 정보 스토어에서 상태와 액션 가져오기
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

  // 번역된 카테고리 목록
  const categories = getTranslatedCategories(t);

  // 로컬 상태 (UI 전용)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // 초기 데이터 로드 추적
  const hasInitialDataLoaded = useRef(false);

  const size = 8; // 페이지 크기를 늘려서 테스트 (원래는 4개 원했지만 서버 제한으로 인해)
  const blockSize = 5; // 페이지네이션 블록 크기

  // ADMIN 권한 여부 확인
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const role = parsed?.state?.user?.role;
        setIsAdmin(role === 'ROLE_ADMIN');
      } catch {
        // 파싱 오류 시 false로 유지
      }
    }
  }, []);

  // 기존 북마크 로드
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

  // 초기 데이터 로드
  useEffect(() => {
    // 이미 데이터를 로드했으면 중복 요청 방지
    if (hasInitialDataLoaded.current) {
      console.log('InfoListPage - 이미 초기 데이터가 로드됨, 중복 요청 방지');
      return;
    }

    console.log('InfoListPage 컴포넌트 마운트, 초기 데이터 로드 시작');

    // 스토어 함수들을 사용하여 초기 데이터 로드
    fetchCategoryCounts();
    fetchPopularPosts();
    fetchPosts(); // 초기 게시글 목록도 로드

    // 상세 페이지에서 전달된 카테고리 설정
    const stateCategory = location.state?.selectedCategory;
    if (stateCategory && categoryKeys.includes(stateCategory)) {
      setSelectedCategory(stateCategory);
    }

    // 페이지 포커스 시 카테고리 새로고침 체크
    const handleFocus = () => {
      if (localStorage.getItem('needRefreshCategories') === 'true') {
        localStorage.removeItem('needRefreshCategories');
        fetchCategoryCounts();
        fetchPopularPosts();
      }
    };

    window.addEventListener('focus', handleFocus);

    // 초기 데이터 로드 완료 플래그 설정
    hasInitialDataLoaded.current = true;

    return () => window.removeEventListener('focus', handleFocus);
  }, [location.state]);

  // 언어 변경 감지는 스토어에서 자동으로 처리되므로 제거

  // 필터 변경 시 스토어 함수 호출
  useEffect(() => {
    console.log('[DEBUG] 필터 변경 감지:', {
      selectedCategory,
      keyword,
      page,
      sortBy,
    });

    // 스토어의 fetchPosts 함수 호출
    fetchPosts({
      category: selectedCategory,
      keyword,
      page: page - 1, // 0-based 페이지
      size,
      sortBy,
    });

    // 첫 페이지 로드 시 카테고리 카운트 업데이트
    if (page === 1 && selectedCategory === 'all') {
      fetchCategoryCounts();
    }
  }, [selectedCategory, keyword, page, sortBy]);

  // 북마크 토글
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
    console.log('정렬 방식 변경:', newSort);
  };

  // 카테고리 카운트 새로고침 함수 (글 작성/삭제 후 호출용)
  const refreshCategoryCounts = () => {
    fetchCategoryCounts();
  };

  // 페이징 계산
  const totalPages = Math.ceil(total / size);
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  return (
    <div style={{ minHeight: '100vh' }}>
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: '#111',
                    fontFamily: proCard.fontFamily,
                  }}
                >
                  {t('infoPage.title')}
                </span>
              </div>
              <p style={{ color: '#666', marginTop: 6, fontFamily: proCard.fontFamily }}>
                {t('infoPage.description')}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('create');
                  localStorage.setItem('needRefreshCategories', 'true');
                }}
                style={{ ...proButton, padding: '12px 32px', fontSize: 16 }}
              >
                {t('infoPage.actions.write')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '32px 16px',
          height: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            height: 'auto',
          }}
        >
          {/* 메인 컨텐츠 */}
          <div
            style={{
              flex: 1,
              paddingRight: 32,
            }}
          >
            {/* 추천 정보 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={squareImg}
                    alt="logo"
                    style={{ height: 24, width: 24, objectFit: 'contain' }}
                  />
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#111',
                      fontFamily: proCard.fontFamily,
                      margin: 0,
                    }}
                  >
                    {selectedCategory === 'all'
                      ? t('infoPage.content.allInfo')
                      : categories.find(cat => cat.key === selectedCategory)?.label ||
                        selectedCategory}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* 정렬 드롭다운 */}
                  <select
                    value={sortBy}
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
                      marginRight: 8,
                    }}
                  >
                    <option value="latest">{t('infoPage.sorting.latest')}</option>
                    <option value="popular">{t('infoPage.sorting.popular')}</option>
                  </select>
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
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.07)',
                }}
              >
                {loading ? (
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        border: '3px solid #222',
                        borderBottomColor: 'transparent',
                        borderRadius: '50%',
                        margin: '0 auto 8px',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <p style={{ color: '#888', fontFamily: proCard.fontFamily }}>
                      {t('infoPage.content.loading')}
                    </p>
                  </div>
                ) : error ? (
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <div style={{ color: '#e53e3e', marginBottom: 16, fontSize: 28 }}>⚠️</div>
                    <p style={{ color: '#e53e3e', fontFamily: proCard.fontFamily }}>{error}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <svg
                      width="48"
                      height="48"
                      style={{ color: '#bbb', margin: '0 auto 16px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p style={{ color: '#888', fontFamily: proCard.fontFamily }}>
                      {t('infoPage.content.noData')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      {posts.map((post, index) => (
                        <Box
                          key={post.informationId}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2.5,
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
                            background: 'rgba(255,255,255,0.5)',
                            backdropFilter: 'blur(4px)',
                            p: '20px 16px',
                            mb: 2,
                            cursor: 'pointer',
                            fontFamily: proCard.fontFamily,
                            transition: 'box-shadow 0.2s',
                            position: 'relative',
                            '&:hover': {
                              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
                            },
                          }}
                          onClick={() => navigate(`${post.informationId}`)}
                        >
                          {/* 북마크 버튼 (오른쪽 상단) */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleBookmark(post.informationId);
                            }}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              background: 'rgba(255,255,255,0.85)',
                              border: '1.5px solid #bbb',
                              borderRadius: '50%',
                              width: 36,
                              height: 36,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              aspectRatio: '1 / 1',
                              boxShadow: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              transition: 'background 0.15s, border 0.15s',
                              zIndex: 2,
                              padding: 0,
                            }}
                            onFocus={e => {
                              e.currentTarget.style.outline = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
                            }}
                            onMouseDown={e => {
                              e.currentTarget.style.outline = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
                            }}
                            onMouseOver={e => (e.currentTarget.style.border = '1.5px solid #222')}
                            onMouseOut={e => (e.currentTarget.style.border = '1.5px solid #bbb')}
                            aria-label={
                              bookmarkedIds.includes(post.informationId)
                                ? t('infoPage.actions.removeBookmark')
                                : t('infoPage.actions.addBookmark')
                            }
                          >
                            {bookmarkedIds.includes(post.informationId) ? (
                              <BookmarkIcon sx={{ color: '#222', fontSize: 22 }} />
                            ) : (
                              <BookmarkBorderIcon sx={{ color: '#bbb', fontSize: 22 }} />
                            )}
                          </button>
                          <span
                            style={{
                              display: 'inline-block',
                              background: '#f3f4f6',
                              color: '#666',
                              fontSize: 13,
                              fontWeight: 500,
                              borderRadius: 8,
                              padding: '2px 12px',
                              marginBottom: 4,
                              width: 'fit-content',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                            }}
                          >
                            {t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                          </span>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 700,
                              color: '#111',
                              marginBottom: 2,
                            }}
                          >
                            {post.title}
                          </div>
                          <div
                            style={{
                              color: '#666',
                              fontSize: 15,
                              marginBottom: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {extractTextFromContent(post.content || '')}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 16,
                              fontSize: 13,
                              color: '#aaa',
                              marginTop: 2,
                              paddingTop: 4,
                              paddingBottom: 4,
                              paddingLeft: 8,
                              paddingRight: 8,
                            }}
                          >
                            <span>{post.userName}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg
                                width="16"
                                height="16"
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
                              </svg>
                              {post.views}
                            </span>
                          </div>
                        </Box>
                      ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                      <div style={{ padding: '24px 0', borderTop: '1.5px solid #e5e7eb' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          {/* 이전 블록 */}
                          {startPage > 1 && (
                            <button
                              onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                              style={{ ...proButton, fontSize: 14, padding: '6px 16px' }}
                            >
                              {t('infoPage.pagination.previous')}
                            </button>
                          )}

                          {/* 페이지 번호들 */}
                          {Array.from(
                            { length: endPage - startPage + 1 },
                            (_, i) => startPage + i
                          ).map(p => (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              style={{
                                ...proButton,
                                fontSize: 14,
                                padding: '6px 16px',
                                ...(p === page ? proButtonActive : {}),
                              }}
                            >
                              {p}
                            </button>
                          ))}

                          {/* 다음 블록 */}
                          {endPage < totalPages && (
                            <button
                              onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                              style={{ ...proButton, fontSize: 14, padding: '6px 16px' }}
                            >
                              {t('infoPage.pagination.next')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 그라데이션 border line */}
          <div
            style={{
              width: 2,
              minHeight: '100%',
              background: 'linear-gradient(to bottom, #fff 0%, #e5e7eb 100%)',
              borderRadius: 1,
              marginLeft: 0,
              marginRight: 0,
            }}
          />

          {/* 오른쪽 사이드바 */}
          <aside
            style={{
              width: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              position: 'sticky',
              top: 200,
              alignSelf: 'flex-start',
              height: 'fit-content',
              paddingLeft: 16,
            }}
          >
            {/* 검색바 (사이드바 상단) */}
            <form onSubmit={handleSearch} style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder={t('infoPage.searchPlaceholder')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: 16,
                    paddingRight: 40,
                    paddingTop: 12,
                    paddingBottom: 12,
                    border: '1.5px solid #bbb',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fafafa',
                    color: '#222',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    height: 32,
                    width: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* 카테고리 뱃지 박스 (검색바와 인기 정보 사이) */}
            <div
              style={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 12,
                border: '1.5px solid #e5e7eb',
                padding: '16px 12px',
                marginBottom: 12,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                position: 'relative',
              }}
            >
              {/* 주제 선택 타이틀 (박스 안, 상단) */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#222',
                  marginBottom: 8,
                  textAlign: 'left',
                  letterSpacing: '-0.5px',
                }}
              >
                {t('infoPage.categorySelectTitle')}
              </div>
              {categories.slice(1).map(category => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryChange(category.key)}
                  style={{
                    background: selectedCategory === category.key ? '#222' : '#f3f4f6',
                    color: selectedCategory === category.key ? '#fff' : '#222',
                    border:
                      selectedCategory === category.key
                        ? '1.5px solid #222'
                        : '1.5px solid #e5e7eb',
                    borderRadius: 20,
                    padding: '6px 0',
                    fontWeight: 600,
                    fontSize: 10,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    width: '100%',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <section
              style={{
                background: 'rgba(255,255,255,0.5)',
                borderRadius: 10,
                padding: 12,
                border: '1.5px solid #e5e7eb',
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#111',
                  marginBottom: 12,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={patternImg} alt="logo" style={{ width: 24, height: 24 }} />
                  {t('infoPage.sidebar.popularInfo')}
                </span>
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {popularPosts.map((post, idx) => (
                  <li
                    key={post.informationId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 0',
                      borderBottom: idx === popularPosts.length - 1 ? 'none' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`${post.informationId}`)}
                  >
                    <span style={{ fontWeight: 700, color: '#bbb', minWidth: 20 }}>{idx + 1}</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: '#111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <img src={hexagonImg} alt="logo" style={{ width: 24, height: 24 }} />

                      {post.title}
                    </span>
                    <span style={{ fontSize: 12, color: '#888' }}>{post.views}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 유용한 웹사이트 */}
            <div
              style={{
                background: 'rgba(255,255,255,0.5)',
                borderRadius: 10,
                border: '1.5px solid #e5e7eb',
                padding: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#111',
                  marginBottom: 16,
                  fontFamily: proCard.fontFamily,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t('infoPage.sidebar.usefulSites')}
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a
                  href="https://www.hikorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: 12,
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: '#111',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.border = '1.5px solid #222')}
                  onMouseOut={e => (e.currentTarget.style.border = '1.5px solid #e5e7eb')}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#111',
                          fontFamily: proCard.fontFamily,
                        }}
                      >
                        {t('infoPage.sidebar.hikorea.title')}
                      </p>
                      <p style={{ fontSize: 12, color: '#888', fontFamily: proCard.fontFamily }}>
                        {t('infoPage.sidebar.hikorea.subtitle')}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      style={{ color: '#bbb' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://www.nhis.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: 12,
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: '#111',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.border = '1.5px solid #222')}
                  onMouseOut={e => (e.currentTarget.style.border = '1.5px solid #e5e7eb')}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#111',
                          fontFamily: proCard.fontFamily,
                        }}
                      >
                        {t('infoPage.sidebar.nhis.title')}
                      </p>
                      <p style={{ fontSize: 12, color: '#888', fontFamily: proCard.fontFamily }}>
                        {t('infoPage.sidebar.nhis.subtitle')}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      style={{ color: '#bbb' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://www.work.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: 12,
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: '#111',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.border = '1.5px solid #222')}
                  onMouseOut={e => (e.currentTarget.style.border = '1.5px solid #e5e7eb')}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#111',
                          fontFamily: proCard.fontFamily,
                        }}
                      >
                        {t('infoPage.sidebar.worknet.title')}
                      </p>
                      <p style={{ fontSize: 12, color: '#888', fontFamily: proCard.fontFamily }}>
                        {t('infoPage.sidebar.worknet.subtitle')}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      style={{ color: '#bbb' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* 최근 검색어 */}
            {keyword && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: 10,
                  border: '1.5px solid #e5e7eb',
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#111',
                    marginBottom: 16,
                    fontFamily: proCard.fontFamily,
                  }}
                >
                  {t('infoPage.sidebar.currentSearch')}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      padding: '6px 16px',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: 16,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: proCard.fontFamily,
                    }}
                  >
                    "{keyword}"
                  </span>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setSearchTerm('');
                      setPage(1);
                    }}
                    style={{
                      color: '#bbb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
