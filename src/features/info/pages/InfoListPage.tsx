import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../shared/i18n';
import { useInfoStore } from '../store/infoStore';

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

const getTranslatedCategories = (t: any) => {
  return categoryKeys.map(key => ({
    key,
    label: t(`infoPage.categories.${key}`),
  }));
};

const getCategoryKoreanName = (categoryKey: string) => {
  const koreanMap: { [key: string]: string } = {
    all: '전체',
    visa: '비자/법률',
    employment: '취업/직장',
    housing: '주거/부동산',
    education: '교육',
    healthcare: '의료/건강',
    finance: '금융/세금',
    transportation: '교통',
    shopping: '쇼핑',
  };
  return koreanMap[categoryKey] || '전체';
};

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
  const hasInitialDataLoaded = useRef(false);
  const size = 4;
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
    if (hasInitialDataLoaded.current) {
      return;
    }
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

  // 북마크 토글 - 서버 호출 후 리스트 최신화만 진행
  const handleBookmark = async (postId: number) => {
    try {
      const token = localStorage.getItem('auth_token') || '';
      await fetch(`${API_BASE}/information/${postId}`, {
        method: 'POST',
        headers: { Authorization: token },
      });
      // 북마크 상태 최신화 (다시 불러옴)
      fetchPosts({
        category: selectedCategory,
        keyword,
        page: page - 1,
        size,
        sortBy,
      });
      fetchPopularPosts();
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
                {categories.slice(1).map(category => (
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
                ))}
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
              <div className="bg-white rounded-lg border border-gray-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">{t('infoPage.content.loading')}</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="p-8 text-center">
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
                    <p className="text-gray-500">{t('infoPage.content.noData')}</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {posts.map((post, index) => (
                        <div
                          key={post.informationId}
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => navigate(`${post.informationId}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                  {t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                                </span>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {extractTextFromContent(post.content || '')}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
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
                                <span className="flex items-center gap-1">
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

                              className={`ml-4 p-2 rounded-lg transition-colors focus:outline-none ${

                                post.isState === 1
                                  ? 'text-yellow-500 bg-yellow-50'
                                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill={post.isState === 1 ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >

                                {/* <path

                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"

                                /> */}

                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-center items-center space-x-2">
                          {startPage > 1 && (
                            <button
                              onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {t('infoPage.pagination.previous')}
                            </button>
                          )}
                          {Array.from(
                            { length: endPage - startPage + 1 },
                            (_, i) => startPage + i
                          ).map(p => (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                p === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                          {endPage < totalPages && (
                            <button
                              onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
          <aside className="w-80 space-y-6">
            {/* 인기 정보 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="flex items-center gap-2">{t('infoPage.sidebar.popularInfo')}</span>
              </h3>
              <div className="space-y-3">
                {popularPosts.map((post, index) => (
                  <button
                    key={post.informationId}
                    onClick={() => navigate(`${post.informationId}`)}
                    className="flex items-start gap-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                          {t(`infoPage.categories.${getCategoryKey(post.category)}`)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
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
                  </button>
                ))}
              </div>
            </div>
            {/* 긴급 연락처 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="flex items-center gap-2">
                  {t('infoPage.sidebar.emergencyContacts')}
                </span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {t('infoPage.sidebar.emergency.title')}
                    </p>
                    <p className="text-xs text-red-600">
                      {t('infoPage.sidebar.emergency.subtitle')}
                    </p>
                  </div>
                  <a href="tel:119" className="text-lg font-bold text-red-600">
                    119
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {t('infoPage.sidebar.police.title')}
                    </p>
                    <p className="text-xs text-blue-600">{t('infoPage.sidebar.police.subtitle')}</p>
                  </div>
                  <a href="tel:112" className="text-lg font-bold text-blue-600">
                    112
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {t('infoPage.sidebar.foreignerCenter.title')}
                    </p>
                    <p className="text-xs text-green-600">
                      {t('infoPage.sidebar.foreignerCenter.subtitle')}
                    </p>
                  </div>
                  <a href="tel:1345" className="text-lg font-bold text-green-600">
                    1345
                  </a>
                </div>
              </div>
            </div>
            {/* 유용한 웹사이트 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="flex items-center gap-2">{t('infoPage.sidebar.usefulSites')}</span>
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.hikorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('infoPage.sidebar.hikorea.title')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('infoPage.sidebar.hikorea.subtitle')}
                      </p>
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
                <a
                  href="https://www.nhis.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('infoPage.sidebar.nhis.title')}
                      </p>
                      <p className="text-xs text-gray-500">{t('infoPage.sidebar.nhis.subtitle')}</p>
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
                <a
                  href="https://www.work.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('infoPage.sidebar.worknet.title')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('infoPage.sidebar.worknet.subtitle')}
                      </p>
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
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('infoPage.sidebar.currentSearch')}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    "{keyword}"
                  </span>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
