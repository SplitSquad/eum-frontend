import apiClient from './apiClient';
// import { Comment, Reply, ReactionType } from '../types-folder/index'; // 존재하지 않아 임시 주석 처리

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
type ReactionType = 'LIKE' | 'DISLIKE';
type Reply = any;
type Comment = any;

/**
 * 댓글 API 관련 상수
 */
const COMMENTS_BASE_URL = '/community/comment';
const REPLIES_BASE_URL = '/community/reply';

/**
 * isState 문자열을 myReaction 타입으로 변환하는 헬퍼 함수
 */
function convertIsStateToMyReaction(isState: string | null | undefined): ReactionType | undefined {
  if (isState === '좋아요') return 'LIKE' as ReactionType;
  if (isState === '싫어요') return 'DISLIKE' as ReactionType;
  return undefined;
}

/**
 * 댓글 객체를 변환하는 헬퍼 함수 (백엔드 응답 -> 프론트엔드 형식)
 */
function transformCommentData(comment: any, postId?: number): Comment {
  // isState를 myReaction으로 변환
  const myReaction = convertIsStateToMyReaction(comment.isState);

  // writer 객체 생성 - API가 root level에서 유저 정보를 주는 경우
  const writerObj = comment.writer || {
    userId: comment.userId,
    nickname: comment.userName,
    profileImage: comment.userPicture || '',
  };

  return {
    ...comment,
    postId: comment.postId || postId, // postId가 null이면 인자로 받은 postId 사용
    myReaction: myReaction, // isState -> myReaction으로 변환
    likeCount: comment.like || 0, // like -> likeCount로 매핑
    dislikeCount: comment.dislike || 0, // dislike -> dislikeCount로 매핑
    writer: writerObj, // writer 객체 추가
  };
}

/**
 * 대댓글 객체 변환 헬퍼 함수 (백엔드 응답 -> 프론트엔드 형식)
 */
function transformReplyData(reply: any, commentId?: number): Reply {
  // isState를 myReaction으로 변환
  const myReaction = convertIsStateToMyReaction(reply.isState);

  // writer 객체 생성
  const writerObj = reply.writer || {
    userId: reply.userId,
    nickname: reply.userName,
    profileImage: reply.userPicture || '',
  };

  return {
    ...reply,
    commentId: reply.commentId || commentId,
    replyId: reply.replyId || reply.id,
    myReaction: myReaction,
    likeCount: reply.like || 0,
    dislikeCount: reply.dislike || 0,
    writer: writerObj,
    liked: myReaction === 'LIKE',
    disliked: myReaction === 'DISLIKE',
  };
}

/**
 * 댓글 API 응답 타입 정의
 */
