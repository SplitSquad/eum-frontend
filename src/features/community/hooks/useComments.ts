import { useEffect, useCallback } from 'react';
import useCommunityStore from '../store/communityStore';
import { ReactionType } from '../types';

/**
 * 댓글 관련 상태와 액션을 제공하는 커스텀 훅
 * @param postId 포스트 ID
 */
export const useComments = (postId: number | null = null) => {
  // Zustand store에서 필요한 데이터만 개별적으로 선택
  const comments = useCommunityStore(state => state.comments);
  const commentsTotalCount = useCommunityStore(state => state.commentPageInfo.totalElements);
  const commentsLoading = useCommunityStore(state => state.commentLoading);
  const commentsError = useCommunityStore(state => state.commentError);

  const fetchComments = useCommunityStore(state => state.fetchComments);
  const createComment = useCommunityStore(state => state.createComment);
  const updateComment = useCommunityStore(state => state.updateComment);
  const deleteComment = useCommunityStore(state => state.deleteComment);
  const replyComment = useCommunityStore(state => state.addReply);
  const reactToComment = useCommunityStore(state => state.reactToComment);
  const cancelReactionToComment = useCommunityStore(state => state.cancelReactionToComment);

  // 댓글 목록 불러오기 (postId 변경 시 or 처음 마운트)
  const fetch = useCallback(() => {
    if (postId !== null) {
      fetchComments(postId);
    }
  }, [fetchComments, postId]);

  // 댓글 생성
  const create = useCallback(
    (content: string) =>
      postId !== null
        ? createComment(postId, content)
        : Promise.reject(new Error('Post ID is null')),
    [createComment, postId]
  );

  // 댓글 수정
  const update = useCallback(
    (commentId: number, content: string) => updateComment(commentId, content),
    [updateComment]
  );

  // 댓글 삭제
  const remove = useCallback(
    (commentId: number) => deleteComment(commentId),
    [deleteComment]
  );

  // 답글 작성
  const reply = useCallback(
    (parentId: number, content: string) =>
      postId !== null
        ? replyComment(postId, parentId, content)
        : Promise.reject(new Error('Post ID is null')),
    [replyComment, postId]
  );

  // 댓글 반응 (좋아요/싫어요)
  const react = useCallback(
    (commentId: number, type: ReactionType) =>
      postId !== null
        ? reactToComment(postId, commentId, type)
        : Promise.reject(new Error('Post ID is null')),
    [reactToComment, postId]
  );

  // 반응 취소
  const cancelReact = useCallback(
    (commentId: number, type: ReactionType) =>
      cancelReactionToComment(commentId, type),
    [cancelReactionToComment]
  );

  // 마운트 또는 postId 변경 시 댓글 목록 한 번만 로드
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
    cancelReact,
  };
};
