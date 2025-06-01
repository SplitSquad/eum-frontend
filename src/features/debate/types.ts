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

  // 사용자의 투표 상태
  isVotedState?: string; // '찬성' 또는 '반대'

  // 사용자의 감정표현 상태
  isState?: string; // '좋아요', '싫어요', '슬퍼요', '화나요', '글쎄요' 중 하나

  // 국가별 참여 통계
  countryStats?: {
    countryCode: string;
    countryName: string;
    count: number;
    percentage: number;
  }[];

  commentCount: number;

  // 카테고리 정보
  category?: string; // '정치/사회', '경제', '생활/문화', '과학/기술', '스포츠', '엔터테인먼트' 등

  // 댓글 및 답글 데이터 (토론 상세 조회 시 함께 로드)
  comments?: any[]; // DebateComment[] 타입이지만 서버 응답과 완전히 일치하지 않을 수 있어 any로 설정
  replies?: Record<number, any[]>; // commentId를 키로 하는 대댓글 맵
  commentOptions?: {
    total: number;
    page: number;
    totalPages: number;
  };

  // 추천 시스템에서 사용되는 매칭 점수 (0-100)
  matchScore?: number;
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
  stance: 'pro' | 'con' | null;

  // 대댓글 수
  replyCount: number;

  // 국가 정보
  nation?: string; // 국가 정보 추가
  countryCode?: string;
  countryName?: string;

  // 사용자의 감정표현 상태 (백엔드에서 제공)
  isState?: string; // '좋아요', '싫어요' 등
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
  nation?: string; // 국가 정보 추가
  countryCode?: string;
  countryName?: string;

  // 사용자의 감정표현 상태 (백엔드에서 제공)
  isState?: string; // '좋아요', '싫어요' 등
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

// 백엔드 API 타입 정의
// API 요청 타입
export interface DebateReqDto {
  title?: string;
  content?: string;
  category?: string;
  emotion?: string;
}

export interface CommentReqDto {
  content?: string;
  language?: string;
  emotion?: string;
  debateId?: number;
  stance?: 'pro' | 'con';
  heart?: number; // 좋아요에 대한 heart 필드 추가 (DB의 heart 컬럼에 반영)
}

export interface VoteReqDto {
  debateId: number;
  option: string; // 'agree' | 'disagree'
}

// API 응답 타입
export interface DebateResDto {
  debateId: number;
  views: number;
  like: number;
  dislike: number;
  sad: number;
  angry: number;
  hm: number; // unsure
  voteCnt: number;
  commentCnt: number;
  disagreePercent: number;
  agreePercent: number;
  isState: string;
  isVotedState: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
  nation: string;
  nationPercent?: Record<string, number>; // 국가별 참여 비율 맵(예: {"KR": 60, "US": 20})

  // 추가 필드: 변환 로직에서 사용되는 대체 필드들
  id?: number; // debateId 대신 사용될 수 있음
  viewCount?: number; // views 대신 사용될 수 있음
  commentCount?: number; // commentCnt 대신 사용될 수 있음
  happy?: number; // 백엔드에 추가될 수 있는 감정 필드
  source?: string; // 기사 출처 링크
  imageUrl?: string; // 토론 관련 이미지 URL

  // 국가별 통계 정보
  countryStats?: {
    countryCode: string;
    countryName: string;
    count: number;
    percentage: number;
  }[];
}

export interface CommentResDto {
  commentId: number;
  like: number;
  dislike: number;
  reply: number;
  isState: string;
  content: string;
  userName: string;
  userId?: number; // 백엔드에서 userId를 제공할 수 있음
  createdAt: string;
  stance?: 'pro' | 'con' | null;
  voteState?: '찬성' | '반대'; // '찬성' 또는 '반대'
  nation?: string; // 국가 정보 추가
  countryCode?: string; // 국가 코드 추가
  countryName?: string; // 국가명 추가
}

export interface ReplyResDto {
  replyId: number;
  like: number;
  dislike: number;
  isState: string;
  content: string;
  userName: string;
  userId?: number; // 백엔드에서 userId를 제공할 수 있음
  createdAt: string;
  nation?: string; // 국가 정보 추가
  countryCode?: string; // 국가 코드 추가
  countryName?: string; // 국가명 추가
}

// API 응답을 프론트엔드 타입으로 변환하는 유틸리티 함수
export function mapDebateResToFrontend(dto: DebateResDto): Debate {
  // 백엔드에서 제공하는 필드가 다양할 수 있으므로 안전하게 처리
  // 필수 필드가 없을 경우 기본값 사용
  const voteCnt = dto.voteCnt || 0;
  const agreePercent = dto.agreePercent || 0;
  const disagreePercent = dto.disagreePercent || 0;

  // 백엔드 응답에 따라 필드 이름이 다를 수 있음
  const debateId = dto.debateId || dto.id || 0;
  const views = dto.views || dto.viewCount || 0;

  // 댓글 수와 답글 수를 합산하여 총 댓글 수 계산
  // commentCnt는 백엔드에서 받은 댓글 수
  const commentCnt = dto.commentCnt || dto.commentCount || 0;

  // 답글 수를 고려한 총 댓글 수 계산 (여기서는 댓글 데이터가 없으므로 백엔드 데이터 그대로 사용)
  // 나중에 댓글과 답글이 모두 로드되면 그때 정확한 계산을 위해 store에서 별도로 처리

  return {
    id: debateId,
    title: dto.title || '',
    content: dto.content || '',
    createdAt: dto.createdAt || new Date().toISOString(),
    viewCount: views,
    source: dto.source || undefined,
    imageUrl: dto.imageUrl || undefined,
    proCount: Math.round(voteCnt * (agreePercent / 100)),
    conCount: Math.round(voteCnt * (disagreePercent / 100)),
    reactions: {
      like: dto.like || 0,
      dislike: dto.dislike || 0,
      sad: dto.sad || 0,
      angry: dto.angry || 0,
      happy: dto.happy || 0, // 백엔드에 없을 수 있음
      unsure: dto.hm || 0, // 백엔드에서는 hm으로 표현
    },
    countryStats: dto.countryStats || undefined,
    commentCount: commentCnt,
    isVotedState: dto.isVotedState,
    isState: dto.isState,
    category: dto.category || undefined,
    matchScore: dto.nationPercent ? Math.round(agreePercent) : undefined,
  };
}

