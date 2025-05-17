import apiClient from '../../config/axios';
import * as CommunityApi from '../../features/community/api/communityApi';
import { Post as CommunityPost } from '../../features/community/types';
import DebateApi from '../../features/debate/api/debateApi';
import { Debate } from '../../features/debate/types';

/**
 * 커뮤니티 게시글 타입 (위젯용)
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImagePath?: string;
  };
  category: string;
  categoryColor?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  images?: string[];
  tags?: string[];
  source: 'community' | 'discussion' | 'information';
  matchScore?: number; // 추천 매칭 점수 (0-100)
}

/**
 * 페이지네이션 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * 커뮤니티 Post를 위젯용 Post로 변환
 */
const convertToWidgetPost = (post: any): Post => {
  return {
    id: post.postId?.toString() || '',
    title: post.title || '',
    content: post.content || '',
    author: {
      id: post.writer?.userId?.toString() || '',
      name: post.writer?.nickname || '',
      profileImagePath: post.writer?.profileImage || '',
    },
    category: post.category || '',
    categoryColor: getCategoryColor(post.category || ''),
    createdAt: post.createdAt || new Date().toISOString(),
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    viewCount: post.viewCount || 0,
    images: post.thumbnail ? [post.thumbnail] : [],
    tags: post.tags || [],
    source: post.postType === '모임' ? 'discussion' : 'community',
    matchScore: post.matchScore
  };
};

/**
 * 커뮤니티 서비스 - 대시보드 위젯용 간소화된 버전
 */
