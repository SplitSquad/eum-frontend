import React, { useEffect } from 'react';
import { useDebateStore } from '../../store';
import DebateItem from './DebateItem';
import Pagination from '../shared/Pagination';

interface DebateListProps {
  title?: string;
  initialPage?: number;
  pageSize?: number;
  showPagination?: boolean;
  className?: string;
}

const DebateList: React.FC<DebateListProps> = ({
  title = '토론 목록',
  initialPage = 1,
  pageSize = 6,
  showPagination = true,
  className = ''
}) => {
  const {
    debates,
    totalPages,
    currentPage,
    isLoading,
    error,
    getDebates,
    voteOnDebate
  } = useDebateStore();

  // 초기 데이터 로드
  useEffect(() => {
    getDebates(initialPage, pageSize);
  }, [getDebates, initialPage, pageSize]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    getDebates(page, pageSize);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 투표 핸들러
  const handleVote = (id: number, stance: 'pro' | 'con') => {
    voteOnDebate(id, stance);
  };

  // 로딩 상태 표시
  if (isLoading && debates.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error && debates.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-center p-10 text-red-500">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => getDebates(currentPage, pageSize)}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 결과가 없는 경우
  if (debates.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-center p-10 text-gray-500">
          <p>등록된 토론 주제가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 색상 순환 배열
  const colors = ['green', 'red', 'yellow', 'blue'] as const;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debates.map((debate, index) => (
          <DebateItem
            key={debate.id}
            debate={debate}
            colorScheme={colors[index % colors.length]}
            onVote={handleVote}
          />
        ))}
      </div>
      
      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DebateList; 