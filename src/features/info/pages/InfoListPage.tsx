import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, useTheme, useMediaQuery, Box } from '@mui/material';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const categories = [
  '전체',
  '교육',
  '교통',
  '금융/세금',
  '비자/법률',
  '쇼핑',
  '의료/건강',
  '주거/부동산',
  '취업/직장',
];

export default function InfoListPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 기존 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'latest' | 'views'>('latest');
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // 페이지에 표시할 게시글 수
  const size = 4;
  // 페이지네이션 크기
  const blockSize = 5;

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

  // 게시글 조회 (검색/필터/정렬/페이징)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('auth_token') || '';
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(size),
          sort: sortOrder,
          keyword,
          category: selectedCategory !== '전체' ? selectedCategory : '전체',
        });
        const url = keyword
          ? `${API_BASE}/information/search?${params}`
          : `${API_BASE}/information?${params}`;

        const res = await fetch(url, { headers: { Authorization: token } });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        setPosts(data.informationList || []);
        setTotal(data.total || 0);

        // 서버에 isBookmarked 필드 있으면 덮어쓰기
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
  }, [selectedCategory, page, sortOrder, keyword]);

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

  // 페이징 계산
  const totalPages = Math.ceil(total / size);
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  return (
    <div>
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
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#555',
            fontFamily: '"Noto Sans KR", sans-serif',
          }}
        >
          한국 생활 가이드
        </Typography>
      </Box>
      <div className="flex">
        {/* 카테고리 사이드바 */}

        <aside className="w-48 space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
                setKeyword('');
              }}
              className={`block w-full px-4 py-2 text-left rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col pl-8">
          {/* 검색 + 정렬 바 */}
          <div className="flex justify-between items-center mb-6 space-x-4">
            <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="제목을 검색하세요."
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.2-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSortOrder('latest')}
                className={`px-3 py-1 rounded ${
                  sortOrder === 'latest'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortOrder('views')}
                className={`px-3 py-1 rounded ${
                  sortOrder === 'views'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                인기순
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
                      <path
                        fill={bookmarkedIds.includes(item.informationId) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5v14l7-7 7 7V5H5z"
                      />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-500">조회수: {item.views}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="mt-6 relative">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(startPage - blockSize, 1))}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                이전
              </button>
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${p === page ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(startPage + blockSize, totalPages))}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                다음
              </button>
            </div>

            {/* ROLE_ADMIN 일 때만 보이는 글쓰기 버튼 */}
            {isAdmin && (
              <button
                onClick={() => navigate('create')}
                className="absolute right-0 top-0 translate-y-1 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              >
                글쓰기
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