const CommunityService = {
  /**
   * 커뮤니티 게시글 목록 조회
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @returns 게시글 목록
   */
  getCommunityPosts: async (page: number = 0, size: number = 10): Promise<PageResponse<Post>> => {
    try {
      const response = await CommunityApi.getPosts({
        page,
        size,
        postType: '자유',
        sortBy: 'latest'
      });

      // API 응답 형식 변환
      const widgetPosts = (response.postList || []).map(convertToWidgetPost);
      
      return {
        content: widgetPosts,
        totalElements: response.total || 0,
        totalPages: response.totalPages || 0,
        size,
        number: page,
        first: page === 0,
        last: page >= (response.totalPages || 0) - 1
      };
    } catch (error) {
      console.error('커뮤니티 게시글 조회 실패:', error);
      // 에러 발생 시 빈 데이터 반환
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true
      };
    }
  },

  /**
   * 커뮤니티의 모임 게시글 목록 조회
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @returns 게시글 목록
   */
  getDiscussionPosts: async (page: number = 0, size: number = 10): Promise<PageResponse<Post>> => {
    try {
      const response = await CommunityApi.getPosts({
        page,
        size,
        postType: '모임',
        sortBy: 'latest'
      });

      // API 응답 형식 변환
      const widgetPosts = (response.postList || []).map(convertToWidgetPost);
      
      return {
        content: widgetPosts,
        totalElements: response.total || 0,
        totalPages: response.totalPages || 0,
        size,
        number: page,
        first: page === 0,
        last: page >= (response.totalPages || 0) - 1
      };
    } catch (error) {
      console.error('모임 게시글 조회 실패:', error);
      // 에러 발생 시 빈 데이터 반환
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true
      };
    }
  },

  /**
   * 토론 게시글 목록 조회 (Debate API)
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @returns 게시글 목록
   */
  getDebatePosts: async (page: number = 0, size: number = 3): Promise<PageResponse<Post>> => {
    try {
      // 실제 debate API 호출
      const response = await DebateApi.getDebates({
        page: page + 1, // debate API는 1부터 시작
        size,
        sortBy: 'latest'
      });

      // 토론 API 응답을 위젯용 Post 형식으로 변환
      const widgetPosts: Post[] = response.debates.map((debate: Debate) => ({
        id: debate.id.toString(),
        title: debate.title || '',
        content: debate.content || '',
        author: {
          id: 'unknown', // 토론 API는 작성자 정보를 따로 제공하지 않음
          name: '토론 게시자',
          profileImagePath: ''
        },
        category: debate.category || '토론',
        categoryColor: getCategoryColor(debate.category || '토론'),
        createdAt: debate.createdAt || new Date().toISOString(),
        likeCount: (debate.reactions?.like || 0) + (debate.reactions?.happy || 0),
        commentCount: debate.commentCount || 0,
        viewCount: debate.viewCount || 0,
        images: debate.imageUrl ? [debate.imageUrl] : [],
        tags: [],
        source: 'discussion',
        matchScore: Math.floor(Math.random() * 15) + 80 // 임시 매칭 점수
      }));
      
      return {
        content: widgetPosts,
        totalElements: response.total || 0,
        totalPages: response.totalPages || 0,
        size,
        number: page,
        first: page === 0,
        last: page >= (response.totalPages || 0) - 1
      };
    } catch (error) {
      console.error('토론 게시글 조회 실패:', error);
      // 에러 발생 시 빈 데이터 반환
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true
      };
    }
  },

  /**
   * 추천 게시글 목록 조회 (사용자 관심사 기반)
   * @param size 요청할 게시글 수
   * @returns 추천 게시글 목록
   */
  getRecommendedPosts: async (size: number = 10): Promise<Post[]> => {
    try {
      // 백엔드에서 추천 게시글 API 호출
      const response = await apiClient.get<any[]>('/community/post/recommendation', {
        params: { cnt: size }
      });

      // 추천 게시글 속성 추가
      return response.map(post => {
        // 위젯용 포스트로 변환
        const widgetPost = convertToWidgetPost(post);
        // 추천 점수 추가
        return {
          ...widgetPost,
          matchScore: post.matchScore || Math.floor(Math.random() * 15) + 80 // 임시로 80~95 사이 랜덤 점수 부여
        };
      });
    } catch (error) {
      console.error('추천 게시글 조회 실패:', error);
      // 에러 시 인기 게시글로 대체
      try {
        const popularPosts = await CommunityApi.getTopPosts(size);
        return popularPosts.map(post => {
          const widgetPost = convertToWidgetPost(post);
          return {
            ...widgetPost,
            matchScore: Math.floor(Math.random() * 15) + 80
          };
        });
      } catch (err) {
        console.error('인기 게시글 조회도 실패:', err);
        return [];
      }
    }
  },

  /**
   * 게시글 상세 조회
   * @param postId 게시글 ID
   * @returns 게시글 상세 정보
   */
  getPostDetail: async (postId: string): Promise<Post | null> => {
    try {
      const response = await CommunityApi.getPostById(parseInt(postId, 10));
      return convertToWidgetPost(response);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      return null;
    }
  },

  /**
   * 커뮤니티 게시글 목록을 랜덤으로 가져옵니다
   * @param count 가져올 게시글 수
   * @returns 랜덤 게시글 목록
   */
  getRandomCommunityPosts: async (count: number = 4): Promise<Post[]> => {
    try {
      // 인기 게시글 가져오기 (랜덤 대신 인기 게시글을 사용)
      const popularPosts = await CommunityApi.getTopPosts(count * 2);
      // 필요한 개수만큼 무작위로 선택
      return CommunityService.shuffleArray(popularPosts.map(convertToWidgetPost)).slice(0, count);
    } catch (error) {
      console.error('랜덤 커뮤니티 게시글 조회 실패:', error);
      return [];
    }
  },

  /**
   * 토론 게시글 목록을 랜덤으로 가져옵니다
   * @param count 가져올 게시글 수
   * @returns 랜덤 게시글 목록
   */
  getRandomDiscussionPosts: async (count: number = 4): Promise<Post[]> => {
    try {
      // 모임 게시글 최근순으로 가져와서 랜덤으로 선택
      const response = await CommunityApi.getPosts({
        page: 0,
        size: count * 2,
        postType: '모임'
      });
      
      // 필요한 개수만큼 무작위로 선택
      if (response && response.postList && response.postList.length > 0) {
        return CommunityService.shuffleArray(response.postList.map(convertToWidgetPost)).slice(0, count);
      }
      return [];
    } catch (error) {
      console.error('랜덤 토론 게시글 조회 실패:', error);
      return [];
    }
  },
  
  /**
   * 배열을 랜덤하게 섞는 유틸리티 함수
   * @param array 섞을 배열
   * @returns 섞인 배열 (원본 배열을 변경하지 않음)
   */
  shuffleArray: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

/**
 * 카테고리별 색상 코드 반환
 * @param category 카테고리 이름
 * @returns 색상 코드
 */
const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    '여행': '#2196f3',
    '맛집': '#f44336',
    '사진': '#9c27b0',
    '음악': '#4caf50',
    '역사': '#ff9800',
    '영화': '#795548',
    '독서': '#607d8b',
    '예술': '#e91e63',
    '스포츠': '#00bcd4',
    '취미': '#673ab7',
    '토론': '#3f51b5',
    '질문': '#009688'
  };

  return categoryColors[category] || '#757575'; // 매핑이 없으면 기본 색상 반환
};

export default CommunityService; 