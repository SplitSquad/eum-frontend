import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Post,
  PostFilter,
  CategoryType,
  ReactionType,
  PostListResponse,
  PostSearchParams,
  PostListParams,
  CreatePostRequest,
  UpdatePostRequest,
  ApiCreatePostRequest,
  ApiUpdatePostRequest,
  PostSummary,
  PostCategory,
  PageResponse,
} from '../types';
import * as postApi from '../api/postApi';

// 불필요한 API 호출을 방지하기 위한 캐시 타임스탬프
let lastFetchTimestamp = 0;
// 마지막으로 사용된 필터 저장
let lastFetchedFilter: PostFilter | null = null;
// 진행 중인 요청을 추적하기 위한 Promise
let activeRequest: Promise<void> | null = null;

// 게시글 관련 상태 타입
interface PostState {
  // 게시글 관련 상태
  posts: PostSummary[];
  currentPost: Post | null;
  topPosts: Post[];
  recentPosts: Post[];
  postLoading: boolean;
  postError: string | null;
  postFilter: PostFilter;
  postPageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };

  // 기타 상태
  selectedCategory: CategoryType;

  // 검색 관련 상태
  isLoading: boolean;
  error: string | null;
  searchParams: PostListParams;
  totalPages: number;
  totalElements: number;
}

interface PostActions {
  // 게시글 관련 액션
  fetchPosts: (filter?: PostFilter) => Promise<void>;
  fetchTopPosts: (count?: number) => Promise<void>;
  fetchRecentPosts: (count?: number) => Promise<void>;
  fetchPostById: (postId: number) => Promise<Post | null>;
  createPost: (postDto: ApiCreatePostRequest, files?: File[]) => Promise<void>;
  updatePost: (
    postId: number,
    postDto: ApiUpdatePostRequest,
    files?: File[],
    removeFileIds?: number[]
  ) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  reactToPost: (postId: number, option: string) => Promise<void>;

  // 좋아요, 싫어요 액션
  likePost: (postId: number) => Promise<void>;
  dislikePost: (postId: number) => Promise<void>;

  // 설정 관련 액션
  setSelectedCategory: (category: CategoryType) => void;
  setPostFilter: (filter: PostFilter) => void;
  setSearchParams: (params: Partial<PostListParams>) => void;

  // 초기화 액션
  resetPostsState: () => void;
  resetState: () => void;

  // Search params actions
  resetSearchParams: () => void;
}

// 두 필터가 동일한지 비교하는 함수
const areFiltersEqual = (a: PostFilter | null, b: PostFilter | null): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  
  // 핵심 필드만 비교
  return (
    a.category === b.category &&
    a.sortBy === b.sortBy &&
    a.page === b.page &&
    a.size === b.size &&
    a.tag === b.tag &&
    a.location === b.location
  );
};

