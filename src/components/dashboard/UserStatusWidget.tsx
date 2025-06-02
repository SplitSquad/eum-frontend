import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorIcon from '@mui/icons-material/Error';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

import UserService, {
  UserProfile,
  UserPreference,
  UserActivity,
  UserActivityStats,
  UserBadge as ServiceUserBadge,
} from '../../services/user/userService';
// @ts-ignore - 모듈을 찾을 수 없다는 오류를 무시
import WeatherService, { WeatherInfo } from '../../services/weather/weatherService';
import { useTranslation } from '../../shared/i18n';
import { useLanguageStore } from '../../features/theme/store/languageStore';
import { env } from '@/config/env';
import { useMypageStore } from '../../features/mypage/store/mypageStore';
import { useAuthStore } from '../../features/auth/store/authStore';

// 사용자 뱃지 인터페이스 추가
interface UserBadge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// 최근 활동 인터페이스
interface RecentActivity {
  id: number;
  type: 'post' | 'comment' | 'debate' | 'bookmark';
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

// 카카오맵 API 스크립트 로드 함수 - 싱글톤 패턴 적용
let kakaoMapPromise: Promise<void> | null = null;
const loadKakaoMapScript = (): Promise<void> => {
  // 이미 로드 중이면 기존 프로미스 반환
  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  // 이미 로드된 경우
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve();
  }

  // 새 프로미스 생성 및 저장
  kakaoMapPromise = new Promise((resolve, reject) => {
    // 카카오맵 API 키 가져오기
    const apiKey = env.KAKAO_MAP_API_KEY;
    if (!apiKey) {
      reject(new Error('Kakao Map API key is not defined'));
      return;
    }

    // 스크립트 태그 생성 및 추가
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = () => {
      kakaoMapPromise = null; // 에러 발생 시 null로 초기화하여 재시도 가능하게 함
      reject(new Error('Failed to load Kakao Map script'));
    };

    document.head.appendChild(script);
  });

  return kakaoMapPromise;
};

// window 타입 확장
declare global {
  interface Window {
    kakao: any;
  }
}

