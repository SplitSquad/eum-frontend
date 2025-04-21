export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  NONE = 'NONE'
}

export interface Post {
  postId: number;
  title: string;
  content: string;
  writerId: number;
  writerNickname?: string;
  writtenTime?: string;
  modifiedTime?: string;
  like?: number;
  dislike?: number;
  viewCount?: number;
  views?: number; // 백엔드 응답 필드명
  likeCount?: number;
  dislikeCount?: number;
  tags?: string[];
  board?: string;
  userNickname?: string;
  userProfileImage?: string;
  profileImage?: string; // 백엔드 응답 필드명
  commentCount?: number;
  myReaction?: ReactionType;
  isState?: '좋아요' | '싫어요' | null;
}

export interface PostReactionResponse {
  like: number;
  dislike: number;
  isState?: ReactionType;
}

export interface CommentType {
  commentId: number;
  postId: number;
  content: string;
  writer?: {
    userId: number;
    nickname: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  parentId?: number;
  status?: string;
  myReaction?: ReactionType;
  replyCount?: number;
  reply?: number;
  liked?: boolean;
  disliked?: boolean;
  replies?: ReplyType[];
}

export interface ReplyType {
  replyId: number;
  commentId: number;
  content: string;
  writer?: {
    userId: number;
    nickname: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType;
  liked?: boolean;
  disliked?: boolean;
} 