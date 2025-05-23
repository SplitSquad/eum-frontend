import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components';
import { useAdminpageStore } from '../store/adminpageStore';
import UserManagementTable from '../components/UserManagementTable';

/**
 * 마이페이지 - 프로필 페이지
 * 사용자 프로필 정보를 표시하고 수정할 수 있습니다.
 */
const UserManagePage: React.FC = () => {
  const { userList, fetchUser } = useAdminpageStore();

  useEffect(() => {
    console.log('[Render]관리자등록 페이지 렌더링');
    fetchUser();
  }, [fetchUser]);

  return (
    <PageLayout title="유저관리페이지">
      <UserManagementTable user={userList || []} />
    </PageLayout>
  );
};

export default UserManagePage;
