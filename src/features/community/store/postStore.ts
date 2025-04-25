import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Post,
  PostFilter,
  PostType,
  ReactionType,
  PostListResponse,
  PostSearchParams,
  PostListParams,
  CreatePostRequest,
  UpdatePostRequest,
  ApiCreatePostRequest,
  ApiUpdatePostRequest,
  PostSummary,
  PageResponse,
} from '../types/index';
import * as postApi from '../api/postApi';
import { Category } from '@mui/icons-material';

// 확장된 PostFilter 타입 - 검색 초기화 플래그 추가
interface ExtendedPostFilter extends PostFilter {
  resetSearch?: boolean;
}

// 불필요한 API 호출을 방지하기 위한 캐시 타임스탬프
let lastFetchTimestamp = 0;
// 마지막으로 사용된 필터 저장
let lastFetchedFilter: ExtendedPostFilter | null = null;
// 진행 중인 요청을 추적하기 위한 Promise
let activeRequest: Promise<void> | null = null;
// 페이지별 캐시 데이터 저장
let pageCache: Record<string, { data: any; timestamp: number }> = {};

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
  selectedCategory: string;

  // 검색 관련 상태
  isLoading: boolean;
  error: string | null;
  searchParams: PostListParams;
  totalPages: number;
  totalElements: number;

  // 검색 상태 유지를 위한 필드 추가
  searchActive: boolean;
  searchTerm: string;
  searchType: string;
}

interface PostActions {
  // 게시글 관련 액션
  fetchPosts: (filter?: ExtendedPostFilter) => Promise<void>;
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
  setSelectedCategory: (category: string) => void;
  setPostFilter: (filter: PostFilter) => void;
  setSearchParams: (params: Partial<PostListParams>) => void;
  
  // postType 관련 액션 추가
  handlePostTypeChange: (postType: PostType) => void;

  // 초기화 액션
  resetPostsState: () => void;
  resetState: () => void;

  // Search params actions
  resetSearchParams: () => void;

  // 검색 관련 액션
  searchPosts: (
    keywordOrOptions: string | {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
      tag?: string;
    },
    searchType?: string,
    options?: {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
      tag?: string;
    }
  ) => Promise<PostListResponse>;
}

