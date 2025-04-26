import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import CategoryFilterSidebar from '@/features/community/components/CategoryFilterSidebar';
import SelectedTagButton from '@/features/community/components/SelectedTagButton';
import CommunityBoardCard from '@/features/community/components/CommunityBoardCard';
import Pagination from '@/components/layout/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/base/Button';
import Flex from '@/components/layout/Flex';
import DropDown from '@/components/base/DropDown';
import SearchBar from '@/components/base/SearchBar';
import { useCommunityStore } from '@/features/community/store/communityStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { tempLogin } from '@/features/auth/api/tempAuthApi';

const ITEMS_PER_PAGE = 9;

interface LocalPostFilter {
  category?: string;
  postType?: string;
  location?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular';
  page: number;
  size: number;
}

const CommunityBoard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 페이징 상태 ---
  const [currentPage, setCurrentPage] = useState(1);

  // --- 필터 상태 (카테고리, 타입 등) ---
  const [filter, setFilter] = useState<LocalPostFilter>({
    page: 0,
    size: ITEMS_PER_PAGE,
  });

  // --- 스토어에서 받아오는 값들 ---
  const {
    posts, // 현재 페이지에 해당하는 게시글들
    totalCount, // 전체 게시글 개수
    postLoading,
    postError,
    fetchPosts, // 게시글 목록 조회 액션
  } = useCommunityStore();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 컴포넌트 마운트 및 필터 변경 시마다 호출
  useEffect(() => {
    // filter.page 는 0-based. currentPage 는 1-based.
    fetchPosts({ ...filter, page: filter.page, size: filter.size });
  }, [filter]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilter(f => ({ ...f, page: page - 1 }));
  };

  // 게시글 작성 핸들러
  const handleCreatePost = async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      const result = await tempLogin(1);
      const token = localStorage.getItem('auth_token');
      if (token) {
        useAuthStore.getState().handleLogin(token, {
          id: result.userId.toString(),
          email: `user${result.userId}@example.com`,
          name: `User ${result.userId}`,
          role: 'USER',
        });
      }
    }
    navigate('/community/create');
  };

  return (
    <AppLayout>
      <PageWrapper>
        <Container as="section">
          <h1 className="text-2xl font-bold mb-6">커뮤니티 소통 게시판</h1>

          {/* 선택된 태그 표시(필터 요약) */}
          <div className="mb-6">
            <SelectedTagButton />
          </div>

          <Flex direction="flex-col md:flex-row" gap="gap-6">
            {/* 사이드바 */}
            <aside className="md:sticky md:top-24">
              <CategoryFilterSidebar />
            </aside>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col gap-4">
              {/* 검색 & 글쓰기 영역 */}
              <div className="bg-white p-4 rounded-md shadow-sm flex justify-end gap-2">
                <DropDown
                  label="검색조건"
                  items={[
                    { label: '제목+본문', value: '제목+본문' },
                    { label: '제목', value: '제목' },
                    { label: '본문', value: '본문' },
                    { label: '작성자', value: '작성자' },
                  ]}
                  onSelect={() => {}}
                />
                <SearchBar value="" onChange={() => {}} onSearch={() => {}} />
                <Button onClick={handleCreatePost}>글쓰기</Button>
              </div>

              {/* 게시글 카드 리스트 */}
              <div className="bg-white p-4 rounded-md shadow-sm min-h-[300px]">
                {postLoading ? (
                  <div>로딩 중…</div>
                ) : postError ? (
                  <div>에러 발생: {postError}</div>
                ) : (
                  <CommunityBoardCard posts={posts} />
                )}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </Flex>
        </Container>
      </PageWrapper>
    </AppLayout>
  );
};

export default CommunityBoard;
