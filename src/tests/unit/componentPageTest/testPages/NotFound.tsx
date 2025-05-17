import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/base/Button';
import AppLayout from '@/components/layout/AppLayout';
import React from 'react';

function NotFound() {
  return (
    <>
      <AppLayout>
        <PageWrapper enableClick={true}>
          <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">
              죄송합니다. 요청하신 페이지가 존재하지 않습니다.
            </p>
          </div>
        </PageWrapper>
      </AppLayout>
    </>
  );
}

export default NotFound;
