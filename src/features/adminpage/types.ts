/**
 * 관리자 페이지에 필요한 타입 정의
 * 각 interface 별로 어떤 객체인지 서술
 * 필요한경우 필드별 설명 서술
 */

import { StringOrTemplateHeader } from '@tanstack/react-table';

// 유저 정보
export interface User {
  userId: number;
  name: string;
  email: string;
  role: string; // ROLE_USER, ROLE_ADMIN
  nreported: number;
  isDeactivate: boolean;
  deactivateCount: number;
  profileImagePath: string;
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
  reportId: number; // reportDetail 조회할때 사용
  reportContent: string;
  reporterName: string;
  nreported: number;
}

export enum ServiceType {
  COMMUNITY = 'COMMUNITY',
  DISCUSSION = 'DISCUSSION',
  DEBATE = 'DEBATE',
}
export enum TargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
}

export interface ReportDetail {
  reportId: number;
  reporterEmail: string;
  reporterName: string;
  reportContent: string;
  serviceType: ServiceType;
  targetType: TargetType;
  contentId: number;
}

export interface ReportedContent {
  title: string | null; // 제목(게시글의 경우 필요함)
  content: string; // (게시글, 댓글, 대댓글)
  writerName: string; // 작성자 이름
  createdAt: string;
}