export interface CommentResponseData {
  commentList: Comment[]; // 백엔드 응답 구조에 맞게 수정
  total: number;
  pageInfo?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ReplyResponseData {
  replyList: Reply[]; // 백엔드 응답 구조에 맞게 수정
  total: number;
  pageInfo?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ReactionResponseData {
  like: number;
  dislike: number;
  liked?: boolean;
  disliked?: boolean;
  isState?: string; // 백엔드에서 반환하는 현재 상태 ("좋아요", "싫어요")
}

/**
 * 댓글 관련 API
 */
export const CommentApi = {
  /**
   * 댓글 목록 조회
   */
  getComments: async (
    postId: number,
    targetType: string = 'post', // targetType은 내부적으로만 사용, 백엔드에 전달하지 않음
    page: number = 0,
    size: number = 5
  ): Promise<CommentResponseData> => {
    try {
      console.log(`[DEBUG] 댓글 목록 API 호출 - postId: ${postId}`);
      // 백엔드 API 요청 형식에 맞게 수정
      const response = await apiClient.get<CommentResponseData>(
        `${COMMENTS_BASE_URL}?postId=${postId}&page=${page}&size=${size}&sort=latest`
      );

      console.log('[DEBUG] 댓글 원본 응답:', JSON.stringify(response, null, 2));

      // 댓글 목록이 있는 경우 (commentList 배열)
      if (response && response.commentList) {
        // 각 댓글을 변환 (userName -> writer.nickname)
        const transformedComments = response.commentList.map(comment =>
          transformCommentData(comment, postId)
        );

        console.log('[DEBUG] 변환된 댓글 목록:', transformedComments);

        return {
          ...response,
          commentList: transformedComments,
          pageInfo: {
            page: page,
            size: size,
            totalElements: response.total || 0,
            totalPages: Math.ceil((response.total || 0) / size),
          },
        };
      }

      // 응답이 배열인 경우 (백엔드가 배열을 직접 반환)
      if (Array.isArray(response)) {
        const transformedComments = response.map(comment => transformCommentData(comment, postId));

        return {
          commentList: transformedComments,
          total: transformedComments.length,
          pageInfo: {
            page: page,
            size: size,
            totalElements: transformedComments.length,
            totalPages: Math.ceil(transformedComments.length / size),
          },
        };
      }

      // 응답이 예상과 다른 경우 빈 목록 반환
      console.warn('[WARN] 댓글 응답 구조가 예상과 다름:', response);
      return {
        commentList: [],
        total: 0,
        pageInfo: {
          page: page,
          size: size,
          totalElements: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 생성
   */
  createComment: async (
    postId: number,
    targetType: string = 'post', // targetType은 내부적으로만 사용
    content: string
  ): Promise<Comment> => {
    try {
      // 숫자형으로 강제 변환하여 타입 문제 방지
      const numericPostId = Number(postId);
      console.log('[DEBUG] 댓글 생성 API 요청 시작:', {
        postId: numericPostId,
        content: content.substring(0, 20) + '...',
        url: COMMENTS_BASE_URL,
      });

      // 백엔드 API 요청 형식에 맞게 수정
      const payload = {
        postId: numericPostId,
        content,
        language: 'ko', // 백엔드 요구사항에 맞게 추가
      };

      console.log('[DEBUG] 댓글 생성 요청 페이로드:', payload);

      const response = await apiClient.post<Comment>(COMMENTS_BASE_URL, payload);

      console.log('[DEBUG] 댓글 생성 응답:', response);

      // 응답에 postId가 없거나 null인 경우, 요청한 postId를 사용하여 보완
      if (!response.postId) {
        console.log('[DEBUG] 응답에 postId가 없어 요청 값으로 보완:', numericPostId);
        return {
          ...response,
          postId: numericPostId,
        };
      }

      return response;
    } catch (error) {
      console.error('[ERROR] 댓글 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 수정
   */
  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    try {
      // 백엔드 API 요청 형식에 맞게 수정
      const response = await apiClient.patch<Comment>(`${COMMENTS_BASE_URL}/${commentId}`, {
        content,
        language: 'ko', // 백엔드 요구사항에 맞게 추가
      });
      return response;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (commentId: number): Promise<void> => {
    try {
      await apiClient.delete(`${COMMENTS_BASE_URL}/${commentId}`);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 댓글 리액션 추가
   */
  reactToComment: async (
    commentId: number,
    reactionType: ReactionType
  ): Promise<ReactionResponseData> => {
    try {
      // 백엔드 API 요청 형식에 맞게 수정 - emotion 필드 사용
      const emotionMapping: Record<string, string> = {
        LIKE: '좋아요',
        DISLIKE: '싫어요',
      };

      console.log(`[DEBUG] 댓글 ${commentId}에 반응 시도:`, reactionType);

      const response = await apiClient.post<ReactionResponseData>(
        `${COMMENTS_BASE_URL}/${commentId}`,
        { emotion: emotionMapping[reactionType] }
      );

      console.log(`[DEBUG] 댓글 ${commentId}에 반응 결과:`, response);

      // 백엔드 응답이 객체가 아니거나 like/dislike 필드가 없는 경우 기본값 제공
      if (!response || typeof response !== 'object') {
        console.warn('[WARN] 댓글 반응 응답이 예상과 다름, 기본값 반환');
        return { like: 0, dislike: 0 };
      }

      // 반환 값에 myReaction 정보 추가
      return {
        like: response.like || 0,
        dislike: response.dislike || 0,
        isState: response.isState, // isState 필드 유지해서 반환
      };
    } catch (error) {
      console.error('댓글 리액션 추가 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 목록 조회
   */
  getReplies: async (
    commentId: number,
    page: number = 0,
    size: number = 5
  ): Promise<ReplyResponseData> => {
    try {
      console.log(`[DEBUG] 대댓글 로드 API 호출 - commentId: ${commentId}`);
      // 백엔드 API 요청 형식에 맞게 수정
      const response = await apiClient.get<ReplyResponseData>(
        `${REPLIES_BASE_URL}?commentId=${commentId}`
      );

      console.log(`[DEBUG] 대댓글 원본 응답:`, response);

      // 응답이 배열인 경우 (백엔드가 직접 배열을 반환)
      if (Array.isArray(response)) {
        console.log(`[DEBUG] 대댓글 응답이 배열 형태 - 개수: ${response.length}`);
        // 각 항목을 Reply 타입으로 변환
        const transformedReplies = response.map(reply => transformReplyData(reply, commentId));

        return {
          replyList: transformedReplies,
          total: transformedReplies.length,
          pageInfo: {
            page: page,
            size: size,
            totalElements: transformedReplies.length,
            totalPages: Math.ceil(transformedReplies.length / size),
          },
        };
      }

      // replyList 배열이 있는 경우
      if (response.replyList) {
        console.log(`[DEBUG] 대댓글 응답에 replyList 존재 - 개수: ${response.replyList.length}`);
        const transformedReplies = response.replyList.map(reply =>
          transformReplyData(reply, commentId)
        );

        return {
          ...response,
          replyList: transformedReplies,
          pageInfo: {
            page: page,
            size: size,
            totalElements: response.total || 0,
            totalPages: Math.ceil((response.total || 0) / size),
          },
        };
      }

      // 숫자 키로 된 객체인 경우 (0, 1, 2, ...)
      if (response && typeof response === 'object') {
        console.log(`[DEBUG] 대댓글 응답이 객체 형태`);
        const replyArray: Reply[] = [];

        for (const key in response) {
          if (
            !isNaN(Number(key)) &&
            response[key as keyof typeof response] &&
            typeof response[key as keyof typeof response] === 'object'
          ) {
            const replyData = response[key as keyof typeof response] as any;
            if (replyData) {
              const transformedReply = transformReplyData(replyData, commentId);
              replyArray.push(transformedReply);
            }
          }
        }

        console.log(`[DEBUG] 대댓글 객체에서 추출된 배열 - 개수: ${replyArray.length}`);
        return {
          replyList: replyArray,
          total: replyArray.length,
          pageInfo: {
            page: page,
            size: size,
            totalElements: replyArray.length,
            totalPages: Math.ceil(replyArray.length / size),
          },
        };
      }

      // 기본 응답 반환
      console.log(`[DEBUG] 대댓글 응답 형식이 예상과 다름, 빈 배열 반환`);
      return {
        replyList: [],
        total: 0,
        pageInfo: {
          page: page,
          size: size,
          totalElements: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error('대댓글 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 생성
   */
  createReply: async (postId: number, commentId: number, content: string): Promise<Reply> => {
    try {
      console.log('[DEBUG] 대댓글 생성 시작:', {
        postId,
        commentId,
        content: content && content.length > 0 ? content.substring(0, 20) + '...' : '(내용 없음)',
      });

      // content가 undefined이거나 빈 문자열인 경우 예외 처리
      if (!content || content.trim() === '') {
        throw new Error('댓글 내용이 비어있습니다.');
      }

      // postId와 commentId가 유효한 숫자인지 확인
      if (isNaN(Number(postId)) || isNaN(Number(commentId))) {
        throw new Error('유효하지 않은 게시글 ID 또는 댓글 ID입니다.');
      }

      // 백엔드 API 요청 형식에 맞게 수정
      const payload = {
        postId: Number(postId),
        commentId: Number(commentId),
        content,
        language: 'ko', // 백엔드 요구사항에 맞게 추가
      };

      console.log('[DEBUG] 대댓글 생성 페이로드:', payload);

      const response = await apiClient.post<Reply>(REPLIES_BASE_URL, payload);

      console.log('[DEBUG] 대댓글 생성 응답:', response);
      return response;
    } catch (error) {
      console.error('대댓글 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 수정
   */
  updateReply: async (replyId: number, content: string): Promise<Reply> => {
    try {
      // 백엔드 API 요청 형식에 맞게 수정
      const response = await apiClient.patch<Reply>(`${REPLIES_BASE_URL}/${replyId}`, {
        content,
        language: 'ko', // 백엔드 요구사항에 맞게 추가
      });
      return response;
    } catch (error) {
      console.error('대댓글 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 삭제
   */
  deleteReply: async (replyId: number): Promise<void> => {
    try {
      await apiClient.delete(`${REPLIES_BASE_URL}/${replyId}`);
    } catch (error) {
      console.error('대댓글 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 리액션 추가
   */
  reactToReply: async (
    replyId: number,
    reactionType: ReactionType
  ): Promise<ReactionResponseData> => {
    try {
      // 백엔드 API 요청 형식에 맞게 수정 - emotion 필드 사용
      const emotionMapping: Record<string, string> = {
        LIKE: '좋아요',
        DISLIKE: '싫어요',
      };

      const response = await apiClient.post<ReactionResponseData>(
        `${REPLIES_BASE_URL}/${replyId}`,
        { emotion: emotionMapping[reactionType] }
      );
      return response;
    } catch (error) {
      console.error('대댓글 리액션 추가 실패:', error);
      throw error;
    }
  },
};

export default CommentApi;
