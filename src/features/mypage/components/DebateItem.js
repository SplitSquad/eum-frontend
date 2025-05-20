import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
/**
 * 내가 투표한 토론 항목 컴포넌트
 */
const DebateItem = ({ debate }) => {
    return (_jsxs("div", { className: "border-b last:border-b-0 py-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { to: `/debate/${debate.id}`, className: "text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors", children: debate.title }), _jsx("span", { className: "text-sm text-gray-500", children: debate.createdAt })] }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsxs("span", { className: "bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full", children: ["\uD22C\uD45C: ", debate.votedOption] }), _jsxs("span", { className: "ml-3 text-sm text-gray-500", children: ["\uCD1D ", debate.totalVotes, "\uBA85 \uCC38\uC5EC"] })] })] }));
};
export default DebateItem;
