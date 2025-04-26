import React from 'react';
import Grid from '@/components/layout/Grid';
import CommunityCard from '@/components/cards/ComunityCard';
import { formatDate } from '@/shared/utils/dateUtils/FormatDate';

export type PostItem = {
  postId: number;
  title?: string;
  views?: number;
  dislike?: number;
  like?: number;
  userName: string;
  createdAt?: string;
  defaultLink?: string;
};

type Props = {
  posts: PostItem[];
};

const CommunityBoardCard = ({ posts }: Props) => {
  // posts 의 createdAt 을 한국 로케일 + 시분까지 포함한 포맷으로 바꿔준 새 배열
  const formattedPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt
      ? formatDate(post.createdAt, 'ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : undefined,
  }));

  return (
    <Grid cols="grid-cols-1" gap="gap-y-4">
      {formattedPosts.map(post => (
        <CommunityCard key={post.postId} defaultLink="/community/board" {...post} />
      ))}
    </Grid>
  );
};

export default CommunityBoardCard;
