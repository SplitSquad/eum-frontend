import apiClient from './apiClient';
import {
  DebateComment,
  DebateReply,
  CommentReqDto,
  mapCommentResToFrontend,
  mapReplyResToFrontend,
  CommentResDto,
  ReplyResDto,
} from '../types';
import { detectLanguage } from '../../community/utils/languageUtils';
import { debugLog } from '../../../shared/utils/debug';

// 목업 댓글 데이터
const MOCK_COMMENTS: DebateComment[] = [
  {
    id: 1,
    debateId: 1,
    userId: 101,
    userName: '김한국',
    userProfileImage: 'https://i.pravatar.cc/150?img=1',
    content:
      '저는 외국인들도 건강보험 혜택을 받을 수 있어야 한다고 생각합니다. 우리나라에 거주하는 모든 사람들이 의료 서비스를 받을 권리가 있다고 생각합니다.',
    createdAt: '2023-06-15T10:30:00Z',
    reactions: {
      like: 24,
      dislike: 5,
      happy: 8,
      angry: 2,
      sad: 1,
      unsure: 3,
    },
    stance: 'pro',
    replyCount: 2,
    countryCode: 'KR',
    countryName: '대한민국',
  },
  {
    id: 2,
    debateId: 1,
    userId: 102,
    userName: 'John Smith',
    userProfileImage: 'https://i.pravatar.cc/150?img=2',
    content:
      '저는 반대 의견입니다. 국민건강보험은 기본적으로 국민을 위한 제도이며, 외국인들은 자국의 보험이나 민간 보험을 활용해야 합니다.',
    createdAt: '2023-06-15T11:15:00Z',
    reactions: {
      like: 19,
      dislike: 10,
      happy: 2,
      angry: 7,
      sad: 0,
      unsure: 5,
    },
    stance: 'con',
    replyCount: 1,
    countryCode: 'US',
    countryName: '미국',
  },
  {
    id: 3,
    debateId: 1,
    userId: 103,
    userName: '박한글',
    userProfileImage: 'https://i.pravatar.cc/150?img=3',
    content:
      '외국인들에게 건강보험 혜택을 주는 것은 좋지만, 보험료 납부 기간과 조건을 좀 더 엄격하게 해야 한다고 생각합니다.',
    createdAt: '2023-06-15T12:45:00Z',
    reactions: {
      like: 15,
      dislike: 3,
      happy: 5,
      angry: 2,
      sad: 1,
      unsure: 8,
    },
    stance: 'pro',
    replyCount: 0,
    countryCode: 'KR',
    countryName: '대한민국',
  },
  {
    id: 4,
    debateId: 1,
    userId: 104,
    userName: 'Wang Lei',
    userProfileImage: 'https://i.pravatar.cc/150?img=4',
    content:
      '저는 한국에서 5년째 살고 있는 유학생입니다. 건강보험 없이는 의료비가 너무 비싸서 감당하기 어렵습니다. 균형있는 제도가 필요하다고 생각합니다.',
    createdAt: '2023-06-15T14:20:00Z',
    reactions: {
      like: 27,
      dislike: 2,
      happy: 10,
      angry: 1,
      sad: 3,
      unsure: 5,
    },
    stance: 'pro',
    replyCount: 0,
    countryCode: 'CN',
    countryName: '중국',
  },
];

