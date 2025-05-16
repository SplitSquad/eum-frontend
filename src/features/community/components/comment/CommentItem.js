import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, Button, Menu, MenuItem, Collapse, } from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useCommunityStore from '../../store/communityStore';
import { ReactionType } from '../../types';
import useAuthStore from '../../../auth/store/authStore';
import ReplyForm from '../ReplyForm';
import { useComments } from '../../hooks';
// 스타일링된 컴포넌트
const CommentBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
}));
const ReplyBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(1),
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 250, 250, 0.7)',
    borderLeft: '2px solid #FFAAA5',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: 'rgba(255, 250, 250, 0.9)',
    },
}));
const ReactionButton = styled(IconButton)(({ theme }) => ({
    padding: '4px',
    color: '#888',
}));
const ActionButton = styled(Button)(({ theme }) => ({
    color: '#888',
    textTransform: 'none',
    fontSize: '0.75rem',
    padding: '2px 8px',
    minWidth: 'auto',
    '&:hover': {
        backgroundColor: 'rgba(255, 170, 165, 0.1)',
    },
}));
const CommentItem = ({ comment, postId, isReply = false, parentId, }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    // 커스텀 훅 사용
    const { updateComment, deleteComment, replyComment, reactToComment } = useComments(postId);
    // 기존 스토어 사용 (훅으로 대체되지 않은 기능이 있을 수 있음)
    const communityStore = useCommunityStore();
    const { user: currentUser } = useAuthStore();
    // 현재 사용자가 댓글 작성자인지 확인
    const isCommentAuthor = (currentUser?.id ?? currentUser?.userId)?.toString() ===
        (comment.writer?.id ?? comment.writer?.userId)?.toString();
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleReplyButtonClick = () => {
        setShowReplyForm(!showReplyForm);
    };
    const handleReaction = async (type) => {
        try {
            if (!currentUser) {
                alert('좋아요/싫어요를 남기려면 로그인이 필요합니다.');
                return;
            }
            console.log(`댓글 ${type} 반응 추가 시도:`, { commentId: comment.commentId, type });
            // 커스텀 훅 사용
            await reactToComment(comment.commentId, type);
        }
        catch (error) {
            console.error('댓글 반응 추가 실패:', error);
        }
    };
    const handleDelete = async () => {
        try {
            if (!isCommentAuthor) {
                alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
                return;
            }
            // 커스텀 훅 사용
            await deleteComment(comment.commentId);
            handleMenuClose();
        }
        catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };
    const handleToggleReplies = () => {
        setRepliesVisible(!repliesVisible);
    };
    const handleEditStart = () => {
        setEditMode(true);
        setEditedContent(comment.content);
        handleMenuClose();
    };
    const handleEditCancel = () => {
        setEditMode(false);
    };
    const handleEditSubmit = async () => {
        if (editedContent.trim()) {
            try {
                // 커스텀 훅 사용
                await updateComment(comment.commentId, editedContent.trim());
                setEditMode(false);
            }
            catch (error) {
                console.error('댓글 수정 실패:', error);
            }
        }
    };
    const handleReplyFormClose = () => {
        setShowReplyForm(false);
    };
    const formattedDate = comment.createdAt
        ? format(new Date(comment.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
        : '날짜 없음';
    const CommentContainer = isReply ? ReplyBox : CommentBox;
    return (_jsxs(_Fragment, { children: [_jsxs(CommentContainer, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Avatar, { src: comment.writer?.profileImage, alt: comment.writer?.nickname || '사용자', sx: { width: 32, height: 32, mr: 1 } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, color: '#555' }, children: comment.writer?.nickname || '사용자' }), _jsxs(Typography, { variant: "caption", sx: { color: '#888' }, children: [formattedDate, " ", isReply && _jsx("span", { style: { color: '#FFAAA5' }, children: "(\uB2F5\uAE00)" })] })] })] }), isCommentAuthor && (_jsx(IconButton, { size: "small", onClick: handleMenuClick, sx: { color: '#888' }, children: _jsx(MoreVertIcon, { fontSize: "small" }) })), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, children: [_jsx(MenuItem, { onClick: handleEditStart, sx: { color: '#2196F3' }, children: "\uC218\uC815\uD558\uAE30" }), _jsx(MenuItem, { onClick: handleDelete, sx: { color: '#f44336' }, children: "\uC0AD\uC81C\uD558\uAE30" })] })] }), editMode ? (_jsxs(Box, { sx: { mt: 1, mb: 2 }, children: [_jsx(TextField, { fullWidth: true, size: "small", multiline: true, value: editedContent, onChange: e => setEditedContent(e.target.value), sx: {
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '& fieldset': {
                                            borderColor: '#FFD7D7',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFAAA5',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF9999',
                                        },
                                    },
                                } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 1 }, children: [_jsx(Button, { size: "small", variant: "outlined", onClick: handleEditCancel, sx: {
                                            borderColor: '#FFD7D7',
                                            color: '#888',
                                            '&:hover': {
                                                borderColor: '#FFAAA5',
                                                backgroundColor: 'rgba(255, 170, 165, 0.05)',
                                            },
                                        }, children: "\uCDE8\uC18C" }), _jsx(Button, { size: "small", variant: "contained", onClick: handleEditSubmit, disabled: !editedContent.trim(), sx: {
                                            backgroundColor: '#FFAAA5',
                                            '&:hover': {
                                                backgroundColor: '#FF9999',
                                            },
                                            boxShadow: '0 2px 4px rgba(255, 170, 165, 0.3)',
                                        }, children: "\uC218\uC815\uC644\uB8CC" })] })] })) : (_jsx(Typography, { variant: "body2", sx: {
                            color: '#333',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            mb: 1,
                        }, children: comment.content })), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mt: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mr: 2 }, children: [_jsx(ReactionButton, { size: "small", onClick: () => handleReaction(ReactionType.LIKE), children: comment.myReaction === ReactionType.LIKE ? (_jsx(ThumbUpIcon, { fontSize: "small", sx: { color: '#4CAF50' } })) : (_jsx(ThumbUpAltOutlinedIcon, { fontSize: "small" })) }), _jsx(Typography, { variant: "caption", sx: { mx: 0.5, color: '#888' }, children: comment.likeCount || 0 }), _jsx(ReactionButton, { size: "small", onClick: () => handleReaction(ReactionType.DISLIKE), children: comment.myReaction === ReactionType.DISLIKE ? (_jsx(ThumbDownIcon, { fontSize: "small", sx: { color: '#F44336' } })) : (_jsx(ThumbDownAltOutlinedIcon, { fontSize: "small" })) }), _jsx(Typography, { variant: "caption", sx: { mx: 0.5, color: '#888' }, children: comment.dislikeCount || 0 })] }), _jsxs(ActionButton, { startIcon: _jsx(ReplyIcon, { fontSize: "small" }), onClick: handleReplyButtonClick, variant: "text", sx: {
                                    backgroundColor: showReplyForm ? 'rgba(255, 170, 165, 0.1)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 170, 165, 0.2)',
                                    },
                                }, children: ["\uB2F5\uAE00 \uC791\uC131 ", comment.replies?.length ? `(${comment.replies.length})` : ''] })] }), showReplyForm && (_jsx(ReplyForm, { postId: postId, commentId: comment.commentId, onClose: handleReplyFormClose }))] }), !isReply && comment.replies && comment.replies.length > 0 && (_jsxs(_Fragment, { children: [comment.replies.length > 0 && (_jsx(Box, { sx: { pl: 2, mb: 1 }, children: _jsx(ActionButton, { onClick: handleToggleReplies, sx: { ml: 4 }, children: repliesVisible ? '답글 숨기기' : `${comment.replies.length}개의 답글 보기` }) })), _jsx(Collapse, { in: repliesVisible, children: comment.replies.map(reply => (_jsx(CommentItem, { comment: reply, postId: postId, isReply: true, parentId: comment.commentId }, reply.commentId))) })] }))] }));
};
export default CommentItem;
