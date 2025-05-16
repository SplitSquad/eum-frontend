import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import VoteProgress from '../shared/VoteProgress';
const DebateItem = ({ debate, colorScheme = 'green', onVote }) => {
    const { id, title, content, createdAt, viewCount, proCount, conCount, commentCount } = debate;
    // 날짜 포맷
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    // 색상 스키마에 따른 스타일
    const colorStyles = {
        green: 'border-l-green-500',
        red: 'border-l-red-500',
        yellow: 'border-l-yellow-500',
        blue: 'border-l-blue-500'
    };
    // 투표 핸들러
    const handleVote = (stance, e) => {
        e.preventDefault(); // 링크 이동 방지
        e.stopPropagation(); // 버블링 방지
        if (onVote) {
            onVote(id, stance);
        }
    };
    // 내용 요약 (100자 제한)
    const summarizeContent = (text, limit = 100) => {
        if (text.length <= limit)
            return text;
        return text.slice(0, limit - 3) + '...';
    };
    return (_jsx("div", { className: `
      bg-white rounded-lg shadow-sm overflow-hidden 
      border-l-4 ${colorStyles[colorScheme]} 
      transition-all duration-200 hover:shadow-md
    `, children: _jsx(Link, { to: `/debate/${id}`, className: "block", children: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: title }), _jsx("p", { className: "text-gray-600 text-sm mb-3", children: summarizeContent(content) }), _jsx("div", { className: "flex justify-between items-center text-xs text-gray-500 mb-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { children: formatDate(createdAt) }), _jsxs("span", { children: ["\uC870\uD68C ", viewCount] }), _jsxs("span", { children: ["\uB313\uAE00 ", commentCount] })] }) }), _jsx(VoteProgress, { proCount: proCount, conCount: conCount, size: "sm" }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsxs("button", { onClick: (e) => handleVote('pro', e), className: "flex-1 py-2 rounded bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition", children: ["\uCC2C\uC131 (", proCount, ")"] }), _jsxs("button", { onClick: (e) => handleVote('con', e), className: "flex-1 py-2 rounded bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition", children: ["\uBC18\uB300 (", conCount, ")"] })] })] }) }) }));
};
export default DebateItem;
