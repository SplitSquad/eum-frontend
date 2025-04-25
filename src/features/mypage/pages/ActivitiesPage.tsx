import React, { useState } from 'react';
import { PageLayout, InfoCard } from '../components';
import styled from '@emotion/styled';

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
  border-bottom: 2px solid ${props => props.active ? '#FF9999' : 'transparent'};
  color: ${props => props.active ? '#333' : '#777'};
  font-weight: ${props => props.active ? '600' : '400'};
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
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #FFF0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  
  svg {
    width: 18px;
    height: 18px;
    color: #FF9999;
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

const ActivityLink = styled.a`
  color: #FF9999;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'bookmark';
  title: string;
  description: string;
  date: string;
  link: string;
}

/**
 * 마이페이지 - 활동 내역 페이지
 * 사용자의 게시물, 댓글, 좋아요, 북마크 등의 활동을 표시합니다.
 */
const ActivitiesPage: React.FC = () => {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'comments' | 'likes' | 'bookmarks'>('all');
  
  // 가상의 활동 데이터
  const activities: Activity[] = [
    {
      id: '1',
      type: 'post',
      title: '게시물 작성',
      description: '첫 번째 게시물을 작성했습니다: "리액트 커스텀 훅 사용법"',
      date: '2023-06-15 10:30',
      link: '/community/posts/1',
    },
    {
      id: '2',
      type: 'comment',
      title: '댓글 작성',
      description: '"타입스크립트 팁" 게시물에 댓글을 남겼습니다.',
      date: '2023-06-14 15:45',
      link: '/community/posts/2#comment-3',
    },
    {
      id: '3',
      type: 'like',
      title: '게시물 좋아요',
      description: '"자바스크립트 최신 기능" 게시물에 좋아요를 눌렀습니다.',
      date: '2023-06-13 09:20',
      link: '/community/posts/3',
    },
    {
      id: '4',
      type: 'bookmark',
      title: '게시물 북마크',
      description: '"Next.js 시작하기" 게시물을 북마크했습니다.',
      date: '2023-06-12 17:10',
      link: '/community/posts/4',
    },
    {
      id: '5',
      type: 'post',
      title: '게시물 작성',
      description: '두 번째 게시물을 작성했습니다: "CSS Grid 레이아웃 예제"',
      date: '2023-06-10 11:15',
      link: '/community/posts/5',
    },
  ];
  
  // 필터링된 활동
  const filteredActivities = activeTab === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeTab.slice(0, -1)); // 's'를 제거 (posts -> post)
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };
  
  // 아이콘 렌더링 함수
  const renderIcon = (type: Activity['type']) => {
    switch (type) {
      case 'post':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
        );
      case 'comment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
          </svg>
        );
      case 'like':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        );
      case 'bookmark':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout title="활동 내역">
      <PageContainer>
        <TabContainer>
          <Tab 
            active={activeTab === 'all'} 
            onClick={() => handleTabChange('all')}
          >
            전체
          </Tab>
          <Tab 
            active={activeTab === 'posts'} 
            onClick={() => handleTabChange('posts')}
          >
            게시물
          </Tab>
          <Tab 
            active={activeTab === 'comments'} 
            onClick={() => handleTabChange('comments')}
          >
            댓글
          </Tab>
          <Tab 
            active={activeTab === 'likes'} 
            onClick={() => handleTabChange('likes')}
          >
            좋아요
          </Tab>
          <Tab 
            active={activeTab === 'bookmarks'} 
            onClick={() => handleTabChange('bookmarks')}
          >
            북마크
          </Tab>
        </TabContainer>

        <InfoCard title={`${activeTab === 'all' ? '전체' : activeTab === 'posts' ? '게시물' : activeTab === 'comments' ? '댓글' : activeTab === 'likes' ? '좋아요' : '북마크'} 활동`}>
          {filteredActivities.length === 0 ? (
            <EmptyState>
              아직 활동 내역이 없습니다.
            </EmptyState>
          ) : (
            <ActivityList>
              {filteredActivities.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon>
                    {renderIcon(activity.type)}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityDescription>{activity.description}</ActivityDescription>
                    <ActivityMeta>
                      <ActivityDate>{activity.date}</ActivityDate>
                      <ActivityLink href={activity.link}>바로가기</ActivityLink>
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          )}
        </InfoCard>
      </PageContainer>
    </PageLayout>
  );
};

export default ActivitiesPage; 