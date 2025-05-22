import React from 'react';
import LegacyAppLayout from '@/components/layout/LegacyAppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import CustomGrid from '@/components/layout/CustomGrid';

function CommunityGroupDetail() {
  return (
    <>
      <LegacyAppLayout>
        <PageWrapper>
          <Container as="section">community 소모임 게시판 section 체크</Container>
          <CustomGrid cols="grid-cols-2 md:grid-cols-4" gap="gap-x-6 gap-y-10">
            <div className="bg-white p-4 shadow rounded">Item 1</div>
            <div className="bg-white p-4 shadow rounded">Item 2</div>
            <div className="bg-white p-4 shadow rounded">Item 3</div>
            <div className="bg-white p-4 shadow rounded">Item 4</div>
          </CustomGrid>
        </PageWrapper>
      </LegacyAppLayout>
    </>
  );
}

export default CommunityGroupDetail;
