import apiClient from './apiClient';
import { Debate, DebateListResponse, PaginationParams, DebateSortOption, ReactionRequest, VoteRequest } from '../types';

// 목업 데이터 - 실제 API 연동 전까지 사용
const MOCK_DEBATES: Debate[] = [
  {
    id: 1,
    title: '외국인 건강 보험 의무 가입: 찬성하시나요?',
    content: '한국에서 6개월 이상 거주하는 외국인은 국민건강보험에 의무적으로 가입해야 한다는 정책에 대해 어떻게 생각하시나요? 이 정책은 모든 이들에게 의료 접근성을 제공하지만, 일부에서는 비용 부담과 혜택의 형평성에 대한 논란이 있습니다.',
    createdAt: '2023-06-15T08:00:00Z',
    viewCount: 1240,
    source: 'https://news.example.com/foreign-health-insurance',
    proCount: 752,
    conCount: 488,
    reactions: {
      like: 320,
      dislike: 45,
      happy: 108,
      angry: 67,
      sad: 23,
      unsure: 89
    },
    countryStats: [
      { countryCode: 'KR', countryName: '대한민국', count: 820, percentage: 65 },
      { countryCode: 'US', countryName: '미국', count: 230, percentage: 20 },
      { countryCode: 'JP', countryName: '일본', count: 78, percentage: 8 },
      { countryCode: 'CN', countryName: '중국', count: 42, percentage: 5 },
      { countryCode: 'OT', countryName: '기타', count: 25, percentage: 2 }
    ],
    commentCount: 156
  },
  {
    id: 2,
    title: '직업 비자 취득 기간 단축: 찬성하시나요?',
    content: '외국인 전문인력 유치를 위해 직업비자 발급 기간을 현행 30일에서 15일로 단축하는 방안이 논의되고 있습니다. 이 정책이 국내 산업 발전에 도움이 될 것인지, 아니면 국내 일자리에 부정적 영향을 미칠 것인지 의견을 나눠주세요.',
    createdAt: '2023-06-14T08:00:00Z',
    viewCount: 968,
    source: 'https://news.example.com/visa-process-time',
    proCount: 524,
    conCount: 444,
    reactions: {
      like: 186,
      dislike: 132,
      happy: 45,
      angry: 78,
      sad: 12,
      unsure: 115
    },
    commentCount: 103
  },
  {
    id: 3,
    title: '조국수 + 영문 기재 병행 도입',
    content: '공문서에 국가명을 한글과 영문으로 병행 표기하는 방안에 대해 어떻게 생각하십니까? 글로벌 표준화와 소통 편의성 증진이 목적이지만, 일부에서는 불필요한 행정 변화라는 의견도 있습니다.',
    createdAt: '2023-06-13T08:00:00Z',
    viewCount: 756,
    source: 'https://news.example.com/document-standardization',
    proCount: 412,
    conCount: 344,
    reactions: {
      like: 167,
      dislike: 89,
      happy: 34,
      angry: 48,
      sad: 8,
      unsure: 102
    },
    commentCount: 87
  },
  {
    id: 4,
    title: '모든 한국어 기관 외국어 전환: 찬성하시나요?',
    content: '한국 내 주요 공공기관과 관광지에서 모든 안내문을 다국어로 제공하는 정책에 대한 의견을 나눠주세요. 외국인 방문객 편의 증진이 목적이지만, 추가 비용과 한국 정체성 희석에 대한 우려도 있습니다.',
    createdAt: '2023-06-12T08:00:00Z',
    viewCount: 645,
    source: 'https://news.example.com/multilingual-public-policy',
    proCount: 325,
    conCount: 320,
    reactions: {
      like: 134,
      dislike: 126,
      happy: 28,
      angry: 45,
      sad: 12,
      unsure: 88
    },
    commentCount: 76
  }
];

/**
 * 토론 관련 API
 */
