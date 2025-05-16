import React from 'react';
import PaginationButton from '@/components/base/PaginationButton';
import ArrowButton from '@/components/base/ArrowButton';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const getPageNumbers = () => {
    const delta = 2;
    const pages: number[] = [];

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <ArrowButton
        direction="left"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {getPageNumbers().map(page => (
        <PaginationButton
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={onPageChange}
        />
      ))}
      <ArrowButton
        direction="right"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
};

export default Pagination;
