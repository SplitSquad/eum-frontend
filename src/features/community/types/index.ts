/**
 * 커뮤니티 타입 정의 - 백엔드 API와 일치하는 타입들
 */

/**
 * 게시글 타입 정의
 */
export interface LegacyPost {
  postId: number;
  userId: number;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
  isFile: number;
  translations: TranslatedPost[];
  tags: LegacyTag[];
  files?: PostFile[];
  commentCount?: number;
  reactionCounts?: {
    like?: number;
    dislike?: number;
  };
}

export interface TranslatedPost {
  translationPostId: number;
  postId: number;
  title: string;
  content: string;
  language: string;
}

export interface PostFile {
  postFileId: number;
  postId: number;
  url: string;
}

export interface LegacyTag {
  tagId: number;
  name: string;
}

export interface PostTag {
  postTagId: number;
  postId: number;
  tagId: number;
}

/**
 * 댓글 타입 정의
 */
export interface LegacyComment {
  commentId: number;
  postId: number;
  userId: number;
  userName: string;
  userPicture?: string;
  createdAt: string;
  replyCnt: number;
  heart: number;
  translations: TranslatedComment[];
  reactionCounts?: {
    like?: number;
    dislike?: number;
  };
}

export interface TranslatedComment {
  translationCommentId: number;
  commentId: number;
  content: string;
  language: string;
}

/**
 * 답글 타입 정의
 */
export interface Reply {
  replyId: number;
  commentId: number;
  content: string;
  writer?: User;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType;
  liked?: boolean;
  disliked?: boolean;
}

/**
 * 반응 타입 정의
 */
export interface LegacyReaction {
  id: number;
  userId: number;
  option: string; // 'like' | 'dislike'
}

export interface PostReaction extends LegacyReaction {
  postId: number;
}

export interface CommentReaction extends LegacyReaction {
  commentId: number;
}

export interface ReplyReaction extends LegacyReaction {
  replyId: number;
}

/**
 * 페이지네이션 타입 정의
 */
export interface PageInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

/**
 * 페이지 응답 타입 - API 직접 호출 결과용
 */
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 필터 및 정렬 옵션 타입
 */
export interface PostFilter {
  category?: string;
  location?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular';
  page?: number;
  size?: number;
  searchBy?: string;
  keyword?: string;
}

/**
 * 검색 옵션 타입
 */
export interface SearchOptions {
  keyword: string;
  searchType?: 'title' | 'content' | 'author' | 'all';
}

/**
 * 카테고리 타입
 */
export type CategoryType = '모임' | '자유';

/**
 * 새로운 API 타입 정의
 */
export type PostCategory = '모임' | '자유';

export type Tag = {
  tagId: number;
  name: string;
  description?: string;
  category: PostCategory;
};

export type PostStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export type ReactionType = 'LIKE' | 'DISLIKE' | 'CANCEL';

export type Reaction = {
  reactionId: number;
  type: ReactionType;
  userId: number;
};

export type User = {
  userId: number;
  nickname: string;
  profileImage: string;
  profileImageUrl?: string;
  role?: string;
};

export type Comment = {
  commentId: number;
  postId: number;
  content: string;
  writer: User;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  parentId?: number;
  status: string;
  children?: Comment[];
  myReaction?: ReactionType;
  replyCount?: number;
  liked?: boolean;
  disliked?: boolean;
};

export type PostSummary = {
  postId: number;
  title: string;
  content?: string;
  category: PostCategory;
  tags: Tag[];
  thumbnailUrl?: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  commentCount: number;
  writer?: User;
  status: PostStatus;
  
  views?: number;
  like?: number;
  dislike?: number;
  userName?: string;
  files?: string[];
};

export type Post = PostSummary & {
  content: string;
  updatedAt?: string;
  myReaction?: ReactionType;
  dislikeCount?: number;
  comments?: Comment[];
  
  views?: number;
  like?: number;
  dislike?: number;
  userName?: string;
  files?: string[];
};

export type CreatePostRequest = {
  title: string;
  content: string;
  category: PostCategory;
  tagIds: number[];
  files?: File[];
};

export type UpdatePostRequest = {
  title?: string;
  content?: string;
  category?: PostCategory;
  tagIds?: number[];
  files?: File[];
  removeFileIds?: number[];
};

export type PostListResponse = {
  postList: PostSummary[];
  total: number;
};

export type PostListParams = {
  page?: number;
  size?: number;
  sort?: string;
  category?: PostCategory;
  tagIds?: number[];
  searchTerm?: string;
};

export type PostResponse = {
  post: Post;
};

export type CommentListResponse = {
  content: Comment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

export type CommentResponse = {
  comment: Comment;
};

export type FileInfo = {
  fileId: number;
  originalName: string;
  url: string;
  contentType: string;
  size: number;
};

export type ErrorResponse = {
  status: number;
  message: string;
  errors?: Record<string, string>;
};

export interface PostSearchParams {
  page?: number;
  size?: number;
  query?: string;
  category?: string;
  tags?: string[];
  sort?: string;
}

export interface CommentSearchParams {
  postId: number;
  page?: number;
  size?: number;
}

// API 호환용 타입 정의
export type ApiCreatePostRequest = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  language?: string;
  emotion?: string;
};

export type ApiUpdatePostRequest = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  language?: string;
  emotion?: string;
  removeFileIds?: number[];
};

export type PostList = PaginatedResponse<Post>;

export type CommentList = PaginatedResponse<Comment>;

export type ReplyList = PaginatedResponse<Reply>;

export type PostFormData = {
  title: string;
  content: string;
  files?: File[];
  removedFileIds?: number[];
};

export type SearchParams = {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string;
};