const DebateApi = {
  /**
   * 토론 주제 목록 조회 (페이징, 필터링, 정렬)
   */
  getDebates: async (params: {
    page?: number;
    size?: number;
    sortBy?: DebateSortOption;
    filter?: string;
  }): Promise<DebateListResponse> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get('/debate', { params });
      // return response.data;

      // 목업 데이터 사용
      const page = params.page || 1;
      const size = params.size || 5;
      const startIdx = (page - 1) * size;
      const endIdx = startIdx + size;
      const paginatedDebates = MOCK_DEBATES.slice(startIdx, endIdx);

      return {
        debates: paginatedDebates,
        total: MOCK_DEBATES.length,
        totalPages: Math.ceil(MOCK_DEBATES.length / size)
      };
    } catch (error) {
      console.error('토론 주제 목록 조회 실패:', error);
      return {
        debates: [],
        total: 0,
        totalPages: 0
      };
    }
  },

  /**
   * 토론 주제 상세 조회
   */
  getDebateById: async (debateId: number): Promise<Debate | null> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get(`/debate/${debateId}`);
      // return response.data;

      // 목업 데이터 사용
      const debate = MOCK_DEBATES.find(debate => debate.id === debateId);
      if (!debate) {
        throw new Error('토론 주제를 찾을 수 없습니다.');
      }

      return {
        ...debate,
        viewCount: debate.viewCount + 1 // 조회수 증가
      };
    } catch (error) {
      console.error(`토론 주제 조회 실패 (ID: ${debateId}):`, error);
      return null;
    }
  },

  /**
   * 조회수 증가
   */
  increaseViewCount: async (debateId: number): Promise<void> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.post(`/debate/${debateId}/view`);
      console.log(`토론 ID:${debateId} 조회수 증가`);
    } catch (error) {
      console.error(`조회수 증가 실패 (ID: ${debateId}):`, error);
    }
  },

  /**
   * 찬반 투표하기
   */
  voteOnDebate: async (voteRequest: VoteRequest): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.post(`/debate/${voteRequest.debateId}/vote`, { stance: voteRequest.stance });
      console.log(`토론 ID:${voteRequest.debateId} ${voteRequest.stance} 투표`);
      return true;
    } catch (error) {
      console.error(`투표 실패 (ID: ${voteRequest.debateId}):`, error);
      return false;
    }
  },
  
  /**
   * 감정표현 추가/수정
   */
  addReaction: async (reactionRequest: ReactionRequest): Promise<boolean> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // await apiClient.post('/debate/reaction', reactionRequest);
      console.log(`${reactionRequest.targetType} ID:${reactionRequest.targetId}에 ${reactionRequest.reactionType} 반응 추가`);
      return true;
    } catch (error) {
      console.error(`감정표현 추가 실패:`, error);
      return false;
    }
  },

  /**
   * 오늘의 토론 주제 가져오기
   */
  getTodayDebates: async (): Promise<Debate[]> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get('/debate/today');
      // return response.data;

      // 목업 데이터에서 최신 3개 반환
      return MOCK_DEBATES.slice(0, 3);
    } catch (error) {
      console.error('오늘의 토론 주제 조회 실패:', error);
      return [];
    }
  },

  /**
   * 인기 토론 주제 가져오기
   */
  getPopularDebates: async (count: number = 3): Promise<Debate[]> => {
    try {
      // TODO: 실제 API 연동 시 사용
      // const response = await apiClient.get('/debate/popular', { params: { count } });
      // return response.data;

      // 목업 데이터를 조회수 기준으로 정렬하여 반환
      return [...MOCK_DEBATES]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, count);
    } catch (error) {
      console.error('인기 토론 주제 조회 실패:', error);
      return [];
    }
  }
};

export default DebateApi;

// 추가 API 기능들

/**
 * 오늘의 이슈 조회
 */
