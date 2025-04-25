// 토론 주제 타입
export interface Debate {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  source?: string; // 기사 출처
  imageUrl?: string; // 관련 이미지
  
  // 찬반 통계
  proCount: number;
  conCount: number;
  
  // 감정표현 통계
  reactions: {
    like: number;
    dislike: number;
    happy: number;
    angry: number;
    sad: number;
    unsure: number;
  };
  
  // 국가별 참여 통계
  countryStats?: {
    countryCode: string;
    countryName: string;
    count: number;
    percentage: number;
  }[];
  
  commentCount: number;
}

// 토론 댓글 타입
export interface DebateComment {
  id: number;
  debateId: number;
  userId: number;
  userName: string;
  userProfileImage?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  
  // 감정표현
  reactions: {
    like: number;
    dislike: number;
    happy: number;
    angry: number;
    sad: number;
    unsure: number;
  };
  
  // 사용자의 찬반 의견
  stance: 'pro' | 'con';
  
  // 대댓글 수
  replyCount: number;
  
  // 국가 정보
  countryCode?: string;
  countryName?: string;
}

// 토론 대댓글 타입
export interface DebateReply {
  id: number;
  commentId: number;
  userId: number;
  userName: string;
  userProfileImage?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  
  // 감정표현
  reactions: {
    like: number;
    dislike: number;
    happy: number;
    angry: number;
    sad: number;
    unsure: number;
  };
  
  // 국가 정보
  countryCode?: string;
  countryName?: string;
}

// 토론 목록 응답 타입
export interface DebateListResponse {
  debates: Debate[];
  total: number;
  totalPages: number;
}

// 찬반 투표 요청 타입
export interface VoteRequest {
  debateId: number;
  stance: 'pro' | 'con';
}

// 감정표현 요청 타입
export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  HAPPY = 'happy',
  ANGRY = 'angry',
  SAD = 'sad',
  UNSURE = 'unsure',
}

export interface ReactionRequest {
  targetId: number; // debateId, commentId, replyId
  targetType: 'debate' | 'comment' | 'reply';
  reactionType: ReactionType;
}

// 필터 및 정렬 옵션
export type DebateSortOption = 'latest' | 'popular' | 'controversial';
export type DebateFilterOption = 'all' | 'participated' | 'bookmark';

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  size: number;
} 