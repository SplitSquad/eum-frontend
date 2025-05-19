import React, { useState, useEffect } from 'react';
import { PageLayout, InfoCard } from '../components';
import styled from '@emotion/styled';
import { useAdminpageStore } from '../store/adminpageStore';
import { useDebateStore } from '../../debate/store';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { CircularProgress } from '@mui/material';
import DebateApi from '../../debate/api/debateApi';

// 스타일 컴포넌트
const PageContainer = styled.div`
  padding: 20px 0;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  font-size: 0.95rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => (props.active ? '#FF9999' : 'transparent')};
  color: ${props => (props.active ? '#333' : '#777')};
  font-weight: ${props => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #777;
  font-size: 0.95rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #ff9999;
  }
`;

const ActivityContent = styled.div`
  flex-grow: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.95rem;
`;

const ActivityDescription = styled.div`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 8px;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #888;
  font-size: 0.8rem;
`;

const ActivityDate = styled.span``;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

// ActivityItem 타입 선언 (실제 사용하는 속성만 포함)
type ActivityItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  onClick: () => void;
};

/**
 * 마이페이지 - 활동 내역 페이지
 * 사용자의 게시물, 댓글, 좋아요, 북마크 등의 활동을 표시합니다.
 */
const CommunityManagePage: React.FC = () => {
  return 'Community Manage Page';
};

export default CommunityManagePage;
