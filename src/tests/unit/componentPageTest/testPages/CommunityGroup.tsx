import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';
import RegionFilter from '@/features/community/components/RegionFilter';
import CategoryFilterSidebar from '@/features/community/components/CategoryFilterSidebar';
import { useRegionStore } from '@/features/community/store/regionStore';
import UseInitializeRegion from '@/shared/hooks/UseInitializeRegion';
import SelectedTagButton from '@/features/community/components/SelectedTagButton';
import { samplePosts } from '@/tests/mocks/communityData';
import CommunityGroupCard from '@/features/community/components/CommunityGroupCard';
import Pagination from '@/components/layout/Pagination';
import Button from '@/components/base/Button';
import Flex from '@/components/layout/Flex';
import SearchBar from '@/components/base/SearchBar';
import DropDown from '@/components/base/DropDown';

const ITEMS_PER_PAGE = 9;
const CommunityGroup = () => {
  UseInitializeRegion();
  const navigate = useNavigate();

  const { resetRegion } = useRegionStore();
  useEffect(() => {
    // 페이지 언마운트 시 리셋
    return () => {
      resetRegion();
    };
  }, [resetRegion]);

  const [currentPage, setCurrentPage] = useState(1);
  const [testValue, setTestValue] = useState(' ');

  const totalPosts = samplePosts.length;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = samplePosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    <AppLayout>
      <PageWrapper>
        <Container as="section">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">커뮤니티 소모임 게시판</h1>

          {/* 🔼 상단 필터: 지역 + 선택된 태그 */}
          <div className="mb-6">
            <RegionFilter />
            <SelectedTagButton />
          </div>

          {/* 🔽 메인 레이아웃: 좌측 사이드바 + 우측 콘텐츠 */}
          <Flex direction="flex-col md:flex-row" gap="gap-6">
            {/* ⬅️ 사이드바 */}
            <div className="md:sticky md:top-24 md:self-start animate-fade-in-down transition-opacity duration-500 ease-in-out">
              {/* ⬅️ 사이드바 */}
              <CategoryFilterSidebar />
            </div>
            {/* ➡️ 우측 콘텐츠 전체 영역 */}
            <div className="flex-1 flex flex-col gap-4">
              {/* ✅ 상단: 글쓰기 버튼 영역 (디자인 분리용 wrapper) */}
              <div className="bg-white p-4 rounded-md shadow-sm flex justify-end">
                <DropDown
                  label="검색조건"
                  items={[
                    { label: '제목+본문', value: '제목+본문' },
                    { label: '제목', value: '제목' },
                    { label: '본문', value: '본문' },
                    { label: '작성자', value: '작성자' },
                  ]}
                  onSelect={e => setTestValue(e)}
                />
                <SearchBar value="testValue" onChange={setTestValue} />
                <Button variant="submit" onClick={() => navigate('/community/write')}>
                  글쓰기
                </Button>
              </div>

              {/* ✅ 하단: 카드 리스트 */}
              <div className="bg-white p-4 rounded-md shadow-sm min-h-[300px]">
                <CommunityGroupCard posts={currentPosts} />
              </div>
            </div>
          </Flex>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Container>
      </PageWrapper>
    </AppLayout>
  );
};

export default CommunityGroup;