const UserStatusWidget: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  
  // 마이페이지 스토어 사용 - level 정보 포함
  const {
    profile,
    posts,
    comments,
    debates,
    bookmarks,
    fetchProfile,
    fetchMyPosts,
    fetchMyComments,
    fetchMyDebates,
    fetchMyBookmarks,
  } = useMypageStore();
  
  // 사용자 정보 상태
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPreference, setUserPreference] = useState<UserPreference | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activityStreak, setActivityStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 날씨 정보 상태 추가
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    current: 'sunny',
    temperature: 24,
    location: t('dashboard.userStatus.locationError'),
    forecast: [
      { day: 'tomorrow', icon: '⛅', temp: 26, minTemp: 20, maxTemp: 30, precipitationProbability: 20 },
      { day: 'dayAfterTomorrow', icon: '🌧️', temp: 22, minTemp: 18, maxTemp: 26, precipitationProbability: 70 },
    ],
  });
  
  // 위치 정보 상태 추가
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  }>({
    latitude: 37.5665,
    longitude: 126.978,
    address: t('dashboard.userStatus.locationError'),
  });
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);

  // 유저 경험치 - 실제 활동 수 기반으로 레벨 계산
  const postsCount = posts?.content?.length || 0;
  const commentsCount = comments?.content?.length || 0;
  const debatesCount = debates?.content?.length || 0;
  const bookmarksCount = bookmarks?.content?.length || 0;
  const totalActivities = postsCount + commentsCount + debatesCount + bookmarksCount;
  
  const userLevel = Math.min(Math.floor(totalActivities / 5) + 1, 10); // 최대 10레벨 (마이페이지와 동일)
  const nextLevel = userLevel + 1;
  const userExp = userLevel >= 10 ? 100 : ((totalActivities % 5) / 5) * 100; // 다음 레벨까지의 진행률
  
  // 레벨별 칭호 시스템
  const getUserTitle = (level: number): { title: string; color: string; icon: string } => {
    const titles = {
      1: { title: t('dashboard.userStatus.titles.1'), color: '#4caf50', icon: '🌱' },
      2: { title: t('dashboard.userStatus.titles.2'), color: '#8bc34a', icon: '🤝' },
      3: { title: t('dashboard.userStatus.titles.3'), color: '#cddc39', icon: '💪' },
      4: { title: t('dashboard.userStatus.titles.4'), color: '#ffeb3b', icon: '🔥' },
      5: { title: t('dashboard.userStatus.titles.5'), color: '#ffc107', icon: '🌏' },
      6: { title: t('dashboard.userStatus.titles.6'), color: '#ff9800', icon: '🏠' },
      7: { title: t('dashboard.userStatus.titles.7'), color: '#ff5722', icon: '✨' },
      8: { title: t('dashboard.userStatus.titles.8'), color: '#e91e63', icon: '🌈' },
      9: { title: t('dashboard.userStatus.titles.9'), color: '#9c27b0', icon: '🎯' },
      10: { title: t('dashboard.userStatus.titles.10'), color: '#673ab7', icon: '👑' },
    };
    return titles[level as keyof typeof titles] || titles[1];
  };
  
  const userTitle = getUserTitle(userLevel);

  // 현재 시간 상태 (실시간 업데이트)
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 시간 업데이트 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트 (60,000ms)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 실시간 날씨 업데이트 useEffect 추가
  useEffect(() => {
    const weatherTimer = setInterval(async () => {
      try {
        const weather = await WeatherService.getWeatherInfo(
          userLocation.latitude,
          userLocation.longitude,
          userLocation.address
        );
        setWeatherInfo(weather);
        console.log('날씨 정보 실시간 업데이트:', weather);
      } catch (error) {
        console.log('실시간 날씨 업데이트 실패:', error);
      }
    }, 30 * 60 * 1000); // 30분마다 날씨 업데이트

    return () => {
      clearInterval(weatherTimer);
    };
  }, [userLocation]);

  // 현재 시간 포맷팅
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  // 시간대별 인사말
  const getGreeting = () => {
    if (hours < 12) return t('dashboard.userStatus.greeting.morning');
    if (hours < 17) return t('dashboard.userStatus.greeting.afternoon');
    return t('dashboard.userStatus.greeting.evening');
  };

  // 사용자 뱃지 생성 함수 (마이페이지와 동일한 로직)
  const generateUserBadges = (postsCount: number, commentsCount: number, debatesCount: number, bookmarksCount: number): UserBadge[] => {
    const totalActivities = postsCount + commentsCount + debatesCount;
    const badges: UserBadge[] = [];

    if (postsCount > 0) {
      badges.push({
        id: 1,
        name: t('dashboard.userStatus.badgeTypes.firstPost'),
        icon: '📝',
        description: t('dashboard.userStatus.badgeTypes.firstPostDesc'),
        unlocked: true,
      });
    }

    if (commentsCount >= 10) {
      badges.push({
        id: 2,
        name: t('dashboard.userStatus.badgeTypes.communicator'),
        icon: '💬',
        description: t('dashboard.userStatus.badgeTypes.communicatorDesc'),
        unlocked: true,
      });
    }

    if (debatesCount > 0) {
      badges.push({
        id: 3,
        name: t('dashboard.userStatus.badgeTypes.debater'),
        icon: '🗳️',
        description: t('dashboard.userStatus.badgeTypes.debaterDesc'),
        unlocked: true,
      });
    }

    if (bookmarksCount > 0) {
      badges.push({
        id: 4,
        name: t('dashboard.userStatus.badgeTypes.collector'),
        icon: '🔖',
        description: t('dashboard.userStatus.badgeTypes.collectorDesc'),
        unlocked: true,
      });
    }

    if (totalActivities >= 50) {
      badges.push({
        id: 5,
        name: t('dashboard.userStatus.badgeTypes.activeUser'),
        icon: '⭐',
        description: t('dashboard.userStatus.badgeTypes.activeUserDesc'),
        unlocked: true,
      });
    }

    if (totalActivities >= 100) {
      badges.push({
        id: 6,
        name: t('dashboard.userStatus.badgeTypes.expert'),
        icon: '🏆',
        description: t('dashboard.userStatus.badgeTypes.expertDesc'),
        unlocked: true,
      });
    }

    return badges.slice(0, 3); // 최대 3개 표시
  };

  // 최근 활동 3개 생성 함수
  const generateRecentActivities = (): RecentActivity[] => {
    const allActivities: RecentActivity[] = [];

    // 게시글 활동
    if (posts?.content) {
      const postActivities = posts.content.map(post => ({
        id: post.id || 0,
        type: 'post' as const,
        title: t('dashboard.userStatus.activityTypes.post'),
        description: post.title || '',
        date: post.createdAt || '',
        icon: <ForumIcon sx={{ fontSize: 16, color: '#2196f3' }} />,
      }));
      allActivities.push(...postActivities);
    }

    // 댓글 활동
    if (comments?.content) {
      const commentActivities = comments.content.map(comment => ({
        id: comment.postId || 0,
        type: 'comment' as const,
        title: t('dashboard.userStatus.activityTypes.comment'),
        description: `${comment.postTitle || ''}: ${(comment.content || '').substring(0, 30)}...`,
        date: comment.createdAt || '',
        icon: <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#4caf50' }} />,
      }));
      allActivities.push(...commentActivities);
    }

    // 토론 활동
    if (debates?.content) {
      const debateActivities = debates.content.map(debate => ({
        id: debate.id || 0,
        type: 'debate' as const,
        title: t('dashboard.userStatus.activityTypes.debate'),
        description: debate.title || '',
        date: debate.createdAt || '',
        icon: <HowToVoteIcon sx={{ fontSize: 16, color: '#9c27b0' }} />,
      }));
      allActivities.push(...debateActivities);
    }

    // 북마크 활동
    if (bookmarks?.content) {
      const bookmarkActivities = bookmarks.content.map(bookmark => ({
        id: bookmark.id || 0,
        type: 'bookmark' as const,
        title: t('dashboard.userStatus.activityTypes.bookmark'),
        description: bookmark.title || '',
        date: bookmark.createdAt || '',
        icon: <BookmarkIcon sx={{ fontSize: 16, color: '#ff9800' }} />,
      }));
      allActivities.push(...bookmarkActivities);
    }

    // 날짜순으로 정렬하고 최신 3개만 반환
    return allActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  // 연속 활동 일수 계산 함수
  const calculateActivityStreak = (): number => {
    const allActivities: { date: string }[] = [];

    // 모든 활동의 날짜를 수집
    if (posts?.content) {
      posts.content.forEach(post => {
        if (post.createdAt) allActivities.push({ date: post.createdAt });
      });
    }
    if (comments?.content) {
      comments.content.forEach(comment => {
        if (comment.createdAt) allActivities.push({ date: comment.createdAt });
      });
    }
    if (debates?.content) {
      debates.content.forEach(debate => {
        if (debate.createdAt) allActivities.push({ date: debate.createdAt });
      });
    }
    if (bookmarks?.content) {
      bookmarks.content.forEach(bookmark => {
        if (bookmark.createdAt) allActivities.push({ date: bookmark.createdAt });
      });
    }

    // 날짜별로 그룹화 (YYYY-MM-DD 형식)
    const activityDates = [...new Set(
      allActivities.map(activity => 
        new Date(activity.date).toISOString().split('T')[0]
      )
    )].sort().reverse(); // 최신순 정렬

    if (activityDates.length === 0) return 0;

    // 오늘부터 역산해서 연속 일수 계산
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < activityDates.length; i++) {
      const checkDate = currentDate.toISOString().split('T')[0];
      
      if (activityDates.includes(checkDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // 하루 전으로
      } else if (i === 0 && checkDate !== today) {
        // 오늘 활동이 없으면 연속성 끊어짐
        break;
      } else {
        // 연속성 끊어짐
        break;
      }
    }

    return streak;
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // 사용자 기본 정보 로딩
        const [userProfileData, preference] = await Promise.all([
          UserService.getProfile(),
          UserService.getPreference(),
        ]);
        
        setUserProfile(userProfileData);
        setUserPreference(preference);

        // 마이페이지 프로필 로딩
        if (!profile) {
          await fetchProfile();
        }

        // 위치 및 날씨 정보 로딩 (카카오맵 방식)
        try {
          const position = await WeatherService.getCurrentPosition();
          
          // 카카오맵 API로 상세 주소 가져오기
          await new Promise<void>((resolve, reject) => {
            if (window.kakao && window.kakao.maps) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${env.KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
            script.onload = () => {
              window.kakao.maps.load(() => resolve());
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
          
          const geocoder = new window.kakao.maps.services.Geocoder();
          const detailedAddress = await new Promise<string>((resolve) => {
              geocoder.coord2RegionCode(
                position.longitude,
                position.latitude,
                (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK && result[0]) {
                  const city = result[0].region_1depth_name;
                  const district = result[0].region_2depth_name;
                  const dong = result[0].region_3depth_name || '';
                  
                  // 상세 주소 포맷팅
                  let formattedAddress = '';
                  if (dong) {
                    // "가"가 포함된 주소는 그대로 사용 (장충동2가 형태)
                    if (dong.endsWith('가')) {
                      formattedAddress = `${city} ${district} ${dong}`;
                    } else if (dong.endsWith('동')) {
                      // 숫자를 제거하되 '동' 부분은 유지 (목2동 -> 목동)
                      const cleanDong = dong.replace(/(\D+)(\d+)(동)/, '$1$3');
                      formattedAddress = `${city} ${district} ${cleanDong}`;
                      } else {
                      formattedAddress = `${city} ${district} ${dong}`;
                      }
                    } else {
                    formattedAddress = `${city} ${district}`;
                    }
                  
                  resolve(formattedAddress);
                  } else {
                    resolve(t('dashboard.userStatus.locationError'));
                  }
                }
              );
            });
          
          // 날씨 정보도 함께 가져오기
          const weather = await WeatherService.getWeatherInfo(
            position.latitude,
            position.longitude,
            detailedAddress
          );
          
          setWeatherInfo({
            ...weather,
            location: detailedAddress // 상세 주소로 설정
          });
          
          setUserLocation({
            latitude: position.latitude,
            longitude: position.longitude,
            address: detailedAddress
          });
        } catch (error) {
          console.log(t('dashboard.userStatus.apiErrors.locationFailed'), error);
          // 기본값 유지
        }

        // 마이페이지 데이터 로딩
        if (user) {
          await Promise.all([
            fetchMyPosts(),
            fetchMyComments(),
            fetchMyDebates(),
            fetchMyBookmarks(),
          ]);
        }

      } catch (error) {
        console.error(t('dashboard.userStatus.apiErrors.userDataFailed'), error);
        setError(t('dashboard.userStatus.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, profile, fetchProfile, fetchMyPosts, fetchMyComments, fetchMyDebates, fetchMyBookmarks]);

  // 마이페이지 데이터가 변경될 때 분석 데이터 업데이트
  useEffect(() => {
    if (!isLoading && (posts || comments || debates || bookmarks)) {
      // 뱃지 생성
      const postsCount = posts?.content?.length || 0;
      const commentsCount = comments?.content?.length || 0;
      const debatesCount = debates?.content?.length || 0;
      const bookmarksCount = bookmarks?.content?.length || 0;
      
      const badges = generateUserBadges(postsCount, commentsCount, debatesCount, bookmarksCount);
      setUserBadges(badges);

      // 최근 활동 생성
      const activities = generateRecentActivities();
      setRecentActivities(activities);

      // 연속 활동 일수 계산
      const streak = calculateActivityStreak();
      setActivityStreak(streak);
    }
  }, [posts, comments, debates, bookmarks, isLoading]);

  // 언어 변경 감지 및 레이블 업데이트
  useEffect(() => {
    console.log('[DEBUG] UserStatusWidget - 언어 변경 감지:', language);
    
    // 언어 변경 시 뱃지와 활동 데이터 다시 생성 (번역된 텍스트로)
    if (!isLoading && (posts || comments || debates || bookmarks)) {
      const postsCount = posts?.content?.length || 0;
      const commentsCount = comments?.content?.length || 0;
      const debatesCount = debates?.content?.length || 0;
      const bookmarksCount = bookmarks?.content?.length || 0;
      
      const badges = generateUserBadges(postsCount, commentsCount, debatesCount, bookmarksCount);
      setUserBadges(badges);

      const activities = generateRecentActivities();
      setRecentActivities(activities);
    }
  }, [language, posts, comments, debates, bookmarks, isLoading]);

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          height: '100%',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          {t('dashboard.userStatus.loading')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 에러 메시지 표시 */}
      {error && (
        <Box
          sx={{
            p: 1,
            mb: 1.5,
            bgcolor: 'error.light',
            color: 'error.dark',
            borderRadius: 1,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ErrorIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {error}
        </Box>
      )}

      {/* 배경 장식 */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,245,255,0.4) 0%, rgba(241,245,255,0) 70%)',
          zIndex: 0,
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.4 },
            '50%': { transform: 'scale(1.1)', opacity: 0.6 },
            '100%': { transform: 'scale(1)', opacity: 0.4 }
          }
        }}
      />

      {/* 메인 컨텐츠 */}
      <Box sx={{ flex: 1, minHeight: 0, zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 유저 프로필 헤더 - 최적화 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile?.profileImage || userProfile?.profileImagePath || ''}
              alt={profile?.name || userProfile?.name || t('dashboard.userStatus.user')}
              sx={{
                width: 48,
                height: 48,
                mr: 1.5,
                border: '2px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              {!(profile?.profileImage || userProfile?.profileImagePath) && <PersonOutlineIcon />}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -1,
                right: 8,
                bgcolor: '#00c853',
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: '2px solid white',
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mr: 1, fontSize: '1rem' }}>
                  {profile?.name || userProfile?.name || t('dashboard.userStatus.user')}
                </Typography>
                <Chip
                  size="small"
                  label={`${userTitle.icon} ${t('dashboard.userStatus.level')}${userLevel}`}
                  sx={{
                    bgcolor: userTitle.color,
                    color: 'white',
                    fontWeight: 600,
                    height: 18,
                    fontSize: '0.65rem',
                    mr: 0.5,
                  }}
                />
                {/* 칭호 표시 */}
                <Chip
                  size="small"
                  label={userTitle.title}
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    borderColor: userTitle.color,
                    color: userTitle.color,
                    fontWeight: 500,
                  }}
                />
              </Box>
              
              {/* 현재 시간 표시 */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
                  {formattedTime}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: userTitle.color, fontSize: '0.85rem' }}>
              {getGreeting()}, {userTitle.title}!
            </Typography>

            {/* 레벨 진행바 - 더 컴팩트하게 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={userExp}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {userExp}{t('dashboard.userStatus.progress')}
              </Typography>
            </Box>
            
            {/* 다음 칭호 정보 */}
            {userLevel < 10 && (
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.3, display: 'block' }}>
                {t('dashboard.userStatus.nextTitle')}: {getUserTitle(nextLevel).icon} {getUserTitle(nextLevel).title} 
                <span style={{ color: getUserTitle(nextLevel).color, fontWeight: 600 }}>
                  ({5 - (totalActivities % 5)}{t('dashboard.userStatus.activitiesRemaining')})
                </span>
              </Typography>
            )}
          </Box>
        </Box>

        {/* 메인 콘텐츠 영역 - 2열 레이아웃 */}
        <Box sx={{ flex: 1, display: 'flex', gap: 1.5, minHeight: 0 }}>
          
          {/* 왼쪽: 연속활동/뱃지 + 달성뱃지 + 최근활동 */}
          <Box sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* 연속활동 & 뱃지 통계 */}
            <Box sx={{ display: 'flex', gap: 0.8, mb: 0.5 }}>
              <Box
                sx={{
                  flex: 1,
                  p: 1.2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: 0,
                  height: 'fit-content',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shimmer 2s infinite',
                    '@keyframes shimmer': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' }
                    }
                  }
                }}
              >
                <LocalFireDepartmentIcon sx={{ fontSize: 14, mb: 0.3 }} />
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '0.9rem', lineHeight: 1 }}>
                  {activityStreak}{t('dashboard.userStatus.streakDays')}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.9 }}>{t('dashboard.userStatus.consecutiveActivity')}</Typography>
              </Box>
              
              <Box
                sx={{
                  flex: 1,
                  p: 1.2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: 0,
                  height: 'fit-content',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shimmer 2s infinite 1s',
                  }
                }}
              >
                <StarIcon sx={{ fontSize: 14, mb: 0.3 }} />
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '0.9rem', lineHeight: 1 }}>
                  {userBadges.filter(b => b.unlocked).length}{t('dashboard.userStatus.badgeCount')}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.9 }}>{t('dashboard.userStatus.badges')}</Typography>
              </Box>
            </Box>

            {/* 달성 뱃지 */}
            <Box sx={{ mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
              >
                <EmojiEventsIcon sx={{ fontSize: 12, mr: 0.5 }} />
                {t('dashboard.userStatus.achievedBadges')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {userBadges.length > 0 ? (
                  userBadges.slice(0, 4).map(badge => (
                    <Chip
                      key={badge.id}
                      label={badge.name}
                      icon={<span style={{ fontSize: '0.6rem' }}>{badge.icon}</span>}
                      size="small"
                      sx={{
                        bgcolor: badge.unlocked ? 'success.light' : 'grey.300',
                        color: badge.unlocked ? 'success.dark' : 'grey.600',
                        fontWeight: 500,
                        height: 20,
                        fontSize: '0.65rem',
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {t('dashboard.userStatus.startActivity')}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* 최근 활동 */}
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
              >
                <NotificationsActiveIcon sx={{ fontSize: 12, mr: 0.5 }} />
                {t('dashboard.userStatus.recentActivity')}
              </Typography>
              <Box sx={{ maxHeight: 160, overflowY: 'auto', overflowX: 'hidden' }}>
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 3).map((activity, index) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.8,
                        mb: index < 2 ? 0.5 : 0, // 마지막 항목은 마진 없음
                        borderRadius: 1,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        border: '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <Box sx={{ mr: 1 }}>{activity.icon}</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          {activity.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: '0.65rem',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {activity.description.length > 25
                            ? `${activity.description.substring(0, 25)}...`
                            : activity.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 1.5, fontSize: '0.75rem' }}>
                    {t('dashboard.userStatus.noActivity')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* 오른쪽: 날씨 정보 + 추천 활동 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* 날씨 정보 */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
              >
                <WbSunnyIcon sx={{ fontSize: 12, mr: 0.5 }} />
                {t('dashboard.userStatus.weatherInfo')}
              </Typography>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="h5" sx={{ mb: 0.3, fontSize: '1.5rem' }}>
                  {getWeatherIcon(weatherInfo.current)}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', lineHeight: 1 }}>
                  {weatherInfo.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {t(`dashboard.userStatus.weatherStatus.${weatherInfo.current}`)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.3 }}>
                  <LocationOnIcon sx={{ fontSize: 10, mr: 0.3 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                    {weatherInfo.location === 'unknown' ? t('dashboard.userStatus.unknownLocation') : weatherInfo.location}
                  </Typography>
                </Box>
              </Box>

              {/* 2일 날씨 예보 - 최저/최고기온과 강수확률 포함 */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {weatherInfo.forecast.slice(0, 2).map((day, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      p: 0.8,
                      borderRadius: 1,
                      bgcolor: 'rgba(33, 150, 243, 0.08)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                      {t(`dashboard.userStatus.${day.day}`)}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', my: 0.3 }}>{day.icon}</Typography>
                    
                    {/* 최저/최고 기온 표시 */}
                    {day.minTemp && day.maxTemp ? (
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'primary.main', fontWeight: 600 }}>
                          {day.maxTemp}°
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', mx: 0.3 }}>
                          /
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                          {day.minTemp}°
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{day.temp}°</Typography>
                    )}
                    
                    {/* 강수확률 표시 */}
                    {day.precipitationProbability && (
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block', mt: 0.2 }}>
                        {day.precipitationProbability}{t('dashboard.userStatus.precipitationProbability')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* 오늘의 추천 활동 */}
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 0.8, display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
              >
                <LocalActivityIcon sx={{ fontSize: 12, mr: 0.5 }} />
                {t('dashboard.userStatus.todaysRecommendations')}
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 0.6, 
                  maxHeight: '100%', 
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '2px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '2px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0,0,0,0.3)',
                  }
                }}
              >
                {getWeatherBasedRecommendations(weatherInfo.current, t).map((rec, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 0.8,
                      borderRadius: 1,
                      bgcolor: rec.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.9rem', mr: 1 }}>{rec.icon}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {rec.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: '0.65rem',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {rec.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// 날씨 아이콘 매핑 - 영어 키 사용
const getWeatherIcon = (status: string): string => {
  const iconMap: { [key: string]: string } = {
    sunny: '☀️',
    cloudy: '⛅',
    overcast: '☁️',
    rain: '🌧️',
    snow: '🌨️',
    fog: '🌫️',
  };
  return iconMap[status] || '☀️';
};

// 날씨 기반 추천 활동 - 번역 키 사용
const getWeatherBasedRecommendations = (
  weatherStatus: string,
  t: (key: string) => string
): Array<{
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}> => {
  const recommendations = {
    sunny: [
      { 
        icon: '🌳', 
        title: t('dashboard.userStatus.recommendations.sunny.parkWalk.title'), 
        description: t('dashboard.userStatus.recommendations.sunny.parkWalk.description'), 
        bgColor: 'rgba(76, 175, 80, 0.1)' 
      },
      { 
        icon: '📸', 
        title: t('dashboard.userStatus.recommendations.sunny.photography.title'), 
        description: t('dashboard.userStatus.recommendations.sunny.photography.description'), 
        bgColor: 'rgba(33, 150, 243, 0.1)' 
      },
      { 
        icon: '🚴', 
        title: t('dashboard.userStatus.recommendations.sunny.cycling.title'), 
        description: t('dashboard.userStatus.recommendations.sunny.cycling.description'), 
        bgColor: 'rgba(255, 152, 0, 0.1)' 
      },
    ],
    cloudy: [
      { 
        icon: '☕', 
        title: t('dashboard.userStatus.recommendations.cloudy.cafe.title'), 
        description: t('dashboard.userStatus.recommendations.cloudy.cafe.description'), 
        bgColor: 'rgba(121, 85, 72, 0.1)' 
      },
      { 
        icon: '🛍️', 
        title: t('dashboard.userStatus.recommendations.cloudy.shopping.title'), 
        description: t('dashboard.userStatus.recommendations.cloudy.shopping.description'), 
        bgColor: 'rgba(233, 30, 99, 0.1)' 
      },
      { 
        icon: '🎨', 
        title: t('dashboard.userStatus.recommendations.cloudy.exhibition.title'), 
        description: t('dashboard.userStatus.recommendations.cloudy.exhibition.description'), 
        bgColor: 'rgba(156, 39, 176, 0.1)' 
      },
    ],
    overcast: [
      { 
        icon: '📚', 
        title: t('dashboard.userStatus.recommendations.overcast.reading.title'), 
        description: t('dashboard.userStatus.recommendations.overcast.reading.description'), 
        bgColor: 'rgba(96, 125, 139, 0.1)' 
      },
      { 
        icon: '🍲', 
        title: t('dashboard.userStatus.recommendations.overcast.cooking.title'), 
        description: t('dashboard.userStatus.recommendations.overcast.cooking.description'), 
        bgColor: 'rgba(255, 87, 34, 0.1)' 
      },
      { 
        icon: '🎬', 
        title: t('dashboard.userStatus.recommendations.overcast.movie.title'), 
        description: t('dashboard.userStatus.recommendations.overcast.movie.description'), 
        bgColor: 'rgba(63, 81, 181, 0.1)' 
      },
    ],
    rain: [
      { 
        icon: '☕', 
        title: t('dashboard.userStatus.recommendations.rain.indoorCafe.title'), 
        description: t('dashboard.userStatus.recommendations.rain.indoorCafe.description'), 
        bgColor: 'rgba(121, 85, 72, 0.1)' 
      },
      { 
        icon: '📖', 
        title: t('dashboard.userStatus.recommendations.rain.indoorReading.title'), 
        description: t('dashboard.userStatus.recommendations.rain.indoorReading.description'), 
        bgColor: 'rgba(96, 125, 139, 0.1)' 
      },
      { 
        icon: '🛋️', 
        title: t('dashboard.userStatus.recommendations.rain.rest.title'), 
        description: t('dashboard.userStatus.recommendations.rain.rest.description'), 
        bgColor: 'rgba(158, 158, 158, 0.1)' 
      },
    ],
    snow: [
      { 
        icon: '⛄', 
        title: t('dashboard.userStatus.recommendations.snow.snowViewing.title'), 
        description: t('dashboard.userStatus.recommendations.snow.snowViewing.description'), 
        bgColor: 'rgba(0, 188, 212, 0.1)' 
      },
      { 
        icon: '🏠', 
        title: t('dashboard.userStatus.recommendations.snow.indoorActivity.title'), 
        description: t('dashboard.userStatus.recommendations.snow.indoorActivity.description'), 
        bgColor: 'rgba(255, 152, 0, 0.1)' 
      },
      { 
        icon: '🍫', 
        title: t('dashboard.userStatus.recommendations.snow.hotDrink.title'), 
        description: t('dashboard.userStatus.recommendations.snow.hotDrink.description'), 
        bgColor: 'rgba(121, 85, 72, 0.1)' 
      },
    ],
    fog: [
      { 
        icon: '🚗', 
        title: t('dashboard.userStatus.recommendations.fog.safeDriving.title'), 
        description: t('dashboard.userStatus.recommendations.fog.safeDriving.description'), 
        bgColor: 'rgba(158, 158, 158, 0.1)' 
      },
      { 
        icon: '🏠', 
        title: t('dashboard.userStatus.recommendations.fog.indoorStay.title'), 
        description: t('dashboard.userStatus.recommendations.fog.indoorStay.description'), 
        bgColor: 'rgba(255, 152, 0, 0.1)' 
      },
      { 
        icon: '📱', 
        title: t('dashboard.userStatus.recommendations.fog.onlineActivity.title'), 
        description: t('dashboard.userStatus.recommendations.fog.onlineActivity.description'), 
        bgColor: 'rgba(33, 150, 243, 0.1)' 
      },
    ],
  };

  const weatherRecs = recommendations[weatherStatus as keyof typeof recommendations] || recommendations['sunny'];
  
  // 랜덤하게 섞어서 반환
  return [...weatherRecs].sort(() => Math.random() - 0.5);
};

export default UserStatusWidget;