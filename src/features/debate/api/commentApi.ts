import apiClient from './apiClient';
import { DebateComment, DebateReply, ReactionRequest } from '../types';

// 목업 댓글 데이터
const MOCK_COMMENTS: DebateComment[] = [
  {
    id: 1,
    debateId: 1,
    userId: 101,
    userName: '김한국',
    userProfileImage: 'https://i.pravatar.cc/150?img=1',
    content: '저는 외국인들도 건강보험 혜택을 받을 수 있어야 한다고 생각합니다. 우리나라에 거주하는 모든 사람들이 의료 서비스를 받을 권리가 있다고 생각합니다.',
    createdAt: '2023-06-15T10:30:00Z',
    reactions: {
      like: 24,
      dislike: 5,
      happy: 8,
      angry: 2,
      sad: 1,
      unsure: 3
    },
    stance: 'pro',
    replyCount: 2,
    countryCode: 'KR',
    countryName: '대한민국'
  },
  {
    id: 2,
    debateId: 1,
    userId: 102,
    userName: 'John Smith',
    userProfileImage: 'https://i.pravatar.cc/150?img=2',
    content: '저는 반대 의견입니다. 국민건강보험은 기본적으로 국민을 위한 제도이며, 외국인들은 자국의 보험이나 민간 보험을 활용해야 합니다.',
    createdAt: '2023-06-15T11:15:00Z',
    reactions: {
      like: 19,
      dislike: 10,
      happy: 2,
      angry: 7,
      sad: 0,
      unsure: 5
    },
    stance: 'con',
    replyCount: 1,
    countryCode: 'US',
    countryName: '미국'
  },
  {
    id: 3,
    debateId: 1,
    userId: 103,
    userName: '박한글',
    userProfileImage: 'https://i.pravatar.cc/150?img=3',
    content: '외국인들에게 건강보험 혜택을 주는 것은 좋지만, 보험료 납부 기간과 조건을 좀 더 엄격하게 해야 한다고 생각합니다.',
    createdAt: '2023-06-15T12:45:00Z',
    reactions: {
      like: 15,
      dislike: 3,
      happy: 5,
      angry: 2,
      sad: 1,
      unsure: 8
    },
    stance: 'pro',
    replyCount: 0,
    countryCode: 'KR',
    countryName: '대한민국'
  },
  {
    id: 4,
    debateId: 1,
    userId: 104,
    userName: 'Wang Lei',
    userProfileImage: 'https://i.pravatar.cc/150?img=4',
    content: '저는 한국에서 5년째 살고 있는 유학생입니다. 건강보험 없이는 의료비가 너무 비싸서 감당하기 어렵습니다. 균형있는 제도가 필요하다고 생각합니다.',
    createdAt: '2023-06-15T14:20:00Z',
    reactions: {
      like: 27,
      dislike: 2,
      happy: 10,
      angry: 1,
      sad: 3,
      unsure: 5
    },
    stance: 'pro',
    replyCount: 0,
    countryCode: 'CN',
    countryName: '중국'
  }
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
      content: '저도 동의합니다. 국제적인 추세를 봐도 외국인에게 건강보험을 제공하는 것이 장기적으로 사회적 비용을 줄입니다.',
      createdAt: '2023-06-15T11:00:00Z',
      reactions: {
        like: 12,
        dislike: 2,
        happy: 3,
        angry: 1,
        sad: 0,
        unsure: 1
      },
      countryCode: 'KR',
      countryName: '대한민국'
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
        unsure: 1
      },
      countryCode: 'GB',
      countryName: '영국'
    }
  ],
  2: [
    {
      id: 103,
      commentId: 2,
      userId: 107,
      userName: '정글로벌',
      userProfileImage: 'https://i.pravatar.cc/150?img=7',
      content: '그렇지만 미국도 특정 조건 하에서는 외국인에게 의료 혜택을 제공하고 있습니다. 완전히 베제되는 것은 아니죠.',
      createdAt: '2023-06-15T12:00:00Z',
      reactions: {
        like: 8,
        dislike: 1,
        happy: 1,
        angry: 1,
        sad: 0,
        unsure: 2
      },
      countryCode: 'KR',
      countryName: '대한민국'
    }
  ]
};

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
  }): Promise<{ comments: DebateComment[]; total: number; totalPages: number }> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get(`/debate/${params.debateId}/comments`, { params });
      // return response.data;

      // 목업 데이터 사용
      const page = params.page || 1;
      const size = params.size || 5;
      const filteredComments = MOCK_COMMENTS.filter(
        comment => comment.debateId === params.debateId
      );
      const startIdx = (page - 1) * size;
      const endIdx = startIdx + size;
      const paginatedComments = filteredComments.slice(startIdx, endIdx);

      return {
        comments: paginatedComments,
        total: filteredComments.length,
        totalPages: Math.ceil(filteredComments.length / size)
      };
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      return {
        comments: [],
        total: 0,
        totalPages: 0
      };
    }
  },

  /**
   * 댓글 작성
   */
  createComment: async (params: {
    debateId: number;
    content: string;
    stance: 'pro' | 'con';
  }): Promise<DebateComment | null> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.post(`/debate/${params.debateId}/comments`, params);
      // return response.data;

      // 목업 데이터 생성
      const newComment: DebateComment = {
        id: Math.max(...MOCK_COMMENTS.map(c => c.id)) + 1,
        debateId: params.debateId,
        userId: 999, // 현재 로그인한 사용자 ID (예시)
        userName: '현재 사용자', // 현재 로그인한 사용자 이름 (예시)
        userProfileImage: 'https://i.pravatar.cc/150?img=8',
        content: params.content,
        createdAt: new Date().toISOString(),
        reactions: {
          like: 0,
          dislike: 0,
          happy: 0,
          angry: 0,
          sad: 0,
          unsure: 0
        },
        stance: params.stance,
        replyCount: 0,
        countryCode: 'KR',
        countryName: '대한민국'
      };

      // 실제로는 서버에 저장하고 응답을 받아야 함
      console.log('새 댓글 작성:', newComment);
      return newComment;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      return null;
    }
  },

  /**
   * 댓글 수정
   */
  updateComment: async (params: { commentId: number; content: string }): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.put(`/comment/${params.commentId}`, { content: params.content });
      
      console.log(`댓글 ID:${params.commentId} 수정 - 내용: ${params.content}`);
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
      // TODO: 실제 API 연동 시 사용
      // await apiClient.delete(`/comment/${commentId}`);
      
      console.log(`댓글 ID:${commentId} 삭제`);
      return true;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      return false;
    }
  },

  /**
   * 댓글에 감정표현 추가
   */
  reactToComment: async (reactionRequest: ReactionRequest): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.post('/debate/reaction', reactionRequest);

      console.log(`댓글 ID:${reactionRequest.targetId}에 ${reactionRequest.reactionType} 반응 추가`);
      return true;
    } catch (error) {
      console.error(`댓글 감정표현 추가 실패:`, error);
      return false;
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
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get(`/comment/${params.commentId}/replies`, { params });
      // return response.data;

      // 목업 데이터 사용
      const replies = MOCK_REPLIES[params.commentId] || [];
      const page = params.page || 1;
      const size = params.size || 10;
      const startIdx = (page - 1) * size;
      const endIdx = startIdx + size;

      return replies.slice(startIdx, endIdx);
    } catch (error) {
      console.error('대댓글 목록 조회 실패:', error);
      return [];
    }
  },

  /**
   * 대댓글 작성
   */
  createReply: async (params: { commentId: number; content: string }): Promise<DebateReply | null> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.post(`/comment/${params.commentId}/reply`, params);
      // return response.data;

      // 목업 데이터 생성
      const newReply: DebateReply = {
        id: 1000 + Math.floor(Math.random() * 1000), // 임의의 ID 생성
        commentId: params.commentId,
        userId: 999, // 현재 로그인한 사용자 ID (예시)
        userName: '현재 사용자', // 현재 로그인한 사용자 이름 (예시)
        userProfileImage: 'https://i.pravatar.cc/150?img=9',
        content: params.content,
        createdAt: new Date().toISOString(),
        reactions: {
          like: 0,
          dislike: 0,
          happy: 0,
          angry: 0,
          sad: 0,
          unsure: 0
        },
        countryCode: 'KR',
        countryName: '대한민국'
      };

      // 실제로는 서버에 저장하고 응답을 받아야 함
      console.log('새 대댓글 작성:', newReply);
      return newReply;
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      return null;
    }
  },

  /**
   * 대댓글 수정
   */
  updateReply: async (params: { replyId: number; content: string }): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.put(`/reply/${params.replyId}`, { content: params.content });
      
      console.log(`대댓글 ID:${params.replyId} 수정 - 내용: ${params.content}`);
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
      // TODO: 실제 API 연동 시 사용
      // await apiClient.delete(`/reply/${replyId}`);
      
      console.log(`대댓글 ID:${replyId} 삭제`);
      return true;
    } catch (error) {
      console.error('대댓글 삭제 실패:', error);
      return false;
    }
  },

  /**
   * 대댓글에 감정표현 추가
   */
  reactToReply: async (reactionRequest: ReactionRequest): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.post('/debate/reaction', reactionRequest);

      console.log(`대댓글 ID:${reactionRequest.targetId}에 ${reactionRequest.reactionType} 반응 추가`);
      return true;
    } catch (error) {
      console.error(`대댓글 감정표현 추가 실패:`, error);
      return false;
    }
  }
};

export default CommentApi; 