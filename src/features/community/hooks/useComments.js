import { useEffect, useCallback } from 'react';
import useCommunityStore from '../store/communityStore';
/**
 * 댓글 관련 상태와 액션을 제공하는 커스텀 훅
 * @param postId 포스트 ID
 */
export const useComments = (postId = null) => {
    // Zustand store에서 필요한 데이터만 개별적으로 선택 (기존)
    // const comments = useCommunityStore(state => state.comments);
    // const commentsTotalCount = useCommunityStore(state => state.commentPageInfo.totalElements);
    // const commentsLoading = useCommunityStore(state => state.commentLoading);
    // const commentsError = useCommunityStore(state => state.commentError);
    // const fetchComments = useCommunityStore(state => state.fetchComments);
    // const createComment = useCommunityStore(state => state.createComment);
    // const updateComment = useCommunityStore(state => state.updateComment);
    // const deleteComment = useCommunityStore(state => state.deleteComment);
    // const replyComment = useCommunityStore(state => state.addReply);
    // const reactToComment = useCommunityStore(state => state.reactToComment);
    // const cancelReactionToComment = useCommunityStore(state => state.cancelReactionToComment);
    // Zustand store 전체 객체에서 필요한 값 구조분해 할당 (수정)
    const store = useCommunityStore();
    const { comments, commentPageInfo, commentLoading, commentError, fetchComments, createComment, updateComment, deleteComment, addReply: replyComment, reactToComment, } = store;
    const commentsTotalCount = commentPageInfo.totalElements;
    const commentsLoading = commentLoading;
    const commentsError = commentError;
    const fetch = useCallback(() => {
        if (postId !== null) {
            fetchComments(postId);
        }
    }, [fetchComments, postId]);
    const create = useCallback((content) => postId !== null
        ? createComment(postId, content)
        : Promise.reject(new Error('Post ID is null')), [createComment, postId]);
    const update = useCallback((commentId, content) => updateComment(commentId, { content, language: 'ko' }), [updateComment]);
    const remove = useCallback((commentId) => deleteComment(commentId), [deleteComment]);
    const reply = useCallback((parentId, content) => postId !== null
        ? replyComment(postId, parentId, content)
        : Promise.reject(new Error('Post ID is null')), [replyComment, postId]);
    const react = useCallback((commentId, type) => postId !== null
        ? reactToComment(postId, commentId, type === 'LIKE' ? 'LIKE' : 'DISLIKE')
        : Promise.reject(new Error('Post ID is null')), [reactToComment, postId]);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return {
        comments,
        commentsTotalCount,
        commentsLoading,
        commentsError,
        fetch,
        create,
        update,
        remove,
        reply,
        react,
        // alias for compatibility
        updateComment: update,
        deleteComment: remove,
        replyComment: reply,
        reactToComment: react,
    };
};
