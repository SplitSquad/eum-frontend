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
  source: 'community' | 'discussion' | 'information' | 'debate';
  matchScore?: number; // 추천 매칭 점수 (0-100)
  address?: string; // 위치 정보 (모임/토론 게시글용)
  debateStats?: {
    agreePercent: number;
    disagreePercent: number;
    voteCnt: number;
  };
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
      name: post.userName || post.writer?.nickname || '',
      profileImagePath: post.writer?.profileImage || '',
    },
    category: post.category || '',
    categoryColor: getCategoryColor(post.category || ''),
    createdAt: post.createdAt || new Date().toISOString(),
    likeCount: post.like || post.likeCount || 0,
    commentCount: post.commentCnt || post.commentCount || 0,
    viewCount: post.views || post.viewCount || 0,
    images: post.thumbnail ? [post.thumbnail] : [],
    tags: post.tags || [],
    source: post.postType === '모임' ? 'discussion' : 'community',
    matchScore: post.matchScore,
    address: post.address || post.location || '' // 주소 정보 추가
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
      const widgetPosts: Post[] = response.debates.map((debate: any) => {
        // 기본 변환
        const post: Post = {
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
          likeCount: debate.voteCnt || (debate.reactions?.like || 0) + (debate.reactions?.happy || 0),
          commentCount: debate.commentCnt || debate.commentCount || 0,
        viewCount: debate.viewCount || 0,
        images: debate.imageUrl ? [debate.imageUrl] : [],
        tags: [],
          source: 'debate', // 소스를 'debate'로 설정
        matchScore: Math.floor(Math.random() * 15) + 80 // 임시 매칭 점수
        };

        // 토론 특화 필드 추가
        if (debate.agreePercent !== undefined || debate.disagreePercent !== undefined || debate.voteCnt !== undefined) {
          post.debateStats = {
            agreePercent: debate.agreePercent || 0,
            disagreePercent: debate.disagreePercent || 0,
            voteCnt: debate.voteCnt || 0
          };
        }

        return post;
      });
      
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
   * 사용자 위치 기반 추천 게시글 목록 조회
   * @param userAddress 사용자 주소
   * @param size 조회할 게시글 수
   * @returns 추천 게시글 목록
   */
  getRecommendedPosts: async (userAddress?: string, size: number = 6): Promise<Post[]> => {
    try {
      if (!userAddress) {
        try {
          // WeatherService에서 현재 위치 정보 가져오기
          const WeatherService = (await import('../../services/weather/weatherService')).default;
          const position = await WeatherService.getCurrentPosition();
          
          // 카카오맵 스크립트 로드
          await new Promise<void>((resolve, reject) => {
            if (window.kakao && window.kakao.maps) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
            script.onload = () => {
              window.kakao.maps.load(() => resolve());
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
          
          // 위치를 주소로 변환
          const geocoder = new window.kakao.maps.services.Geocoder();
          userAddress = await new Promise<string>((resolve) => {
            geocoder.coord2RegionCode(
              position.longitude,
              position.latitude,
              (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK && result[0]) {
                  // 동까지 포함한 주소 추출 (예: '서울특별시 중구 장충동')
                  const city = result[0].region_1depth_name; // 예: 서울특별시
                  const district = result[0].region_2depth_name; // 예: 중구
                  const dong = result[0].region_3depth_name || ''; // 예: 장충동
                  
                  const address = dong ? `${city} ${district} ${dong}` : `${city} ${district}`;
                  resolve(address);
                } else {
                  resolve('자유'); // 변환 실패 시 기본값
                }
              }
            );
          });
        } catch (error) {
          console.error('위치 정보 가져오기 실패:', error);
          userAddress = '자유'; // 오류 발생 시 기본값으로 '자유' 사용
        }
      }

      // 주소 구성요소 추출
      const addressParts = (userAddress || '').split(' ');
      let city = '';
      let district = '';
      let dong = '';
      let isDistrictOnly = false;
      
      if (addressParts.length >= 2) {
        city = addressParts[0]; // 예: 서울특별시
        district = addressParts[1]; // 예: 양천구
        isDistrictOnly = addressParts.length === 2; // 구까지만 있는 경우 표시
        
        if (addressParts.length >= 3) {
          dong = addressParts[2]; // 예: 목동
        }
      }
      
      // 구 단위까지만 추출한 주소
      const districtAddress = addressParts.length >= 2 ? `${city} ${district}` : userAddress;
      console.log('API 요청 주소:', userAddress);
      console.log('구 단위 주소:', districtAddress);
      
      try {
        let postList = [];
        
        // 동 단위 주소가 있으면 해당 요청
        if (!isDistrictOnly && dong) {
          console.log('동 단위까지 포함한 주소로 요청 시도');
          // 백엔드에서 추천 게시글 API 호출 (동 단위)
          const response = await apiClient.get<any>('/community/post/recommendation', {
            params: { 
              address: userAddress,
              size: size 
            }
          });

          // 응답 구조를 확인하고 처리
          postList = Array.isArray(response) ? response : 
                     (response.postList && Array.isArray(response.postList) ? response.postList : []);
        }
        
        // 결과가 없거나 매우 적거나, 처음부터 구 단위 주소만 있으면 구 단위로 요청
        if (postList.length < 2 || isDistrictOnly) {
          console.log('구 단위로 요청 시도:', districtAddress);
          
          // 구 단위 주소로 요청
          const districtResponse = await apiClient.get<any>('/community/post/recommendation', {
            params: { 
              address: districtAddress,
              size: size 
            }
          });
          
          // 새로운 응답 처리
          const districtPostList = Array.isArray(districtResponse) ? districtResponse : 
                               (districtResponse.postList && Array.isArray(districtResponse.postList) ? districtResponse.postList : []);
          
          // 기존 결과와 새 결과 병합
          if (districtPostList.length > 0) {
            if (postList.length > 0) {
              // 기존 결과가 있으면 중복 제거하며 병합
              const existingIds = new Set(postList.map((p: any) => p.postId?.toString()));
              const uniqueNewPosts = districtPostList.filter((p: any) => !existingIds.has(p.postId?.toString()));
              Array.prototype.push.apply(postList, uniqueNewPosts);
            } else {
              // 기존 결과가 없으면 새 결과를 그대로 사용
              postList = districtPostList;
            }
          }
        }

        // 게시글 목록 변환
        const analysis = {}; // 분석 정보 객체
        return postList.flat().filter(Boolean).map(post => {
          // 위젯용 포스트로 변환
          const widgetPost = convertToWidgetPost(post);
          
          // 임의의 매칭 점수 부여 (실제로는 서버에서 제공받는 것이 좋음)
          const matchScore = Math.floor(Math.random() * 15) + 80;
            
          return {
            ...widgetPost,
            matchScore
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
    } catch (err) {
      console.error('추천 게시글 최종 실패:', err);
      return [];
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

/**
 * 주소 정제 함수: '서울특별시 중구 장충동 2가' -> '서울특별시 중구'
 * API 요청용으로 구/군 단위까지만 추출
 */
const formatAddress = (address: string): string => {
  if (!address || address === '자유') return '자유';
  
  // 주소에서 구성 요소 추출
  const parts = address.split(' ');
  
  // 시/도와 구/군만 반환 (구까지만 요청)
  if (parts.length >= 2) {
    // 시/도와 구/군만 포함
    return `${parts[0]} ${parts[1]}`;
  }
  
  return address;
};

export default CommunityService; 