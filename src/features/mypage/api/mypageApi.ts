import apiClient from './apiClient';
import { 
  ProfileInfo, 
  ApiResponse, 
  PaginatedResponse, 
  MyPost, 
  MyComment, 
  MyDebate, 
  MyBookmark 
} from '../types';

// 목업 데이터
const MOCK_PROFILE: ProfileInfo = {
  userId: 1,
  name: '알렉스',
  email: 'alex@example.com',
  profileImage: 'https://i.pravatar.cc/150?img=12',
  introduction: '한국에서 프로그래머로 일하고 있는 외국인입니다. 한국 문화와 음식을 좋아하고, 한국어 공부에 관심이 많습니다.',
  country: '미국',
  language: '영어',
  joinDate: '2023-11-01',
  role: '취업'
};

const MOCK_POSTS: MyPost[] = [
  {
    id: 1,
    title: '서울 강남에서 한국어 스터디 모임 구해요',
    content: '서울 강남에서 한국어 스터디 모임을 찾고 있습니다. 주 2회 정도 만나서 회화 연습을 하고 싶어요.',
    category: '게시글',
    createdAt: '2023-12-12',
    viewCount: 45,
    likeCount: 5,
    commentCount: 3
  },
  {
    id: 2,
    title: '외국인 친구를 위한 한국 문화 체험 장소 추천해주세요',
    content: '이번에 미국에서 친구가 방문하는데, 서울에서 한국 문화를 체험할 수 있는 장소를 추천해주세요.',
    category: '토론',
    createdAt: '2023-12-10',
    viewCount: 87,
    likeCount: 12,
    commentCount: 8
  }
];

const MOCK_COMMENTS: MyComment[] = [
  {
    id: 1,
    content: '저도 강남 쪽에 있어요! 저랑 중급 정도 수준엔데 실전 회화가 부족해서 연습하고 싶어요.',
    createdAt: '2023-12-12',
    postId: 3,
    postTitle: '서울에서 한국어 스터디 구합니다'
  },
  {
    id: 2,
    content: '외국인 등록증 발급 절차가 복잡해서 저도 처음에 많이 헤맸어요. 출입국관리사무소에 방문하기 전에 온라인으로 예약하는 게 좋아요.',
    createdAt: '2023-12-10',
    postId: 5,
    postTitle: '외국인 등록증 발급 절차 질문있어요'
  }
];

const MOCK_DEBATES: MyDebate[] = [
  {
    id: 1,
    title: '외국인의 한국 정착 지원을 위한 언어 요구사항?',
    createdAt: '2023-12-10',
    votedOption: '한국어 교육 지원 확대',
    totalVotes: 145
  },
  {
    id: 2,
    title: '외국인 노동자 보호를 위한 최선의 정책은?',
    createdAt: '2023-12-05',
    votedOption: '노동법 강화',
    totalVotes: 232
  }
];

// 북마크 목업 데이터 (실제 API 연동 전까지 사용)
const MOCK_BOOKMARKS: MyBookmark[] = [
  {
    id: 1,
    title: '외국인들을 위한 산청 방법',
    category: '북마크',
    createdAt: '2023-12-08',
    source: '한국문화원'
  },
  {
    id: 2,
    title: '서울 생활 가이드북 2023',
    category: '북마크',
    createdAt: '2023-11-20',
    source: '서울시청'
  }
];

/**
 * 마이페이지 API 클래스
 */
class MypageApi {
  /**
   * 사용자 프로필 정보 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getProfileInfo(userId?: number): Promise<ProfileInfo> {
    // 목업 데이터 반환 (실제 API 연결 전까지)
    return {
      userId: userId || 1,
      name: '알렉스',
      email: 'alex@example.com',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      introduction: '한국에서 프로그래머로 일하고 있는 외국인입니다. 한국 문화와 음식을 좋아하고, 한국어 공부에 관심이 많습니다.',
      country: '미국',
      language: '영어',
      joinDate: '2023-11-01',
      role: '취업'
    };
  }

  /**
   * 프로필 정보 업데이트
   * TODO: 실제 API 연동 시 수정 필요
   */
  async updateProfile(profileData: Partial<ProfileInfo>): Promise<ProfileInfo> {
    // 목업 데이터 업데이트 시뮬레이션
    console.log('프로필 업데이트 요청:', profileData);
    
    // 기존 프로필 가져오기
    const currentProfile = await this.getProfileInfo(profileData.userId);
    
    return {
      ...currentProfile,
      ...profileData
    };
  }

  /**
   * 비밀번호 변경
   * TODO: 실제 API 연동 시 수정 필요
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // 비밀번호 변경 성공 시뮬레이션
    console.log('비밀번호 변경 요청', { currentPassword, newPassword });
    return true;
  }

  /**
   * 내가 작성한 게시글 목록 조회
   */
  async getMyPosts(userId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<MyPost>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 게시글을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }
      
