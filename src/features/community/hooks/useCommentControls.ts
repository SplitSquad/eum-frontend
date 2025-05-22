import { useState, useCallback } from 'react';
// import { Comment } from '../types'; // 타입 import 불가로 임시 주석 처리

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
// type Comment = {
//   commentId: number;
//   content: string;
//   writerNickname?: string;
//   createdAt?: string;
//   likeCount?: number;
//   dislikeCount?: number;
//   replyCount?: number;
// };
type Comment = {
  commentId: number;
  content: string;
  writerNickname?: string;
  createdAt?: string;
  likeCount?: number;
  dislikeCount?: number;
  replyCount?: number;
  children?: Comment[];
};

interface ReplyInfo {
  replyId: number;
  commentId: number;
}

/**
 * 댓글 및 답글 컨트롤(수정, 삭제, 답글 토글 등) 관련 상태와 로직을 관리하는 커스텀 훅
 *
 * @param comments 댓글 목록
 * @returns 댓글 컨트롤 관련 상태 및 함수들
 */
const useCommentControls = (comments: Comment[]) => {
  // 답글 토글 상태 (commentId -> boolean)
  const [replyToggles, setReplyToggles] = useState<Record<number, boolean>>({});
  // 답글 내용 상태 (commentId -> string)
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});

  // 댓글 수정 모드 상태 (commentId -> boolean)
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  // 댓글 수정 내용 상태 (commentId -> string)
  const [editContents, setEditContents] = useState<Record<number, string>>({});

  // 메뉴 상태 관리
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [activeReplyInfo, setActiveReplyInfo] = useState<ReplyInfo | null>(null);

  // 상태 초기화 - 댓글 목록이 변경될 때 호출
  const initializeState = useCallback(() => {
    const initialReplyContents: Record<number, string> = {};
    const initialReplyToggles: Record<number, boolean> = {};
    const initialEditMode: Record<number, boolean> = {};
    const initialEditContents: Record<number, string> = {};

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
  const handleCommentMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, commentId: number) => {
      setMenuAnchorEl(event.currentTarget);
      setActiveCommentId(commentId);
      setActiveReplyInfo(null);
    },
    []
  );

  // 답글 메뉴 열기 핸들러
  const handleReplyMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, replyInfo: ReplyInfo) => {
      setMenuAnchorEl(event.currentTarget);
      setActiveCommentId(null);
      setActiveReplyInfo(replyInfo);
    },
    []
  );

  // 메뉴 닫기 핸들러
  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    setActiveCommentId(null);
    setActiveReplyInfo(null);
  }, []);

  // 댓글 수정 시작
  const handleEditStart = useCallback(
    (commentId: number, content?: string) => {
      setEditMode(prev => ({ ...prev, [commentId]: true }));
      if (content) {
        setEditContents(prev => ({ ...prev, [commentId]: content }));
      }
      handleMenuClose();
    },
    [handleMenuClose]
  );

  // 댓글 수정 취소
  const handleEditCancel = useCallback((commentId: number) => {
    setEditMode(prev => ({ ...prev, [commentId]: false }));
  }, []);

  // 답글 작성 토글
  const handleReplyToggle = useCallback((commentId: number) => {
    setReplyToggles(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  }, []);

  // 답글 내용 변경
  const handleReplyChange = useCallback((commentId: number, value: string) => {
    setReplyContents(prev => ({ ...prev, [commentId]: value }));
  }, []);

  // 댓글 수정 내용 변경
  const handleEditChange = useCallback((commentId: number, value: string) => {
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
