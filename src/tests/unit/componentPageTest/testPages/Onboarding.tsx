import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/base/Button';
import AppLayout from '@/components/layout/AppLayout';
import React from 'react';
import PurposeSelect from '@/components/onboarding/PurposeSelect';

function Onboarding() {
  return (
    <>
      <AppLayout>
        <PageWrapper enableClick={true}>
          <PurposeSelect onSelect={() => {}} />
        </PageWrapper>
      </AppLayout>
    </>
  );
}

export default Onboarding;
