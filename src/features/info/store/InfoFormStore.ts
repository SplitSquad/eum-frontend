import { create } from 'zustand';
import {
  getInfoDetail,
  InfoDetail,
  getInfoList,
  InfoListResponse,
  toggleBookmark as apiToggleBookmark,
} from '../api/infoApi';

interface InfoFormState {
  informationId?: number;
  title: string;
  files: string[];
  category: string;
  content: string;
  userName?: string;
  createdAt?: string;
  views?: number;

  // List filter state
  selectedCategory: string;
  sortOrder: 'latest' | 'views';
  keyword: string;
  page: number;
  inputValue: string;

  // List data state
  posts: InfoDetail[];
  total: number;
  totalPages: number;
  bookmarkedIds: number[];

  setTitle: (title: string) => void;
  setFiles: (files: string[]) => void;
  setCategory: (category: string) => void;
  setContent: (content: string) => void;
  setAll: (data: Partial<InfoFormState>) => void;
  reset: () => void;
  fetchAndSetDetail: (id: string | number) => Promise<void>;

  // List filter actions
  setSelectedCategory: (cat: string) => void;
  setSortOrder: (order: 'latest' | 'views') => void;
  setKeyword: (kw: string) => void;
  setPage: (p: number) => void;
  setInputValue: (v: string) => void;
  resetListFilters: () => void;

  // List data actions
  fetchList: () => Promise<void>;
  toggleBookmark: (id: number) => Promise<void>;
}

export const useInfoFormStore = create<InfoFormState>(set => ({
  informationId: undefined,
  title: '',
  files: [],
  category: '',
  content: JSON.stringify({ type: 'doc', content: [] }),
  userName: '',
  createdAt: '',
  views: 0,

  // List filter state
  selectedCategory: '전체',
  sortOrder: 'latest',
  keyword: '',
  page: 1,
  inputValue: '',

  // List data state
  posts: [],
  total: 0,
  totalPages: 0,
  bookmarkedIds: [],

  setFiles: files => set({ files }),
  setTitle: title => set({ title }),
  setContent: content => set({ content }),
  setCategory: category => set({ category }),
  setAll: data => set(state => ({ ...state, ...data })),
  reset: () =>
    set({
      informationId: undefined,
      title: '',
      files: [],
      category: '',
      content: JSON.stringify({ type: 'doc', content: [] }),
      userName: '',
      createdAt: '',
      views: 0,
    }),
  fetchAndSetDetail: async (id: string | number) => {
    const detail = await getInfoDetail(id);
    set(state => ({
      ...state,
      ...detail,
    }));
  },

  // List filter actions
  setSelectedCategory: cat => set({ selectedCategory: cat }),
  setSortOrder: order => set({ sortOrder: order }),
  setKeyword: kw => set({ keyword: kw }),
  setPage: p => set({ page: p }),
  setInputValue: v => set({ inputValue: v }),
  resetListFilters: () =>
    set({
      selectedCategory: '전체',
      sortOrder: 'latest',
      keyword: '',
      page: 1,
      inputValue: '',
    }),

  // List data actions
  fetchList: async () => {
    set(state => ({ ...state })); // trigger loading if needed
    const { selectedCategory, sortOrder, keyword, page } = useInfoFormStore.getState();
    const res = await getInfoList({
      category: selectedCategory,
      sort: sortOrder,
      keyword,
      page,
    });
    set(state => ({
      ...state,
      posts: res.posts,
      total: res.total,
      totalPages: res.totalPages,
      // 북마크 정보는 서버 응답에 따라 별도 관리 필요
    }));
    // 북마크 정보 동기화 (localStorage와 서버 응답 모두 고려)
    if (res.posts.length && 'isBookmarked' in res.posts[0]) {
      const ids = res.posts.filter((i: any) => i.isBookmarked).map((i: any) => i.informationId);
      set({ bookmarkedIds: ids });
      localStorage.setItem('bookmarkedIds', JSON.stringify(ids));
    } else {
      // fallback: localStorage
      const saved = localStorage.getItem('bookmarkedIds');
      if (saved) {
        try {
          set({ bookmarkedIds: JSON.parse(saved) });
        } catch {
          localStorage.removeItem('bookmarkedIds');
        }
      }
    }
  },
  toggleBookmark: async (id: number) => {
    const success = await apiToggleBookmark(id);
    if (success) {
      set(state => {
        const prev = state.bookmarkedIds;
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
        localStorage.setItem('bookmarkedIds', JSON.stringify(next));
        return { bookmarkedIds: next };
      });
    }
  },
}));
