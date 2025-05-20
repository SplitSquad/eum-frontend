/**
 * 관리자 페이지에 필요한 타입 정의
 * 각 interface 별로 어떤 객체인지 서술
 * 필요한경우 필드별 설명 서술
 */

// 유저 정보
export interface User {
  userId: number;
  userName: string;
  email: string;
  reportCount: number;
  isDeactivate: boolean;
}

// 게시글
export interface Post {
  postId: number;
  userId: number;
  createdAt: string;
  views: number;
  category: string;
  isFile: number; // 0(false), 1(true)
}

// 게시글 내용
export interface PostDetail {
  translation_postId: number;
  postId: number;
  title: string;
  content: string;
  language: string;
}

// 댓글
export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  createdAt: string;
  replyCnt: number;
  heart: number; // 좋아요 수
}

// 댓글 내용
export interface CommentDetail {
  translationCommentId: number;
  commentId: number;
  content: string;
  language: string;
}

// 대댓글
export interface Reply {
  replyId: number;
  commentId: number;
  userId: number;
  createdAt: string;
}

// 대댓글 내용
export interface ReplyDetail {
  translationReplyId: number;
  replyId: number;
  content: string;
  language: string;
}

export interface Report {
  id: number;
  targetType: string; // 'user', 'post', 'comment' 등
  targetId: number;
  reportCount: number;
  processCount: number;
  status: string; // '처리완료', '처리중' 등
}
