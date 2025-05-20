import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const CommunityCard = ({ postId, title = '', views = 0, dislike = 0, like = 0, userName = '', createdAt = '', defaultLink = '', }) => {
    const navigate = useNavigate();
    const clickHandler = () => {
        if (postId) {
            navigate(`${defaultLink}/${postId}`);
        }
    };
    return (_jsxs("div", { onClick: clickHandler, className: "cursor-pointer bg-white shadow-md hover:shadow-lg rounded-lg p-4 transition duration-200 border border-gray-100", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 truncate mb-2", children: title || '제목 없음' }), _jsxs("div", { className: "text-sm text-gray-500 mb-2 flex justify-between", children: [_jsx("span", { children: userName || '익명' }), _jsx("span", { children: createdAt || '-' })] }), _jsxs("div", { className: "flex gap-4 text-xs text-gray-600", children: [_jsxs("span", { children: ["\uD83D\uDC4D ", like ?? 0] }), _jsxs("span", { children: ["\uD83D\uDC4E ", dislike ?? 0] }), _jsxs("span", { children: ["\uD83D\uDC41 ", views ?? 0] })] })] }));
};
export default CommunityCard;
