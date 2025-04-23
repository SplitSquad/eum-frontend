import React, { Suspense } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import PostListPage from '@/features/community/pages/PostListPage';
import { AuthGuard } from '@/routes/guards';
import LoadingFallback from '@/pages/Loading';

const Community: React.FC = () => {
  return (
    <PageWrapper>
      <Container as="section">
        <Suspense fallback={<LoadingFallback />}>
          <AuthGuard>
            <PostListPage />
          </AuthGuard>
        </Suspense>
      </Container>
    </PageWrapper>
  );
};

export default Community;