// 두 필터가 동일한지 비교하는 함수
const areFiltersEqual = (a: ExtendedPostFilter | null, b: ExtendedPostFilter | null): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;

  // 핵심 필드만 비교
  return (
    a.category === b.category &&
    a.sortBy === b.sortBy &&
    a.page === b.page &&
    a.size === b.size &&
    a.tag === b.tag &&
    a.location === b.location &&
    a.postType === b.postType // postType 비교 추가
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
        category: '전체',
        location: '전체',
        page: 0,
        size: 6,
        postType: '자유',  // 초기값으로 자유 게시글 설정
      },
      postPageInfo: {
        page: 0,
        size: 6,
        totalElements: 0,
        totalPages: 0,
      },

      // 기타 상태 초기값
      selectedCategory: '전체',

      // 검색 관련 상태 초기값
      isLoading: false,
      error: null,
      searchParams: {
        page: 0,
        size: 6,
        sort: 'createdAt,desc',
        category: undefined,
        tagIds: undefined,
        searchTerm: undefined,
      },
      totalPages: 0,
      totalElements: 0,

      // 검색 상태 유지를 위한 필드 추가
      searchActive: false,
      searchTerm: '',
      searchType: '',

      // 액션: 게시글 관련
      fetchPosts: async filter => {
        try {
          console.log('[DEBUG] fetchPosts 시작 - 필터:', filter);

          // 현재 상태에서 필터 정보 가져오기
          const currentState = get();

          // resetSearch가 명시적으로 true인 경우에만 검색 상태 초기화
          if (filter?.resetSearch === true) {
            console.log('[DEBUG] resetSearch가 true, 검색 상태 초기화');
            set({
              searchActive: false,
              searchTerm: '',
              searchType: ''
            });
          } 
          // 검색 활성화된 경우, 검색 상태 유지하고 페이지 이동만 처리
          else if (currentState.searchActive && currentState.searchTerm) {
            console.log(
              '[DEBUG] 검색 상태에서 페이지 이동:',
              currentState.searchTerm,
              currentState.searchType
            );
            // 검색 API로 페이지 이동
            return get().searchPosts({
              page: filter?.page !== undefined ? filter.page : currentState.postPageInfo.page,
              size: 6,
              sort: currentState.postFilter.sortBy,
              postType: filter?.postType || currentState.postFilter.postType,
              region: filter?.location || currentState.postFilter.location,
              category: filter?.category || currentState.postFilter.category
            });
          }

          // 병합된 필터 생성 (새 필터 우선)
          const mergedFilter = {
            ...currentState.postFilter,
            ...filter,
            // 페이지 처리 - 명시적으로 페이지가 전달된 경우 해당 페이지 사용
            page: filter?.page !== undefined ? filter.page : currentState.postFilter.page || 0,
            // 페이지당 6개 항목으로 항상 고정 - size 파라미터를 무시
            size: 6,
            // 카테고리 처리
            category: filter?.category || currentState.postFilter.category || '전체',
            // 지역 처리
            location: filter?.location || currentState.postFilter.location,
            // 태그 처리
            tag: filter?.tag || currentState.postFilter.tag,
            // postType 처리 - 빈 문자열이거나 undefined이면 '전체'로 설정
            postType: filter?.postType !== undefined ? filter.postType : 
                      (currentState.postFilter.postType || '전체' as PostType)
          };

          // 더 자세한 필터 로깅 추가
          console.log('[DEBUG] 병합된 필터 상세:', {
            ...mergedFilter,
            category: mergedFilter.category || '전체',
            postType: mergedFilter.postType || '전체'
          });

          // 캐시 키 생성 - 페이지, 카테고리, 정렬, 지역, postType, 태그 포함
          const postTypeForCache = !mergedFilter.postType || mergedFilter.postType === ('ALL' as any) ? '전체' : mergedFilter.postType;
          const tagForCache = mergedFilter.tag || 'notag';
          const cacheKey = `${mergedFilter.page}_${mergedFilter.category || '전체'}_${mergedFilter.sortBy || 'latest'}_${mergedFilter.location || '전체'}_${postTypeForCache}_${tagForCache}`;
          
          console.log(`[DEBUG] 생성된 캐시 키: ${cacheKey}`);
          
          const now = Date.now();
          const CACHE_TTL = 5000; // 5초로 단축 (디버깅 편의를 위해)

          // 1. 이미 로딩 중이고 동일한 요청일 경우, 진행 중인 요청을 반환
          if (
            currentState.postLoading &&
            activeRequest &&
            areFiltersEqual(lastFetchedFilter, mergedFilter)
          ) {
            console.log('[DEBUG] 이미 동일한 요청이 진행 중입니다. 중복 요청 방지.');
            return await activeRequest;
          }

          // 2. 페이지 캐시 확인 - 특정 페이지 데이터가 캐시되어 있는지 확인
          if (pageCache[cacheKey] && now - pageCache[cacheKey].timestamp < CACHE_TTL) {
            console.log('[DEBUG] 페이지 캐시 사용:', cacheKey);

            // 캐시된 데이터로 상태 업데이트 (로딩 없이 즉시)
            set({
              posts: pageCache[cacheKey].data.posts,
              postPageInfo: pageCache[cacheKey].data.pageInfo,
              postFilter: mergedFilter,
            });

            return;
          }

          // postType 변경 시는 강제로 캐시 무시
          if (filter && filter.postType !== undefined && filter.postType !== lastFetchedFilter?.postType) {
            console.log('[DEBUG] postType 변경됨, 캐시 무시 및 새 요청 시작');
            lastFetchTimestamp = 0; // 캐시 무효화
          } 
          // 카테고리 변경 시는 강제로 캐시 무시
          else if (filter && filter.category !== undefined && filter.category !== lastFetchedFilter?.category) {
            console.log('[DEBUG] 카테고리 변경됨, 캐시 무시 및 새 요청 시작');
            lastFetchTimestamp = 0; // 캐시 무효화
          }
          // 태그 변경 시는 강제로 캐시 무시
          else if (filter && filter.tag !== undefined && filter.tag !== lastFetchedFilter?.tag) {
            console.log('[DEBUG] 태그 변경됨, 캐시 무시 및 새 요청 시작');
            lastFetchTimestamp = 0; // 캐시 무효화
          }
          else {
            // 3. 일반 캐시 확인 - 동일 필터 요청이 최근에 있었는지
            if (
              currentState.posts.length > 0 &&
              areFiltersEqual(lastFetchedFilter, mergedFilter) &&
              now - lastFetchTimestamp < CACHE_TTL
            ) {
              console.log('[DEBUG] 일반 캐시 사용 (5초 이내), API 요청 스킵');
              return;
            }
          }

          // 로딩 상태 설정 - 페이지 이동은 빠르게 처리되어야 해서 지연 적용
          let loadingTimeout: any = null;

          // 페이지네이션 이동 시 100ms 후에만 로딩 상태 표시 (깜빡임 방지)
          if (filter?.page !== undefined && currentState.posts.length > 0) {
            loadingTimeout = setTimeout(() => {
              // 아직 요청이 완료되지 않았다면 로딩 상태 표시
              if (activeRequest) {
                set({ postLoading: true });
              }
            }, 100);
          } else {
            // 일반 요청은 즉시 로딩 상태 표시
            set({ postLoading: true, postError: null });
          }

          // 현재 필터 저장 (중복 요청 방지용)
          lastFetchedFilter = { ...mergedFilter };

          // 최종 필터로 상태 업데이트
          set({ postFilter: mergedFilter });

          // API 요청 생성 및 추적
          const fetchData = async () => {
            try {
              // API 호출용 파라미터 - size는 항상 6으로 고정
              const apiParams = {
                page: mergedFilter.page,
                size: 6, // 항상 6으로 고정
                category: mergedFilter.category,
                sortBy: mergedFilter.sortBy,
                location: mergedFilter.location,
                tag: mergedFilter.tag,
                postType: mergedFilter.postType, // postType도 확실히 전달
              };

              console.log('[DEBUG] API 요청 파라미터:', apiParams);
              // API 요청 시작
              let response;
              
              try {
                response = await postApi.PostApi.getPosts(apiParams);
                console.log('[DEBUG] API 응답 받음:', response);
              } catch (apiError) {
                console.error('[ERROR] API 호출 실패:', apiError);
                
                // 로딩 타임아웃 취소
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout);
                  loadingTimeout = null;
                }
                
                // 오류 상태 설정 및 빈 배열 반환
                set({ 
                  postLoading: false, 
                  postError: '게시글을 불러올 수 없습니다.',
                  posts: [] // 에러 시 빈 목록으로 설정
                });
                
                // 에러 발생 시 캐시 타임스탬프 초기화
                lastFetchTimestamp = 0;
                lastFetchedFilter = null;
                return;
              }

              // 응답이 없는 경우 처리
              if (!response) {
                console.log('[INFO] 응답이 없습니다.');
                
                // 로딩 타임아웃 취소
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout);
                  loadingTimeout = null;
                }
                
                // 빈 결과 설정
                set({ 
                  posts: [],
                  postPageInfo: {
                    page: mergedFilter.page,
                    size: 6,
                    totalElements: 0,
                    totalPages: 0
                  },
                  postLoading: false
                });
                
                return;
              }

              // 백엔드 응답을 적절한 타입으로 변환 (다양한 API 응답 형식 지원)
              const posts = response?.postList || response?.content || response || [];
              const totalCount = response?.total || response?.totalElements || posts.length;
              const totalPages = response?.totalPages || Math.ceil(totalCount / 6);

              console.log('[DEBUG] 가공된 API 응답:', {
                postsCount: posts.length,
                totalCount,
                totalPages,
              });

              // 데이터 저장
              const mappedPosts = posts.map(post => ({
                ...post,
                content: post.content || '', // content가 없는 경우 빈 문자열 사용
                dislikeCount: post.dislikeCount || 0, // dislikeCount가 없는 경우 0 사용
              }));

              // 페이지 정보 구성
              const pageInfo = {
                page: mergedFilter.page,
                size: 6, // 항상 6으로 고정
                totalElements: totalCount,
                totalPages: totalPages,
              };

              // 페이지 캐시 업데이트
              pageCache[cacheKey] = {
                data: {
                  posts: mappedPosts,
                  pageInfo,
                },
                timestamp: Date.now(),
              };

              console.log('[DEBUG] 상태 업데이트 직전 가공된 posts:', mappedPosts);

              // 로딩 타임아웃 취소
              if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
              }

              // 상태 업데이트 (페이지 정보 항상 정확하게 계산)
              set({
                posts: mappedPosts,
                postPageInfo: pageInfo,
                postLoading: false,
              });

              // 로그에 페이지네이션 상태 출력
              console.log('[DEBUG] 페이지네이션 상태:', {
                currentPage: mergedFilter.page,
                pageSize: 6, // 항상 6으로 고정
                totalElements: totalCount,
                totalPages: totalPages,
                actualPostsLength: mappedPosts.length,
              });

              // 타임스탬프 업데이트 (캐싱 용도)
              lastFetchTimestamp = Date.now();

              // 상태 업데이트 후 현재 상태 확인
              console.log('상태 업데이트 후 현재 posts:', get().posts);
              console.log('페이지 정보:', get().postPageInfo);
            } catch (error) {
              console.error('게시글 목록 조회 실패:', error);

              // 로딩 타임아웃 취소
              if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
              }

              set({ postLoading: false, postError: '게시글을 불러오는 중 오류가 발생했습니다.', posts: [] });

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
          set({ postLoading: false, postError: '게시글을 불러오는 중 오류가 발생했습니다.', posts: [] });

          // 진행 중인 요청 추적 제거
          activeRequest = null;
        }
      },

      fetchTopPosts: async (count = 5) => {
        try {
          const posts = await postApi.PostApi.getTopPosts(count);
          set({ topPosts: posts });
        } catch (error) {
          console.error('인기 게시글 조회 실패:', error);
        }
      },

      fetchRecentPosts: async (count = 5) => {
        try {
          const posts = await postApi.PostApi.getRecentPosts(count);
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

          const post = await postApi.PostApi.getPostById(postId);
          console.log('API 응답 받음:', post);

          if (!post || typeof post !== 'object') {
            console.error('유효하지 않은 게시글 데이터:', post);
            set({ postLoading: false, postError: '게시글 데이터를 불러올 수 없습니다.' });
          } else {
            set({ currentPost: post, postLoading: false });

            // 조회수 증가 API 호출 (오류가 발생해도 무시)
            try {
              await postApi.PostApi.increaseViewCount(postId);
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
          const createdPost = await postApi.PostApi.createPost(postDto, files);
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
          console.log('[DEBUG] 게시글 수정 시작:', {
            postId,
            dto: {
              ...postDto,
              content: postDto.content ? postDto.content.substring(0, 50) + '...' : '',
            },
            filesCount: files?.length || 0,
            removeFileIds
          });

          const updatedPost = await postApi.PostApi.updatePost(
            postId,
            postDto,
            files,
            removeFileIds
          );

          console.log('[DEBUG] 게시글 수정 성공:', {
            updatedPost: {
              ...updatedPost,
              content: updatedPost.content ? updatedPost.content.substring(0, 50) + '...' : '',
              category: updatedPost.category,
              postType: updatedPost.postType,
              address: updatedPost.address || updatedPost.location,
              tags: updatedPost.tags
            }
          });

          set(state => {
            // 게시글 목록에서 해당 게시글 업데이트
            const updatedPosts = state.posts.map(post => 
              post.postId === postId 
                ? {
                    ...post,
                    title: updatedPost.title,
                    content: updatedPost.content,
                    category: updatedPost.category,
                    tags: updatedPost.tags,
                    postType: updatedPost.postType as PostType,
                    address: updatedPost.address || updatedPost.location,
                    location: updatedPost.address || updatedPost.location
                  } 
                : post
            );

            // 현재 게시글도 업데이트
            const updatedCurrentPost = state.currentPost?.postId === postId
              ? {
                  ...state.currentPost,
                  title: updatedPost.title,
                  content: updatedPost.content,
                  category: updatedPost.category,
                  tags: updatedPost.tags,
                  postType: updatedPost.postType as PostType,
                  address: updatedPost.address || updatedPost.location,
                  location: updatedPost.address || updatedPost.location,
                  // 파일 업데이트
                  files: updatedPost.files || state.currentPost.files
                }
              : state.currentPost;

            return {
              posts: updatedPosts,
              currentPost: updatedCurrentPost,
              isLoading: false,
            };
          });
        } catch (error) {
          console.error('[ERROR] 게시글 수정 실패:', error);
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
          await postApi.PostApi.deletePost(postId);

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
            postsCount: get().posts.length,
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
            const response = await postApi.PostApi.reactToPost(
              postId,
              option as 'LIKE' | 'DISLIKE'
            );

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
          postFilter: { ...state.postFilter, ...filter },
        }));

        // 필터 변경 시 새로운 데이터 로드
        get().fetchPosts(filter);
      },

      // postType 변경 처리 함수 추가
      handlePostTypeChange: (postType) => {
        console.log('[DEBUG] handlePostTypeChange 호출, postType:', postType);
        
        // 현재 필터 가져오기
        const currentFilter = get().postFilter;
        
        // 새 필터 설정 (postType 명시적 설정)
        const newFilter: PostFilter = {
          ...currentFilter,
          postType: postType,
          page: 0, // 페이지 초기화
          resetSearch: true // 검색 상태 초기화
        };
        
        // 모임 게시글 선택 시 지역 설정 초기화
        if (postType === '모임') {
          newFilter.location = '전체';
        } else if (postType === '자유') {
          newFilter.location = '자유';
        }
        
        console.log('[DEBUG] handlePostTypeChange - 새 필터:', newFilter);
        
        // 필터 적용 및 데이터 로드
        set({
          postFilter: newFilter,
          searchActive: false, // 검색 상태 초기화
          searchTerm: '',
          searchType: ''
        });
        
        // 데이터 로드
        get().fetchPosts(newFilter);
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
            size: 6,
            totalElements: 0,
            totalPages: 0,
          },
          searchActive: false, // 검색 상태도 초기화
          searchTerm: '',
          searchType: '',
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
            category: '전체',
            location: '전체',
            page: 0,
            size: 6,
            postType: '자유',  // 초기값으로 자유 게시글 설정
          },
          postPageInfo: {
            page: 0,
            size: 6,
            totalElements: 0,
            totalPages: 0,
          },
          selectedCategory: '전체',
          searchActive: false,
          searchTerm: '',
          searchType: '',
        });

        // 캐시 초기화
        lastFetchTimestamp = 0;
        lastFetchedFilter = null;
      },

      resetSearchParams: () => {
        set({
          searchParams: {
            page: 0,
            size: 6,
            sort: 'createdAt,desc',
            category: undefined,
            tagIds: undefined,
            searchTerm: undefined,
          },
        });
      },

      searchPosts: async (
        keywordOrOptions: string | {
          page?: number;
          size?: number;
          sort?: string;
          postType?: string;
          region?: string;
          category?: string;
          tag?: string;
        },
        searchType?: string,
        options?: {
          page?: number;
          size?: number;
          sort?: string;
          postType?: string;
          region?: string;
          category?: string;
          tag?: string;
        }
      ) => {
        try {
          let keyword: string = '';
          let searchOptions = options || {};
          
          // First argument is an object (for backward compatibility)
          if (typeof keywordOrOptions === 'object' && keywordOrOptions !== null) {
            searchOptions = keywordOrOptions;
            keyword = get().searchTerm || '';
            searchType = get().searchType || '제목_내용';
            console.log('[DEBUG] Object argument detected, using existing search term/type:', keyword, searchType);
          } else {
            keyword = keywordOrOptions as string;
          }

          console.log(`[DEBUG] searchPosts called: {keyword: '${keyword}', searchType: '${searchType}', page: ${searchOptions.page}, size: ${searchOptions.size}, category: ${searchOptions.category}, region: ${searchOptions.region}, postType: ${searchOptions.postType}, tag: ${searchOptions.tag}}`);
          
          // Important: Prevent duplicate execution if same search is in progress
          const currentState = get();
          
          // 검색 상태 설정 - 항상 로딩 시작
          set({ 
            postLoading: true, 
            searchActive: true, 
            searchTerm: keyword, 
            searchType: searchType, 
            postPageInfo: {
              ...currentState.postPageInfo,
              page: searchOptions.page || 0
            },
            // 필터 상태 업데이트 - 검색 시 필터도 함께 업데이트
            postFilter: {
              ...currentState.postFilter,
              category: searchOptions.category !== undefined ? searchOptions.category : currentState.postFilter.category,
              location: searchOptions.region !== undefined ? searchOptions.region : currentState.postFilter.location,
              postType: searchOptions.postType !== undefined ? searchOptions.postType as PostType : currentState.postFilter.postType,
              tag: searchOptions.tag !== undefined ? searchOptions.tag : currentState.postFilter.tag,
              sortBy: searchOptions.sort === 'views,desc' ? 'popular' : 'latest',
              page: searchOptions.page || 0
            }
          });

          // 검색 API 호출 시 필터 적용
          const apiParams: any = {
            keyword: keyword,
            searchType: searchType,
            page: searchOptions.page || 0,
            size: searchOptions.size || 6,
            sort: searchOptions.sort || 'createdAt,desc',
          };
          
          // 필터 조건 추가
          if (searchOptions.category) {
            apiParams.category = searchOptions.category;
          }
          if (searchOptions.region) {
            apiParams.region = searchOptions.region;
          }
          if (searchOptions.postType) {
            apiParams.postType = searchOptions.postType;
          }
          if (searchOptions.tag) {
            apiParams.tag = searchOptions.tag;
          }
          
          // 디버깅을 위한 API 파라미터 로깅
          console.log('[DEBUG] 검색 API 파라미터:', apiParams);
          
          // API call with timeout for safety
          let apiCallCompleted = false;
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              if (!apiCallCompleted) {
                console.error('[ERROR] 검색 API 호출 시간 초과');
                reject(new Error('검색 요청 시간이 초과되었습니다.'));
              }
            }, 10000); // 10초 타임아웃
          });
          
          try {
            // API 호출과 타임아웃 중 먼저 완료되는 것 처리
            const response = await Promise.race([
              postApi.PostApi.searchPosts(keyword, searchType, searchOptions),
              timeoutPromise
            ]) as any;
            
            apiCallCompleted = true;
            
            if (!response) {
              console.log('[INFO] 검색 결과가 없습니다.');
              set({ 
                postLoading: false,
                posts: [], // 빈 결과 설정
                postPageInfo: {
                  page: searchOptions.page || 0,
                  size: searchOptions.size || 6,
                  totalPages: 0,
                  totalElements: 0
                }
              });
              return { postList: [], total: 0, totalPages: 0 };
            }
            
            // Process response
            set((state) => ({
              ...state,
              searchTerm: keyword,
              searchType: searchType,
              posts: response.postList || [],
              postPageInfo: {
                page: searchOptions.page || 0,
                size: searchOptions.size || 6,
                totalPages: response.totalPages || 0,
                totalElements: response.total || 0
              },
              postLoading: false // 로딩 상태 종료
            }));

            return response;
          } catch (apiError) {
            console.error('[ERROR] 검색 API 호출 실패:', apiError);
            // API 호출 실패 시 상태 업데이트
            set({
              postLoading: false,
              postError: '검색 중 오류가 발생했습니다.'
            });
            throw apiError;
          }
        } catch (error) {
          console.error('[ERROR] searchPosts 함수 실행 오류:', error);
          set({
            postError: '게시글 검색 중 오류가 발생했습니다.',
            postLoading: false, // 항상 로딩 상태 종료
            posts: [] // 에러 시 빈 목록으로 설정
          });
          return {
            postList: [],
            total: 0,
            totalPages: 0,
          };
        }
      },
    }),
    { name: 'post-store' }
  )
);

// 함수형 사용을 위한 hook - 필요할 경우 사용
export default () => usePostStore(state => state);