// 게시글 관련 상태 관리 스토어 - 스토어 자체를 export
export const usePostStore = create<PostState & PostActions>()(
  devtools(
    (set, get) => ({
      // 게시글 관련 상태 초기값
      posts: [],
      currentPost: null,
      topPosts: [],
      recentPosts: [],
      postLoading: false,
      postError: null,
      postFilter: {
        sortBy: 'latest',
      },
      postPageInfo: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
      },

      // 기타 상태 초기값
      selectedCategory: '자유',

      // 검색 관련 상태 초기값
      isLoading: false,
      error: null,
      searchParams: {
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        category: undefined,
        tagIds: undefined,
        searchTerm: undefined,
      },
      totalPages: 0,
      totalElements: 0,

      // 액션: 게시글 관련
      fetchPosts: async filter => {
        try {
          console.log('fetchPosts 시작 - 필터:', filter);
          
          // 현재 상태에서 필터 정보 가져오기
          const currentState = get();
          
          // 병합된 필터 생성 (새 필터 우선)
          const mergedFilter = {
            ...currentState.postFilter,
            ...filter,
            // 페이지가 변경되지 않았고 다른 필터가 바뀌었으면 첫 페이지부터 다시 시작
            page: filter && Object.keys(filter).some(key => key !== 'page' && key !== 'size') ? 0 : 
                filter?.page !== undefined ? filter.page : currentState.postFilter.page || 0,
            // 페이지당 6개 게시물
            size: filter?.size || 6,
            // 현재 선택된 카테고리 유지
            category: filter?.category || currentState.selectedCategory,
          };
          
          // 1. 이미 로딩 중이고 동일한 요청일 경우, 진행 중인 요청을 반환
          if (currentState.postLoading && activeRequest && areFiltersEqual(lastFetchedFilter, mergedFilter)) {
            console.log('이미 동일한 요청이 진행 중입니다. 중복 요청 방지.');
            return await activeRequest;
          }
          
          // 2. 데이터가 이미 있고, 필터가 동일하며, 마지막 요청 이후 5초가 지나지 않았으면 캐시 사용
          const now = Date.now();
          const CACHE_TTL = 5000; // 5초 캐시
          
          if (
            currentState.posts.length > 0 && 
            areFiltersEqual(lastFetchedFilter, mergedFilter) &&
            now - lastFetchTimestamp < CACHE_TTL
          ) {
            console.log('캐시된 데이터 사용 (5초 이내), API 요청 스킵');
            return;
          }
          
          // 로딩 상태 설정
          set({ postLoading: true, postError: null });
          
          // 현재 필터 저장 (중복 요청 방지용)
          lastFetchedFilter = { ...mergedFilter };
          
          // 최종 필터로 상태 업데이트
          set({ postFilter: mergedFilter });

          // API 요청 생성 및 추적
          const fetchData = async () => {
            try {
              // API 호출용 파라미터
              const apiParams = {
                page: mergedFilter.page,
                size: mergedFilter.size,
                category: mergedFilter.category,
                sortBy: mergedFilter.sortBy,
                location: mergedFilter.location,
                tag: mergedFilter.tag,
              };
              
              console.log('API 요청 파라미터:', apiParams);
              const response = await postApi.default.getPosts(apiParams);

              console.log('API 응답 받음:', response);

              // 백엔드 응답을 적절한 타입으로 변환
              const posts = response?.postList || [];
              const totalCount = response?.total || 0;

              console.log('가공된 응답:', { postsCount: posts.length, totalCount });

              // 데이터 저장
              const mappedPosts = posts.map(post => ({
                ...post,
                content: post.content || '', // content가 없는 경우 빈 문자열 사용
                dislikeCount: post.dislikeCount || 0, // dislikeCount가 없는 경우 0 사용
              }));

              console.log('상태 업데이트 직전 가공된 posts:', mappedPosts);

              // 상태 업데이트
              set({
                posts: mappedPosts,
                postPageInfo: {
                  page: mergedFilter.page,
                  size: mergedFilter.size,
                  totalElements: totalCount,
                  totalPages: Math.ceil(totalCount / mergedFilter.size),
                },
                postLoading: false,
              });

              // 타임스탬프 업데이트 (캐싱 용도)
              lastFetchTimestamp = Date.now();
              
              // 상태 업데이트 후 현재 상태 확인
              console.log('상태 업데이트 후 현재 posts:', get().posts);
              console.log('페이지 정보:', get().postPageInfo);
            } catch (error) {
              console.error('게시글 목록 조회 실패:', error);
              set({ postLoading: false, postError: '게시글을 불러오는 중 오류가 발생했습니다.' });
              
              // 에러 발생 시 캐시 타임스탬프 초기화
              lastFetchTimestamp = 0;
              lastFetchedFilter = null;
            } finally {
              // 진행 중인 요청 추적 제거
              activeRequest = null;
            }
          };
          
          // 요청 실행 및 추적
          activeRequest = fetchData();
          await activeRequest;
          
        } catch (error) {
          console.error('fetchPosts 전체 실패:', error);
          set({ postLoading: false, postError: '게시글을 불러오는 중 오류가 발생했습니다.' });
          
          // 진행 중인 요청 추적 제거
          activeRequest = null;
        }
      },

      fetchTopPosts: async (count = 5) => {
        try {
          const posts = await postApi.default.getTopPosts(count);
          set({ topPosts: posts });
        } catch (error) {
          console.error('인기 게시글 조회 실패:', error);
        }
      },

      fetchRecentPosts: async (count = 5) => {
        try {
          const posts = await postApi.default.getRecentPosts(count);
          set({ recentPosts: posts });
        } catch (error) {
          console.error('최신 게시글 조회 실패:', error);
        }
      },

      fetchPostById: async postId => {
        try {
          console.log('fetchPostById 시작 - 게시글 ID:', postId);
          
          // 이미 로딩 중이거나 같은 게시글이라면 중복 요청 방지
          const currentState = get();
          if (currentState.postLoading) {
            console.log('이미 게시글 로딩 중, 요청 무시');
            return currentState.currentPost;
          }
          
          // 같은 게시글이 이미 로드되어 있으면 그대로 반환
          if (currentState.currentPost?.postId === postId) {
            console.log('이미 같은 게시글이 로드되어 있음:', postId);
            return currentState.currentPost;
          }
          
          set({ postLoading: true, postError: null });
          
          // 새 게시글 요청 시 먼저 상태 초기화
          // 이전 게시글 데이터가 잠시라도 표시되는 것을 방지
          if (currentState.currentPost?.postId !== postId) {
            console.log('새 게시글 요청 - 기존 데이터 초기화');
            set({ currentPost: null });
          }
      
          const post = await postApi.default.getPostById(postId);
          console.log('API 응답 받음:', post);
      
          if (!post || typeof post !== 'object') {
            console.error('유효하지 않은 게시글 데이터:', post);
            set({ postLoading: false, postError: '게시글 데이터를 불러올 수 없습니다.' });
          } else {
            set({ currentPost: post, postLoading: false });
            
            // 조회수 증가 API 호출 (오류가 발생해도 무시)
            try {
              await postApi.default.increaseViewCount(postId);
            } catch (error) {
              console.error('조회수 증가 실패 (무시됨):', error);
            }
          }
          
          return get().currentPost;
        } catch (error) {
          console.error('게시글 상세 조회 실패:', error);
          set({ postLoading: false, postError: '게시글을 불러오는 중 오류가 발생했습니다.' });
          return null;
        }
      },

      createPost: async (postDto, files) => {
        set({ isLoading: true, error: null });
        try {
          const createdPost = await postApi.default.createPost(postDto, files);
          set(state => ({
            posts: [createdPost, ...state.posts],
            isLoading: false,
          }));
        } catch (error) {
          console.error('게시글 생성 실패:', error);
          set({ error: '게시글을 생성하는데 실패했습니다.', isLoading: false });
        }
      },

      updatePost: async (postId, postDto, files, removeFileIds) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPost = await postApi.default.updatePost(postId, postDto, files, removeFileIds);
          set(state => ({
            posts: state.posts.map(post => (post.postId === postId ? updatedPost : post)),
            currentPost: state.currentPost?.postId === postId ? updatedPost : state.currentPost,
            isLoading: false,
          }));
        } catch (error) {
          console.error('게시글 수정 실패:', error);
          set({ error: '게시글을 수정하는데 실패했습니다.', isLoading: false });
        }
      },

      deletePost: async postId => {
        set({ isLoading: true, error: null });
        try {
          console.log('[DEBUG] 게시글 삭제 액션 시작:', postId);
          
          // API 호출 전 상태 저장
          const prevState = get();
          
          // API 호출
          await postApi.default.deletePost(postId);
          
          // 해당 게시글을 posts 배열에서 제거하고 currentPost도 업데이트
          set(state => {
            // 삭제 성공 후 상태 업데이트
            console.log('[DEBUG] 게시글 삭제 성공 후 상태 업데이트');
            
            return {
              // posts 배열에서 해당 게시글 제거
              posts: state.posts.filter(post => post.postId !== postId),
              
              // currentPost가 삭제하려는 게시글과 같으면 null로 설정
              currentPost: state.currentPost?.postId === postId ? null : state.currentPost,
              
              // topPosts와 recentPosts에서도 제거
              topPosts: state.topPosts.filter(post => post.postId !== postId),
              recentPosts: state.recentPosts.filter(post => post.postId !== postId),
              
              isLoading: false,
            };
          });
          
          console.log('[DEBUG] 게시글 삭제 액션 완료 - 상태:', { 
            currentPost: get().currentPost, 
            postsCount: get().posts.length 
          });
        } catch (error) {
          console.error('[ERROR] 게시글 삭제 액션 실패:', error);
          set({ error: '게시글을 삭제하는데 실패했습니다.', isLoading: false });
        }
      },

      reactToPost: async (postId, option) => {
        try {
          const currentPost = get().currentPost;
          if (currentPost && currentPost.postId === postId) {
            const response = await postApi.default.reactToPost(postId, option as 'LIKE' | 'DISLIKE');
            
            // 게시글 반응 상태 업데이트
            set({
              currentPost: {
                ...currentPost,
                likeCount: response.like,
                dislikeCount: response.dislike,
                myReaction: option as ReactionType,
              },
            });
          }
        } catch (error) {
          console.error('게시글 반응 처리 실패:', error);
        }
      },

      likePost: async postId => {
        await get().reactToPost(postId, 'LIKE');
      },

      dislikePost: async postId => {
        await get().reactToPost(postId, 'DISLIKE');
      },

      setSelectedCategory: category => {
        set({ selectedCategory: category });
        
        // 카테고리 변경 시 페이지 초기화하고 새로운 목록 로드
        get().fetchPosts({ category, page: 0 });
      },

      setPostFilter: filter => {
        // 기존 필터와 새로운 필터 병합
        set(state => ({ 
          postFilter: { ...state.postFilter, ...filter } 
        }));
        
        // 필터 변경 시 새로운 데이터 로드
        get().fetchPosts(filter);
      },

      setSearchParams: params => {
        set(state => ({
          searchParams: {
            ...state.searchParams,
            ...params,
          },
        }));
      },

      resetPostsState: () => {
        set({
          posts: [],
          postLoading: false,
          postError: null,
          postPageInfo: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
          },
        });
        
        // 캐시 초기화
        lastFetchTimestamp = 0;
        lastFetchedFilter = null;
      },

      resetState: () => {
        set({
          posts: [],
          currentPost: null,
          topPosts: [],
          recentPosts: [],
          postLoading: false,
          postError: null,
          postFilter: {
            sortBy: 'latest',
          },
          postPageInfo: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
          },
          selectedCategory: '자유',
        });
        
        // 캐시 초기화
        lastFetchTimestamp = 0;
        lastFetchedFilter = null;
      },

      resetSearchParams: () => {
        set({
          searchParams: {
            page: 0,
            size: 10,
            sort: 'createdAt,desc',
            category: undefined,
            tagIds: undefined,
            searchTerm: undefined,
          },
        });
      },
    }),
    { name: 'post-store' }
  )
);

// 함수형 사용을 위한 hook - 필요할 경우 사용
export default () => usePostStore(state => state);
