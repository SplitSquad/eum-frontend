import apiClient from './apiClient';
import { Post } from '../types';
import axios, { AxiosResponse } from 'axios';

// 로컬에서 필요한 타입 정의
type PostType = '자유' | '모임';

// API 요청 타입 정의
export interface ApiCreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
  postType?: PostType;
  address?: string;
}

export interface ApiUpdatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
  removeFileIds?: number[];
  postType?: PostType;
  address?: string;
}

// PostListResponse 타입 정의
export interface PostListResponse {
  postList: Post[];
  total: number;
  totalPages: number;
}

// PageResponse 타입 정의
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

// 검색을 위한 파라미터 타입 정의
export interface PostSearchParams {
  keyword: string;
  searchType: string; // 'title' | 'content' | 'writer'
  page?: number;
  size?: number;
  category?: string;
  location?: string;
  postType?: PostType | string; // postType 파라미터 추가
  tag?: string;
}

// 게시글 검색 파라미터 인터페이스
interface SearchPostsParams {
  keyword?: string;
  tag?: string;
  page?: number;
  size?: number;
  sort?: string;
  category?: string; // 카테고리 속성 추가
  location?: string; // 지역 속성 추가
  postType?: PostType | string; // 게시글 타입 속성 추가
}

// 백엔드의 검색 응답 형식을 위한 인터페이스 (Spring Data 페이징 응답 형식)
interface SearchResponseData {
  content: Post[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  first: boolean;
  last: boolean;
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
    postType?: PostType;
  }): Promise<PostListResponse> => {
    try {
      console.log('[DEBUG] getPosts 요청 시작, 원본 파라미터:', params);

      // API 파라미터 변환 (백엔드 파라미터명에 맞게 변환)
      const apiParams: Record<string, any> = {
        page: params.page !== undefined ? params.page : 0,
        size: params.size || 6,
        category: params.category === '전체' ? '전체' : params.category || '전체',
        sort:
          params.sortBy === 'popular' ? 'views' : params.sortBy === 'oldest' ? 'oldest' : 'latest',
      };

      // postType 처리 - 백엔드는 빈 문자열을 허용하지 않음, 항상 값이 있어야 함
      apiParams.postType = params.postType || '자유';

      // region(지역) 처리 - 자유 게시글이면 무조건 '자유'로, 그렇지 않으면 location 값 사용
      if (apiParams.postType === '자유') {
        apiParams.region = '자유';
      } else {
        apiParams.region = params.location === '전체' ? '전체' : params.location || '전체';
      }

      // 태그 처리
      if (params.tag && params.tag !== '전체') {
        // 콤마로 분리된 태그 문자열을 배열로 변환
        const tagsArray = params.tag.split(',').map(tag => tag.trim());
        // 태그 배열을 직접 할당
        apiParams.tags = tagsArray;

        // 로그에 태그 정보 명확하게 표시
        console.log('[DEBUG] 태그 필터링 적용:', { tag: params.tag, tagsArray });
      }

      // 실제 API 요청 로그
      console.log('[DEBUG] 서버로 전송되는 최종 파라미터:', apiParams);

      // 실제 API 호출
      const response = await apiClient.get<any>(BASE_URL, {
        params: apiParams,
        paramsSerializer: params => {
          // URLSearchParams를 사용하여 직접 쿼리 문자열 생성
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // 배열인 경우 key[]=value1&key[]=value2 형식으로 직렬화
              value.forEach(v => searchParams.append(`${key}[]`, v));
            } else {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        },
      });

      console.log('[DEBUG] 게시글 목록 원본 응답 데이터:', response);

      // 안전하게 데이터 추출 및 변환
      let posts = [];
      let total = 0;

      // 백엔드 응답 구조에 따라 적절히 처리
      if (response && typeof response === 'object') {
        // 응답에 postList가 있는 경우 (기존 API 형식)
        if (Array.isArray(response.postList)) {
          posts = response.postList;
          total = typeof response.total === 'number' ? response.total : posts.length;
          console.log('[DEBUG] 백엔드 응답에서 postList 배열 추출:', {
            postsLength: posts.length,
            totalCount: total,
          });
        }
        // Spring Data 표준 페이징 응답 형식인 경우
        else if (Array.isArray(response.content)) {
          posts = response.content;
          total =
            typeof response.totalElements === 'number' ? response.totalElements : posts.length;
          console.log('[DEBUG] 백엔드 응답에서 content 배열 추출:', {
            postsLength: posts.length,
            totalCount: total,
          });
        }
        // 응답 자체가 배열인 경우
        else if (Array.isArray(response)) {
          posts = response;
          total = response.length;
          console.log('[DEBUG] 백엔드 응답이 직접 배열 형태:', {
            postsLength: posts.length,
          });
        }
      }

      // 각 게시물에 대해 필드 확인 및 결측치 처리
      posts = posts.map((post: any) => {
        // 게시물이 null이면 빈 객체로 대체
        if (!post)
          return {
            postId: 0,
            title: '[데이터 오류]',
            content: '',
            writer: { userId: 0, nickname: '알 수 없음', profileImage: '', role: 'USER' },
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            category: '전체',
            tags: [],
            status: 'ACTIVE',
            postType: '자유',
            address: '자유',
          };

        return {
          ...post,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          dislikeCount: post.dislikeCount || 0,
          // 백엔드 응답 필드와 프론트엔드 필드 맵핑
          postId: post.postId,
          writer: {
            userId: post.userId || 0,
            nickname: post.userName || '알 수 없음',
            profileImage: '',
            role: 'USER',
          },
          viewCount: post.views || 0,
          category: post.category || '전체',
          createdAt: post.createdAt || new Date().toISOString(),
          postType: post.postType || '자유',
          address: post.address || '자유',
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
        };
      });

      // 페이징 계산 - 페이지당 6개 기준으로 총 페이지 수 계산
      const totalPages = Math.ceil(total / 6);

      console.log(
        `[DEBUG] 게시글 목록 처리 완료: ${posts.length}개 게시글, 총 ${total}개, 총 페이지: ${totalPages}`
      );

      const result: PostListResponse = {
        postList: posts,
        total: total,
        totalPages: totalPages,
      };

      return result;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);

      // 서버 에러가 발생한 경우 클라이언트에서 기본값 제공
      return {
        postList: [],
        total: 0,
        totalPages: 0,
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
        writer: {
          userId: post.userId || 0,
          nickname: post.userName || '알 수 없음',
          profileImage: '',
          role: 'USER',
        },
        viewCount: post.views || 0,
        likeCount: post.like || 0,
        dislikeCount: post.dislike || 0,
        commentCount: post.commentCnt || 0,
        postType: post.postType || '자유',
        address: post.address || '집 없음',
        thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
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
   * 게시글 검색 - 검색어, 태그 등으로 게시글 검색
   */
  searchPosts: async (
    keyword: string,
    searchBy: string = 'title_content',
    options: {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
    } = {}
  ): Promise<PostListResponse> => {
    try {
      console.log('[API 요청] searchPosts:', { keyword, searchBy, ...options });

      // 검색 요청을 위한 기본 URL 경로 설정
      const endpoint = `${BASE_URL}/search`;

      // 검색 요청 파라미터 설정 - URLSearchParams 사용하여 파라미터 직접 구성
      const searchParams = new URLSearchParams();

      // 영어로 된 searchBy를 백엔드에서 기대하는 한글로 변환
      let searchByValue: string;
      switch (searchBy) {
        case 'title':
          searchByValue = '제목';
          break;
        case 'content':
          searchByValue = '내용';
          break;
        case 'writer':
          searchByValue = '작성자';
          break;
        case 'title_content':
          searchByValue = '제목_내용';
          break;
        default:
          // 이미 한글로 전달된 경우를 처리
          if (['제목', '내용', '작성자', '제목_내용'].includes(searchBy)) {
            searchByValue = searchBy;
          } else {
            searchByValue = '제목_내용'; // 기본값
          }
      }

      console.log('[DEBUG] 변환된 searchBy 값:', { 원래값: searchBy, 변환값: searchByValue });

      // 페이지네이션 파라미터
      searchParams.append('page', String(options.page || 0));
      searchParams.append('size', String(options.size || 10));

      // 검색 필수 파라미터 - keyword와 searchBy 필드
      searchParams.append('keyword', keyword);
      searchParams.append('searchBy', searchByValue);

      // 정렬 파라미터 (backend format: "latest", "oldest", "views")
      const sortValue = options.sort || 'createdAt,desc';
      // SpringBoot 형식의 sort를 backend 형식으로 변환
      let backendSort;
      if (sortValue.includes('createdAt,desc')) {
        backendSort = 'latest';
      } else if (sortValue.includes('createdAt,asc')) {
        backendSort = 'oldest';
      } else if (sortValue.includes('views')) {
        backendSort = 'views';
      } else {
        backendSort = 'latest'; // 기본값
      }
      searchParams.append('sort', backendSort);

      // 카테고리 (전체인 경우 '전체' 값으로 명시적 전달)
      searchParams.append('category', options.category || '전체');

      // 지역 파라미터 (빈 값이면 '전체'로 설정)
      searchParams.append('region', options.region || '전체');

      // 게시글 타입 (없으면 '자유'로 설정)
      searchParams.append('postType', options.postType || '자유');

      // URL 생성 (파라미터가 직접 포함된 URL)
      const requestUrl = `${endpoint}?${searchParams.toString()}`;

      console.log('[DEBUG] 최종 요청 URL:', requestUrl);

      // API 요청 (직접 URL 사용)
      const response = await apiClient.get<any>(requestUrl);

      console.log('[API 응답] searchPosts 원본 응답:', response);

      // 게시글 목록과 페이징 정보 추출
      let posts: any[] = [];
      let total = 0;
      let totalPages = 0;

      // Spring Data Page 객체 처리를 위한 응답 데이터 정규화
      // 백엔드 응답이 "Page X of Y containing Z instances" 형식으로 출력되는 경우를 처리
      const data = response;

      console.log(
        '[API 응답 파싱] 데이터 타입:',
        typeof data,
        '자바스크립트 객체 여부:',
        data !== null && typeof data === 'object'
      );

      // 응답 형식에 따른 처리 (더 상세한 로깅 추가)
      if (data) {
        // Spring Data Page 객체인 경우 (toString() 메서드로 인해 출력은 "Page X of Y" 형식)
        console.log('[DEBUG] 데이터 구조 검사:', {
          hasPostList: !!data.postList,
          hasContent: !!data.content,
          hasTotal: !!data.total,
          hasTotalElements: !!data.totalElements,
        });

        // 백엔드 맵핑 응답 구조: { postList: [...], total: n } 형식
        if (data.postList) {
          console.log(
            '[DEBUG] postList 배열 발견:',
            Array.isArray(data.postList) ? data.postList.length : 'not array'
          );
          posts = Array.isArray(data.postList) ? data.postList : [];
          total = data.total || 0;
          totalPages = data.totalPages || Math.ceil(total / (options.size || 10));
        }
        // Spring Data JPA Page 객체 형식: { content: [...], totalElements: n, totalPages: n } 형식
        else if (data.content) {
          console.log(
            '[DEBUG] content 배열 발견:',
            Array.isArray(data.content) ? data.content.length : 'not array'
          );
          posts = Array.isArray(data.content) ? data.content : [];
          total = data.totalElements || 0;
          totalPages = data.totalPages || Math.ceil(total / (options.size || 10));
        }
        // 직접 배열인 경우
        else if (Array.isArray(data)) {
          console.log('[DEBUG] 응답이 직접 배열:', data.length);
          posts = data;
          total = posts.length;
          totalPages = Math.ceil(total / (options.size || 10));
        }
        // 형식을 파악할 수 없는 경우 (객체이지만 예상 필드가 없음)
        else if (typeof data === 'object') {
          console.warn('[WARN] 예상하지 못한 응답 형식. 각 필드를 검사합니다:', Object.keys(data));

          // 객체의 각 최상위 속성을 검사하여 배열 찾기
          let arrayFound = false;
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`[DEBUG] 배열 필드 발견: ${key}, 길이: ${data[key].length}`);
              posts = data[key];
              arrayFound = true;

              // total 값도 같이 찾기
              if (typeof data['total'] === 'number') {
                total = data['total'];
              } else if (typeof data['totalElements'] === 'number') {
                total = data['totalElements'];
              } else {
                total = posts.length;
              }

              break;
            }
          }

          // 배열을 찾지 못한 경우, 객체 자체가 단일 게시글일 수 있음
          if (!arrayFound) {
            console.warn('[WARN] 응답에서 배열을 찾을 수 없습니다. 단일 객체 응답으로 처리합니다.');

            // 객체에 postId 같은 핵심 필드가 있는지 확인
            if (data.postId || data.id) {
              posts = [data];
              total = 1;
            } else {
              posts = [];
              total = 0;
            }
          }

          totalPages = Math.ceil(total / (options.size || 10));
        }
      }

      console.log('[DEBUG] 파싱된 데이터:', {
        postsLength: posts.length,
        total,
        totalPages,
        firstItem: posts.length > 0 ? { ...posts[0] } : 'no items',
      });

      // 게시글 데이터 정규화
      const normalizedPosts = posts.map((post: any) => {
        if (!post) {
          return {
            postId: 0,
            writerId: 0,
            title: '[데이터 오류]',
            content: '',
            writer: { userId: 0, nickname: '알 수 없음', profileImage: '', role: 'USER' },
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            category: '전체',
            tags: [],
            status: 'ACTIVE',
            postType: '자유',
            address: '자유',
          };
        }

        return {
          postId: post.postId || post.id || 0,
          writerId: post.userId || post.writerId || post.writer?.userId || 0,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          writer: {
            userId: post.userId || post.writer?.userId || 0,
            nickname: post.userName || post.writer?.nickname || '알 수 없음',
            profileImage: post.writer?.profileImage || '',
            role: post.writer?.role || 'USER',
          },
          createdAt: post.createdAt || new Date().toISOString(),
          viewCount: post.views || post.viewCount || 0,
          likeCount: post.like || post.likeCount || 0,
          dislikeCount: post.dislike || post.dislikeCount || 0,
          commentCount: post.commentCnt || post.commentCount || 0,
          category: post.category || '전체',
          tags: post.tags || [],
          status: post.status || 'ACTIVE',
          postType: post.postType || '자유',
          address: post.address || post.location || '자유',
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
        };
      });

      const result = {
        postList: normalizedPosts,
        total,
        totalPages,
      };

      console.log('[DEBUG] 최종 결과:', {
        postsCount: normalizedPosts.length,
        total,
        totalPages,
      });

      return result;
    } catch (error) {
      console.error('게시글 검색 실패:', error);
      return {
        postList: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 게시글 상세 조회
   */
  getPostById: async (postId: number): Promise<Post> => {
    try {
      const response = await apiClient.get<any>(`${BASE_URL}/${postId}`);

      // 백엔드 응답 구조와 일치하도록 데이터 변환
      return {
        ...response,
        // 백엔드 응답 필드와 프론트엔드 필드 맵핑
        writer: {
          userId: response.userId || 0,
          nickname: response.userName || '알 수 없음',
          profileImage: '',
          role: 'USER',
        },
        viewCount: response.views || 0,
        likeCount: response.like || 0,
        dislikeCount: response.dislike || 0,
        commentCount: response.commentCnt || 0,
        myReaction: response.isState || null, // isState를 myReaction으로 변환
        // 추가된 필드
        postType: response.postType || '자유',
        address: response.address || '자유',
        // 썸네일 처리
        thumbnail: response.files && response.files.length > 0 ? response.files[0] : null,
      };
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
  createPost: async (postDto: ApiCreatePostRequest, files: File[] = []): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'ko',
        emotion: postDto.emotion || 'NONE',
        // 대분류 카테고리가 없으면 '전체'로 설정
        category: postDto.category || '전체',
        // postType이 없으면 '자유'로 설정
        postType: postDto.postType || '자유',
        // 자유 게시글은 '자유'로, 모임 게시글은 선택된 지역 사용
        address: postDto.postType === '자유' ? '자유' : postDto.address || '',
      };

      console.log('[DEBUG] 게시글 작성 요청 DTO:', dto);

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
    files: File[] = []
  ): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'ko',
        emotion: postDto.emotion || 'NONE',
        // 대분류 카테고리가 없으면 '전체'로 설정
        category: postDto.category || '전체',
        // postType이 없으면 '자유'로 설정
        postType: postDto.postType || '자유',
        // 자유 게시글은 '자유'로, 모임 게시글은 선택된 지역 사용
        address: postDto.postType === '자유' ? '자유' : postDto.address || '',
      };

      console.log('[DEBUG] 게시글 수정 요청 DTO:', dto);

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
        LIKE: '좋아요',
        DISLIKE: '싫어요',
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
  },

  /**
   * 내가 작성한 게시글 조회
   */
  getMyPosts: async (
    userId: number,
    page: number = 0,
    size: number = 6
  ): Promise<PostListResponse> => {
    try {
      const response = await apiClient.get<any>(`${BASE_URL}/written`, {
        params: { userId, page, size },
      });

      // 응답 데이터 처리 - 게시글 목록과 동일한 구조로 변환
      let posts = response.postList || [];
      const total = response.total || 0;

      // 각 게시물 필드 변환 (getPosts와 동일한 로직)
      posts = posts.map((post: any) => {
        return {
          ...post,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          // 백엔드 응답 필드와 프론트엔드 필드 맵핑
          postId: post.postId,
          writer: {
            userId: post.userId || 0,
            nickname: post.userName || '알 수 없음',
            profileImage: '',
            role: 'USER',
          },
          viewCount: post.views || 0,
          likeCount: post.like || 0,
          dislikeCount: post.dislike || 0,
          commentCount: post.commentCnt || 0,
          category: post.category || '전체',
          tags: post.tags,
          createdAt: post.createdAt || new Date().toISOString(),
          // 추가된 필드
          postType: post.postType || '자유',
          address: post.address || '자유',
          // 썸네일 처리
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
        };
      });

      return {
        postList: posts,
        total,
        totalPages: Math.ceil(total / size),
      };
    } catch (error) {
      console.error('내 게시글 조회 실패:', error);
      return { postList: [], total: 0, totalPages: 0 };
    }
  },
};

// 기존 코드와의 호환성을 위한 default export
export default PostApi;