export function mapCommentResToFrontend(dto: CommentResDto, debateId: number): DebateComment {
  // 디버그를 위한 로그 추가
  console.log(`[DEBUG] 댓글 매핑 (ID: ${dto.commentId}):`, dto);
  console.log(
    `[DEBUG] 국가 정보 확인 - nation: ${dto.nation}, countryCode: ${dto.countryCode}, countryName: ${dto.countryName}`
  );

  // 댓글 내용으로부터 stance 값 추출
  // let extractedStance: 'pro' | 'con' = 'null'; // 기본값은 pro
  let content = dto.content || '';

  // // 댓글 내용에서 stance 정보 확인
  // if (content.startsWith('【반대】')) {
  //   extractedStance = 'con';
  //   console.log(`[DEBUG] 댓글 ID ${dto.commentId}에서 반대 의견 접두사 발견`);
  // } else if (content.startsWith('【찬성】')) {
  //   extractedStance = 'pro';
  //   console.log(`[DEBUG] 댓글 ID ${dto.commentId}에서 찬성 의견 접두사 발견`);
  // }

  // stance 값 디버깅 출력
  // console.log(`[DEBUG] 댓글 ID: ${dto.commentId}의 최종 stance 값:`, extractedStance);

  return {
    id: dto.commentId,
    debateId: debateId,
    userId: dto.userId || 0, // 백엔드에서 userId를 제공하는 경우 사용
    userName: dto.userName || '익명',
    content: dto.content || '',
    createdAt: dto.createdAt || new Date().toISOString(),
    reactions: {
      like: dto.like || 0,
      dislike: dto.dislike || 0,
      happy: 0,
      angry: 0,
      sad: 0,
      unsure: 0,
    },
    stance: dto.stance === 'pro' || dto.stance === 'con' ? dto.stance : null, // 1순위: 백엔드 응답의 stance, 2순위: 기본값 'pro'
    replyCount: dto.reply || 0,
    isState: dto.isState,
    nation: dto.nation,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
  };
}

export function mapReplyResToFrontend(dto: ReplyResDto, commentId: number): DebateReply {
  // 디버그를 위한 로그 추가
  console.log(`[DEBUG] 답글 매핑 (ID: ${dto.replyId}):`, dto);
  console.log(
    `[DEBUG] 답글 국가 정보 확인 - nation: ${dto.nation}, countryCode: ${dto.countryCode}, countryName: ${dto.countryName}`
  );

  return {
    id: dto.replyId,
    commentId: commentId,
    userId: dto.userId || 0, // 백엔드에서 userId를 제공하는 경우 사용
    userName: dto.userName,
    content: dto.content,
    createdAt: dto.createdAt,
    reactions: {
      like: dto.like,
      dislike: dto.dislike,
      happy: 0, // 백엔드에 없음
      angry: 0, // 백엔드에 없음
      sad: 0, // 백엔드에 없음
      unsure: 0, // 백엔드에 없음
    },
    isState: dto.isState,
    nation: dto.nation,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
  };
}

/**
 * 백엔드의 isVotedState 값을 프론트엔드의 VoteType으로 변환
 * @param isVotedState 백엔드에서 전달받은 투표 상태 ('찬성' | '반대' | null)
 * @returns 프론트엔드에서 사용하는 VoteType ('pro' | 'con' | null)
 */
export function mapIsVotedStateToVoteType(
  isVotedState: string | null | undefined
): 'pro' | 'con' | null {
  if (!isVotedState) return null;

  switch (isVotedState) {
    case '찬성':
      return 'pro';
    case '반대':
      return 'con';
    default:
      return null;
  }
}

/**
 * 백엔드의 isState 값을 프론트엔드의 EmotionType으로 변환
 * @param isState 백엔드에서 전달받은 감정 상태
 * @returns 프론트엔드에서 사용하는 EmotionType
 */
export function mapIsStateToEmotionType(
  isState: string | null | undefined
): 'like' | 'dislike' | 'sad' | 'angry' | 'confused' | null {
  if (!isState) return null;

  switch (isState) {
    case '좋아요':
      return 'like';
    case '싫어요':
      return 'dislike';
    case '슬퍼요':
      return 'sad';
    case '화나요':
      return 'angry';
    case '글쎄요':
      return 'confused';
    default:
      return null;
  }
}
