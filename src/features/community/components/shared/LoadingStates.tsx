import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

// 포스트 카드 스켈레톤
export const PostCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width="30%" height={16} />
        <Skeleton variant="text" width="20%" height={16} />
      </Box>
    </CardContent>
  </Card>
);

// 포스트 리스트 스켈레톤
export const PostListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
    {Array.from({ length: count }).map((_, index) => (
      <PostCardSkeleton key={index} />
    ))}
  </Box>
);

// 태그 스켈레톤
export const TagsSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={Math.random() * 60 + 40}
        height={32}
        sx={{ borderRadius: '16px' }}
      />
    ))}
  </Box>
);

// 카테고리 탭 스켈레톤
export const CategoryTabsSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={80}
        height={40}
        sx={{ borderRadius: '20px' }}
      />
    ))}
  </Box>
);

// 전체 페이지 로딩
export const CommunityPageSkeleton: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <CategoryTabsSkeleton />
    <TagsSkeleton />
    <PostListSkeleton />
  </Box>
);

// 인라인 로딩 (작은 스피너)
export const InlineLoading: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
    }}
  >
    <Box
      sx={{
        width: size * 0.8,
        height: size * 0.8,
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #FFAAA5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
  </Box>
); 