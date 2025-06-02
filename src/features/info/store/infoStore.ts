import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useLanguageStore } from '../../theme/store/languageStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 정보 게시글 타입 정의
interface InfoPost {
  informationId: number;
  title: string;
  content: string;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
  isState?: number;
}

// 정보 필터 타입 정의
interface InfoFilter {
  category: string;
  keyword: string;
  page: number;
  size: number;
  sortBy: 'latest' | 'popular';
  _forceRefresh?: number; // 강제 새로고침용
}

// 스토어 상태 타입 정의
interface InfoState {
  posts: InfoPost[];
  popularPosts: InfoPost[];
  categoryCounts: { [key: string]: number };
  currentPost: InfoPost | null; // 현재 보고 있는 상세 게시글
  loading: boolean;
  error: string | null;
  total: number;
  filter: InfoFilter;
}

// 스토어 액션 타입 정의
interface InfoActions {
  fetchPosts: (filter?: Partial<InfoFilter>) => Promise<void>;
  fetchPopularPosts: () => Promise<void>;
  fetchCategoryCounts: () => Promise<void>;
  fetchPostDetail: (id: string) => Promise<InfoPost | null>;
  setFilter: (filter: Partial<InfoFilter>) => void;
  resetStore: () => void;
}

// 초기 상태
const initialState: InfoState = {
  posts: [],
  popularPosts: [],
  categoryCounts: {},
  currentPost: null,
  loading: false,
  error: null,
  total: 0,
  filter: {
    category: 'all',
    keyword: '',
    page: 0,
    size: 4,
    sortBy: 'latest',
  },
};

// 카테고리 매핑 함수들
const getCategoryKoreanName = (categoryKey: string) => {
  const koreanMap: { [key: string]: string } = {
    all: '전체',
    visa: '비자/법률',
    employment: '취업/직장',
    housing: '주거/부동산',
    education: '교육',
    healthcare: '의료/건강',
    finance: '금융/세금',
    transportation: '교통',
    shopping: '쇼핑',
  };
  return koreanMap[categoryKey] || '전체';
};

