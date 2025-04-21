# 커뮤니티 기능 구현 가이드

## 구조 개요

커뮤니티 기능은 다음과 같은 구조로 구현되어 있습니다:

- `api/`: 백엔드 API 연동 로직
- `components/`: 재사용 가능한 UI 컴포넌트
- `pages/`: 라우팅 가능한 페이지 컴포넌트
- `store/`: 상태 관리 로직
- `types/`: 타입 정의
- `utils/`: 유틸리티 함수

## 스토어 구조

### 기존 통합 스토어

`communityStore.ts`는 레거시 코드와의 호환성을 위해 유지됩니다. 이 스토어는 내부적으로 세분화된 스토어들을 사용합니다.

### 세분화된 스토어

상태 관리를 더 효율적으로 하기 위해 기능별로 분리된 스토어를 제공합니다:

- `postStore.ts`: 게시글 관련 상태 및 액션
- `commentStore.ts`: 댓글 관련 상태 및 액션
- `searchStore.ts`: 검색 관련 상태 및 액션

## 새로운 postStore 사용 예제

### 기본 사용법

```tsx
import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import usePostStore from '../store/postStore';

const PostListExample: React.FC = () => {
  const { posts, postLoading, postError, fetchPosts } = usePostStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 게시글 로드
    fetchPosts();
  }, [fetchPosts]);

  if (postLoading) return <Box>로딩 중...</Box>;
  if (postError) return <Box>에러: {postError}</Box>;

  return (
    <Box>
      <Typography variant="h5">게시글 목록 ({posts.length}개)</Typography>
      {posts.map(post => (
        <Box key={post.postId} sx={{ mb: 2 }}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2">{post.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PostListExample;
```

### 카테고리 필터링

```tsx
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import usePostStore from '../store/postStore';
import { CategoryType } from '../types';

const CategoryFilterExample: React.FC = () => {
  const { posts, setSelectedCategory } = usePostStore();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('자유');

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    setSelectedCategory(category); // 스토어 카테고리 업데이트 (자동으로 게시글 로드)
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant={activeCategory === '자유' ? 'contained' : 'outlined'}
          onClick={() => handleCategoryChange('자유')}
          sx={{ mr: 1 }}
        >
          자유
        </Button>
        <Button
          variant={activeCategory === '모임' ? 'contained' : 'outlined'}
          onClick={() => handleCategoryChange('모임')}
        >
          모임
        </Button>
      </Box>

      <Box>
        {posts.map(post => (
          <Box key={post.postId} sx={{ mb: 1 }}>
            [{post.category}] {post.title}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryFilterExample;
```

## communityStore vs 분리된 스토어

### 레거시 코드 (communityStore 사용)

```tsx
import { useCommunityStore } from '../store/communityStore';

const LegacyComponent = () => {
  const { posts, fetchPosts } = useCommunityStore();
  // ...
};
```

### 권장 방식 (분리된 스토어 사용)

```tsx
import usePostStore from '../store/postStore';

const ModernComponent = () => {
  const { posts, fetchPosts } = usePostStore();
  // ...
};
```

## 성능 최적화

각 스토어는 devtools 미들웨어를 사용하여 개발 중 상태 변화를 추적할 수 있습니다. 프로덕션 환경에서는 자동으로 비활성화됩니다.
