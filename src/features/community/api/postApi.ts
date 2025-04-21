import apiClient from './apiClient';
import { Post } from '../types';

// PostListResponse 타입이 없으면 수동으로 정의
export interface PostListResponse {
  postList: Post[];
  total: number;
}

// PageResponse 타입이 없으면 수동으로 정의
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// API 요청 타입이 없으면 수동으로 정의
export interface ApiCreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
}

export interface ApiUpdatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
}

/**
 * 게시글 API 관련 상수 및 유틸리티
 */
const BASE_URL = '/community/post';

/**
 * 게시글 관련 API
 */
export const PostApi = {
  /**
   * 게시글 목록 조회 (페이징, 필터링, 정렬)
   */
  getPosts: async (params: {
    page?: number;
    size?: number;
    category?: string;
    sortBy?: string;
    location?: string;
    tag?: string;
  }): Promise<PostListResponse> => {
    try {
      // API 호출 파라미터 변환 (백엔드 컨트롤러 매개변수와 일치하도록)
      const apiParams = {
        page: params.page || 0,
        size: params.size || 10,
        category: params.category || '전체',
        sort: params.sortBy || 'latest',
        region: params.location || '전체', // 백엔드는 region이라는 이름으로 사용
        tag: params.tag,
      };

      console.log('게시글 목록 API 호출 파라미터:', apiParams);

      // 실제 API 호출
      const response = await apiClient.get<PostListResponse>(BASE_URL, { params: apiParams });
      
      console.log('게시글 목록 원본 응답 데이터:', response);
      
      // 안전하게 데이터 추출 및 변환
      const result: PostListResponse = {
        postList: Array.isArray(response.postList) ? response.postList : [],
        total: typeof response.total === 'number' ? response.total : 0,
      };

      console.log('API 응답 처리 결과:', result);
      
      return result;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      // 에러가 발생했을 때 빈 결과 반환
      return {
        postList: [],
        total: 0,
      };
    }
  },

  /**
   * 인기 게시글 조회
   */
  getTopPosts: async (count: number = 5): Promise<Post[]> => {
    try {
      // 추천 게시글 API 사용
      const response = await apiClient.get<any>(`${BASE_URL}/recommendation`, {
        params: { tag: '전체', cnt: count },
      });
      
      // 백엔드 응답 구조에 맞게 처리
      const posts = response.postList || [];
      
      return posts.map((post: any) => ({
        ...post,
        content: post.content || '',
        dislikeCount: post.dislikeCount || 0,
      })) as Post[];
    } catch (error) {
      console.error('인기 게시글 조회 실패:', error);
      return [];
    }
  },

  /**
   * 최신 게시글 조회
   */
  getRecentPosts: async (count: number = 5): Promise<Post[]> => {
    try {
      // getPosts 함수를 재사용하여 최신 게시글 조회
      const response = await PostApi.getPosts({
        page: 0,
        size: count,
        sortBy: 'latest',
        category: '전체',
      });

      return (response.postList as Post[]) || [];
    } catch (error) {
      console.error('최신 게시글 조회 실패:', error);
      return [];
    }
  },

  /**
   * 게시글 검색
   */
  searchPosts: async (params: {
    keyword: string;
    searchType?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Post>> => {
    try {
      // API 파라미터 변환
      const apiParams = {
        page: params.page || 0,
        size: params.size || 10,
        category: '전체',
        sort: 'latest',
        region: '전체',
        keyword: params.keyword,
        searchBy: params.searchType || 'all',
      };

      // 검색 API 호출
      const response = await apiClient.get<PageResponse<Post>>(`${BASE_URL}/search`, { params: apiParams });
      
      return response;
    } catch (error) {
      console.error('게시글 검색 실패:', error);
      // 에러 발생 시 빈 결과 반환
      return {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
        },
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      };
    }
  },

  /**
   * 게시글 상세 조회
   */
  getPostById: async (postId: number): Promise<Post> => {
    try {
      return await apiClient.get<Post>(`${BASE_URL}/${postId}`);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 조회수 증가
   */
  increaseViewCount: async (postId: number): Promise<void> => {
    try {
      // 조회수 증가 API가 아직 구현되지 않았지만, 추후 구현 시 활성화
      console.log('조회수 증가 API가 아직 구현되지 않았습니다:', postId);
      // 실제 API 구현 시 아래 주석을 해제하세요
      // await apiClient.post(`${BASE_URL}/${postId}/view`);
      return;
    } catch (error) {
      console.error('게시글 조회수 증가 실패:', error);
      // 핵심 기능에 영향을 주지 않으므로 에러를 throw하지 않음
    }
  },

  /**
   * 게시글 작성
   */
  createPost: async (
    postDto: ApiCreatePostRequest,
    files: File[] = []
  ): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'KO',
        emotion: postDto.emotion || 'NONE',
      };

      // FormData 구성
      const formData = new FormData();

      // 1) "post" 파트에 DTO 전체를 JSON 블롭으로 append
      const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('post', jsonBlob);

      // 2) "files" 파트에 파일들 append
      if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
      }

      // 3) API 요청
      return await apiClient.post<Post>(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 수정
   */
  updatePost: async (
    postId: number,
    postDto: ApiUpdatePostRequest,
    files: File[] = [],
    removeFileIds: number[] = []
  ): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'KO',
        emotion: postDto.emotion || 'NONE',
        removeFileIds,
      };

      // FormData 구성
      const formData = new FormData();

      // 1) "post" 파트에 DTO 전체를 JSON 블롭으로 append
      const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('post', jsonBlob);

      // 2) "files" 파트에 파일들 append
      if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
      }

      // 3) API 요청
      return await apiClient.patch<Post>(`${BASE_URL}/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (postId: number): Promise<void> => {
    try {
      await apiClient.delete(`${BASE_URL}/${postId}`);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 좋아요/싫어요 반응
   */
  reactToPost: async (
    postId: number,
    option: 'LIKE' | 'DISLIKE'
  ): Promise<{ like: number; dislike: number }> => {
    try {
      const emotionMapping: Record<string, string> = {
        'LIKE': '좋아요',
        'DISLIKE': '싫어요'
      };

      const response = await apiClient.post<{ like: number; dislike: number }>(
        `${BASE_URL}/emotion/${postId}`, 
        { emotion: emotionMapping[option] }
      );

      return response;
    } catch (error) {
      console.error('게시글 반응 추가 실패:', error);
      throw error;
    }
  }
};

// 기존 코드와의 호환성을 위한 default export
export default PostApi; 