// 목업 답글 데이터
const MOCK_REPLIES: Record<number, DebateReply[]> = {
  1: [
    {
      id: 101,
      commentId: 1,
      userId: 105,
      userName: '이민국',
      userProfileImage: 'https://i.pravatar.cc/150?img=5',
      content:
        '저도 동의합니다. 국제적인 추세를 봐도 외국인에게 건강보험을 제공하는 것이 장기적으로 사회적 비용을 줄입니다.',
      createdAt: '2023-06-15T11:00:00Z',
      reactions: {
        like: 12,
        dislike: 2,
        happy: 3,
        angry: 1,
        sad: 0,
        unsure: 1,
      },
      countryCode: 'KR',
      countryName: '대한민국',
    },
    {
      id: 102,
      commentId: 1,
      userId: 106,
      userName: 'Emma Johnson',
      userProfileImage: 'https://i.pravatar.cc/150?img=6',
      content: '보건의료는 인간의 기본적인 권리라고 생각합니다. 국적에 상관없이 보장되어야 합니다.',
      createdAt: '2023-06-15T11:30:00Z',
      reactions: {
        like: 9,
        dislike: 3,
        happy: 2,
        angry: 2,
        sad: 0,
        unsure: 1,
      },
      countryCode: 'GB',
      countryName: '영국',
    },
  ],
  2: [
    {
      id: 103,
      commentId: 2,
      userId: 107,
      userName: '정글로벌',
      userProfileImage: 'https://i.pravatar.cc/150?img=7',
      content:
        '그렇지만 미국도 특정 조건 하에서는 외국인에게 의료 혜택을 제공하고 있습니다. 완전히 베제되는 것은 아니죠.',
      createdAt: '2023-06-15T12:00:00Z',
      reactions: {
        like: 8,
        dislike: 1,
        happy: 1,
        angry: 1,
        sad: 0,
        unsure: 2,
      },
      countryCode: 'KR',
      countryName: '대한민국',
    },
  ],
};

// API 응답 타입 정의
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 토론 댓글 관련 API
 */
