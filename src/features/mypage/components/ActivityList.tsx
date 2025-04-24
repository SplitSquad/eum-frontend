import React, { ReactNode } from 'react';

interface ActivityListProps {
  title: string;
  emptyMessage: string;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  children: ReactNode;
}

/**
 * 활동 목록을 표시하는 공통 컴포넌트
 * 로딩 상태, 에러 상태, 빈 상태를 처리합니다.
 */
const ActivityList: React.FC<ActivityListProps> = ({ 
  title, 
  emptyMessage, 
  isLoading, 
  error, 
  isEmpty,
  children 
}) => {
  return (
    <div className="border rounded-lg overflow-hidden mb-8">
      {/* 제목 */}
      <div className="bg-gray-50 border-b px-4 py-3">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      
      {/* 내용 영역 */}
      <div className="p-4">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button className="mt-2 text-primary-500 hover:underline">다시 시도</button>
          </div>
        )}
        
        {/* 빈 상태 */}
        {isEmpty && !isLoading && !error && (
          <div className="text-center py-12 text-gray-500">
            <p>{emptyMessage}</p>
          </div>
        )}
        
        {/* 콘텐츠 */}
        {!isEmpty && !isLoading && !error && children}
      </div>
    </div>
  );
};

export default ActivityList; 