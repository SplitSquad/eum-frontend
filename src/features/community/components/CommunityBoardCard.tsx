import React from 'react';
import Grid from '@/components/layout/Grid';
import CommunityCard from '@/components/cards/ComunityCard';

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
  return (
    <Grid cols="grid-cols-1" gap="gap-y-4">
      {posts.map(post => (
        <CommunityCard defaultLink={'/community/board'} key={post.postId} {...post} />
      ))}
    </Grid>
  );
};

export default CommunityBoardCard;