      console.log(`[API] 내가 작성한 게시글 조회: userId=${userId}, page=${page}, size=${size}`);
      
      const response = await apiClient.get<any>('/community/post/written', {
        params: { userId, page, size }
      });
      
      console.log('[API] 내가 작성한 게시글 응답:', response);
      
      // 백엔드 응답 구조에 맞게 변환
      const posts = response.postList || [];
      const total = response.total || 0;
      
      // 각 게시물 정보를 프론트엔드 타입으로 변환
      const mappedPosts: MyPost[] = posts.map((post: any) => ({
        id: post.postId || 0,
        title: post.title || '[제목 없음]',
        content: post.content || '',
        category: post.category || '일반',
        createdAt: post.createdAt || new Date().toISOString(),
        viewCount: post.views || 0,
        likeCount: post.like || 0,
        commentCount: post.commentCnt || 0
      }));
      
      return {
        content: mappedPosts,
        pageable: {
          pageNumber: page,
          pageSize: size
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedPosts.length,
        number: page
      };
    } catch (error) {
      console.error('내가 작성한 게시글 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 작성한 댓글 목록 조회
   */
  async getMyComments(userId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<MyComment>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 댓글을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }
      
      console.log(`[API] 내가 작성한 댓글 조회: userId=${userId}, page=${page}, size=${size}`);
      
      const response = await apiClient.get<any>('/community/comment/written', {
        params: { userId, page, size }
      });
      
      console.log('[API] 내가 작성한 댓글 응답:', response);
      
      // 백엔드 응답 구조에 맞게 변환
      const comments = response.commentList || [];
      const total = response.total || 0;
      
      // 각 댓글 정보를 프론트엔드 타입으로 변환
      const mappedComments: MyComment[] = comments.map((comment: any) => ({
        id: comment.commentId || 0,
        content: comment.content || '',
        createdAt: comment.createdAt || new Date().toISOString(),
        postId: comment.postId || 0,
        postTitle: comment.postTitle || '[게시글 제목 없음]'
      }));
      
      return {
        content: mappedComments,
        pageable: {
          pageNumber: page,
          pageSize: size
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedComments.length,
        number: page
      };
    } catch (error) {
      console.error('내가 작성한 댓글 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 투표한 토론 목록 조회
   */
  async getMyDebates(userId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<MyDebate>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 토론을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }
      
      console.log(`[API] 내가 투표한 토론 조회: userId=${userId}, page=${page}, size=${size}`);
      
      // DebateApi의 getVotedDebates 직접 호출 대신 API 요청
      const response = await apiClient.get<any>('/debate/voted', {
        params: { userId, page, size } // 백엔드 페이지 번호는 0부터 시작
      });
      
      console.log('[API] 내가 투표한 토론 응답:', response);
      
      let debates: any[] = [];
      let total = 0;
      
      // 응답 형식에 따라 데이터 추출
      if (response.content && Array.isArray(response.content)) {
        debates = response.content;
        total = response.totalElements || 0;
      } else if (response.debates && Array.isArray(response.debates)) {
        debates = response.debates;
        total = response.total || 0;
      } else if (response.debateList && Array.isArray(response.debateList)) {
        // 백엔드에서 debateList 필드로 반환하는 경우 처리
        debates = response.debateList;
        total = response.total || 0;
      }
      
      console.log('[DEBUG] 추출된 토론 목록:', debates);
      
      // 각 토론 정보를 프론트엔드 타입으로 변환
      const mappedDebates: MyDebate[] = debates.map((debate: any) => ({
        id: debate.debateId || 0,
        title: debate.title || '[제목 없음]',
        createdAt: debate.createdAt || new Date().toISOString(),
        votedOption: debate.isVotedState || '투표 정보 없음',
        totalVotes: debate.voteCnt || 0
      }));
      
      console.log('[DEBUG] 변환된 토론 목록:', mappedDebates);
      
      return {
        content: mappedDebates,
        pageable: {
          pageNumber: page,
          pageSize: size
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedDebates.length,
        number: page
      };
    } catch (error) {
      console.error('내가 투표한 토론 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 북마크한 정보글 목록 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getMyBookmarks(page: number = 0, size: number = 10): Promise<PaginatedResponse<MyBookmark>> {
    // 목업 데이터 반환
    return {
      content: MOCK_BOOKMARKS,
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      last: true,
      totalElements: MOCK_BOOKMARKS.length,
      totalPages: 1,
      size: MOCK_BOOKMARKS.length,
      number: page
    };
  }
  
  /**
   * 빈 페이지네이션 응답 반환 (오류 시 사용)
   */
  private getEmptyPaginatedResponse<T>(page: number, size: number): PaginatedResponse<T> {
    return {
      content: [],
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: page
    };
  }
}

// 단일 인스턴스 생성하여 내보내기
const mypageApi = new MypageApi();
export default mypageApi; 