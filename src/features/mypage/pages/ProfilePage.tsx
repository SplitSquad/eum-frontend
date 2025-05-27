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
import { useMypageStore } from '../store/mypageStore';
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
const ProfilePage: React.FC = () => {
  const {
    profile,
    profileLoading,
    profileError,
    profileUpdateLoading,
    profileUpdateError,
    profileUpdated,
    fetchProfile,
    updateProfile,
    resetProfileUpdateStatus,
    posts,
    comments,
    debates,
    bookmarks,
    fetchMyPosts,
    fetchMyComments,
    fetchMyDebates,
    fetchMyBookmarks,
  } = useMypageStore();

  const { user } = useAuthStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'comments', 'debates', 'badges'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    introduction: '',
    country: '',
    language: '',
  });

  // 프로필 데이터 로드
  useEffect(() => {
    console.log('프로필 로드 시작, 현재 인증 사용자:', user);
    fetchProfile();

    // 사용자 활동 데이터 로드
    if (user?.userId) {
      const userId = Number(user.userId);
      fetchMyPosts(0, 5); // 최근 5개만 로드
      fetchMyComments(0, 5);
      fetchMyDebates(0, 5);
      fetchMyBookmarks(0, 5);
    }
  }, [fetchProfile, fetchMyPosts, fetchMyComments, fetchMyDebates, fetchMyBookmarks, user]);

  // 프로필 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (profile) {
      console.log('가져온 프로필 데이터:', profile);
      setFormData({
        name: profile.name,
        email: profile.email,
        introduction: profile.introduction || '',
        country: profile.country || '',
        language: profile.language || '',
      });
    }
  }, [profile]);

  // 프로필 업데이트 성공 시 편집 모드 종료 및 성공 메시지 표시
  useEffect(() => {
    if (profileUpdated) {
      setIsEditing(false);
      setShowSuccess(true);
      resetProfileUpdateStatus();
    }
  }, [profileUpdated, resetProfileUpdateStatus]);

  // 입력 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      userId: profile?.userId, // 기존 userId 유지
    });
  };

  // 편집 취소 핸들러
  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        introduction: profile.introduction || '',
        country: profile.country || '',
        language: profile.language || '',
      });
    }
    setIsEditing(false);
  };

  // 초기 로딩 상태 (데이터가 전혀 없을 때만)
  if (profileLoading === 'loading' && !profile && !user) {
    return (
      <PageLayout title="내 프로필">
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      </PageLayout>
    );
  }

  // 에러 상태
  if (profileError && profileLoading === 'error') {
    return (
      <PageLayout title="내 프로필">
        <ErrorMessage>
          <p>{profileError}</p>
          <Button onClick={() => fetchProfile()} variant="primary" className="mt-4">
            다시 시도
          </Button>
        </ErrorMessage>
      </PageLayout>
    );
  }

  // 방문 목적 표시 (여행, 유학, 취업 등)
  const visitPurpose = translateVisitPurpose(profile?.role);

  // 통계 데이터 계산
  const postsCount = posts?.totalElements || 0;
  const commentsCount = comments?.totalElements || 0;
  const debatesCount = debates?.totalElements || 0;
  const bookmarksCount = bookmarks?.totalElements || 0;
  const totalActivities = postsCount + commentsCount + debatesCount;

  // 배지 정보 - 실제 활동 기반으로 동적 생성
  const badges = [
    ...(postsCount > 0 ? [{
      id: 1,
      name: '첫 게시글',
      icon: '📝',
      description: '첫 번째 게시글을 작성했습니다!',
      unlocked: true,
    }] : []),
    ...(commentsCount >= 10 ? [{
      id: 2,
      name: '소통왕',
      icon: '💬',
      description: '10개 이상의 댓글을 작성했습니다!',
      unlocked: true,
    }] : []),
    ...(debatesCount > 0 ? [{
      id: 3,
      name: '토론 참여자',
      icon: '🗳️',
      description: '토론에 참여하여 의견을 표현했습니다!',
      unlocked: true,
    }] : []),
    ...(bookmarksCount > 0 ? [{
      id: 4,
      name: '지식 수집가',
      icon: '📚',
      description: '첫 번째 북마크를 추가했습니다!',
      unlocked: true,
    }] : []),
    ...(totalActivities >= 10 ? [{
      id: 5,
      name: '활발한 활동가',
      icon: '🌟',
      description: '10개 이상의 활동을 완료했습니다!',
      unlocked: true,
    }] : []),
  ];

  // 사용자 레벨 계산 (임시 로직)
  const userLevel = Math.min(Math.floor(totalActivities / 5) + 1, 10);
  const maxLevel = 10;
  const levelProgress = (userLevel / maxLevel) * 100;

  return (
    <PageLayout title="내 프로필">
      <form onSubmit={handleSubmit}>
        <ProfileSection>
          {/* 왼쪽: 프로필 카드 */}
          <ProfileCard
            profileImage={profile?.profileImage}
            name={profile?.name || ''}
            role={visitPurpose || '사용자'}
            email={profile?.email || ''}
          >
            <ProfileActions>
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={profileUpdateLoading === 'loading'}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={profileUpdateLoading === 'loading'}
                    className="ml-2"
                  >
                    {profileUpdateLoading === 'loading' ? '저장 중...' : '저장하기'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  프로필 수정
                </Button>
              )}
            </ProfileActions>

            <Box mt={2} p={2} bgcolor="#f9f9f9" borderRadius={2}>
              <Typography variant="body2" color="text.secondary" align="center">
                활동 레벨: {userLevel}/{maxLevel}
              </Typography>
              <Box
                mt={1}
                width="100%"
                height={8}
                bgcolor="#e0e0e0"
                borderRadius={4}
                overflow="hidden"
                position="relative"
              >
                <Box width={`${levelProgress}%`} height="100%" bgcolor="#FF9999" borderRadius={4} />
              </Box>
            </Box>
          </ProfileCard>

          {/* 오른쪽: 상세 정보 */}
          <InfoCard title="개인 정보">
            <ProfileInfoSection>
              <StyledFormField label="이름" htmlFor="name">
                {isEditing ? (
                  <StyledInput
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <ReadOnlyValue>{profile?.name || '이름 없음'}</ReadOnlyValue>
                )}
              </StyledFormField>

              <StyledFormField label="이메일" htmlFor="email">
                <ReadOnlyValue>{profile?.email || '이메일 없음'}</ReadOnlyValue>
              </StyledFormField>

              <StyledFormField label="자기소개" htmlFor="introduction">
                {isEditing ? (
                  <StyledTextarea
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    placeholder="자기소개를 입력하세요"
                    rows={4}
                  />
                ) : (
                  <ReadOnlyValue>{profile?.introduction || '자기소개가 없습니다.'}</ReadOnlyValue>
                )}
              </StyledFormField>

              <Box gridColumn="span 2">
                <Box display="flex" flexDirection="column" gap={1}>
                  <IconWithText>
                    <PublicIcon fontSize="small" sx={{ color: '#FF9999' }} />
                    <Typography variant="body2">
                      <strong>국가:</strong> {profile?.country || '국가 정보 없음'}
                    </Typography>
                  </IconWithText>

                  <IconWithText>
                    <TranslateIcon fontSize="small" sx={{ color: '#FF9999' }} />
                    <Typography variant="body2">
                      <strong>언어:</strong> {profile?.language || '언어 정보 없음'}
                    </Typography>
                  </IconWithText>

                  <IconWithText>
                    <CakeIcon fontSize="small" sx={{ color: '#FF9999' }} />
                    <Typography variant="body2">
                      <strong>가입일:</strong> {profile?.joinDate || '가입일 정보 없음'}
                    </Typography>
                  </IconWithText>

                  <IconWithText>
                    <TravelExploreIcon fontSize="small" sx={{ color: '#FF9999' }} />
                    <Typography variant="body2">
                      <strong>방문 목적:</strong> {visitPurpose}
                    </Typography>
                  </IconWithText>
                </Box>
              </Box>
            </ProfileInfoSection>
          </InfoCard>
        </ProfileSection>
      </form>

      {/* 활동 통계 */}
      <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 4 }}>
        활동 통계
      </Typography>
      <StatsSection>
        <StatCard>
          <StatIcon>
            <ForumIcon />
          </StatIcon>
          <StatValue>{postsCount}</StatValue>
          <StatLabel>작성한 게시글</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <ChatBubbleOutlineIcon />
          </StatIcon>
          <StatValue>{commentsCount}</StatValue>
          <StatLabel>작성한 댓글</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <HowToVoteIcon />
          </StatIcon>
          <StatValue>{debatesCount}</StatValue>
          <StatLabel>참여한 토론</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <BookmarkIcon />
          </StatIcon>
          <StatValue>{bookmarksCount}</StatValue>
          <StatLabel>저장한 북마크</StatLabel>
        </StatCard>
      </StatsSection>

      {/* 배지 섹션 */}
      <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 4 }}>
        나의 배지
      </Typography>

      {badges.length > 0 ? (
        <BadgeGrid>
          {badges.map(badge => (
            <Badge key={badge.id}>
              <BadgeIcon>{badge.icon}</BadgeIcon>
              <BadgeName>{badge.name}</BadgeName>
              <BadgeDescription>{badge.description}</BadgeDescription>
            </Badge>
          ))}
        </BadgeGrid>
      ) : (
        <NoBadge>
          <EmojiEventsIcon sx={{ fontSize: 48, color: '#ddd', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            아직 획득한 배지가 없습니다.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            활동을 통해 다양한 배지를 수집해 보세요!
          </Typography>
        </NoBadge>
      )}

      {/* 최근 활동 */}
      <ActivitySection>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          최근 활동
        </Typography>

        <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
          <Chip
            label="게시글"
            onClick={() => setActiveTab('posts')}
            color={activeTab === 'posts' ? 'primary' : 'default'}
            variant={activeTab === 'posts' ? 'filled' : 'outlined'}
          />
          <Chip
            label="댓글"
            onClick={() => setActiveTab('comments')}
            color={activeTab === 'comments' ? 'primary' : 'default'}
            variant={activeTab === 'comments' ? 'filled' : 'outlined'}
          />
          <Chip
            label="토론"
            onClick={() => setActiveTab('debates')}
            color={activeTab === 'debates' ? 'primary' : 'default'}
            variant={activeTab === 'debates' ? 'filled' : 'outlined'}
          />
        </Box>

        <ActivityContainer>
          {activeTab === 'posts' && (
            <>
              {posts?.content?.length ? (
                posts.content.map(post => (
                  <ActivityItem key={post.id}>
                    <ActivityTitle>{post.title}</ActivityTitle>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {post.content.substring(0, 100)}
                      {post.content.length > 100 ? '...' : ''}
                    </Typography>
                    <ActivityMeta>
                      <span>카테고리: {post.category}</span>
                      <span>작성일: {post.createdAt}</span>
                    </ActivityMeta>
                  </ActivityItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  작성한 게시글이 없습니다.
                </Typography>
              )}
            </>
          )}

          {activeTab === 'comments' && (
            <>
              {comments?.content?.length ? (
                comments.content.map(comment => (
                  <ActivityItem key={comment.id}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      게시글: <strong>{comment.postTitle}</strong>
                    </Typography>
                    <Typography variant="body1">{comment.content}</Typography>
                    <ActivityMeta>
                      <span>작성일: {comment.createdAt}</span>
                    </ActivityMeta>
                  </ActivityItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  작성한 댓글이 없습니다.
                </Typography>
              )}
            </>
          )}

          {activeTab === 'debates' && (
            <>
              {debates?.content?.length ? (
                debates.content.map(debate => (
                  <ActivityItem key={debate.id}>
                    <ActivityTitle>{debate.title}</ActivityTitle>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`투표: ${debate.votedOption}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <ActivityMeta>
                      <span>투표 수: {debate.totalVotes}</span>
                      <span>참여일: {debate.createdAt}</span>
                    </ActivityMeta>
                  </ActivityItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  참여한 토론이 없습니다.
                </Typography>
              )}
            </>
          )}
        </ActivityContainer>
      </ActivitySection>

      {/* 성공 메시지 표시 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          프로필이 성공적으로 업데이트되었습니다.
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default ProfilePage;
