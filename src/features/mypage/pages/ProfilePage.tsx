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
import { uploadProfileImage, deleteProfileImage } from '../api';
import styled from '@emotion/styled';
import { useAuthStore } from '../../auth/store/authStore';
import { Typography, Box, Avatar, Chip, Divider, Container } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import CakeIcon from '@mui/icons-material/Cake';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from '@/shared/i18n';


// TODO : 실제 유저 정보 및 활동 연결(유저 정보, 유저가 투표한 토론, 유저가 작성한 게시글, 유저가 작성한 댓글)

// 스타일링된 컴포넌트
const PageContainer = styled.div`
  padding: 20px 0;
  position: relative;
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
  border-top-color: #888;
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
  color: #888;
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
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #555;
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
  color: #888;
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

  svg {
    color: #888 !important;
  }
`;

// 새로운 토스트 알림 스타일
const ToastNotification = styled.div<{ show: boolean; type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props =>
    props.type === 'success'
      ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
      : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'};
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  opacity: ${props => (props.show ? 1 : 0)};
  transform: ${props => (props.show ? 'translateX(0) scale(1)' : 'translateX(100px) scale(0.95)')};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// 방문 목적에 따른 한국어 변환 함수
const translateVisitPurpose = (purpose?: string): string => {
  const { t } = useTranslation();
  if (!purpose) return t('mypage.myprofile.novistpurpose');

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
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'comments', 'debates', 'badges'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    introduction: '',
    country: '',
    language: '',
  });

  // 통합 로딩 상태 관리 (깜빡임 방지)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 통합 알림 상태
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // 통합 알림 함수
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    // 3초 후 자동으로 숨김
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 프로필 데이터 로드 - 최적화된 단일 useEffect
  useEffect(() => {
    const initializeData = async () => {
      if (!user?.userId) {
        setIsInitialLoading(false);
        return;
      }

      try {
        // 동시에 모든 데이터 로드
        const dataPromises = [
          fetchProfile(),
          fetchMyPosts(0, 5),
          fetchMyComments(0, 5),
          fetchMyDebates(0, 5),
          fetchMyBookmarks(0, 5),
        ];

        // 모든 데이터 로딩 완료까지 대기
        await Promise.allSettled(dataPromises);

        // 약간의 지연 후 부드럽게 표시
        setTimeout(() => {
          setContentReady(true);
          setIsInitialLoading(false);
        }, 100);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setIsInitialLoading(false);
      }
    };

    initializeData();
  }, [user?.userId, fetchProfile, fetchMyPosts, fetchMyComments, fetchMyDebates, fetchMyBookmarks]);

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

      // auth store의 사용자 정보도 업데이트 (헤더 프로필 이미지 반영용)
      const { setUser, user } = useAuthStore.getState();
      if (user) {
        const updatedUser = {
          ...user,
          name: profile.name,
          profileImagePath: profile.profileImage,
        };
        setUser(updatedUser);
      }
    }
  }, [profile]);

  // 프로필 업데이트 성공 시 편집 모드 종료 및 성공 메시지 표시
  useEffect(() => {
    if (profileUpdated) {
      setIsEditing(false);
      showNotification('프로필이 성공적으로 업데이트되었습니다! 🎉', 'success');
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

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file: File) => {
    setIsImageLoading(true);
    try {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        showNotification(t('mypage.imagesize'), 'error');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        showNotification(t('mypage.imagesize'), 'error');
        return;
      }

      const imageUrl = await uploadProfileImage(file);

      // 프로필 정보 다시 불러오기
      await fetchProfile();

      // auth store의 사용자 정보도 다시 로드하여 헤더에 즉시 반영
      const { loadUser } = useAuthStore.getState();
      await loadUser();

      showNotification(t('mypage.imageupdetesuccess'), 'success');
      console.log('프로필 이미지 업로드 성공:', imageUrl);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      showNotification(t('mypage.imageupdetesuccess'), 'error');
    } finally {
      setIsImageLoading(false);
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = async () => {
    setIsImageLoading(true);
    try {
      await deleteProfileImage();

      // 프로필 정보 다시 불러오기
      await fetchProfile();

      // auth store의 사용자 정보도 다시 로드하여 헤더에 즉시 반영
      const { loadUser } = useAuthStore.getState();
      await loadUser();

      showNotification(t('mypage.imagedeletesuccess'), 'success');
      console.log('프로필 이미지 삭제 성공');
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
      showNotification(t('mypage.imagedeletefail'), 'error');
    } finally {
      setIsImageLoading(false);
    }
  };

  // 통합 로딩 상태 처리 (깜빡임 방지)
  if (isInitialLoading) {
    const { t } = useTranslation();
    return (
      <PageLayout title={t('mypage.myprofile.title')}>
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      </PageLayout>
    );
  }

  // 에러 상태
  if (profileError && profileLoading === 'error') {
    const { t } = useTranslation();
    return (
      <PageLayout title={t('mypage.myprofile.title')}>
        <ErrorMessage>
          <p>{profileError}</p>
          <Button
            onClick={() => {
              setIsInitialLoading(true);
              setContentReady(false);
              fetchProfile();
            }}
            variant="primary"
            className="mt-4"
          >
            {t('mypage.trybtn')}
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
  const { t } = useTranslation();
  const badges = [
    ...(postsCount > 0
      ? [
          {
            id: 1,
            name: t('mypage.badge1name'),
            icon: '📝',
            description: t('mypage.badge1desc'),
            unlocked: true,
          },
        ]
      : []),
    ...(commentsCount >= 10
      ? [
          {
            id: 2,
            name: t('mypage.badge2name'),
            icon: '💬',
            description: t('mypage.badge2desc'),
            unlocked: true,
          },
        ]
      : []),
    ...(debatesCount > 0
      ? [
          {
            id: 3,
            name: t('mypage.badge3name'),
            icon: '🗳️',
            description: t('mypage.badge3desc'),
            unlocked: true,
          },
        ]
      : []),
    ...(bookmarksCount > 0
      ? [
          {
            id: 4,
            name: t('mypage.badge4name'),
            icon: '📚',
            description: t('mypage.badge4desc'),
            unlocked: true,
          },
        ]
      : []),
    ...(totalActivities >= 10
      ? [
          {
            id: 5,
            name: t('mypage.badge5name'),
            icon: '🌟',
            description: t('mypage.badge5desc'),
            unlocked: true,
          },
        ]
      : []),
  ];

  // 사용자 레벨 계산 (임시 로직)
  const userLevel = Math.min(Math.floor(totalActivities / 5) + 1, 10);
  const maxLevel = 10;
  const levelProgress = (userLevel / maxLevel) * 100;

  return (
    <PageLayout title={t('mypage.myprofile.title')}>
      {/* 부드러운 등장 효과를 위한 컨테이너 */}
      <PageContainer
        style={{
          opacity: contentReady ? 1 : 0,
          transform: contentReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <ProfileSection>
            {/* 왼쪽: 프로필 카드 */}
            <ProfileCard
              profileImage={profile?.profileImage}
              name={profile?.name || ''}
              role={visitPurpose || '사용자'}
              email={profile?.email || ''}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              isImageLoading={isImageLoading}
              isEditing={isEditing}
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
                      {t('mypage.cancelbtn')}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={profileUpdateLoading === 'loading'}
                      className="ml-2"
                    >
                      {profileUpdateLoading === 'loading' ? t('mypage.myprofile.save2') : t('mypage.myprofile.save1')}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    fullWidth
                  >
                    {t('mypage.myprofile.profileedit')}
                  </Button>
                )}
              </ProfileActions>

              <Box mt={2} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {t('mypage.myprofile.activitylevel')}: {userLevel}/{maxLevel}
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
                  <Box
                    width={`${levelProgress}%`}
                    height="100%"
                    bgcolor="#FF9999"
                    borderRadius={4}
                  />
                </Box>
              </Box>
            </ProfileCard>

            {/* 오른쪽: 상세 정보 */}
            <InfoCard title={t('mypage.myprofile.Personalinformation')}>
              <ProfileInfoSection>
                <StyledFormField label={t('mypage.myprofile.name')} htmlFor="name">
                  {isEditing ? (
                    <StyledInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('mypage.inputname')}
                    />
                  ) : (
                    <ReadOnlyValue>{profile?.name || t('mypage.myprofile.noname')}</ReadOnlyValue>
                  )}
                </StyledFormField>

                <StyledFormField label={t('mypage.myprofile.email')} htmlFor="email">
                  <ReadOnlyValue>{profile?.email || t('mypage.myprofile.noemail')}</ReadOnlyValue>
                </StyledFormField>

                <StyledFormField label={t('mypage.myprofile.Introduceyourself')} htmlFor="introduction">
                  {isEditing ? (
                    <StyledTextarea
                      id="introduction"
                      name="introduction"
                      value={formData.introduction}
                      onChange={handleChange}
                      placeholder={t('mypage.inputintroduction')}
                      rows={4}
                    />
                  ) : (
                    <ReadOnlyValue>{profile?.introduction || t('mypage.myprofile.nointroduction')}</ReadOnlyValue>
                  )}
                </StyledFormField>

                <Box gridColumn="span 2">
                  <Box display="flex" flexDirection="column" gap={1}>
                    <IconWithText>
                      <PublicIcon fontSize="small" sx={{ color: '#FF9999' }} />
                      <Typography variant="body2">
                        <strong>{t('mypage.myprofile.country')}:</strong> {profile?.country || t('mypage.myprofile.nocountry')}
                      </Typography>
                    </IconWithText>

                    <IconWithText>
                      <TranslateIcon fontSize="small" sx={{ color: '#FF9999' }} />
                      <Typography variant="body2">
                        <strong>{t('mypage.myprofile.language')}:</strong> {profile?.language || t('mypage.myprofile.nolanguage')}
                      </Typography>
                    </IconWithText>

                    <IconWithText>
                      <CakeIcon fontSize="small" sx={{ color: '#FF9999' }} />
                      <Typography variant="body2">
                        <strong>{t('mypage.myprofile.Joineddate')}:</strong> {profile?.joinDate || t('mypage.myprofile.nojoindate')}
                      </Typography>
                    </IconWithText>

                    <IconWithText>
                      <TravelExploreIcon fontSize="small" sx={{ color: '#FF9999' }} />
                      <Typography variant="body2">
                        <strong>{t('mypage.myprofile.visitpurpose')}:</strong> {visitPurpose}
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
          {t('mypage.myprofile.ActivityStatistics')}
        </Typography>
        <StatsSection>
          <StatCard>
            <StatIcon>
              <ForumIcon />
            </StatIcon>
            <StatValue>{postsCount}</StatValue>
            <StatLabel>{t('mypage.myprofile.post')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <ChatBubbleOutlineIcon />
            </StatIcon>
            <StatValue>{commentsCount}</StatValue>
            <StatLabel>{t('mypage.myprofile.comment')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <HowToVoteIcon />
            </StatIcon>
            <StatValue>{debatesCount}</StatValue>
            <StatLabel>{t('mypage.myprofile.debate')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <BookmarkIcon />
            </StatIcon>
            <StatValue>{bookmarksCount}</StatValue>
            <StatLabel>{t('mypage.myprofile.Bookmark')}</StatLabel>
          </StatCard>
        </StatsSection>

        {/* 배지 섹션 */}
        <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 4 }}>
          {t('mypage.myprofile.badge')}
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
              {t('mypage.myprofile.nobadge')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('mypage.myprofile.nobadge2')}
            </Typography>
          </NoBadge>
        )}
      </PageContainer>

      {/* 새로운 토스트 알림 표시 */}
      {notification.show && (
        <ToastNotification show={notification.show} type={notification.type}>
          {notification.type === 'success' ? (
            <CheckCircleIcon sx={{ fontSize: 24, color: '#fff' }} />
          ) : (
            <ErrorIcon sx={{ fontSize: 24, color: '#fff' }} />
          )}
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
            {notification.message}
          </Typography>
        </ToastNotification>
      )}
    </PageLayout>
  );
};

export default ProfilePage;
