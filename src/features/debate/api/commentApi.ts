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
    sortBy?: string;
    language?: string;
  }): Promise<{
    comments: DebateComment[];
    total: number;
    totalPages: number;
  }> => {
    try {
      // 실제 API 연동 (MOCK 데이터 사용 대신 실제 API 호출)
      const { debateId, page = 1, size = 10, sortBy = 'latest', language = 'ko' } = params;

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
          sort: sortBy,
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

          // 댓글 내용에서 stance 정보 추출
          let extractedStance: 'pro' | 'con' | undefined = undefined;
          let content = item.content || '';

          if (content.startsWith('【반대】')) {
            extractedStance = 'con';
            console.log(`[DEBUG] 댓글 ID ${item.commentId}에서 반대 의견 접두사 발견`);
          } else if (content.startsWith('【찬성】')) {
            extractedStance = 'pro';
            console.log(`[DEBUG] 댓글 ID ${item.commentId}에서 찬성 의견 접두사 발견`);
          }

          // 댓글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 댓글 ID: ${item.commentId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}, stance: ${extractedStance || 'pro'}`
          );

          // 댓글 매핑 시 추출한 userId와 내용에서 추출한 stance 값 전달
          const comment = mapCommentResToFrontend(
            {
              ...item,
              userId,
              stance: extractedStance || item.stance, // 내용에서 추출한 stance 값을 우선 사용
            },
            debateId
          );

          return comment;
        });

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
    stance?: 'pro' | 'con';
  }): Promise<DebateComment | null> => {
    try {
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // stance 값을 콘솔에 출력하여 디버깅
      console.log('[DEBUG] 댓글 작성 시 선택한 입장(stance):', commentRequest.stance);

      // stance 정보를 댓글 내용 앞에 추가
      const stancePrefix = commentRequest.stance === 'con' ? '【반대】 ' : '【찬성】 ';
      const contentWithStance = stancePrefix + commentRequest.content;

      // 백엔드 API 요청 형식으로 변환
      const requestData: CommentReqDto = {
        content: contentWithStance, // stance 정보가 포함된 내용
        debateId: commentRequest.debateId,
        stance: commentRequest.stance, // 백엔드에서 사용하지 않더라도 보내기
        language: userLanguage, // 사용자 언어 설정 동적으로 추가
      };

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
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // 백엔드 API 요청 형식으로 변환
      const requestData: CommentReqDto = {
        content,
        language: userLanguage, // 사용자 언어 설정 추가
      };

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

          // 답글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 답글 ID: ${item.replyId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}`
          );

          // 답글 매핑 시 추출한 userId 전달
          return mapReplyResToFrontend(
            {
              ...item,
              userId,
            },
            commentId
          );
        });
      } else if (response && Array.isArray(response)) {
        // 배열로 응답할 경우
        console.log('원본 답글 배열 데이터:', JSON.stringify(response, null, 2));

        return response.map((item: ReplyResDto) => {
          // userId 필드를 찾아서 추출
          const userId = item.userId || 0;

          // 답글 매핑 전 원본 데이터 로깅
          console.log(
            `[DEBUG] 답글 ID: ${item.replyId}, 작성자 ID: ${userId}, 작성자 이름: ${item.userName}`
          );

          // 답글 매핑 시 추출한 userId 전달
          return mapReplyResToFrontend(
            {
              ...item,
              userId,
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
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // 백엔드 API 요청 형식으로 변환
      const requestData = {
        content,
        commentId,
        language: userLanguage, // 사용자 언어 설정 추가
      };

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
      // 사용자의 언어 설정 확인
      const userLanguage = localStorage.getItem('userLanguage') || 'ko';

      // 백엔드 API 요청 형식으로 변환
      const requestData = {
        content,
        language: userLanguage, // 사용자 언어 설정 추가
      };

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
