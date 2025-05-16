import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { TableCell, TableRow, Chip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
/**
 * 게시글 목록의 각 행(row)을 표시하는 컴포넌트
 */
const PostListItem = ({ post }) => {
    // 날짜 포맷팅 (현재는 ISO 문자열 형태로 들어온다고 가정)
    const formattedDate = post.createdAt
        ? format(new Date(post.createdAt), 'yyyy.MM.dd', { locale: ko })
        : '';
    return (_jsxs(TableRow, { hover: true, sx: {
            '&:hover': {
                backgroundColor: 'rgba(255, 170, 165, 0.05)',
            },
            transition: 'background-color 0.2s',
        }, children: [_jsx(TableCell, { align: "center", children: post.postId }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: post.category, size: "small", sx: {
                        bgcolor: 'rgba(255, 235, 235, 0.8)',
                        color: '#FF6B6B',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                    } }) }), _jsx(TableCell, { align: "left", children: _jsxs(Link, { to: `/community/post/${post.postId}`, style: {
                        textDecoration: 'none',
                        color: '#333',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                    }, children: [post.title, post.commentCount > 0 && (_jsxs(Typography, { component: "span", sx: {
                                color: '#FF6B6B',
                                ml: 1,
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                            }, children: ["[", post.commentCount, "]"] }))] }) }), _jsx(TableCell, { align: "center", children: post.writer?.nickname || '익명' }), _jsx(TableCell, { align: "center", children: formattedDate }), _jsx(TableCell, { align: "center", children: post.viewCount }), _jsx(TableCell, { align: "center", children: post.likeCount })] }));
};
export default PostListItem;