export const getTodayIssues = async () => {
  try {
    // TODO: 실제 API 연동 시 사용
    // const response = await apiClient.get('/api/debates/today');
    // return response.json();
    
    console.log('오늘의 이슈 조회');
    // 여기서는, 실제 API 호출 대신 더미 데이터를 반환하도록 함
    return new Promise(resolve => {
      setTimeout(() => {
        // 더미 데이터 구조를 Debate 타입을 확장한 형태로 정의
        const dummyTodayIssues = [
          {
            id: 7,
            title: '메타버스는 미래 사회를 어떻게 변화시킬까요?',
            content: '페이스북이 메타로 사명을 바꾸며 메타버스에 투자하고 있습니다. 메타버스가 우리 사회에 어떤 영향을 미칠지에 대한 토론입니다.',
            category: '과학/기술',
            createdAt: new Date().toISOString(),
            description: '페이스북이 메타로 사명을 바꾸며 메타버스에 투자하고 있습니다. 우리 사회는 어떻게 변할까요?',
            viewCount: 3200,
            proCount: 188,
            conCount: 92,
            commentCount: 42,
            reactions: {
              like: 75,
              dislike: 18,
              happy: 20,
              angry: 10,
              sad: 5,
              unsure: 15
            }
          },
          {
            id: 8,
            title: '현금 없는 사회가 올 것인가요?',
            content: '디지털 결제 수단이 발전하면서 현금 사용이 줄고 있습니다. 미래에는 현금이 완전히 사라질지에 대한 토론입니다.',
            category: '경제',
            createdAt: new Date().toISOString(),
            description: '디지털 결제 수단이 발전하면서 현금 사용이 줄고 있습니다. 현금은 완전히 사라질까요?',
            viewCount: 2800,
            proCount: 145,
            conCount: 135,
            commentCount: 38,
            reactions: {
              like: 65,
              dislike: 25,
              happy: 15,
              angry: 12,
              sad: 8,
              unsure: 18
            }
          }
        ];
        resolve(dummyTodayIssues);
      }, 500);
    });
  } catch (error) {
    console.error('오늘의 이슈를 불러오는데 실패했습니다:', error);
    throw new Error('오늘의 이슈를 불러오는데 실패했습니다');
  }
};

/**
 * 모스트 핫 이슈 조회
 */
export const getHotIssue = async () => {
  try {
    // TODO: 실제 API 연동 시 사용
    // const response = await apiClient.get('/api/debates/hot');
    // return response.json();
    
    console.log('핫 이슈 조회');
    // 여기서는, 실제 API 호출 대신 더미 데이터를 반환하도록 함
    return new Promise(resolve => {
      setTimeout(() => {
        const dummyHotIssue = {
          id: 9,
          title: '기본소득 제도를 도입해야 할까요?',
          content: '모든 시민에게 조건 없이 정기적인 현금을 지급하는 기본소득 제도에 대한 토론입니다. 사회 안전망으로서의 역할과 경제적 지속 가능성을 함께 고려해야 합니다.',
          category: '정치/사회',
          createdAt: new Date().toISOString(),
          description: '모든 시민에게 조건 없이 정기적인 현금을 지급하는 기본소득 제도에 대한 토론입니다.',
          viewCount: 8500,
          proCount: 450,
          conCount: 380,
          commentCount: 120,
          reactions: {
            like: 210,
            dislike: 85,
            happy: 45,
            angry: 55,
            sad: 20,
            unsure: 40
          }
        };
        resolve(dummyHotIssue);
      }, 700);
    });
  } catch (error) {
    console.error('핫 이슈를 불러오는데 실패했습니다:', error);
    throw new Error('핫 이슈를 불러오는데 실패했습니다');
  }
};

/**
 * 반반 이슈 조회
 */
export const getBalancedIssue = async () => {
  try {
    // TODO: 실제 API 연동 시 사용
    // const response = await apiClient.get('/api/debates/balanced');
    // return response.json();
    
    console.log('반반 이슈 조회');
    // 여기서는, 실제 API 호출 대신 더미 데이터를 반환하도록 함
    return new Promise(resolve => {
      setTimeout(() => {
        const dummyBalancedIssue = {
          id: 10,
          title: '학교에서 교복을 입어야 할까요?',
          content: '교복이 학생들의 소속감을 높이고 경제적 격차를 줄인다는 주장과, 학생의 개성과 자유를 제한한다는 주장이 맞서는 토론입니다.',
          category: '생활/문화',
          createdAt: new Date().toISOString(),
          description: '교복이 학생들의 소속감을 높이고 경제적 격차를 줄인다는 주장과, 학생의 개성과 자유를 제한한다는 주장이 맞서는 토론입니다.',
          viewCount: 4200,
          proCount: 200,
          conCount: 200,
          commentCount: 85,
          reactions: {
            like: 95,
            dislike: 90,
            happy: 25,
            angry: 30,
            sad: 15,
            unsure: 35
          }
        };
        resolve(dummyBalancedIssue);
      }, 600);
    });
  } catch (error) {
    console.error('반반 이슈를 불러오는데 실패했습니다:', error);
    throw new Error('반반 이슈를 불러오는데 실패했습니다');
  }
}; 