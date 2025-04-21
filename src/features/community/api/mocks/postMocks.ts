import { PageResponse } from '@/types/common';
import { Post } from '@/features/community/types';

/**
 * 목업 게시글 데이터
 */
export const MOCK_POSTS: Post[] = [
  {
    postId: 1,
    title: '첫 번째 게시글입니다.',
    content: '안녕하세요, 첫 번째 게시글의 내용입니다. 잘 부탁드립니다!',
    category: 'NOTICE',
    tags: ['공지사항', '첫 게시글'],
    writer: {
      userId: 1,
      nickname: '관리자',
      profileImage: 'https://via.placeholder.com/150',
    },
    createdAt: '2023-04-01T09:00:00Z',
    viewCount: 120,
    likeCount: 15,
    dislikeCount: 2,
    commentCount: 5,
    status: 'ACTIVE',
  },
  {
    postId: 2,
    title: '개발 팁 공유합니다.',
    content: '프론트엔드 개발할 때 유용한 팁들을 공유합니다...',
    category: 'DEV',
    tags: ['개발', '프론트엔드', '팁'],
    writer: {
      userId: 2,
      nickname: '개발자킴',
      profileImage: 'https://via.placeholder.com/150',
    },
    createdAt: '2023-04-02T14:30:00Z',
    viewCount: 85,
    likeCount: 10,
    dislikeCount: 0,
    commentCount: 3,
    status: 'ACTIVE',
  },
  {
    postId: 3,
    title: '질문있습니다!',
    content: 'Next.js에서 API 라우트 사용법에 대해 질문이 있습니다...',
    category: 'QNA',
    tags: ['질문', 'Next.js', 'API'],
    writer: {
      userId: 3,
      nickname: '초보개발자',
      profileImage: 'https://via.placeholder.com/150',
    },
    createdAt: '2023-04-03T10:15:00Z',
    viewCount: 42,
    likeCount: 5,
    dislikeCount: 1,
    commentCount: 8,
    status: 'ACTIVE',
  },
  {
    postId: 4,
    title: '자유게시판입니다',
    content: '오늘 날씨가 정말 좋네요! 다들 즐거운 하루 보내세요~',
    category: 'FREE',
    tags: ['자유', '일상'],
    writer: {
      userId: 4,
      nickname: '행복이',
      profileImage: 'https://via.placeholder.com/150',
    },
    createdAt: '2023-04-04T16:45:00Z',
    viewCount: 36,
    likeCount: 8,
    dislikeCount: 0,
    commentCount: 2,
    status: 'ACTIVE',
  },
  {
    postId: 5,
    title: '프로젝트 공유합니다',
    content: '최근에 완성한 포트폴리오 프로젝트를 공유합니다...',
    category: 'DEV',
    tags: ['프로젝트', '포트폴리오', '리액트'],
    writer: {
      userId: 5,
      nickname: '코딩왕',
      profileImage: 'https://via.placeholder.com/150',
    },
    createdAt: '2023-04-05T11:20:00Z',
    viewCount: 94,
    likeCount: 20,
    dislikeCount: 1,
    commentCount: 7,
    status: 'ACTIVE',
  },
];

/**
 * 모의 페이지 응답을 생성하는 함수
 * @param data 데이터 배열
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 * @returns 페이지 응답 객체
 */
export function createMockPageResponse<T>(
  data: T[],
  page: number = 0,
  size: number = 10
): PageResponse<T> {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const pageContent = data.slice(startIndex, endIndex);

  return {
    content: pageContent,
    pageable: {
      pageNumber: page,
      pageSize: size,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      offset: startIndex,
      paged: true,
      unpaged: false,
    },
    last: endIndex >= data.length,
    totalPages: Math.ceil(data.length / size),
    totalElements: data.length,
    size: size,
    number: page,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false,
    },
    first: page === 0,
    numberOfElements: pageContent.length,
    empty: pageContent.length === 0,
  };
}
