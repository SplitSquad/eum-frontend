import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PaginationButton from '@/components/base/PaginationButton';
import ArrowButton from '@/components/base/ArrowButton';
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const pages = [];
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };
    return (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [_jsx(ArrowButton, { direction: "left", disabled: currentPage === 1, onClick: () => onPageChange(currentPage - 1) }), getPageNumbers().map(page => (_jsx(PaginationButton, { page: page, isActive: page === currentPage, onClick: onPageChange }, page))), _jsx(ArrowButton, { direction: "right", disabled: currentPage === totalPages, onClick: () => onPageChange(currentPage + 1) })] }));
};
export default Pagination;