const CommentApi = {
  /**
   * 토론 주제에 대한 댓글 목록 조회
   */
  getComments: async (params: {
    debateId: number;
    page?: number;
    size?: number;
    sortBy?: string; // 'latest' | 'oldest' | 'popular' (백엔드에서는 heart로 변환)
    language?: string;
  }): Promise<{
    comments: DebateComment[];
    total: number;
    totalPages: number;
  }> => {
    try {
      // 실제 API 연동 (MOCK 데이터 사용 대신 실제 API 호출)
      const { debateId, page = 1, size = 10, sortBy = 'latest', language = 'ko' } = params;

      // 정렬 파라미터 변환 (프론트엔드 → 백엔드)
      let backendSort = 'latest'; // 기본값
      if (sortBy === 'popular') {
        backendSort = 'heart'; // 인기순 (좋아요 기준)
      } else if (sortBy === 'oldest') {
        backendSort = 'oldest'; // 오래된순
      } else {
        backendSort = 'latest'; // 최신순 (기본값)
      }

      console.log(`[DEBUG] 토론 댓글 정렬 파라미터 변환: ${sortBy} → ${backendSort}`);

      // API 호출
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.get<any>(`/debate/comment`, {
        headers: {
          Authorization: token,
        },
        params: {
          debateId,
          page: page - 1, // Spring Boot는 0부터 시작하는 페이지 인덱스 사용
          size,
          sort: backendSort, // 변환된 정렬 파라미터 사용
          language, // 사용자 언어 설정 추가
        },
      });

      // API 응답 데이터 확인 및 처리
      console.log('댓글 API 응답:', response);

      if (response && response.commentList) {
        // 실제 API 응답에 맞게 처리 (commentList 형식)
        const { commentList, total } = response;

        // 원본 데이터를 기록하여 디버깅 돕기
        console.log('원본 댓글 데이터:', JSON.stringify(commentList, null, 2));

        // 응답 데이터를 프론트엔드 모델로 변환
        const comments = commentList.map((item: CommentResDto) => {
          // userId 필드를 찾아서 추출
          const userId = item.userId || 0;
          console.log(
            '[DEBUG] 아이템:',
            item,
            '*****************************************************************'
          );
          // 댓글 내용에서 stance 정보 추출
          let content = item.content || '';
          let extractedStance: 'pro' | 'con' | null = null;

          if (item.voteState === '찬성') {
            extractedStance = 'pro';
          } else if (item.voteState === '반대') {
            extractedStance = 'con';
          } else {
            extractedStance = null; // voteState가 없거나 다른 값일 때 null 유지
          }
          console.log(
            '[DEBUG] 댓글 내용에서 추출한 stance 값:',
            extractedStance,
            '*****************************************************************'
          );
          // 댓글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 댓글 ID: ${item.commentId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}, stance: ${extractedStance}`
          );

          // 댓글 매핑 시 추출한 userId와 내용에서 추출한 stance 값 전달
          const comment = mapCommentResToFrontend(
            {
              ...item,
              userId,
              stance: extractedStance, // 내용에서 추출한 stance 값을 우선 사용
            },
            debateId
          );
          console.log(
            '[DEBUG] 최종 변환된 댓글:',
            JSON.stringify(comment, null, 2),
            '*****************************************************************'
          );
          return comment;
        });

        // comment 출력
        console.log(
          '[DEBUG] 변환된 댓글 목록:',
          JSON.stringify(comments, null, 2),
          '*****************************************'
        );
        return {
          comments,
          total: total || commentList.length,
          totalPages: Math.ceil((total || commentList.length) / size),
        };
      }

      // API 응답이 예상과 다른 경우, 빈 결과 반환
      console.error('API 응답 형식이 예상과 다릅니다:', response);
      return {
        comments: [],
        total: 0,
        totalPages: 0,
      };
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);

      // 에러 발생 시 빈 결과 반환
      return {
        comments: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 댓글 작성
   */
  createComment: async (commentRequest: {
    content: string;
    debateId: number;
    stance?: 'pro' | 'con' | null; // stance는 선택적이며, 백엔드에서 사용하지 않음
  }): Promise<DebateComment | null> => {
    try {
      // 언어 감지 - 사용자가 입력한 댓글 내용에서 자동 감지
      const detectedLanguage = await detectLanguage(commentRequest.content);

      debugLog('토론 댓글 언어 감지 결과:', {
        content: commentRequest.content.substring(0, 50) + '...',
        detectedLanguage,
        contentLength: commentRequest.content.length,
      });

      // stance 값을 콘솔에 출력하여 디버깅
      console.log('[DEBUG] 댓글 작성 시 선택한 입장(stance):', commentRequest.stance);

      // stance 정보를 댓글 내용 앞에 추가
      // const stancePrefix = commentRequest.stance === 'con' ? '【반대】 ' : '【찬성】 ';
      const contentWithStance = commentRequest.content;

      // 백엔드 API 요청 형식으로 변환
      const requestData: CommentReqDto = {
        debateId: commentRequest.debateId,
        stance: commentRequest.stance ?? undefined, // null을 undefined로 변환하여 타입 오류 방지
        language: detectedLanguage.toUpperCase(), // 감지된 언어를 대문자로 변환
        content: commentRequest.content,
      };

      debugLog('토론 댓글 생성 페이로드:', requestData);

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.post<any>('/debate/comment', requestData, {
        headers: {
          Authorization: token,
        },
      });

      console.log('댓글 작성 응답:', response);

      // 디버깅용 로그 추가 (더 자세한 정보로)
      console.log('[DEBUG] 댓글 원본 응답:', JSON.stringify(response, null, 2));
      console.log('[DEBUG] 요청에 포함된 stance:', commentRequest.stance);

      // stance 정보는 이제 댓글 내용에 접두사로 저장되므로 추가 저장 작업이 필요 없음
      console.log(`[DEBUG] 댓글 접두사에 stance 정보가 포함됨: ${commentRequest.stance}`);

      // 백엔드 응답에 맞게 처리
      if (response && response.commentId) {
        // stance 필드는 백엔드에 없으므로 클라이언트에서 추가
        const responseWithStance = {
          ...response,
          stance: commentRequest.stance, // 사용자가 직접 선택한 입장 사용
        };

        console.log('[DEBUG] 수정된 댓글 응답:', JSON.stringify(responseWithStance, null, 2));

        return mapCommentResToFrontend(responseWithStance, commentRequest.debateId);
      } else if (response && response.comment) {
        // 다른 응답 형식인 경우
        const commentWithStance = {
          ...response.comment,
          stance: commentRequest.stance, // 사용자가 직접 선택한 입장 사용
        };

        console.log(
          '[DEBUG] 수정된 댓글 응답 (다른 형식):',
          JSON.stringify(commentWithStance, null, 2)
        );

        return mapCommentResToFrontend(commentWithStance, commentRequest.debateId);
      }

      return null;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      return null;
    }
  },

  /**
   * 댓글 수정
   */
  updateComment: async (commentId: number, content: string): Promise<boolean> => {
    try {
      // 언어 감지 - 수정된 댓글 내용에서 자동 감지
      const detectedLanguage = await detectLanguage(content);

      debugLog('토론 댓글 수정 언어 감지 결과:', {
        content: content.substring(0, 50) + '...',
        detectedLanguage,
        contentLength: content.length,
      });

      // 백엔드 API 요청 형식으로 변환
      const requestData: CommentReqDto = {
        content,
        language: detectedLanguage.toUpperCase(), // 감지된 언어를 대문자로 변환
      };

      debugLog('토론 댓글 수정 페이로드:', requestData);

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      await apiClient.patch<any>(`/debate/comment/${commentId}`, requestData, {
        headers: {
          Authorization: token,
        },
      });

      return true;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      return false;
    }
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (commentId: number): Promise<boolean> => {
    try {
      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      await apiClient.delete<any>(`/debate/comment/${commentId}`, {
        headers: {
          Authorization: token,
        },
      });

      return true;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      return false;
    }
  },

  /**
   * 댓글에 감정표현 추가
   */
  reactToComment: async (commentId: number, emotion: string): Promise<any> => {
    try {
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // 백엔드 API에 맞게 감정표현 변환
      const emotionMapping: Record<string, string> = {
        like: '좋아요',
        dislike: '싫어요',
      };

      // 백엔드 API 요청 형식으로 변환
      const requestData: CommentReqDto = {
        emotion: emotionMapping[emotion] || emotion,
        language: userLanguage,
      };

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.post<any>(`/debate/comment/${commentId}`, requestData, {
        headers: {
          Authorization: token,
        },
      });

      return response;
    } catch (error) {
      console.error('댓글 감정표현 추가 실패:', error);
      throw error;
    }
  },

  /**
   * 대댓글 목록 조회
   */
  getReplies: async (params: {
    commentId: number;
    page?: number;
    size?: number;
  }): Promise<DebateReply[]> => {
    try {
      // 실제 API 연동
      const { commentId, page = 1, size = 5 } = params;

      const token = localStorage.getItem('token') || '';
      const response = await apiClient.get<any>(`/debate/reply`, {
        headers: {
          Authorization: token,
        },
        params: {
          commentId,
          page: page - 1, // Spring Boot는 0부터 시작하는 페이지 인덱스 사용
          size,
        },
      });

      console.log('대댓글 응답:', response);

      // 백엔드 응답에 맞게 처리
      if (response && response.replyList) {
        // 원본 데이터를 기록하여 디버깅 돕기
        console.log('원본 답글 데이터:', JSON.stringify(response.replyList, null, 2));

        return response.replyList.map((item: ReplyResDto) => {
          // userId 필드를 찾아서 추출
          const userId = item.userId || 0;
          let extractedStance: 'pro' | 'con' | null = null;

          if (item.voteState === '찬성') {
            extractedStance = 'pro';
          } else if (item.voteState === '반대') {
            extractedStance = 'con';
          } else {
            extractedStance = null; // voteState가 없거나 다른 값일 때 null 유지
          }

          // 답글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 대댓글 ID: ${item.replyId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}, stance: ${extractedStance}******************************`
          );

          // 답글 매핑 시 추출한 userId 전달
          return mapReplyResToFrontend(
            {
              ...item,
              userId,
              stance: extractedStance, // 내용에서 추출한 stance 값을 우선 사용
            },
            commentId
          );
        });
      } else if (response && Array.isArray(response)) {
        // 배열로 응답할 경우
        console.log('원본 대댓글 배열 데이터:', JSON.stringify(response, null, 2));

        return response.map((item: ReplyResDto) => {
          // userId 필드를 찾아서 추출
          const userId = item.userId || 0;
          let extractedStance: 'pro' | 'con' | null = null;

          if (item.voteState === '찬성') {
            extractedStance = 'pro';
          } else if (item.voteState === '반대') {
            extractedStance = 'con';
          } else {
            extractedStance = null; // voteState가 없거나 다른 값일 때 null 유지
          }

          // 답글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 답글 ID: ${item.replyId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}`
          );

          // 답글 매핑 시 추출한 userId 전달
          return mapReplyResToFrontend(
            {
              ...item,
              userId,
              stance: extractedStance, // 내용에서 추출한 stance 값을 우선 사용
            },
            commentId
          );
        });
      }

      return [];
    } catch (error) {
      console.error('대댓글 목록 조회 실패:', error);

      // API 연동 실패 시 빈 배열 반환
      return [];
    }
  },

  /**
   * 대댓글 작성
   */
  createReply: async (commentId: number, content: string): Promise<DebateReply | null> => {
    try {
      // 언어 감지 - 사용자가 입력한 대댓글 내용에서 자동 감지
      const detectedLanguage = await detectLanguage(content);

      debugLog('토론 대댓글 언어 감지 결과:', {
        content: content.substring(0, 50) + '...',
        detectedLanguage,
        contentLength: content.length,
      });

      // 백엔드 API 요청 형식으로 변환
      const requestData = {
        content,
        commentId,
        language: detectedLanguage.toUpperCase(), // 감지된 언어를 대문자로 변환
      };

      debugLog('토론 대댓글 생성 페이로드:', requestData);

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.post<ReplyResDto>('/debate/reply', requestData, {
        headers: {
          Authorization: token,
        },
      });

      console.log('대댓글 작성 응답:', response);

      if (response) {
        return mapReplyResToFrontend(response, commentId);
      }

      return null;
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      return null;
    }
  },

  /**
   * 대댓글 수정
   */
  updateReply: async (replyId: number, content: string): Promise<boolean> => {
    try {
      // 언어 감지 - 수정된 대댓글 내용에서 자동 감지
      const detectedLanguage = await detectLanguage(content);

      debugLog('토론 대댓글 수정 언어 감지 결과:', {
        content: content.substring(0, 50) + '...',
        detectedLanguage,
        contentLength: content.length,
      });

      // 백엔드 API 요청 형식으로 변환
      const requestData = {
        content,
        language: detectedLanguage.toUpperCase(), // 감지된 언어를 대문자로 변환
      };

      debugLog('토론 대댓글 수정 페이로드:', requestData);

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      await apiClient.patch<any>(`/debate/reply/${replyId}`, requestData, {
        headers: {
          Authorization: token,
        },
      });

      return true;
    } catch (error) {
      console.error('대댓글 수정 실패:', error);
      return false;
    }
  },

  /**
   * 대댓글 삭제
   */
  deleteReply: async (replyId: number): Promise<boolean> => {
    try {
      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      await apiClient.delete<any>(`/debate/reply/${replyId}`, {
        headers: {
          Authorization: token,
        },
      });

      return true;
    } catch (error) {
      console.error('대댓글 삭제 실패:', error);
      return false;
    }
  },

  /**
   * 대댓글에 감정표현 추가
   */
  reactToReply: async (replyId: number, emotion: string): Promise<any> => {
    try {
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // 백엔드 API에 맞게 감정표현 변환
      const emotionMapping: Record<string, string> = {
        like: '좋아요',
        dislike: '싫어요',
      };

      // 백엔드 API 요청 형식으로 변환
      const requestData = {
        emotion: emotionMapping[emotion] || emotion,
        language: userLanguage,
      };

      // 실제 API 호출
      const token = localStorage.getItem('token') || '';
      const response = await apiClient.post<any>(`/debate/reply/${replyId}`, requestData, {
        headers: {
          Authorization: token,
        },
      });

      return response;
    } catch (error) {
      console.error('대댓글 감정표현 추가 실패:', error);
      throw error;
    }
  },
};

export default CommentApi;
