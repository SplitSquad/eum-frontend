import React, { useState, useEffect } from 'react';
import { PageLayout, InfoCard } from '../components';
import styled from '@emotion/styled';
import { useMypageStore } from '../store/mypageStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { CircularProgress, Pagination } from '@mui/material';
import DebateApi from '../../debate/api/debateApi';
import { useTranslation } from '@/shared/i18n';

//리스폰스 타입 정의
interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  onClick: () => void;
}
// 스타일 컴포넌트
const PageContainer = styled.div`
  padding: 20px 0;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  font-size: 0.95rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => (props.active ? '#fafafa' : 'transparent')};
  color: ${props => (props.active ? '#222' : '#555')};
  font-weight: ${props => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    color: #333;
    transform: translateY(-1px);
    background-color: rgba(255, 153, 153, 0.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ff9999;
    transform: scaleX(${props => (props.active ? 1 : 0)});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  /* 호버 시 밑줄 미리보기 */
  &:hover::after {
    transform: scaleX(${props => (props.active ? 1 : 0.3)});
    opacity: ${props => (props.active ? 1 : 0.5)};
  }

  /* 클릭 시 리플 효과 */
  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #555;
  font-size: 0.95rem;
  opacity: 0;
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 콘텐츠 전환을 위한 애니메이션 래퍼
const ContentWrapper = styled.div<{ isVisible: boolean; delay?: number }>`
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: ${props => (props.isVisible ? 'translateY(0)' : 'translateY(10px)')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.delay || 0}ms;
  will-change: opacity, transform;

  /* 콘텐츠가 사라질 때는 더 빠르게 */
  ${props =>
    !props.isVisible &&
    `
    transition-duration: 0.2s;
  `}
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div<{ animationDelay?: number }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  opacity: 0;
  transform: translateY(15px);
  animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${props => props.animationDelay || 0}ms;

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 탭 전환 시 부드러운 재시작을 위한 애니메이션 */
  &.tab-enter {
    animation: tabEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: ${props => props.animationDelay || 0}ms;
  }

  @keyframes tabEnter {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    /* 호버 시 아이콘 배경색 변경 */
    .activity-icon {
      background-color: #ffe6e6;

      svg {
        transform: scale(1.05);
      }
    }

    /* 호버 시 제목 색상 변경 */
    .activity-title {
      color: #ff9999;
    }
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
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #ff9999;
    transition: transform 0.3s ease;
  }
`;

const ActivityContent = styled.div`
  flex-grow: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.95rem;
  transition: color 0.3s ease;
