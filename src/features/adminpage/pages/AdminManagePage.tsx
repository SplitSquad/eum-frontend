import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components';
import styled from '@emotion/styled';
import LogoutButton from '../../auth/components/LogoutButton';
import AdminManagementTable from '../components/AdminManagementTable';
import { useAdminpageStore } from '../store/adminpageStore';
import USER from '../dummy_data/user';

/**
 * 관리자페이지
 * 사용자에게 권한을 부여할 수 있는 페이지입니다.
 */
const AdminManagePage: React.FC = () => {
  const { userList, fetchUser } = useAdminpageStore();

  useEffect(() => {
    console.log('[Render]관리자등록 페이지 렌더링');
    fetchUser();
  }, [fetchUser]);

  return (
    <PageLayout title="관리자페이지">
      <AdminManagementTable user={userList || []} />
    </PageLayout>
  );
};

export default AdminManagePage;
