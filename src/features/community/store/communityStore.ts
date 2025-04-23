import { create } from 'zustand';
import { usePostStore } from './postStore';
import useCommentStore from './commentStore';
import { Post, Comment, Reply, CategoryType, ReactionType, PostSummary } from '../types';

/**
 * 통합 커뮤니티 스토어의 인터페이스 정의
 * 이 스토어는 다른 스토어의 상태와 액션을 중계하는 역할만 합니다.
 * 새로운 코드에서는 각 기능별 스토어를 직접 사용하는 것이 권장됩니다.
 */
interface CommunityStore {
  // 게시글 관련 상태 (postStore에서 구독)
  posts: PostSummary[];
  currentPost: Post | null;
  topPosts: Post[];
  recentPosts: Post[];
  postLoading: boolean;
  postError: string | null;
  postFilter: any;
  postPageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  selectedCategory: CategoryType;

  // 댓글 관련 상태 (commentStore에서 구독)
  comments: Comment[];
  commentLoading: boolean;
  commentError: string | null;
  commentPageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  replies: Record<number, Reply[]>;

  // 검색 관련 상태 (searchStore에서 구독)
  searchKeyword: string;
  searchType: string;
  searchResults: Post[];
  searchLoading: boolean;

  // 게시글 관련 액션 (postStore 액션 호출)
  fetchPosts: (filter?: any) => Promise<void>;
  fetchTopPosts: (count?: number) => Promise<void>;
  fetchRecentPosts: (count?: number) => Promise<void>;
  fetchPostById: (postId: number) => Promise<Post | null>;
  createPost: (postDto: any, files?: File[]) => Promise<void>;
  updatePost: (
    postId: number,
    postDto: any,
    files?: File[],
    removeFileIds?: number[]
  ) => Promise<void>;
  deletePost: (postId: number) => Promise<boolean>;
  reactToPost: (postId: number, option: string) => Promise<void>;
  updateCurrentPostReaction: (reactionUpdate: {
    myReaction?: ReactionType | undefined;
    likeCount: number;
    dislikeCount: number;
  }) => void;
  setSelectedCategory: (category: CategoryType) => void;
  setPostFilter: (filter: any) => void;
  resetPostsState: () => void;

  // 댓글 관련 액션 (commentStore 액션 호출)
  fetchComments: (postId: number, page?: number, size?: number) => Promise<void>;
  createComment: (postId: number, content: string, parentId?: number) => Promise<void>;
  updateComment: (
    commentId: number,
    commentData: { content: string; language: string }
  ) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  addCommentReaction: (
    postId: number,
    commentId: number,
    option: 'LIKE' | 'DISLIKE'
  ) => Promise<void>;
  addReply: (postId: number, commentId: number, content: string) => Promise<void>;
  getCommentReplies: (commentId: number) => Promise<Reply[]>;
  updateReply: (commentId: number, replyId: number, content: string) => Promise<void>;
  deleteReply: (commentId: number, replyId: number) => Promise<void>;
  reactToReply: (
    postId: number,
    commentId: number,
    replyId: number,
    option: 'LIKE' | 'DISLIKE'
  ) => Promise<void>;
  resetCommentsState: () => void;

  // 검색 관련 액션 (searchStore 액션 호출)
  searchPosts: (keyword: string, searchType?: string) => Promise<void>;
  setSearchKeyword: (keyword: string) => void;
  setSearchType: (type: string) => void;
  resetSearchState: () => void;

  // 댓글 기능 (commentStore 액션 호출)
  createReply: (postId: number, commentId: number, content: string) => Promise<void>;
  reactToComment: (postId: number, commentId: number, type: 'LIKE' | 'DISLIKE') => Promise<void>;
}

/**
 * 통합 커뮤니티 스토어
 * 개별 스토어들의 상태와 액션을 결합하여 제공합니다.
 *
 * 이 스토어는 기존 코드와의 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 각 기능별 스토어를 직접 사용하는 것이 권장됩니다.
 */
