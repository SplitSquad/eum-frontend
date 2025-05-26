import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/shared/i18n/index';
import koTranslations from '@/shared/i18n/translations/ko';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function InfoListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 카테고리 코드를 배열로 정의
  const categoryKeys = [
    'all',
    'education',
    'financeTaxes',
    'visaLaw',
    'shopping',
    'medicalHealth',
    'residentialRealestate',
    'employmentWorkplace',
    'transportation',
  ] as const;

  // 선택된 카테고리 키만 상태에 저장
  const [selectedKey, setSelectedKey] = useState<(typeof categoryKeys)[number]>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'latest' | 'views'>('latest');
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const size = 4;
  const blockSize = 5;
  const [isAdmin, setIsAdmin] = useState(false);

  // ADMIN 권한 여부 확인
  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const role = JSON.parse(stored)?.state?.user?.role;
        setIsAdmin(role === 'ROLE_ADMIN');
      } catch {}
    }
  }, []);

  // 로컬 북마크 초기 로드
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

  // 게시글 조회 (검색/필터/정렬/페이징)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('auth_token') || '';
        // API에는 항상 한국어 카테고리만 전달
        const koreanCategory = koTranslations.info[selectedKey];

        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(size),
          sort: sortOrder,
          keyword,
          category: koreanCategory,
        });
        const url = keyword
          ? `${API_BASE}/information/search?${params}`
          : `${API_BASE}/information?${params}`;

        const res = await fetch(url, { headers: { Authorization: token } });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        setPosts(data.informationList || []);
        setTotal(data.total || 0);

        // 서버가 isBookmarked 필드를 주면 로컬 덮어쓰기
        if (data.informationList?.[0]?.hasOwnProperty('isBookmarked')) {
          const ids = data.informationList
            .filter((i: any) => i.isBookmarked)
            .map((i: any) => i.informationId);
          setBookmarkedIds(ids);
          localStorage.setItem('bookmarkedIds', JSON.stringify(ids));
        }
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      }
    };
    fetchPosts();
  }, [selectedKey, page, sortOrder, keyword]);

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

  // 페이지네이션 계산
  const totalPages = Math.ceil(total / size);
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  return (
    <div className="flex max-w-6xl mx-auto p-6">
      {/* 카테고리 사이드바 */}
      <aside className="w-48 space-y-2 mr-8">
        {categoryKeys.map(key => {
          const label = t(`info.${key}`);
          const isActive = selectedKey === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setPage(1);
                setKeyword('');
              }}
              className={`block w-full px-4 py-2 text-left rounded-lg transition-colors ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          );
        })}
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">{t('info.koreaLifeGuide')}</h1>

        {/* 검색 + 정렬 바 */}
        <div className="flex justify-between items-center mb-6 space-x-4">
          <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder={t('info.searchPlaceholder')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 h-10 px-4 focus:outline-none"
            />
            <button
              onClick={() => {
                setKeyword(inputValue.trim());
                setPage(1);
                setInputValue('');
              }}
              className="px-4 bg-gray-100 hover:bg-gray-200"
            >
              🔍
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSortOrder('latest');
                setPage(1);
              }}
              className={`px-3 py-1 rounded ${
                sortOrder === 'latest'
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('info.sort.latest')}
            </button>
            <button
              onClick={() => {
                setSortOrder('views');
                setPage(1);
              }}
              className={`px-3 py-1 rounded ${
                sortOrder === 'views'
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('info.sort.views')}
            </button>
          </div>
        </div>

        {/* 게시글 리스트 */}
        <ul className="divide-y">
          {posts.map(item => (
            <li key={item.informationId} className="py-4 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {item.userName} · {item.createdAt}
                </p>
                <h3
                  className="font-semibold text-base cursor-pointer hover:underline"
                  onClick={() => navigate(`${item.informationId}`)}
                >
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleBookmark(item.informationId)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  {bookmarkedIds.includes(item.informationId) ? '★' : '☆'}
                </button>
                <span className="text-sm text-gray-500">
                  {t('info.views', { count: item.views })}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6 relative">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                {t('pagination.prev')}
              </button>
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    p === page ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                {t('pagination.next')}
              </button>
            </div>

            {/* ROLE_ADMIN 일 때만 보이는 글쓰기 버튼 */}
            {isAdmin && (
              <button
                onClick={() => navigate('create')}
                className="absolute right-0 top-0 translate-y-1 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              >
                {t('info.create')}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