`;

const ActivityDescription = styled.div`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

  .MuiCircularProgress-root {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 페이지네이션 컨테이너
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

// 활동 개수 정보 표시
const ActivityCountInfo = styled.div`
  text-align: center;
  margin-top: 12px;
  color: #888;
  font-size: 0.8rem;
  opacity: 0;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 200ms;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
const ActivitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId ? Number(user.userId) : 0;

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<
    'all' | 'posts' | 'comments' | 'debates' | 'bookmarks'
  >('all');

  // 통합 로딩 상태 관리 (깜빡임 방지)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // 탭 전환 애니메이션을 위한 상태
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 페이지네이션 상태 (각 탭별로 독립적인 페이지)
  const [currentPages, setCurrentPages] = useState({
    all: 1,
    posts: 1,
    comments: 1,
    debates: 1,
    bookmarks: 1,
  });

  const itemsPerPage = 5; // 페이지당 5개 아이템

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

  // 데이터 불러오기 - 최적화된 단일 useEffect
  useEffect(() => {
    const initializeData = async () => {
      if (!isAuthenticated || !user?.userId || userId <= 0) {
        console.log('[AUTH] 인증 정보 없음 - 로딩 종료');
        setIsInitialLoading(false);
        return;
      }

      try {
        console.log('[DEBUG] 활동 내역 데이터 로딩 시작, 사용자 ID:', userId);

        // 모든 활동 데이터를 동시에 로드
        const dataPromises = [
          fetchMyPosts(0, 5),
          fetchMyComments(0, 5),
          fetchMyDebates(0, 5),
          fetchMyBookmarks(0, 5),
        ];

        await Promise.allSettled(dataPromises);

        console.log('[DEBUG] 모든 활동 데이터 로딩 완료');
      } catch (error) {
        console.error('[ERROR] 활동 데이터 로딩 실패:', error);
      } finally {
        setIsInitialLoading(false);
        // 부드러운 등장을 위한 지연
        setTimeout(() => {
          setContentReady(true);
          setIsContentVisible(true);
        }, 60);
      }
    };

    initializeData();
  }, [
    isAuthenticated,
    user?.userId,
    userId,
    fetchMyPosts,
    fetchMyComments,
    fetchMyDebates,
    fetchMyBookmarks,
  ]);

  // 탭 변경 핸들러 - 부드러운 전환 애니메이션
  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === activeTab) return;

    setIsTransitioning(true);
    setIsContentVisible(false);

    // 콘텐츠가 사라진 후 탭 변경
    setTimeout(() => {
      setActiveTab(tab);
      // 탭 변경 시 해당 탭의 페이지를 1페이지로 리셋
      setCurrentPages(prev => ({
        ...prev,
        [tab]: 1,
      }));
      // 새 콘텐츠 표시
      setTimeout(() => {
        setIsContentVisible(true);
        setIsTransitioning(false);
      }, 30); // 더 빠른 전환
    }, 150); // 사라지는 시간 단축
  };

  // 페이지 변경 핸들러 - 서버 측 페이지네이션으로 변경
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [activeTab]: value,
    }));

    // 페이지 변경 시 부드러운 전환
    setIsContentVisible(false);
    
    // 해당 탭의 데이터를 서버에서 새로 가져오기 (페이지는 0-based)
    const pageToFetch = value - 1;
    
    setTimeout(async () => {
      try {
        if (activeTab === 'posts') {
          await fetchMyPosts(pageToFetch, itemsPerPage);
        } else if (activeTab === 'comments') {
          await fetchMyComments(pageToFetch, itemsPerPage);
        } else if (activeTab === 'debates') {
          await fetchMyDebates(pageToFetch, itemsPerPage);
        } else if (activeTab === 'bookmarks') {
          await fetchMyBookmarks(pageToFetch, itemsPerPage);
        } else if (activeTab === 'all') {
          // 전체 탭인 경우 모든 데이터의 해당 페이지를 가져오기
          await Promise.all([
            fetchMyPosts(pageToFetch, itemsPerPage),
            fetchMyComments(pageToFetch, itemsPerPage),
            fetchMyDebates(pageToFetch, itemsPerPage),
            fetchMyBookmarks(pageToFetch, itemsPerPage),
          ]);
        }
      } catch (error) {
        console.error('페이지 데이터 로딩 실패:', error);
      } finally {
      setIsContentVisible(true);
      }
    }, 100);
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
    if (isTransitioning) return true; // 전환 중일 때도 로딩으로 처리

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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      // YYYY.MM.DD HH:mm 형식으로 표시
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch (error) {
      // 날짜 파싱 실패 시 원본 문자열의 앞부분만 표시
      return dateString.split('T')[0] || dateString.substring(0, 10);
    }
  };

  // 활동 목록 생성 - 서버 페이지네이션 데이터 직접 사용
  const getActivities = () => {
    let activities: ActivityItem[] = [];
    let totalPages = 1;
    let totalElements = 0;

    if (activeTab === 'posts' && posts?.content) {
      activities = posts.content.map(post => ({
        id: post.id || 0,
        type: 'post',
        title: t('ActivitiesPage.post'),
        description: post.title || '',
        date: post.createdAt || '',
        onClick: () => handleActivityClick('post', post.id || 0),
      }));
      totalPages = posts.totalPages || 1;
      totalElements = posts.totalElements || 0;
    } else if (activeTab === 'comments' && comments?.content) {
      activities = comments.content.map(comment => ({
        id: comment.postId || 0,
        type: 'comment',
        title: t('ActivitiesPage.comment'),
        description: `${comment.postTitle || ''}: ${comment.content || ''}`,
        date: comment.createdAt || '',
        onClick: () => handleActivityClick('comment', comment.postId || 0),
      }));
      totalPages = comments.totalPages || 1;
      totalElements = comments.totalElements || 0;
    } else if (activeTab === 'debates' && debates?.content) {
      activities = debates.content.map(debate => ({
        id: debate.id || 0,
        type: 'debate',
        title: t('ActivitiesPage.debate'),
        description: debate.title || '',
        date: debate.createdAt || '',
        onClick: () => handleActivityClick('debate', debate.id || 0),
      }));
      totalPages = debates.totalPages || 1;
      totalElements = debates.totalElements || 0;
    } else if (activeTab === 'bookmarks' && bookmarks?.content) {
      activities = bookmarks.content.map(bookmark => ({
        id: bookmark.id || 0,
        type: 'bookmark',
        title: t('ActivitiesPage.bookmark'),
        description: bookmark.title || '',
        date: bookmark.createdAt || '',
        onClick: () => handleActivityClick('bookmark', bookmark.id || 0),
      }));
      totalPages = bookmarks.totalPages || 1;
      totalElements = bookmarks.totalElements || 0;
    } else if (activeTab === 'all') {
      // 전체 탭의 경우 모든 활동을 합쳐서 표시
      const allActivities: ActivityItem[] = [];

      if (posts?.content) {
        const postActivities = posts.content.map(post => ({
          id: post.id || 0,
          type: 'post',
          title: t('ActivitiesPage.post'),
          description: post.title || '',
          date: post.createdAt || '',
          onClick: () => handleActivityClick('post', post.id || 0),
        }));
        allActivities.push(...postActivities);
      }

      if (comments?.content) {
        const commentActivities = comments.content.map(comment => ({
          id: comment.postId || 0,
          type: 'comment',
          title: t('ActivitiesPage.comment'),
          description: `${comment.postTitle || ''}: ${comment.content || ''}`,
          date: comment.createdAt || '',
          onClick: () => handleActivityClick('comment', comment.postId || 0),
        }));
        allActivities.push(...commentActivities);
      }

      if (debates?.content) {
      const debateActivities = debates.content.map(debate => ({
        id: debate.id || 0,
        type: 'debate',
        title: t('ActivitiesPage.debate'),
        description: debate.title || '',
        date: debate.createdAt || '',
        onClick: () => handleActivityClick('debate', debate.id || 0),
      }));
      allActivities.push(...debateActivities);
    }

      if (bookmarks?.content) {
      const bookmarkActivities = bookmarks.content.map(bookmark => ({
        id: bookmark.id || 0,
        type: 'bookmark',
        title: t('ActivitiesPage.bookmark'),
        description: bookmark.title || '',
        date: bookmark.createdAt || '',
        onClick: () => handleActivityClick('bookmark', bookmark.id || 0),
      }));
      allActivities.push(...bookmarkActivities);
    }

      // 전체 탭에서는 날짜순 정렬 후 현재 페이지만큼 잘라서 표시
    const sortedActivities = allActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentPage = currentPages[activeTab];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

      activities = sortedActivities.slice(startIndex, endIndex);
      totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
      
      // 실제 totalElements의 합계 사용 (클라이언트 데이터 개수가 아닌)
      const actualTotalElements = 
        (posts?.totalElements || 0) + 
        (comments?.totalElements || 0) + 
        (debates?.totalElements || 0) + 
        (bookmarks?.totalElements || 0);
      
      // 디버깅을 위한 로그 추가
      console.log('📊 활동 페이지 전체 탭 통계:', {
        postsTotal: posts?.totalElements || 0,
        commentsTotal: comments?.totalElements || 0,
        debatesTotal: debates?.totalElements || 0,
        bookmarksTotal: bookmarks?.totalElements || 0,
        actualTotalElements,
        currentDisplayedItems: sortedActivities.length
      });
      
      totalElements = actualTotalElements;
      
      // 페이지 계산도 실제 전체 개수 기준으로 수정
      totalPages = Math.ceil(actualTotalElements / itemsPerPage);
    }

    return {
      activities,
      totalPages,
      totalItems: totalElements,
    };
  };

  const { activities, totalPages, totalItems } = getActivities();

  // 통합 로딩 상태 처리 (깜빡임 방지)
  if (isInitialLoading) {
    return (
      <PageLayout title={t('ActivitiesPage.activitylist')}>
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('ActivitiesPage.activitylist')}>
      {/* 부드러운 등장 효과를 위한 컨테이너 */}
      <PageContainer
        style={{
          opacity: contentReady ? 1 : 0,
          transform: contentReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <TabContainer>
          <Tab active={activeTab === 'all'} onClick={() => handleTabChange('all')}>
          {t('ActivitiesPage.listall')}
          </Tab>
          <Tab active={activeTab === 'posts'} onClick={() => handleTabChange('posts')}>
          {t('ActivitiesPage.listpost')}
          </Tab>
          <Tab active={activeTab === 'comments'} onClick={() => handleTabChange('comments')}>
          {t('ActivitiesPage.listcomment')}
          </Tab>
          <Tab active={activeTab === 'debates'} onClick={() => handleTabChange('debates')}>
          {t('ActivitiesPage.listdebate')}
          </Tab>
          <Tab active={activeTab === 'bookmarks'} onClick={() => handleTabChange('bookmarks')}>
          {t('ActivitiesPage.listbookmark')}
          </Tab>
        </TabContainer>

        <InfoCard
          title={`${activeTab === 'all' ? t('ActivitiesPage.infoall') : activeTab === 'posts' ? t('ActivitiesPage.infopost') : activeTab === 'comments' ? t('ActivitiesPage.infocomment') : activeTab === t('ActivitiesPage.infodebate') ? '토론' : t('ActivitiesPage.infobookmark')} ${t('ActivitiesPage.infoactivity')}`}
        >
          <ContentWrapper isVisible={isContentVisible}>
            {/* 탭 변경 시에는 개별 로딩, 초기 로딩은 통합 처리됨 */}
            {!contentReady || isLoading() ? (
              <LoadingContainer>
                <CircularProgress size={30} />
              </LoadingContainer>
            ) : activities.length === 0 ? (
              <EmptyState>{t('ActivitiesPage.noactivity')}</EmptyState>
            ) : (
              <>
                {/* 활동 목록 */}
                <ActivityList>
                  {activities.map((activity, index) => (
                    <ActivityItem
                      key={`${activity.type}-${activity.id}-${index}-${activeTab}`} // 탭별로 고유 키 생성
                      onClick={activity.onClick}
                      animationDelay={index * 30} // 순차적 등장 효과 간격 대폭 단축
                      className={isContentVisible ? 'tab-enter' : ''}
                      style={{
                        // 탭 전환 시 리셋을 위한 애니메이션
                        animationName: isContentVisible ? 'tabEnter' : 'none',
                      }}
                    >
                      <ActivityIcon className="activity-icon">
                        {renderIcon(activity.type)}
                      </ActivityIcon>
                      <ActivityContent>
                        <ActivityTitle className="activity-title">{activity.title}</ActivityTitle>
                        <ActivityDescription>{activity.description}</ActivityDescription>
                        <ActivityMeta>
                          <ActivityDate>{formatDate(activity.date)}</ActivityDate>
                        </ActivityMeta>
                      </ActivityContent>
                    </ActivityItem>
                  ))}
                </ActivityList>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <PaginationContainer>
                    <Pagination
                      count={totalPages}
                      page={currentPages[activeTab]}
                      onChange={handlePageChange}
                      color="primary"
                      size="medium"
                      showFirstButton
                      showLastButton
                      disabled={isTransitioning}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: '#666',
                          '&.Mui-selected': {
                            backgroundColor: '#FF9999',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: '#e88888',
                            },
                          },
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        },
                      }}
                    />
                  </PaginationContainer>
                )}

                {/* 활동 개수 정보 */}
                {totalItems > 0 && (
                  <ActivityCountInfo>
                    {t('ActivitiesPage.count1')} {totalItems}{t('ActivitiesPage.count2')} {(currentPages[activeTab] - 1) * itemsPerPage + 1}~
                    {Math.min(currentPages[activeTab] * itemsPerPage, totalItems)}{t('ActivitiesPage.count3')}
                  </ActivityCountInfo>
                )}
              </>
            )}
          </ContentWrapper>
        </InfoCard>
      </PageContainer>
    </PageLayout>
  );
};

export default ActivitiesPage;