export const useCommunityStore = create<CommunityStore>((set, get) => {
  // 초기 상태 설정 - postStore에서 가져옴
  const initialPostState = usePostStore.getState();
  const initialCommentState = useCommentStore.getState();

  // 타 스토어 구독 설정
  // 1. postStore 상태 변경 구독
  usePostStore.subscribe(state => {
    // communityStore 상태 업데이트 (postStore 변경 사항 반영)
    set({
      posts: state.posts,
      currentPost: state.currentPost,
      topPosts: state.topPosts,
      recentPosts: state.recentPosts,
      postLoading: state.postLoading,
      postError: state.postError,
      postFilter: state.postFilter,
      postPageInfo: state.postPageInfo,
      selectedCategory: state.selectedCategory,
    });
    console.log('communityStore: postStore 상태 변경 감지 및 동기화 완료', {
      postsLength: state.posts.length,
    });
  });

  // 2. commentStore 상태 변경 구독
  useCommentStore.subscribe(state => {
    // communityStore 상태 업데이트 (commentStore 변경 사항 반영)
    set({
      comments: state.comments,
      commentLoading: state.commentLoading,
      commentError: state.commentError,
      commentPageInfo: state.commentPageInfo,
      replies: state.replies,
    });
  });

  return {
    // 초기 상태: postStore 상태
    posts: initialPostState.posts,
    currentPost: initialPostState.currentPost,
    topPosts: initialPostState.topPosts,
    recentPosts: initialPostState.recentPosts,
    postLoading: initialPostState.postLoading,
    postError: initialPostState.postError,
    postFilter: initialPostState.postFilter,
    postPageInfo: initialPostState.postPageInfo,
    selectedCategory: initialPostState.selectedCategory,

    // 초기 상태: commentStore 상태
    comments: initialCommentState.comments,
    commentLoading: initialCommentState.commentLoading,
    commentError: initialCommentState.commentError,
    commentPageInfo: initialCommentState.commentPageInfo,
    replies: initialCommentState.replies,

    // 초기 상태: 검색 관련 상태
    searchKeyword: '',
    searchType: 'all',
    searchResults: [],
    searchLoading: false,

    // 게시글 관련 액션 - postStore 액션 호출
    fetchPosts: async (filter?: any) => {
      console.log(
        '[DEBUG] communityStore.fetchPosts는 이제 단순히 postStore의 fetchPosts를 호출합니다.'
      );
      await usePostStore.getState().fetchPosts(filter);
    },

    fetchTopPosts: async (count?: number) => {
      await usePostStore.getState().fetchTopPosts(count);
    },

    fetchRecentPosts: async (count?: number) => {
      await usePostStore.getState().fetchRecentPosts(count);
    },

    fetchPostById: async (postId: number) => {
      return await usePostStore.getState().fetchPostById(postId);
    },

    createPost: async (postDto: any, files?: File[]) => {
      await usePostStore.getState().createPost(postDto, files);
    },

    updatePost: async (postId: number, postDto: any, files?: File[], removeFileIds?: number[]) => {
      await usePostStore.getState().updatePost(postId, postDto, files, removeFileIds);
    },

    deletePost: async (postId: number) => {
      try {
        await usePostStore.getState().deletePost(postId);
        useCommentStore.getState().resetCommentsState();
        return true;
      } catch (error) {
        console.error('[ERROR] communityStore.deletePost 실패:', error);
        throw error;
      }
    },

    reactToPost: async (postId: number, option: string) => {
      await usePostStore.getState().reactToPost(postId, option);
    },

    updateCurrentPostReaction: (reactionUpdate: {
      myReaction?: ReactionType | undefined;
      likeCount: number;
      dislikeCount: number;
    }) => {
      const { currentPost } = usePostStore.getState();
      if (!currentPost) return;

      usePostStore.setState({
        currentPost: {
          ...currentPost,
          myReaction: reactionUpdate.myReaction,
          likeCount: reactionUpdate.likeCount,
          dislikeCount: reactionUpdate.dislikeCount,
        },
      });
    },

    setSelectedCategory: (category: CategoryType) => {
      usePostStore.getState().setSelectedCategory(category);
    },

    setPostFilter: (filter: any) => {
      usePostStore.getState().setPostFilter(filter);
    },

    resetPostsState: () => {
      usePostStore.getState().resetPostsState();
    },

    // 댓글 관련 액션 - commentStore 액션 호출
    fetchComments: async (postId: number, page?: number, size?: number) => {
      await useCommentStore.getState().fetchComments(postId, page, size);
    },

    createComment: async (postId: number, content: string, parentId?: number) => {
      await useCommentStore.getState().createComment(postId, content, parentId);
    },

    updateComment: async (
      commentId: number,
      commentData: { content: string; language: string }
    ) => {
      await useCommentStore.getState().updateComment(commentId, commentData);
    },

    deleteComment: async (commentId: number) => {
      await useCommentStore.getState().deleteComment(commentId);
    },

    addCommentReaction: async (postId: number, commentId: number, option: 'LIKE' | 'DISLIKE') => {
      await useCommentStore.getState().addCommentReaction(postId, commentId, option);
    },

    addReply: async (postId: number, commentId: number, content: string) => {
      await useCommentStore.getState().addReply(postId, commentId, content);
    },

    getCommentReplies: async (commentId: number) => {
      return await useCommentStore.getState().getCommentReplies(commentId);
    },

    updateReply: async (commentId: number, replyId: number, content: string) => {
      await useCommentStore.getState().updateReply(commentId, replyId, content);
    },

    deleteReply: async (commentId: number, replyId: number) => {
      await useCommentStore.getState().deleteReply(commentId, replyId);
    },

    reactToReply: async (
      postId: number,
      commentId: number,
      replyId: number,
      option: 'LIKE' | 'DISLIKE'
    ) => {
      await useCommentStore.getState().reactToReply(postId, commentId, replyId, option);
    },

    resetCommentsState: () => {
      useCommentStore.getState().resetCommentsState();
    },

    // 검색 관련 액션 - searchStore 액션 호출
    searchPosts: async (keyword: string, searchType?: string) => {
      // 검색 로딩 상태 표시
      set({ searchLoading: true });

      try {
        // postStore의 검색 기능 사용
        const searchParams = { keyword, searchType };
        const posts = await usePostStore.getState().fetchPosts({
          page: 0,
          size: 10,
          searchBy: searchType || 'all',
          keyword: keyword,
        });

        // 결과 저장
        set({
          searchKeyword: keyword,
          searchType: searchType || 'all',
          searchResults: usePostStore.getState().posts,
          searchLoading: false,
        });
      } catch (error) {
        console.error('검색 실패:', error);
        set({ searchLoading: false });
      }
    },

    setSearchKeyword: (keyword: string) => {
      set({ searchKeyword: keyword });
    },

    setSearchType: (type: string) => {
      set({ searchType: type });
    },

    resetSearchState: () => {
      set({
        searchKeyword: '',
        searchType: 'all',
        searchResults: [],
        searchLoading: false,
      });
    },

    // 새로운 댓글 기능
    createReply: async (postId: number, commentId: number, content: string) => {
      await useCommentStore.getState().addReply(postId, commentId, content);
    },

    reactToComment: async (postId: number, commentId: number, type: 'LIKE' | 'DISLIKE') => {
      await useCommentStore.getState().addCommentReaction(postId, commentId, type);
    },
  };
});

// 함수형 사용을 위한 hook - 필요할 경우 사용
export default () => useCommunityStore(state => state);
