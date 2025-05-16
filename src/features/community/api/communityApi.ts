/**
 * 기존 API 함수들을 각 모듈에서 가져와 재노출
 * 이 파일은 기존 코드와의 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 각 기능별 API 파일(postApi.ts, commentApi.ts)을 직접 사용하는 것이 권장됩니다.
 */

// 게시글 관련 API
import PostApi, {
  PostListResponse,
  PageResponse,
  ApiCreatePostRequest,
  ApiUpdatePostRequest,
} from './postApi';

// 댓글 관련 API - 임시로 commentApi에서 가져옴
import CommentApi from './commentApi';

// 게시글 관련 API 함수들
export const getPosts = PostApi.getPosts;
export const getTopPosts = PostApi.getTopPosts;
export const getRecentPosts = PostApi.getRecentPosts;
export const searchPosts = PostApi.searchPosts;
export const getPostById = PostApi.getPostById;
export const increaseViewCount = PostApi.increaseViewCount;
export const createPost = PostApi.createPost;
export const updatePost = PostApi.updatePost;
export const deletePost = PostApi.deletePost;
export const reactToPost = PostApi.reactToPost;

// 댓글 관련 API 함수들
export const getComments = CommentApi.getComments;
export const createComment = CommentApi.createComment;
export const updateComment = CommentApi.updateComment;
export const deleteComment = CommentApi.deleteComment;
export const reactToComment = CommentApi.reactToComment;
export const getReplies = CommentApi.getReplies;
export const createReply = CommentApi.createReply;
export const updateReply = CommentApi.updateReply;
export const deleteReply = CommentApi.deleteReply;
export const reactToReply = CommentApi.reactToReply;
