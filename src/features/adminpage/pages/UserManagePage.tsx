import React, { useEffect, useState } from 'react';
import {
  PageLayout,
  ProfileCard,
  InfoCard,
  FormField,
  StyledInput,
  StyledTextarea,
  Button,
} from '../components';
import { useAdminpageStore } from '../store/adminpageStore';
import styled from '@emotion/styled';
import { useAuthStore } from '../../auth/store/authStore';
import { Alert, Snackbar, Typography, Box, Avatar, Chip, Divider, Container } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import CakeIcon from '@mui/icons-material/Cake';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

// TODO : 실제 유저 정보 및 활동 연결(유저 정보, 유저가 투표한 토론, 유저가 작성한 게시글, 유저가 작성한 댓글)

// 스타일링된 컴포넌트
const PageContainer = styled.div`
  padding: 20px 0;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ProfileActions = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const ProfileInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFormField = styled(FormField)`
  margin-bottom: 16px;
`;

const ReadOnlyValue = styled.div`
  padding: 12px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: #f9f9f9;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #ff9999;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #e53e3e;
  margin: 20px 0;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd1d1 0%, #ff9999 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 4px 0;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ActivitySection = styled.div`
  margin-top: 32px;
`;

const ActivityContainer = styled.div`
  margin-top: 16px;
`;

const ActivityItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
  margin-top: 8px;
`;

const NoBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  color: #999;
  text-align: center;
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const BadgeIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #ff9999;
  font-size: 32px;
`;

const BadgeName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
`;

const BadgeDescription = styled.div`
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  margin-top: 4px;
`;

const IconWithText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

// 방문 목적에 따른 한국어 변환 함수
const translateVisitPurpose = (purpose?: string): string => {
  if (!purpose) return '미지정';

  const purposeMap: Record<string, string> = {
    travel: '여행',
    study: '유학',
    work: '취업',
    living: '거주',
    business: '사업',
    other: '기타',
  };

  return purposeMap[purpose] || purpose;
};

/**
 * 마이페이지 - 프로필 페이지
 * 사용자 프로필 정보를 표시하고 수정할 수 있습니다.
 */
const UserManagePage: React.FC = () => {
  return 'User Manage Page';
};

export default UserManagePage;
