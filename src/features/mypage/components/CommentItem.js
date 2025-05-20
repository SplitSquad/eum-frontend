import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
/**
 * 내가 작성한 댓글 항목 컴포넌트
 */
const CommentItem = ({ comment }) => {
    return (_jsxs("div", { className: "border-b last:border-b-0 py-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { to: `/community/post/${comment.postId}`, className: "text-primary-600 hover:underline transition-colors text-sm", children: comment.postTitle }), _jsx("span", { className: "text-sm text-gray-500", children: comment.createdAt })] }), _jsx("p", { className: "text-gray-700 mb-1", children: comment.content })] }));
};
export default CommentItem;
