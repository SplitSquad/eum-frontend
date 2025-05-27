/**
 * 마이페이지 기능에 필요한 타입 정의
 */

// 내 활동 관련 타입
export interface MyActivity {
  posts: MyPost[];
  comments: MyComment[];
  debates: MyDebate[];
  bookmarks: MyBookmark[];
}

// 내가 작성한 게시글
export interface MyPost {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// 내가 작성한 댓글
export interface MyComment {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  postTitle: string;
}

// 내가 투표한 토론
export interface MyDebate {
  id: number;
  title: string;
  createdAt: string;
  votedOption: string;
  totalVotes: number;
}

// 내가 북마크한 정보글
export interface MyBookmark {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  source: string;
}

// 프로필 정보
export interface ProfileInfo {
  userId: number;
  name: string;
  email: string;
  profileImage: string;
  introduction: string;
  country: string;
  language: string;
  joinDate: string;
  role: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
