import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDebateStore } from '../../store';
import DebateItem from './DebateItem';
import Pagination from '../shared/Pagination';
const DebateList = ({ title = '토론 목록', initialPage = 1, pageSize = 6, showPagination = true, className = '' }) => {
    const { debates, totalPages, currentPage, isLoading, error, getDebates, voteOnDebate } = useDebateStore();
    // 초기 데이터 로드
    useEffect(() => {
        getDebates(initialPage, pageSize);
    }, [getDebates, initialPage, pageSize]);
    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        getDebates(page, pageSize);
        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // 투표 핸들러
    const handleVote = (id, stance) => {
        voteOnDebate(id, stance);
    };
    // 로딩 상태 표시
    if (isLoading && debates.length === 0) {
        return (_jsxs("div", { className: `bg-white rounded-lg shadow p-6 ${className}`, children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: title }), _jsx("div", { className: "flex justify-center items-center p-10", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary" }) })] }));
    }
    // 에러 상태 표시
    if (error && debates.length === 0) {
        return (_jsxs("div", { className: `bg-white rounded-lg shadow p-6 ${className}`, children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: title }), _jsxs("div", { className: "text-center p-10 text-red-500", children: [_jsx("p", { children: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4." }), _jsx("button", { onClick: () => getDebates(currentPage, pageSize), className: "mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition", children: "\uB2E4\uC2DC \uC2DC\uB3C4" })] })] }));
    }
    // 결과가 없는 경우
    if (debates.length === 0) {
        return (_jsxs("div", { className: `bg-white rounded-lg shadow p-6 ${className}`, children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: title }), _jsx("div", { className: "text-center p-10 text-gray-500", children: _jsx("p", { children: "\uB4F1\uB85D\uB41C \uD1A0\uB860 \uC8FC\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) })] }));
    }
    // 색상 순환 배열
    const colors = ['green', 'red', 'yellow', 'blue'];
    return (_jsxs("div", { className: `bg-white rounded-lg shadow p-6 ${className}`, children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: title }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: debates.map((debate, index) => (_jsx(DebateItem, { debate: debate, colorScheme: colors[index % colors.length], onVote: handleVote }, debate.id))) }), showPagination && totalPages > 1 && (_jsx("div", { className: "mt-6 flex justify-center", children: _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange }) }))] }));
};
export default DebateList;