// 정보 스토어 생성
export const useInfoStore = create<InfoState & InfoActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 게시글 목록 조회
      fetchPosts: async (filterUpdate = {}) => {
        const currentState = get();
        const mergedFilter = { ...currentState.filter, ...filterUpdate };

        console.log('[INFO Store] 게시글 조회 시작:', mergedFilter);

        set({ loading: true, error: null, filter: mergedFilter });

        try {
          const token = localStorage.getItem('auth_token') || '';

          // 정렬 방식 매핑
          const sortMapping = {
            latest: 'latest',
            popular: 'views',
          };

          const params = new URLSearchParams({
            page: String(mergedFilter.page),
            size: String(mergedFilter.size),
            sort: sortMapping[mergedFilter.sortBy],
            keyword: mergedFilter.keyword || '',
            category:
              mergedFilter.category !== 'all'
                ? getCategoryKoreanName(mergedFilter.category)
                : getCategoryKoreanName('all'),
          });

          const url = mergedFilter.keyword
            ? `${API_BASE}/information/search?${params}`
            : `${API_BASE}/information?${params}`;

          console.log('[INFO Store] API 호출:', url);

          const response = await fetch(url, {
            headers: { Authorization: token },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          console.log('[INFO Store] API 응답:', data);

          let processedPosts = data.informationList || [];

          // 클라이언트 사이드 정렬 (필요한 경우)
          if (mergedFilter.sortBy === 'popular' && processedPosts.length > 0) {
            processedPosts = [...processedPosts].sort((a, b) => (b.views || 0) - (a.views || 0));
          }

          set({
            posts: processedPosts,
            total: data.total || 0,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error('[INFO Store] 게시글 조회 실패:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.',
          });
        }
      },

      // 인기 게시글 조회
      fetchPopularPosts: async () => {
        try {
          const token = localStorage.getItem('auth_token') || '';
          const params = new URLSearchParams({
            page: '0',
            size: '4',
            sort: 'views',
            category: getCategoryKoreanName('all'),
          });

          const url = `${API_BASE}/information?${params}`;
          const response = await fetch(url, { headers: { Authorization: token } });

          if (response.ok) {
            const data = await response.json();
            set({ popularPosts: data.informationList || [] });
            console.log('[INFO Store] 인기 게시글 조회 완료:', data.informationList?.length);
          }
        } catch (error) {
          console.error('[INFO Store] 인기 게시글 조회 실패:', error);
        }
      },

      // 카테고리별 게시글 수 조회
      fetchCategoryCounts: async () => {
        try {
          const token = localStorage.getItem('auth_token') || '';
          const counts: { [key: string]: number } = {};

          console.log('[INFO Store] 카테고리 카운트 조회 시작');

          // 전체 데이터를 한 번에 조회해서 카테고리별로 카운트
          const allParams = new URLSearchParams({
            page: '0',
            size: '10000',
            category: getCategoryKoreanName('all'),
            sort: 'latest',
          });

          const url = `${API_BASE}/information?${allParams}`;
          const response = await fetch(url, { headers: { Authorization: token } });

          if (response.ok) {
            const data = await response.json();
            const allPosts = data.informationList || [];

            // 카테고리별로 카운트
            const categoryKeys = [
              'all',
              'visa',
              'employment',
              'housing',
              'education',
              'healthcare',
              'finance',
              'transportation',
              'shopping',
            ];

            categoryKeys.forEach(categoryKey => {
              if (categoryKey === 'all') {
                counts[categoryKey] = allPosts.length;
              } else {
                const koreanName = getCategoryKoreanName(categoryKey);
                counts[categoryKey] = allPosts.filter(
                  (post: any) => post.category === koreanName
                ).length;
              }
            });

            console.log('[INFO Store] 카테고리 카운트 완료:', counts);
            set({ categoryCounts: counts });
          }
        } catch (error) {
          console.error('[INFO Store] 카테고리 카운트 조회 실패:', error);
        }
      },

      // 필터 설정
      setFilter: filterUpdate => {
        const currentState = get();
        const newFilter = { ...currentState.filter, ...filterUpdate };
        set({ filter: newFilter });
      },

      // 게시글 상세 조회
      fetchPostDetail: async (id: string) => {
        try {
          const token = localStorage.getItem('auth_token') || '';
          const response = await fetch(`${API_BASE}/information/${id}`, {
            headers: { Authorization: token },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data: InfoPost = await response.json();
          console.log('[INFO Store] 게시글 상세 조회 완료:', data);

          // 현재 게시글로 설정
          set({ currentPost: data });

          return data;
        } catch (error) {
          console.error('[INFO Store] 게시글 상세 조회 실패:', error);
          throw error;
        }
      },

      // 스토어 초기화
      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'info-store',
    }
  )
);

// 언어 변경 감시 함수 - 커뮤니티와 동일한 패턴
const setupLanguageChangeListener = () => {
  let previousLanguage = useLanguageStore.getState().language;

  useLanguageStore.subscribe(state => {
    const currentLanguage = state.language;

    // 언어가 변경되었을 때만 실행
    if (currentLanguage !== previousLanguage) {
      console.log(
        `[INFO Store] 언어가 변경됨: ${previousLanguage} → ${currentLanguage}, 정보 데이터 새로고침`
      );
      previousLanguage = currentLanguage;

      const infoState = useInfoStore.getState();
      const currentFilter = infoState.filter;

      // 캐시를 무시하고 새로 요청하기 위해 임시 필터 속성 추가
      const refreshFilter = {
        ...currentFilter,
        _forceRefresh: Date.now(), // 강제 새로고침을 위한 임시 속성
      };

      // 백엔드 언어 동기화 후 데이터 새로고침
      setTimeout(async () => {
        try {
          console.log('[INFO Store] 언어 변경으로 백엔드 동기화 시작');

          // 언어 스토어에서 백엔드 동기화 실행
          const { syncWithBackend } = useLanguageStore.getState();
          await syncWithBackend(currentLanguage);

          console.log('[INFO Store] 백엔드 동기화 완료, 정보 데이터 새로고침 시작');

          // 동기화 완료 후 데이터 새로고침
          const infoStore = useInfoStore.getState();
          await Promise.all([
            infoStore.fetchCategoryCounts(),
            infoStore.fetchPopularPosts(),
            infoStore.fetchPosts(refreshFilter),
          ]);

          // 현재 상세 페이지를 보고 있다면 상세 데이터도 새로고침
          if (infoStore.currentPost) {
            const currentId = infoStore.currentPost.informationId.toString();
            console.log('[INFO Store] 상세 페이지 데이터 새로고침:', currentId);
            await infoStore.fetchPostDetail(currentId);
          }

          console.log('[INFO Store] 언어 변경 데이터 새로고침 완료');
        } catch (error) {
          console.error('[INFO Store] 언어 변경 시 데이터 새로고침 실패:', error);

          // 동기화 실패 시에도 UI 새로고침은 시도
          const infoStore = useInfoStore.getState();
          infoStore.fetchCategoryCounts();
          infoStore.fetchPopularPosts();
          infoStore.fetchPosts(refreshFilter);

          // 상세 페이지도 새로고침 시도
          if (infoStore.currentPost) {
            const currentId = infoStore.currentPost.informationId.toString();
            infoStore.fetchPostDetail(currentId);
          }
        }
      }, 200);
    }
  });
};

// 스토어 생성 후 언어 변경 감시 시작
setupLanguageChangeListener();

export default useInfoStore;
