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
} from '@mui/material';

import { useThemeStore } from '@/features/theme/store/themeStore';

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

// 카테고리별 아이콘과 색상 매핑
const getCategoryIcon = (categoryKey: string) => {
  const iconMap: { [key: string]: string } = {
    visa: '⚖️',
    employment: '💼',
    housing: '🏠',
    education: '🎓',
    healthcare: '🏥',
    finance: '🏦',
    transportation: '🚗',
    shopping: '🛍️',
    all: '📋',
  };
  return iconMap[categoryKey] || '📄';
};

const getCategoryColor = (categoryKey: string) => {
  const colorMap: { [key: string]: string } = {
    visa: '#4CAF50',
    employment: '#2196F3',
    housing: '#FF9800',
    education: '#9C27B0',
    healthcare: '#F44336',
    finance: '#607D8B',
    transportation: '#795548',
    shopping: '#E91E63',
    all: '#6B7280',
  };
  return colorMap[categoryKey] || '#6B7280';
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

  // 스토어 함수들을 사용하므로 로컬 함수 제거

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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('infoPage.title')}</h1>
              <p className="text-gray-600 mt-1">{t('infoPage.description')}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('create');
                  // 글 작성 후 돌아왔을 때 카테고리 카운트 새로고침을 위해 storage event 활용
                  localStorage.setItem('needRefreshCategories', 'true');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('infoPage.actions.write')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 검색바 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={t('infoPage.searchPlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 카테고리 그리드 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('infoPage.categories.title')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(1).map(
                  (
                    category // '전체' 제외
                  ) => (
                    <button
                      key={category.key}
                      onClick={() => handleCategoryChange(category.key)}
                      className={`p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group ${
                        selectedCategory === category.key
                          ? 'ring-2 ring-blue-500 border-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3"
                          style={{ backgroundColor: `${getCategoryColor(category.key)}20` }}
                        >
                          {getCategoryIcon(category.key)}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{category.label}</h3>
                        <p className="text-sm text-gray-500">
                          {t('infoPage.content.postsCount', {
                            count: String(categoryCounts[category.key] || 0),
                          })}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 추천 정보 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategory === 'all'
                    ? t('infoPage.content.allInfo')
                    : categories.find(cat => cat.key === selectedCategory)?.label ||
                      selectedCategory}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleSortChange('latest')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        sortBy === 'latest'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('infoPage.sorting.latest')}
                    </button>
                    <button
                      onClick={() => handleSortChange('popular')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        sortBy === 'popular'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('infoPage.sorting.popular')}
                    </button>
                  </div>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('infoPage.actions.viewAll')}
                  </button>
                </div>
              </div>

              <div>
                {loading ? (
                  <div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>{t('infoPage.content.loading')}</p>
                  </div>
                ) : error ? (
                  <div>
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div>
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                    <p>{t('infoPage.content.noData')}</p>
                  </div>
                ) : (
                  <>
                    <div>
                      {posts.map((post, index) => (
                        <div
                          key={post.informationId}
                          onClick={() => navigate(`${post.informationId}`)}
                        >
                          <div>
                            <div>
                              <div>
                                <span>
                                  {t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                                </span>
                              </div>
                              <h3>{post.title}</h3>
                              <p>{extractTextFromContent(post.content || '')}</p>
                              <div>
                                <span>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {post.userName}
                                </span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span>
                                  <svg
                                    className="w-4 h-4"
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
                            </div>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleBookmark(post.informationId);
                              }}
                              className={`ml-4 p-2 rounded-lg transition-colors ${
                                bookmarkedIds.includes(post.informationId)
                                  ? 'text-yellow-500 bg-yellow-50'
                                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill={
                                  bookmarkedIds.includes(post.informationId)
                                    ? 'currentColor'
                                    : 'none'
                                }
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                      <div>
                        <div>
                          {/* 이전 블록 */}
                          {startPage > 1 && (
                            <button onClick={() => setPage(Math.max(startPage - blockSize, 1))}>
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
                              className={`${
                                p === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {p}
                            </button>
                          ))}

                          {/* 다음 블록 */}
                          {endPage < totalPages && (
                            <button
                              onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
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

          {/* 오른쪽 사이드바 */}
          <aside>
            {/* 인기 정보 */}
            <div>
              <h3>
                <span>{t('infoPage.sidebar.popularInfo')}</span>
              </h3>
              <div>
                {popularPosts.map((post, index) => (
                  <button
                    key={post.informationId}
                    onClick={() => navigate(`${post.informationId}`)}
                  >
                    <span>{index + 1}</span>
                    <div>
                      <p>{post.title}</p>
                      <div>
                        <span>{t(`infoPage.categories.${getCategoryKey(post.category)}`)}</span>
                        <span>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 긴급 연락처 */}
            <div>
              <h3>
                <span>{t('infoPage.sidebar.emergencyContacts')}</span>
              </h3>
              <div>
                <div>
                  <div>
                    <p>{t('infoPage.sidebar.emergency.title')}</p>
                    <p>{t('infoPage.sidebar.emergency.subtitle')}</p>
                  </div>
                  <a href="tel:119" className="text-lg font-bold text-red-600">
                    119
                  </a>
                </div>
                <div>
                  <div>
                    <p>{t('infoPage.sidebar.police.title')}</p>
                    <p>{t('infoPage.sidebar.police.subtitle')}</p>
                  </div>
                  <a href="tel:112" className="text-lg font-bold text-blue-600">
                    112
                  </a>
                </div>
                <div>
                  <div>
                    <p>{t('infoPage.sidebar.foreignerCenter.title')}</p>
                    <p>{t('infoPage.sidebar.foreignerCenter.subtitle')}</p>
                  </div>
                  <a href="tel:1345" className="text-lg font-bold text-green-600">
                    1345
                  </a>
                </div>
              </div>
            </div>

            {/* 유용한 웹사이트 */}
            <div>
              <h3>
                <span>{t('infoPage.sidebar.usefulSites')}</span>
              </h3>
              <div>
                <a href="https://www.hikorea.go.kr" target="_blank" rel="noopener noreferrer">
                  <div>
                    <div>
                      <p>{t('infoPage.sidebar.hikorea.title')}</p>
                      <p>{t('infoPage.sidebar.hikorea.subtitle')}</p>
                    </div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>

                <a href="https://www.nhis.or.kr" target="_blank" rel="noopener noreferrer">
                  <div>
                    <div>
                      <p>{t('infoPage.sidebar.nhis.title')}</p>
                      <p>{t('infoPage.sidebar.nhis.subtitle')}</p>
                    </div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>

                <a href="https://www.work.go.kr" target="_blank" rel="noopener noreferrer">
                  <div>
                    <div>
                      <p>{t('infoPage.sidebar.worknet.title')}</p>
                      <p>{t('infoPage.sidebar.worknet.subtitle')}</p>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400"
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
              <div>
                <h3>{t('infoPage.sidebar.currentSearch')}</h3>
                <div>
                  <span>"{keyword}"</span>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setSearchTerm('');
                      setPage(1);
                    }}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
