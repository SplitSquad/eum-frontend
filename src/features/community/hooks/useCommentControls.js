import { useState, useCallback } from 'react';
/**
 * 댓글 및 답글 컨트롤(수정, 삭제, 답글 토글 등) 관련 상태와 로직을 관리하는 커스텀 훅
 *
 * @param comments 댓글 목록
 * @returns 댓글 컨트롤 관련 상태 및 함수들
 */
const useCommentControls = (comments) => {
    // 답글 토글 상태 (commentId -> boolean)
    const [replyToggles, setReplyToggles] = useState({});
    // 답글 내용 상태 (commentId -> string)
    const [replyContents, setReplyContents] = useState({});
    // 댓글 수정 모드 상태 (commentId -> boolean)
    const [editMode, setEditMode] = useState({});
    // 댓글 수정 내용 상태 (commentId -> string)
    const [editContents, setEditContents] = useState({});
    // 메뉴 상태 관리
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [activeReplyInfo, setActiveReplyInfo] = useState(null);
    // 상태 초기화 - 댓글 목록이 변경될 때 호출
    const initializeState = useCallback(() => {
        const initialReplyContents = {};
        const initialReplyToggles = {};
        const initialEditMode = {};
        const initialEditContents = {};
        comments.forEach(comment => {
            initialReplyContents[comment.commentId] = '';
            initialReplyToggles[comment.commentId] = false;
            initialEditMode[comment.commentId] = false;
            initialEditContents[comment.commentId] = comment.content;
            if (comment.children) {
                comment.children.forEach(reply => {
                    initialEditMode[reply.commentId] = false;
                    initialEditContents[reply.commentId] = reply.content;
                });
            }
        });
        setReplyContents(initialReplyContents);
        setReplyToggles(initialReplyToggles);
        setEditMode(initialEditMode);
        setEditContents(initialEditContents);
    }, [comments]);
    // 댓글 메뉴 열기 핸들러
    const handleCommentMenuOpen = useCallback((event, commentId) => {
        setMenuAnchorEl(event.currentTarget);
        setActiveCommentId(commentId);
        setActiveReplyInfo(null);
    }, []);
    // 답글 메뉴 열기 핸들러
    const handleReplyMenuOpen = useCallback((event, replyInfo) => {
        setMenuAnchorEl(event.currentTarget);
        setActiveCommentId(null);
        setActiveReplyInfo(replyInfo);
    }, []);
    // 메뉴 닫기 핸들러
    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
        setActiveCommentId(null);
        setActiveReplyInfo(null);
    }, []);
    // 댓글 수정 시작
    const handleEditStart = useCallback((commentId, content) => {
        setEditMode(prev => ({ ...prev, [commentId]: true }));
        if (content) {
            setEditContents(prev => ({ ...prev, [commentId]: content }));
        }
        handleMenuClose();
    }, [handleMenuClose]);
    // 댓글 수정 취소
    const handleEditCancel = useCallback((commentId) => {
        setEditMode(prev => ({ ...prev, [commentId]: false }));
    }, []);
    // 답글 작성 토글
    const handleReplyToggle = useCallback((commentId) => {
        setReplyToggles(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    }, []);
    // 답글 내용 변경
    const handleReplyChange = useCallback((commentId, value) => {
        setReplyContents(prev => ({ ...prev, [commentId]: value }));
    }, []);
    // 댓글 수정 내용 변경
    const handleEditChange = useCallback((commentId, value) => {
        setEditContents(prev => ({ ...prev, [commentId]: value }));
    }, []);
    return {
        replyToggles,
        replyContents,
        editMode,
        editContents,
        menuAnchorEl,
        activeCommentId,
        activeReplyInfo,
        initializeState,
        handleCommentMenuOpen,
        handleReplyMenuOpen,
        handleMenuClose,
        handleEditStart,
        handleEditCancel,
        handleReplyToggle,
        handleReplyChange,
        handleEditChange,
        setActiveReplyInfo,
    };
};
export default useCommentControls;
