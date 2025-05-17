import React from 'react';
import CommunityCard from '@/components/cards/ComunityCard';
import Grid from '@/components/layout/Grid';

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

const CommunityGroupCard = ({ posts }: Props) => {
  return (
    <Grid cols="grid-cols-3" gap="gap-y-4">
      {posts.map(post => (
        <CommunityCard defaultLink={'/community/groups'} key={post.postId} {...post} />
      ))}
    </Grid>
  );
};

export default CommunityGroupCard;
