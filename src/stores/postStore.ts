import { create } from 'zustand';
import { AxiosError } from 'axios';
import { instance } from '../services/api';
import { BASE_URL } from '../constants/api';
import { Post, PostPageResponseDto } from '../dtos/post-page-response.dto';

// 포스트 필터 인터페이스
interface PostFilter {
  keyword: string;
  searchType: string;
  sortBy: string;
  postType: string;
  location: string;
  category: string;
  tags: string[];
}

// 페이지 정보 인터페이스
interface PostPageInfo {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

// 스토어 상태 인터페이스
interface PostStoreState {
  posts: Post[];
  postPageInfo: PostPageInfo;
  postFilter: PostFilter;
  isPostsLoading: boolean;
  postError: AxiosError | null;
  
  fetchPosts: (filter?: {
    page?: number;
    size?: number;
    sort?: string;
    postType?: string;
    region?: string;
    category?: string;
    tags?: string[];
    resetSearch?: boolean;
  }) => Promise<PostPageResponseDto>;
  
  searchPosts: (
    keywordParam?: string | {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
      tags?: string[];
    },
    searchType?: string,
    options?: {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
      tags?: string[];
    }
  ) => Promise<PostPageResponseDto>;
}

// zustand 스토어 생성
const usePostStore = create<PostStoreState>((set, get) => ({
  posts: [],
  postPageInfo: {
    page: 0,
    size: 6,
    totalPages: 0,
    totalElements: 0,
  },
  postFilter: {
    keyword: '',
    searchType: 'title',
    sortBy: 'createdAt,desc',
    postType: '',
    location: '',
    category: '',
    tags: [],
  },
  isPostsLoading: false,
  postError: null,
  
  fetchPosts: async (filter) => {
    const state = get();
    
    // 필터 초기화 없이 페이지 변경만 할 경우
    if (filter && filter.page !== undefined && Object.keys(filter).length === 1) {
      return state.searchPosts(
        state.postFilter.keyword,
        state.postFilter.searchType,
        {
          page: filter.page,
          size: 6,
          sort: state.postFilter.sortBy,
          postType: state.postFilter.postType,
          region: state.postFilter.location,
          category: state.postFilter.category
        }
      );
    }
    
    // 검색 취소(검색 상태 초기화)시 다른 필터는 유지
    if (filter?.resetSearch) {
      return state.searchPosts(
        '',
        'title',
        {
          page: filter.page !== undefined ? filter.page : state.postPageInfo.page,
          size: 6,
          sort: state.postFilter.sortBy,
          postType: state.postFilter.postType,
          region: state.postFilter.location,
          category: state.postFilter.category,
          tags: state.postFilter.tags
        }
      );
    }

    // 일반 필터 적용
    return state.searchPosts({
      page: filter?.page !== undefined ? filter.page : state.postPageInfo.page,
      size: 6,
      sort: state.postFilter.sortBy,
      postType: filter?.postType || state.postFilter.postType,
      region: filter?.region || state.postFilter.location,
      category: filter?.category || state.postFilter.category,
      tags: filter?.tags || state.postFilter.tags
    });
  },

  searchPosts: async (
    keywordParam?,
    searchType = 'title',
    options = {}
  ) => {
    const state = get();
    set({ isPostsLoading: true, postError: null });

    try {
      let actualKeyword = '';
      let actualSearchType = searchType;
      let actualOptions = { ...options };
      
      // 키워드가 객체인 경우 (필터 객체로 직접 호출된 경우)
      if (typeof keywordParam === 'object' && keywordParam !== null) {
        actualOptions = keywordParam;
        actualKeyword = state.postFilter.keyword;
      } else {
        // string 타입이거나 undefined인 경우
        actualKeyword = keywordParam as string || '';
      }

      // 페이지 정보
      const page = actualOptions.page !== undefined ? actualOptions.page : 0;
      const size = actualOptions.size || 6;
      const sort = actualOptions.sort || state.postFilter.sortBy;
      
      // 필터 정보
      const postType = actualOptions.postType || state.postFilter.postType;
      const region = actualOptions.region || state.postFilter.location;
      const category = actualOptions.category || state.postFilter.category;
      const tags = actualOptions.tags || state.postFilter.tags;

      const response = await instance.get<PostPageResponseDto>(`${BASE_URL}/api/v1/posts`, {
        params: {
          keyword: actualKeyword,
          searchType: actualSearchType,
          page,
          size,
          sort,
          postType,
          region,
          category,
          tags: tags?.join(',')
        },
      });

      set({
        posts: response.data.content,
        postPageInfo: {
          page,
          size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        },
        postFilter: {
          ...state.postFilter,
          keyword: actualKeyword,
          searchType: actualSearchType,
          sortBy: sort,
          postType,
          location: region,
          category,
          tags
        },
        isPostsLoading: false,
      });
      
      return response.data;
    } catch (error) {
      set({ isPostsLoading: false, postError: error as AxiosError });
      throw error;
    }
  },
}));

export default usePostStore; 