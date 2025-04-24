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
  async getProfileInfo(): Promise<ProfileInfo> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.get<ApiResponse<ProfileInfo>>('/api/mypage/profile');
    // return response.data;
    
    // 목업 데이터 반환
    return MOCK_PROFILE;
  }

  /**
   * 프로필 정보 업데이트
   * TODO: 실제 API 연동 시 수정 필요
   */
  async updateProfile(profileData: Partial<ProfileInfo>): Promise<ProfileInfo> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.put<ApiResponse<ProfileInfo>>('/api/mypage/profile', profileData);
    // return response.data;
    
    // 목업 데이터 업데이트 시뮬레이션
    console.log('프로필 업데이트 요청:', profileData);
    return {
      ...MOCK_PROFILE,
      ...profileData
    };
  }

  /**
   * 비밀번호 변경
   * TODO: 실제 API 연동 시 수정 필요
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.post<ApiResponse<boolean>>('/api/mypage/change-password', {
    //   currentPassword,
    //   newPassword
    // });
    // return response.data.success;
    
    // 비밀번호 변경 성공 시뮬레이션
    console.log('비밀번호 변경 요청', { currentPassword, newPassword });
    return true;
  }

  /**
   * 내가 작성한 게시글 목록 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getMyPosts(page: number = 0, size: number = 10): Promise<PaginatedResponse<MyPost>> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<MyPost>>>('/api/mypage/posts', {
    //   params: { page, size }
    // });
    // return response.data;
    
    // 목업 데이터 반환
    return {
      content: MOCK_POSTS,
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      last: true,
      totalElements: MOCK_POSTS.length,
      totalPages: 1,
      size: MOCK_POSTS.length,
      number: page
    };
  }

  /**
   * 내가 작성한 댓글 목록 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getMyComments(page: number = 0, size: number = 10): Promise<PaginatedResponse<MyComment>> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<MyComment>>>('/api/mypage/comments', {
    //   params: { page, size }
    // });
    // return response.data;
    
    // 목업 데이터 반환
    return {
      content: MOCK_COMMENTS,
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      last: true,
      totalElements: MOCK_COMMENTS.length,
      totalPages: 1,
      size: MOCK_COMMENTS.length,
      number: page
    };
  }

  /**
   * 내가 투표한 토론 목록 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getMyDebates(page: number = 0, size: number = 10): Promise<PaginatedResponse<MyDebate>> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<MyDebate>>>('/api/mypage/debates', {
    //   params: { page, size }
    // });
    // return response.data;
    
    // 목업 데이터 반환
    return {
      content: MOCK_DEBATES,
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      last: true,
      totalElements: MOCK_DEBATES.length,
      totalPages: 1,
      size: MOCK_DEBATES.length,
      number: page
    };
  }

  /**
   * 내가 북마크한 정보글 목록 조회
   * TODO: 실제 API 연동 시 수정 필요
   */
  async getMyBookmarks(page: number = 0, size: number = 10): Promise<PaginatedResponse<MyBookmark>> {
    // TODO: 실제 API 호출로 변경
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<MyBookmark>>>('/api/mypage/bookmarks', {
    //   params: { page, size }
    // });
    // return response.data;
    
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
}

// 단일 인스턴스 생성하여 내보내기
const mypageApi = new MypageApi();
export default mypageApi; 