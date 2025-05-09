import React, { useState, useEffect } from 'react';
import { PageLayout, InfoCard } from '../components';
import styled from '@emotion/styled';
import { useMypageStore } from '../store/mypageStore';
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

/**
 * 마이페이지 - 활동 내역 페이지
 * 사용자의 게시물, 댓글, 좋아요, 북마크 등의 활동을 표시합니다.
 */
const ActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId ? Number(user.userId) : 0;

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<
    'all' | 'posts' | 'comments' | 'debates' | 'bookmarks'
  >('all');

  // Store에서 데이터 가져오기
  const {
    posts,
    comments,
    bookmarks,
    debates,
    fetchMyPosts,
    fetchMyComments,
    fetchMyDebates,
    fetchMyBookmarks,
    postsLoading,
    commentsLoading,
    debatesLoading,
    bookmarksLoading,
  } = useMypageStore();

  // 로그인 상태 확인
  useEffect(() => {
    console.log('[AUTH] 인증 상태:', isAuthenticated);
    console.log('[AUTH] 사용자 정보:', user);
    console.log('[AUTH] 사용자 ID:', userId);

    // 로컬 스토리지에서 토큰 확인 (디버깅용)
    const token = localStorage.getItem('auth_token');
    console.log('[AUTH] 토큰 존재 여부:', token ? '있음' : '없음');
    if (token) {
      console.log('[AUTH] 토큰 일부:', token.substring(0, 15) + '...');
    }
  }, [isAuthenticated, user, userId]);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        console.log('[AUTH] 인증되지 않은 사용자입니다. 데이터를 불러오지 않습니다.');
        return;
      }

      if (!user) {
        console.log('[AUTH] 사용자 정보가 없습니다. 데이터를 불러오지 않습니다.');
        return;
      }

      if (userId <= 0) {
        console.error('[ERROR] 사용자 ID가 유효하지 않습니다:', userId);
        return;
      }

      console.log('[DEBUG] 활동 내역 데이터 로딩 시작, 사용자 ID:', userId);

      // 현재 탭 또는 전체 탭이 선택되었을 때만 해당 데이터 로드
      if (activeTab === 'all' || activeTab === 'posts') {
        console.log('[DEBUG] 내 게시글 데이터 로딩 시작');
        fetchMyPosts();
      }

      if (activeTab === 'all' || activeTab === 'comments') {
        console.log('[DEBUG] 내 댓글 데이터 로딩 시작');
        fetchMyComments();
      }

      if (activeTab === 'all' || activeTab === 'debates') {
        console.log('[DEBUG] 내 토론 데이터 로딩 시작');
        try {
          fetchMyDebates();
          // 백업으로 직접 API 호출
          console.log('[DEBUG] 직접 토론 API 호출 시도');
          const response = await DebateApi.getVotedDebates(userId);
          console.log('[DEBUG] 직접 토론 API 응답:', response);
        } catch (error) {
          console.error('[ERROR] 토론 데이터 로딩 실패:', error);
        }
      }

      if (activeTab === 'all' || activeTab === 'bookmarks') {
        console.log('[DEBUG] 내 북마크 데이터 로딩 시작');
        fetchMyBookmarks();
      }
    };

    loadData();
  }, [
    userId,
    activeTab,
    fetchMyPosts,
    fetchMyComments,
    fetchMyBookmarks,
    fetchMyDebates,
    isAuthenticated,
    user,
  ]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  // 아이콘 렌더링 함수
  const renderIcon = (type: string) => {
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
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'debate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
        );
      case 'bookmark':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // 로딩 상태 확인
  const isLoading = () => {
    if (activeTab === 'all') {
      return (
        postsLoading === 'loading' ||
        commentsLoading === 'loading' ||
        debatesLoading === 'loading' ||
        bookmarksLoading === 'loading'
      );
    } else if (activeTab === 'posts') {
      return postsLoading === 'loading';
    } else if (activeTab === 'comments') {
      return commentsLoading === 'loading';
    } else if (activeTab === 'debates') {
      return debatesLoading === 'loading';
    } else if (activeTab === 'bookmarks') {
      return bookmarksLoading === 'loading';
    }
    return false;
  };

  // 활동 항목 클릭 핸들러
  const handleActivityClick = (type: string, id: number) => {
    if (type === 'post') {
      navigate(`/community/${id}`);
    } else if (type === 'comment') {
      navigate(`/community/${id}`); // 실제로는 해당 댓글이 있는 게시글로 이동
    } else if (type === 'debate') {
      navigate(`/debate/${id}`);
    } else if (type === 'bookmark') {
      navigate(`/info/${id}`); // 북마크된 정보글로 이동
    }
  };

  // 활동 목록 생성
  const getActivities = () => {
    const allActivities = [];

    // 게시글 활동
    if ((activeTab === 'all' || activeTab === 'posts') && posts?.content) {
      console.log('[DEBUG] 게시글 활동 데이터:', posts.content);
      const postActivities = posts.content.map(post => ({
        id: post.id || 0, // 타입에 맞게 수정
        type: 'post',
        title: '게시물 작성',
        description: post.title || '', // 타입에 맞게 수정
        date: post.createdAt || '',
        onClick: () => handleActivityClick('post', post.id || 0),
      }));
      allActivities.push(...postActivities);
    }

    // 댓글 활동
    if ((activeTab === 'all' || activeTab === 'comments') && comments?.content) {
      console.log('[DEBUG] 댓글 활동 데이터:', comments.content);
      const commentActivities = comments.content.map(comment => ({
        id: comment.postId || 0, // 타입에 맞게 수정
        type: 'comment',
        title: '댓글 작성',
        description: `${comment.postTitle || ''}: ${comment.content || ''}`, // 타입에 맞게 수정
        date: comment.createdAt || '',
        onClick: () => handleActivityClick('comment', comment.postId || 0),
      }));
      allActivities.push(...commentActivities);
    }

    // 토론 투표 활동
    if ((activeTab === 'all' || activeTab === 'debates') && debates?.content) {
      console.log('[DEBUG] 토론 활동 데이터:', debates.content);
      const debateActivities = debates.content.map(debate => ({
        id: debate.id || 0,
        type: 'debate',
        title: '토론 참여',
        description: debate.title || '',
        date: debate.createdAt || '',
        onClick: () => handleActivityClick('debate', debate.id || 0),
      }));
      allActivities.push(...debateActivities);
    }

    // 북마크 활동
    if ((activeTab === 'all' || activeTab === 'bookmarks') && bookmarks?.content) {
      console.log('[DEBUG] 북마크 활동 데이터:', bookmarks.content);
      const bookmarkActivities = bookmarks.content.map(bookmark => ({
        id: bookmark.id || 0,
        type: 'bookmark',
        title: '북마크 추가',
        description: bookmark.title || '',
        date: bookmark.createdAt || '',
        onClick: () => handleActivityClick('bookmark', bookmark.id || 0),
      }));
      allActivities.push(...bookmarkActivities);
    }

    // 날짜순으로 정렬 (최신순)
    return allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const activities = getActivities();

  return (
    <PageLayout title="활동 내역">
      <PageContainer>
        <TabContainer>
          <Tab active={activeTab === 'all'} onClick={() => handleTabChange('all')}>
            전체
          </Tab>
          <Tab active={activeTab === 'posts'} onClick={() => handleTabChange('posts')}>
            게시물
          </Tab>
          <Tab active={activeTab === 'comments'} onClick={() => handleTabChange('comments')}>
            댓글
          </Tab>
          <Tab active={activeTab === 'debates'} onClick={() => handleTabChange('debates')}>
            토론
          </Tab>
          <Tab active={activeTab === 'bookmarks'} onClick={() => handleTabChange('bookmarks')}>
            북마크
          </Tab>
        </TabContainer>

        <InfoCard
          title={`${activeTab === 'all' ? '전체' : activeTab === 'posts' ? '게시물' : activeTab === 'comments' ? '댓글' : activeTab === 'debates' ? '토론' : '북마크'} 활동`}
        >
          {isLoading() ? (
            <LoadingContainer>
              <CircularProgress size={30} />
            </LoadingContainer>
          ) : activities.length === 0 ? (
            <EmptyState>아직 활동 내역이 없습니다.</EmptyState>
          ) : (
            <ActivityList>
              {activities.map((activity, index) => (
                <ActivityItem
                  key={`${activity.type}-${activity.id}-${index}`}
                  onClick={activity.onClick}
                >
                  <ActivityIcon>{renderIcon(activity.type)}</ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityDescription>{activity.description}</ActivityDescription>
                    <ActivityMeta>
                      <ActivityDate>{activity.date}</ActivityDate>
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
