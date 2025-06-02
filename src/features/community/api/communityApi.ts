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

// API 클라이언트 추가
import apiClient from './apiClient';
import { PostSummary } from '../types-folder/index';

// 게시글 관련 API 함수들
export const getPosts = PostApi.getPosts;
export const getTopPosts = PostApi.getTopPosts;
export const getRecentPosts = PostApi.getRecentPosts;
export const searchPosts = PostApi.searchPosts;
export const getPostById = PostApi.getPostById;
export const getPostOriginal = PostApi.getPostOriginal;
export const increaseViewCount = PostApi.increaseViewCount;
export const createPost = PostApi.createPost;
export const updatePost = PostApi.updatePost;
export const deletePost = PostApi.deletePost;
export const reactToPost = PostApi.reactToPost;

// 사용자 작성 게시글 목록 응답 타입 정의
interface UserPostsResponse {
  postList: PostSummary[];
  total?: number;
  totalPages?: number;
}

// 사용자 작성 게시글 목록 조회 함수 추가
export const getUserPosts = async (
  userId: number,
  page = 0,
  size = 100
): Promise<UserPostsResponse> => {
  try {
    const response = await apiClient.get(`/community/post/written`, {
      params: { userId, page, size },
    });

    // 백엔드 응답 데이터 구조에 맞게 처리
    const data = response as any; // linter 에러 방지를 위한 any 타입 캐스팅

    // 응답이 직접 배열인 경우 (백엔드 응답 구조에 따라 조정 필요)
    if (Array.isArray(data)) {
      return { postList: data };
    }
    // 페이징 응답인 경우
    else if (data?.content && Array.isArray(data.content)) {
      return {
        postList: data.content,
        total: data.totalElements,
        totalPages: data.totalPages,
      };
    }
    // postList 필드가 있는 경우
    else if (data?.postList && Array.isArray(data.postList)) {
      return data as UserPostsResponse;
    }

    // 기본 빈 응답 반환
    return { postList: [] };
  } catch (error) {
    console.error('[ERROR] 사용자 작성 게시글 로드 실패:', error);
    throw error;
  }
};

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
