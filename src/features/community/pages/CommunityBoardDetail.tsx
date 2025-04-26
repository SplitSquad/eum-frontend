import React from 'react';
import Grid from '@/components/layout/Grid';
import CommunityCard from '@/components/cards/ComunityCard';
import { formatDate } from '@/shared/utils/dateUtils/FormatDate';

function CommunityBoardDetail() {
  return (
    <Grid cols="grid-cols-1" gap="gap-y-4">
      {formattedPosts.map(post => (
        <CommunityCard key={post.postId} defaultLink="/community/board" {...post} />
      ))}
    </Grid>
  );
}

export default CommunityBoardDetail;
