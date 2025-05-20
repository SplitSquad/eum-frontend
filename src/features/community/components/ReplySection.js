import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper, Divider, styled, Collapse, } from '@mui/material';
import { ThumbUp as ThumbUpIcon, ThumbUpOutlined as ThumbUpOutlinedIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Send as SendIcon, ThumbDown as ThumbDownIcon, ThumbDownOutlined as ThumbDownOutlinedIcon, } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
// 스타일드 컴포넌트
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.15)',
    background: 'linear-gradient(to right, #fff, #fff9f9)',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
        width: '100px',
        height: '100px',
        backgroundImage: 'radial-gradient(circle, rgba(255, 182, 193, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0,
    },
}));
const ReplyItem = styled(Box)(({ theme }) => ({
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 182, 193, 0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
    },
}));
const ReplyInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        '& fieldset': {
            borderColor: 'rgba(255, 182, 193, 0.3)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 182, 193, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ffb6c1',
        },
    },
}));
const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    backgroundColor: '#ffb6c1',
    color: 'white',
    minWidth: '40px',
    padding: '6px 14px',
    '&:hover': {
        backgroundColor: '#ff8da1',
    },
    '&.Mui-disabled': {
        backgroundColor: 'rgba(255, 182, 193, 0.3)',
        color: 'rgba(255, 255, 255, 0.7)',
    },
}));
const ToggleButton = styled(Button)(({ theme }) => ({
    color: '#ff8da1',
    fontSize: '0.85rem',
    '&:hover': {
        backgroundColor: 'rgba(255, 182, 193, 0.08)',
    },
}));
const ReplySection = ({ commentId, initialReplies = [], onAddReply, onLikeReply, onDislikeReply, }) => {
    const [expanded, setExpanded] = useState(false);
    const [replies, setReplies] = useState(initialReplies);
    const [newReply, setNewReply] = useState('');
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        setReplies(initialReplies);
    }, [initialReplies]);
    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };
    const handleAddReply = async () => {
        if (!newReply.trim() || submitting)
            return;
        setSubmitting(true);
        try {
            const success = await onAddReply(commentId, newReply);
            if (success) {
                setNewReply('');
            }
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleLikeReply = async (replyId) => {
        // 이미 좋아요 상태면 좋아요 취소
        const reply = replies.find(r => r.id === replyId);
        if (!reply)
            return;
        let updatedReplies = [...replies];
        try {
            // 이미 같은 반응이 있으면 취소
            if (reply.myReaction === 'LIKE') {
                // 좋아요 취소 로직
                updatedReplies = replies.map(r => r.id === replyId ? { ...r, likes: r.likes - 1, isLiked: false, myReaction: null } : r);
            }
            // 싫어요 상태였다면 싫어요 취소하고 좋아요 추가
            else if (reply.myReaction === 'DISLIKE') {
                updatedReplies = replies.map(r => r.id === replyId
                    ? {
                        ...r,
                        likes: r.likes + 1,
                        dislikes: (r.dislikes || 0) - 1,
                        isLiked: true,
                        isDisliked: false,
                        myReaction: 'LIKE',
                    }
                    : r);
            }
            // 아무 반응도 없었던 경우, 좋아요 추가
            else {
                updatedReplies = replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1, isLiked: true, myReaction: 'LIKE' } : r);
            }
            // 먼저 UI 업데이트
            setReplies(updatedReplies);
            // 서버 요청 (에러가 발생해도 UI는 유지)
            await onLikeReply(commentId, replyId);
        }
        catch (error) {
            console.error('대댓글 좋아요 처리 중 오류 발생:', error);
            // 에러 발생 시 원래대로 복원하지 않고 UI 상태 유지
        }
    };
    const handleDislikeReply = async (replyId) => {
        if (!onDislikeReply)
            return;
        // 해당 댓글 찾기
        const reply = replies.find(r => r.id === replyId);
        if (!reply)
            return;
        let updatedReplies = [...replies];
        try {
            // 이미 싫어요 상태면 싫어요 취소
            if (reply.myReaction === 'DISLIKE') {
                updatedReplies = replies.map(r => r.id === replyId
                    ? { ...r, dislikes: (r.dislikes || 0) - 1, isDisliked: false, myReaction: null }
                    : r);
            }
            // 좋아요 상태였다면 좋아요 취소하고 싫어요 추가
            else if (reply.myReaction === 'LIKE') {
                updatedReplies = replies.map(r => r.id === replyId
                    ? {
                        ...r,
                        likes: r.likes - 1,
                        dislikes: (r.dislikes || 0) + 1,
                        isLiked: false,
                        isDisliked: true,
                        myReaction: 'DISLIKE',
                    }
                    : r);
            }
            // 아무 반응도 없었던 경우, 싫어요 추가
            else {
                updatedReplies = replies.map(r => r.id === replyId
                    ? { ...r, dislikes: (r.dislikes || 0) + 1, isDisliked: true, myReaction: 'DISLIKE' }
                    : r);
            }
            // 먼저 UI 업데이트
            setReplies(updatedReplies);
            // 서버 요청 (에러가 발생해도 UI는 유지)
            await onDislikeReply(commentId, replyId);
        }
        catch (error) {
            console.error('대댓글 싫어요 처리 중 오류 발생:', error);
            // 에러 발생 시 원래대로 복원하지 않고 UI 상태 유지
        }
    };
    // 전체 내용 표시 여부를 토글
    const toggleContent = (replyId) => {
        // 실제 구현에서는 상태 관리를 통해 각 대댓글의 전체 내용 표시 여부를 관리
        console.log('Toggle content for reply:', replyId);
    };
    return (_jsxs(StyledPaper, { children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, children: [_jsxs(Typography, { variant: "subtitle2", color: "text.secondary", children: ["\uB313\uAE00\uC5D0 \uB2EC\uB9B0 \uB2F5\uAE00 ", replies.length, "\uAC1C"] }), _jsx(ToggleButton, { startIcon: expanded ? _jsx(ExpandLessIcon, {}) : _jsx(ExpandMoreIcon, {}), onClick: handleToggleExpand, children: expanded ? '접기' : '펼치기' })] }), _jsxs(Collapse, { in: expanded, children: [_jsx(Box, { mb: 2, children: replies.map(reply => (_jsxs(ReplyItem, { children: [_jsxs(Box, { display: "flex", alignItems: "flex-start", mb: 1, children: [_jsx(Avatar, { src: reply.authorAvatar, sx: {
                                                width: 32,
                                                height: 32,
                                                mr: 1.5,
                                                border: '1px solid rgba(255, 182, 193, 0.3)',
                                            }, children: !reply.authorAvatar && reply.authorName.charAt(0) }), _jsxs(Box, { flex: 1, children: [_jsxs(Box, { display: "flex", alignItems: "center", mb: 0.5, children: [_jsx(Typography, { variant: "subtitle2", fontWeight: "500", children: reply.authorName }), _jsx(Typography, { variant: "caption", color: "text.secondary", sx: { ml: 1 }, children: formatDistanceToNow(reply.createdAt, { addSuffix: true, locale: ko }) })] }), _jsx(Typography, { variant: "body2", color: "text.primary", sx: { wordBreak: 'break-word' }, children: reply.content })] })] }), _jsxs(Box, { display: "flex", alignItems: "center", ml: 5.5, gap: 1, children: [_jsxs(Button, { size: "small", variant: reply.myReaction === 'LIKE' ? 'contained' : 'outlined', startIcon: reply.myReaction === 'LIKE' ? (_jsx(ThumbUpIcon, { fontSize: "small" })) : (_jsx(ThumbUpOutlinedIcon, { fontSize: "small" })), onClick: () => handleLikeReply(reply.id), sx: {
                                                bgcolor: reply.myReaction === 'LIKE' ? 'rgba(255, 170, 165, 0.2)' : 'transparent',
                                                border: '1px solid rgba(255, 170, 165, 0.5)',
                                                borderRadius: '20px',
                                                color: '#666',
                                                fontSize: '0.85rem',
                                                padding: '4px 10px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 170, 165, 0.3)',
                                                },
                                            }, children: ["\uC88B\uC544\uC694 ", reply.likes || 0] }), _jsxs(Button, { size: "small", variant: reply.myReaction === 'DISLIKE' ? 'contained' : 'outlined', startIcon: reply.myReaction === 'DISLIKE' ? (_jsx(ThumbDownIcon, { fontSize: "small" })) : (_jsx(ThumbDownOutlinedIcon, { fontSize: "small" })), onClick: () => handleDislikeReply(reply.id), sx: {
                                                bgcolor: reply.myReaction === 'DISLIKE' ? 'rgba(255, 170, 165, 0.2)' : 'transparent',
                                                border: '1px solid rgba(255, 170, 165, 0.5)',
                                                borderRadius: '20px',
                                                color: '#666',
                                                fontSize: '0.85rem',
                                                padding: '4px 10px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 170, 165, 0.3)',
                                                },
                                            }, children: ["\uC2EB\uC5B4\uC694 ", reply.dislikes || 0] })] })] }, reply.id))) }), _jsx(Divider, { sx: { borderColor: 'rgba(255, 182, 193, 0.2)', my: 2 } })] }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(Avatar, { sx: { width: 32, height: 32, backgroundColor: '#ffb6c1' }, children: "U" }), _jsx(ReplyInput, { fullWidth: true, size: "small", placeholder: "\uB2F5\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", value: newReply, onChange: e => setNewReply(e.target.value), onKeyPress: e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddReply();
                            }
                        } }), _jsx(StyledButton, { disabled: submitting || !newReply.trim(), onClick: handleAddReply, endIcon: _jsx(SendIcon, {}), children: "\uB4F1\uB85D" })] })] }));
};
export default ReplySection;
