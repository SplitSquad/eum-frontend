// 포스트 기본 인터페이스
export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    profileImage?: string;
  };
  category: string;
  postType: string;
  region?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  imageUrls?: string[];
}

// 페이징 응답 DTO
export interface PostPageResponseDto {
  content: Post[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
} 