import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
/**
 * 내가 작성한 게시글 항목 컴포넌트
 */
const PostItem = ({ post }) => {
    return (_jsxs("div", { className: "border-b last:border-b-0 py-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { to: `/community/post/${post.id}`, className: "text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors", children: post.title }), _jsx("span", { className: "text-sm text-gray-500", children: post.createdAt })] }), _jsx("p", { className: "text-gray-600 mb-2 line-clamp-2 text-sm", children: post.content }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsxs("span", { className: "flex items-center", children: [_jsx("span", { className: "mr-1", children: "\uD83D\uDC41\uFE0F" }), " ", post.viewCount] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { className: "flex items-center", children: [_jsx("span", { className: "mr-1", children: "\u2764\uFE0F" }), " ", post.likeCount] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { className: "flex items-center", children: [_jsx("span", { className: "mr-1", children: "\uD83D\uDCAC" }), " ", post.commentCount] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsx("span", { className: "bg-gray-100 px-2 py-0.5 rounded-full text-xs", children: post.category })] })] }));
};
export default PostItem;
