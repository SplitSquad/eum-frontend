import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  blockSize: number;
  onPageChange: (p: number) => void;
  onPrevBlock: () => void;
  onNextBlock: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  startPage,
  endPage,
  blockSize,
  onPageChange,
  onPrevBlock,
  onNextBlock,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button onClick={onPrevBlock} className="px-3 py-1 rounded hover:bg-gray-100">
        이전
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${p === page ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          {p}
        </button>
      ))}
      <button onClick={onNextBlock} className="px-3 py-1 rounded hover:bg-gray-100">
        다음
      </button>
    </div>
  );
};

export default Pagination;
