import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
/**
 * 내가 북마크한 정보글 항목 컴포넌트
 */
const BookmarkItem = ({ bookmark }) => {
    return (_jsxs("div", { className: "border-b last:border-b-0 py-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { to: `/info/${bookmark.id}`, className: "text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors", children: bookmark.title }), _jsx("span", { className: "text-sm text-gray-500", children: bookmark.createdAt })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx("span", { className: "bg-gray-100 px-2 py-0.5 rounded-full text-xs", children: bookmark.category }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { children: ["\uCD9C\uCC98: ", bookmark.source] })] })] }));
};
export default BookmarkItem;
