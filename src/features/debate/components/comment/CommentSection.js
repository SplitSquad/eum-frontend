import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDebateStore } from '../../store';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Pagination from '../shared/Pagination';
import { Box, Typography, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, Divider, Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SortIcon from '@mui/icons-material/Sort';
// 스타일 컴포넌트
const CommentContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));
const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));
const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    textTransform: 'none',
    boxShadow: 'none',
    padding: theme.spacing(1, 2),
    fontSize: '0.9rem',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
    },
}));
const EmptyCommentsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
    borderRadius: 8,
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
}));
const CommentListContainer = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(4),
    '& > div + div': {
        marginTop: theme.spacing(2),
    }
}));
const CommentSection = ({ debateId }) => {
    const { comments, totalComments, commentPages, currentCommentPage, isLoading, getComments } = useDebateStore();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [sortBy, setSortBy] = useState('latest');
    const [localComments, setLocalComments] = useState([]);
    // 새 댓글 추가 성공 핸들러
    const handleCommentSuccess = (newComment) => {
        // 임시 ID인 경우 (음수) - 낙관적 UI 업데이트를 위한 로컬 댓글
        if (newComment && newComment.id < 0) {
            setLocalComments(prev => [newComment, ...prev]);
            setShowCommentForm(false);
        }
        // 서버에서 실제 데이터를 받은 경우 - API 호출 완료
        else {
            // 댓글 작성 폼 닫기
            setShowCommentForm(false);
            // 서버 데이터 다시 가져오기
            getComments(debateId, currentCommentPage || 1);
        }
    };
    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        // 페이지 변경 시 로컬 댓글 초기화
        setLocalComments([]);
        getComments(debateId, page);
    };
    // 정렬 변경 핸들러
    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortBy(value);
        // 정렬 변경 시 로컬 댓글 초기화
        setLocalComments([]);
        // 서버에서 새로 데이터 가져오기 (정렬 옵션은 백엔드에서 처리)
        getComments(debateId, 1);
    };
    // 댓글이 없는 경우
    const renderEmptyComments = () => (_jsxs(EmptyCommentsBox, { children: [_jsx(Typography, { variant: "body1", color: "text.secondary", gutterBottom: true, children: "\uC544\uC9C1 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(ActionButton, { onClick: () => setShowCommentForm(true), variant: "contained", color: "primary", startIcon: _jsx(AddCommentIcon, {}), sx: { mt: 2 }, children: "\uCCAB \uB313\uAE00 \uC791\uC131\uD558\uAE30" })] }));
    // 서버 댓글과 로컬 댓글 통합
    const allComments = [...localComments, ...comments];
    return (_jsxs(CommentContainer, { elevation: 0, children: [_jsxs(HeaderBox, { children: [_jsxs(Typography, { variant: "h6", fontWeight: "bold", color: "text.primary", children: ["\uB313\uAE00 ", totalComments + localComments.length, "\uAC1C"] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, alignItems: 'center' }, children: [_jsxs(FormControl, { variant: "outlined", size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { id: "comment-sort-label", children: "\uC815\uB82C" }), _jsxs(Select, { labelId: "comment-sort-label", value: sortBy, onChange: handleSortChange, label: "\uC815\uB82C", startAdornment: _jsx(SortIcon, { fontSize: "small", sx: { color: 'action.active', mr: 1 } }), children: [_jsx(MenuItem, { value: "latest", children: "\uCD5C\uC2E0\uC21C" }), _jsx(MenuItem, { value: "oldest", children: "\uC624\uB798\uB41C\uC21C" }), _jsx(MenuItem, { value: "popular", children: "\uC778\uAE30\uC21C" })] })] }), _jsx(ActionButton, { onClick: () => setShowCommentForm(!showCommentForm), variant: "contained", color: showCommentForm ? "inherit" : "primary", startIcon: _jsx(AddCommentIcon, {}), children: showCommentForm ? '취소' : '댓글 작성' })] })] }), _jsx(Divider, { sx: { mb: 3 } }), showCommentForm && (_jsx(Box, { sx: { mb: 4 }, children: _jsx(CommentForm, { debateId: debateId, onSuccess: handleCommentSuccess }) })), _jsx(Box, { sx: { mt: 2 }, children: isLoading && comments.length === 0 && localComments.length === 0 ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, { color: "primary", size: 40 }) })) : allComments.length === 0 ? (renderEmptyComments()) : (_jsx(CommentListContainer, { spacing: 3, children: allComments.map(comment => (_jsx(CommentItem, { comment: comment, debateId: debateId, onUpdate: () => {
                            // 댓글 목록 업데이트가 필요한 경우만 서버 API 호출 (댓글 삭제, 수정 등)
                            // 대댓글만 업데이트 되었을 때는 불필요한 댓글 목록 다시 로드 방지
                            // 제발 이거로 되어야만 한다....
                            console.log('댓글 업데이트 이벤트 발생 - 리다이렉션 방지를 위해 자동 새로고침 비활성화됨');
                            // 기존 코드를 주석 처리하여 불필요한 API 호출 방지
                            /*
                            console.log('댓글 업데이트 필요 - 목록 다시 불러오기');
                            if (currentCommentPage) {
                              getComments(debateId, currentCommentPage);
                            }
                            */
                        } }, comment.id))) })) }), commentPages > 1 && (_jsx(Box, { sx: { mt: 4, display: 'flex', justifyContent: 'center' }, children: _jsx(Pagination, { currentPage: currentCommentPage, totalPages: commentPages, onPageChange: handlePageChange }) }))] }));
};
export default CommentSection;
