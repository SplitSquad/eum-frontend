import { create } from 'zustand';
import { usePostStore } from './postStore';
import useCommentStore from './commentStore';
// enum ReactionType으로 변경
// type ReactionType = 'LIKE' | 'DISLIKE';
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "LIKE";
    ReactionType["DISLIKE"] = "DISLIKE";
})(ReactionType || (ReactionType = {}));
/**
 * 통합 커뮤니티 스토어
 * 개별 스토어들의 상태와 액션을 결합하여 제공합니다.
 *
 * 이 스토어는 기존 코드와의 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 각 기능별 스토어를 직접 사용하는 것이 권장됩니다.
 */
export const useCommunityStore = create((set, get) => {
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
        fetchPosts: async (filter) => {
            console.log('[DEBUG] communityStore.fetchPosts는 이제 단순히 postStore의 fetchPosts를 호출합니다.');
            await usePostStore.getState().fetchPosts(filter);
        },
        fetchTopPosts: async (count) => {
            await usePostStore.getState().fetchTopPosts(count);
        },
        fetchRecentPosts: async (count) => {
            await usePostStore.getState().fetchRecentPosts(count);
        },
        fetchPostById: async (postId) => {
            return await usePostStore.getState().fetchPostById(postId);
        },
        createPost: async (postDto, files) => {
            await usePostStore.getState().createPost(postDto, files);
        },
        updatePost: async (postId, postDto, files, removeFileIds) => {
            const dto = removeFileIds ? { ...postDto, removeFileIds } : postDto;
            await usePostStore.getState().updatePost(postId, dto, files);
        },
        deletePost: async (postId) => {
            try {
                await usePostStore.getState().deletePost(postId);
                useCommentStore.getState().resetCommentsState();
                return true;
            }
            catch (error) {
                console.error('[ERROR] communityStore.deletePost 실패:', error);
                throw error;
            }
        },
        reactToPost: async (postId, option) => {
            await usePostStore.getState().reactToPost(postId, option);
        },
        updateCurrentPostReaction: (reactionUpdate) => {
            const { currentPost } = usePostStore.getState();
            if (!currentPost)
                return;
            usePostStore.setState({
                currentPost: {
                    ...currentPost,
                    myReaction: reactionUpdate.myReaction,
                    likeCount: reactionUpdate.likeCount,
                    dislikeCount: reactionUpdate.dislikeCount,
                },
            });
        },
        setSelectedCategory: (category) => {
            usePostStore.getState().setSelectedCategory(category);
        },
        setPostFilter: (filter) => {
            usePostStore.getState().setPostFilter(filter);
        },
        resetPostsState: () => {
            usePostStore.getState().resetPostsState();
        },
        // 댓글 관련 액션 - commentStore 액션 호출
        fetchComments: async (postId, page, size) => {
            await useCommentStore.getState().fetchComments(postId, page, size);
        },
        createComment: async (postId, content, parentId) => {
            await useCommentStore.getState().createComment(postId, content, parentId);
        },
        updateComment: async (commentId, commentData) => {
            await useCommentStore.getState().updateComment(commentId, commentData);
        },
        deleteComment: async (commentId) => {
            await useCommentStore.getState().deleteComment(commentId);
        },
        addCommentReaction: async (postId, commentId, option) => {
            await useCommentStore.getState().addCommentReaction(postId, commentId, option);
        },
        addReply: async (postId, commentId, content) => {
            await useCommentStore.getState().addReply(postId, commentId, content);
        },
        getCommentReplies: async (commentId) => {
            return await useCommentStore.getState().getCommentReplies(commentId);
        },
        updateReply: async (commentId, replyId, content) => {
            await useCommentStore.getState().updateReply(commentId, replyId, content);
        },
        deleteReply: async (commentId, replyId) => {
            await useCommentStore.getState().deleteReply(commentId, replyId);
        },
        reactToReply: async (postId, commentId, replyId, option) => {
            await useCommentStore.getState().reactToReply(postId, commentId, replyId, option);
        },
        resetCommentsState: () => {
            useCommentStore.getState().resetCommentsState();
        },
        // 검색 관련 액션 - searchStore 액션 호출
        searchPosts: async (keyword, searchType, searchParams) => {
            await usePostStore.getState().searchPosts(keyword, searchType, searchParams);
        },
        setSearchKeyword: (keyword) => {
            set({ searchKeyword: keyword });
        },
        setSearchType: (type) => {
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
        createReply: async (postId, commentId, content) => {
            await useCommentStore.getState().addReply(postId, commentId, content);
        },
        reactToComment: async (postId, commentId, type) => {
            await useCommentStore.getState().addCommentReaction(postId, commentId, type);
        },
    };
});
// 함수형 사용을 위한 hook - 필요할 경우 사용
export default () => useCommunityStore(state => state);
