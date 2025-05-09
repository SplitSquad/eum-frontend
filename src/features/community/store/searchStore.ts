// 전역 상태 보류

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Post, PageResponse, SearchOptions } from '../types';
import * as api from '../api/communityApi';

// 검색 관련 상태 타입
interface SearchState {
  // 검색 관련 상태
  keyword: string;
  searchType: 'title' | 'content' | 'author' | 'all';
  results: Post[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
}

interface SearchActions {
  // 검색 관련 액션
  searchPosts: (params: {
    keyword: string;
    searchType?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;
  setKeyword: (keyword: string) => void;
  setSearchType: (type: 'title' | 'content' | 'author' | 'all') => void;
  resetState: () => void;
}

const initialState: SearchState = {
  keyword: '',
  searchType: 'all',
  results: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
};

// 검색 관련 상태 관리 스토어
export const useSearchStore = create<SearchState & SearchActions>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      ...initialState,

      // 액션: 검색 관련
      searchPosts: async ({ keyword, searchType = 'all', page = 0, size = 10 }) => {
        try {
          set({
            isLoading: true,
            error: null,
            keyword,
            searchType: searchType as 'title' | 'content' | 'author' | 'all',
          });

          // TODO: 실제 API 호출 구현
          // const response = await fetch(`/api/posts/search?keyword=${keyword}&type=${searchType}&page=${page}&size=${size}`);
          // const data = await response.json();

          // 임시 구현 - api 호출
          const response = await api.searchPosts({
            keyword,
            searchType,
            page,
            size,
          });

          const pageData = response as PageResponse<Post>;

          set({
            results: pageData.content,
            totalPages: pageData.totalPages,
            totalElements: pageData.totalElements,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: (error as Error).message,
            results: [],
          });
          console.error('게시글 검색 오류:', error);
        }
      },

      setKeyword: keyword => {
        set({ keyword });
      },

      setSearchType: type => {
        set({ searchType: type });
      },

      resetState: () => {
        set(initialState);
      },
    }),
    { name: 'search-store' }
  )
);

export default useSearchStore;
