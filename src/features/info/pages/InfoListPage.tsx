import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import useAuthStore from '@/features/auth/store/authStore';
import { useInfoFormStore } from '../store/InfoFormStore';
import CategorySidebar from '../components/CategorySidebar';
import InfoSearchBar from '../components/InfoSearchBar';
import InfoList from '../components/InfoList';
import Pagination from '../components/Pagination';
import WriteButton from '../components/WriteButton';
import PageHeaderText from '@/components/layout/PageHeaderText';

const categories = [
  '전체',
  '관광/체험',
  '교통/이동',
  '부동산/계약',
  '문화/생활',
  '학사/캠퍼스',
  '비자/법률',
  '잡페어',
  '숙소/지역정보',
];

export default function InfoListPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    selectedCategory,
    sortOrder,
    keyword,
    page,
    inputValue,
    setSelectedCategory,
    setSortOrder,
    setKeyword,
    setPage,
    setInputValue,
    resetListFilters,
    fetchAndSetDetail,
    posts,
    total,
    totalPages,
    bookmarkedIds,
    fetchList,
    toggleBookmark,
  } = useInfoFormStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // 페이지에 표시할 게시글 수
  const size = 4;
  // 페이지네이션 크기
  const blockSize = 5;

  // 리스트 데이터 fetch (필터/정렬/검색/페이지 변경 시)
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, page, sortOrder, keyword]);

  // 페이징 계산
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  // 상세 클릭 시 store에 세팅 후 이동
  const handleDetailClick = async (id: number) => {
    await fetchAndSetDetail(id);
    navigate(`${id}`);
  };

  return (
    <div>
      <PageHeaderText isMobile={isMobile}>한국 생활 가이드</PageHeaderText>
      <div className="flex">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={cat => {
            setSelectedCategory(cat);
            setPage(1);
            setKeyword('');
            setInputValue('');
          }}
        />
        <main className="flex-1 flex flex-col pl-8">
          <InfoSearchBar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSearch={() => {
              setKeyword(inputValue.trim());
              setPage(1);
              setInputValue('');
            }}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
          <InfoList
            posts={posts}
            onClick={handleDetailClick}
            onBookmark={toggleBookmark}
            bookmarkedIds={bookmarkedIds}
          />
          <div className="mt-6 relative">
            <Pagination
              page={page}
              totalPages={totalPages}
              startPage={startPage}
              endPage={endPage}
              blockSize={blockSize}
              onPageChange={setPage}
              onPrevBlock={() => setPage(Math.max(startPage - blockSize, 1))}
              onNextBlock={() => setPage(Math.min(startPage + blockSize, totalPages))}
            />
            {isAdmin && (
              <WriteButton
                onClick={() => {
                  resetListFilters();
                  navigate('create');
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
