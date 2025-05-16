import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  // 페이지가 1페이지뿐이면 렌더링하지 않음
  if (totalPages <= 1) return null;

  // 페이지 번호 생성
  const generatePageNumbers = () => {
    // 표시할 페이지 번호 배열
    const pageNumbers: number[] = [];

    // 시작 페이지와 끝 페이지 계산
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // 처음/마지막 페이지 표시 여부
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // 1 페이지는 항상 표시
    if (leftSiblingIndex > 1) {
      pageNumbers.push(1);
    }

    // 왼쪽 생략 부호
    if (showLeftDots) {
      pageNumbers.push(-1); // -1은 생략 부호를 표시하기 위한 값
    }

    // 가운데 페이지 번호들
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    // 오른쪽 생략 부호
    if (showRightDots) {
      pageNumbers.push(-2); // -2는 생략 부호를 표시하기 위한 값
    }

    // 마지막 페이지는 항상 표시
    if (rightSiblingIndex < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // 페이지 번호 배열
  const pageNumbers = generatePageNumbers();

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center">
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`
              px-3 py-1 mx-1 rounded-md
              ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-label="이전 페이지"
          >
            &lt;
          </button>
        </li>

        {/* 페이지 번호 */}
        {pageNumbers.map((pageNumber, index) => {
          // 생략 부호인 경우
          if (pageNumber < 0) {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-3 py-1 mx-1 text-gray-500">...</span>
              </li>
            );
          }

          // 일반 페이지 번호
          return (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`
                  px-3 py-1 mx-1 rounded-md
                  ${
                    pageNumber === currentPage
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                aria-label={`${pageNumber} 페이지`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-1 mx-1 rounded-md
              ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-label="다음 페이지"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
