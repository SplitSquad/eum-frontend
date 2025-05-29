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
  AvatarGroup,
  Button,
  CircularProgress,
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorIcon from '@mui/icons-material/Error';
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

// 사용자 뱃지 인터페이스 추가
interface UserBadge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
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
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
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
  
  // 사용자 정보 상태
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPreference, setUserPreference] = useState<UserPreference | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 날씨 정보 상태 추가
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    current: '맑음',
    temperature: 24,
    location: '서울시 강남구',
    forecast: [
      { day: '오늘', icon: '☀️', temp: 24 },
      { day: '내일', icon: '⛅', temp: 26 },
      { day: '모레', icon: '🌧️', temp: 22 },
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
    address: '서울시 강남구',
  });
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);

  // 유저 경험치
  const userExp = 75; // 백분율 (0-100)
  const userLevel = userProfile?.userId ? Math.floor((userProfile.userId % 20) + 1) : 1; // 임시로 userId를 이용해 레벨 생성
  const nextLevel = userLevel + 1;

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

  // 현재 시간 포맷팅
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  // 시간대별 인사말
  const getGreeting = () => {
    if (hours < 12) return t('dashboard.greeting.morning');
    if (hours < 17) return t('dashboard.greeting.afternoon');
    return t('dashboard.greeting.evening');
  };

  // 사용자 뱃지 생성 함수 (마이페이지와 동일한 로직)
  const generateUserBadges = (postsCount: number, commentsCount: number, debatesCount: number, bookmarksCount: number): UserBadge[] => {
    const totalActivities = postsCount + commentsCount + debatesCount;
    const badges: UserBadge[] = [];

    if (postsCount > 0) {
      badges.push({
        id: 1,
        name: '첫 게시글',
        icon: '📝',
        description: '첫 번째 게시글을 작성했습니다!',
        unlocked: true,
      });
    }

    if (commentsCount >= 10) {
      badges.push({
        id: 2,
        name: '소통왕',
        icon: '💬',
        description: '10개 이상의 댓글을 작성했습니다!',
        unlocked: true,
      });
    }

    if (debatesCount > 0) {
      badges.push({
        id: 3,
        name: '토론 참여자',
        icon: '🗳️',
        description: '토론에 참여하여 의견을 표현했습니다!',
        unlocked: true,
      });
    }

    if (bookmarksCount > 0) {
      badges.push({
        id: 4,
        name: '지식 수집가',
        icon: '📚',
        description: '첫 번째 북마크를 추가했습니다!',
        unlocked: true,
      });
    }

    if (totalActivities >= 10) {
      badges.push({
        id: 5,
        name: '활발한 활동가',
    icon: '🌟',
        description: '10개 이상의 활동을 완료했습니다!',
        unlocked: true,
      });
    }

    return badges;
  };

  // 컴포넌트 마운트 시 카카오맵 스크립트 미리 로드
  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        setIsMapScriptLoaded(true);
      })
      .catch(error => {
        console.error('카카오맵 스크립트 로드 실패:', error);
      });
  }, []);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 사용자 프로필 가져오기
        const profile = await UserService.getProfile();
        setUserProfile(profile);

        // 사용자 선호도 정보 가져오기
        const preference = await UserService.getPreference();
        setUserPreference(preference);

        // 사용자 활동 정보 가져오기
        const activities = await UserService.getRecentActivities();
        setUserActivities(activities);

        // 사용자 활동 통계 및 뱃지 정보 가져오기
        try {
          // 실제 API에서 활동 통계 가져오기
          const activityStats = await UserService.getActivityStats();
          
          // 활동 통계를 기반으로 뱃지 생성
          const badges = generateUserBadges(
            activityStats.postsCount,
            activityStats.commentsCount,
            activityStats.debatesCount,
            activityStats.bookmarksCount
          );
          setUserBadges(badges);
        } catch (badgeError) {
          console.warn('뱃지 정보 가져오기 실패, 임시 데이터 사용:', badgeError);
          // API 실패 시 임시 데이터 사용
          const postsCount = Math.floor(Math.random() * 15);
          const commentsCount = Math.floor(Math.random() * 25);
          const debatesCount = Math.floor(Math.random() * 8);
          const bookmarksCount = Math.floor(Math.random() * 12);
          
          const badges = generateUserBadges(postsCount, commentsCount, debatesCount, bookmarksCount);
          setUserBadges(badges);
        }

        // 사용자 위치 정보 가져오기
        try {
          // 사용자의 실제 위치 가져오기
          const position = await WeatherService.getCurrentPosition();

          // 카카오맵에서 위치 정보 가져오기
          let address = '';

          try {
            // 위치 정보 변환을 위해 항상 먼저 카카오맵 스크립트가 로드되어 있는지 확인
            await loadKakaoMapScript();

            // 지오코더 객체 생성
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 위도/경도를 행정구역 정보로 변환
            address = await new Promise((resolve, reject) => {
              geocoder.coord2RegionCode(
                position.longitude,
                position.latitude,
                (result: any, status: any) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    if (result[0]) {
                      // 행정구역 정보 추출
                      const region =
                        result[0].region_1depth_name + ' ' + result[0].region_2depth_name;

                      // 동/읍/면 정보가 있으면 추가
                      if (result[0].region_3depth_name) {
                        resolve(region + ' ' + result[0].region_3depth_name);
                      } else {
                        resolve(region);
                      }
                    } else {
                      resolve('');
                    }
                  } else {
                    console.error('Region code conversion failed:', status);
                    resolve('');
                  }
                }
              );
            });
          } catch (geoError) {
            console.error('주소 변환 실패:', geoError);
            // 주소 변환 실패 시 사용자에게 알림
            setError('위치 정보를 변환하는 중 문제가 발생했습니다. 기본 위치 정보를 사용합니다.');
          }

          // 주소 변환 실패 시 프로필 주소 사용 또는 위도/경도 표시
          if (!address) {
            address =
              profile?.address ||
              `위도 ${position.latitude.toFixed(4)}, 경도 ${position.longitude.toFixed(4)}`;
          }

          setUserLocation({
            latitude: position.latitude,
            longitude: position.longitude,
            address,
          });

          // 기상청 API로 실제 날씨 정보 가져오기
          const weather = await WeatherService.getWeatherInfo(
            position.latitude,
            position.longitude,
            address
          );

          setWeatherInfo(weather);
          console.log('날씨 정보 로드 성공:', weather);
        } catch (weatherError) {
          console.error('날씨 정보 가져오기 실패:', weatherError);
          // 날씨 정보 가져오기 실패 시 사용자에게 알림
          setError('날씨 정보를 가져오는 중 문제가 발생했습니다. 기본 날씨 정보를 사용합니다.');
          // 기본 날씨 정보 유지
        }
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');

        // 에러 발생 시 더미 데이터 설정 (개발 중에만 사용)
        setUserProfile({
          userId: 1234,
          email: 'user@example.com',
          name: '홍길동',
          phoneNumber: '010-1234-5678',
          address: '서울시 강남구',
          role: 'ROLE_USER',
        });

        setUserPreference({
          userId: 1234,
          language: 'ko',
          nation: 'KR',
          interests: ['여행', '음식', '사진', '음악', '역사'],
        });

        setUserActivities([
          { id: '1', type: '로그인', date: '오늘', streak: 7 },
          { id: '2', type: '리뷰 작성', date: '3일 전', streak: 0 },
          { id: '3', type: '장소 저장', date: '1주일 전', streak: 0 },
        ]);

        // 에러 발생 시에도 임시 뱃지 데이터 설정
        const badges = generateUserBadges(5, 12, 3, 8);
        setUserBadges(badges);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
          {isMapScriptLoaded
            ? '사용자 정보를 불러오는 중입니다...'
            : '지도 정보를 준비하는 중입니다...'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
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
            mb: 2,
            bgcolor: 'error.light',
            color: 'error.dark',
            borderRadius: 1,
            fontSize: '0.875rem',
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
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,245,255,0.5) 0%, rgba(241,245,255,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* 스크롤 가능한 메인 컨텐츠 */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pb: 1, zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            position: 'relative',
            zIndex: 1,
            height: '100%',
          }}
        >
          {/* 좌측 컬럼: 유저 프로필 + 액티비티 */}
          <Box sx={{ flex: { xs: '1', md: '7' }, width: { xs: '100%', md: '60%' } }}>
            {/* 유저 프로필 헤더 */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={userProfile?.profileImagePath || ''}
                  alt={userProfile?.name || '사용자'}
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    border: '2px solid white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  {!userProfile?.profileImagePath && <PersonOutlineIcon />}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: 12,
                    bgcolor: '#00c853',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>
                    {userProfile?.name || '사용자'}
                  </Typography>
                  <Chip
                    size="small"
                    label={`Lv.${userLevel}`}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}>
                  {getGreeting()}!
                </Typography>

                {/* 레벨 진행바 */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={userExp}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.05)',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {userExp}% / Lv.{nextLevel}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* 유저 상태 컨테이너 */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* 날씨 정보 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WbSunnyIcon sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
                    >
                      {weatherInfo.temperature}°C {weatherInfo.current}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {weatherInfo.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* 시간 정보 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formattedTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentTime.toLocaleDateString('ko-KR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>

                {/* 활동 연속 일수 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalFireDepartmentIcon sx={{ color: 'error.main', mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {userActivities.length > 0 ? userActivities[0].streak : 0}일 연속
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('dashboard.userStatus.activeStatus')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 유저 활동 리스트 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t('dashboard.userStatus.recentActivity')}
              </Typography>

              <List
                disablePadding
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  mb: 2,
                }}
              >
                {userActivities.length > 0 ? (
                  userActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'primary.light',
                              color: 'primary.main',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.type}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.date}
                            </Typography>
                          }
                        />
                        {activity.streak > 0 && (
                          <Chip
                            size="small"
                            icon={<LocalFireDepartmentIcon fontSize="small" />}
                            label={`${activity.streak}${t('dashboard.userStatus.continuousDays')}`}
                            sx={{
                              height: 24,
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                              color: 'error.main',
                              '& .MuiChip-icon': {
                                color: 'error.main',
                                marginLeft: '4px',
                              },
                            }}
                          />
                        )}
                      </ListItem>
                      {index < userActivities.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={
                                              <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', textAlign: 'center' }}
                      >
                        {t('dashboard.userStatus.noActivity')}
                      </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>

              {/* 최근 달성 뱃지 */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    width: 40,
                    height: 40,
                    bgcolor: 'warning.light',
                    color: 'warning.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '1.5rem',
                  }}
                >
                  {userBadges.length > 0 ? userBadges[0].icon : '🌟'}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {userBadges.length > 0 ? userBadges[0].name : t('dashboard.userStatus.newBadgeEarned')}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {userBadges.length > 0 ? userBadges[0].description : t('dashboard.userStatus.newBadgeDescription')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 우측 컬럼: 날씨 기반 활동 추천 */}
          <Box sx={{ flex: { xs: '1', md: '5' }, width: { xs: '100%', md: '40%' } }}>
            {/* 날씨 기반 활동 추천 섹션 */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WbSunnyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('dashboard.userStatus.weatherBasedRecommendations')}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  mb: 2,
                }}
              >
                {/* 현재 날씨 정보 */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      width: 50,
                      height: 50,
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '1.8rem',
                    }}
                  >
                    {getWeatherIcon(weatherInfo.current)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {weatherInfo.temperature}°C {weatherInfo.current}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {weatherInfo.location}
                    </Typography>
                    {weatherInfo.humidity && (
                      <Typography variant="caption" color="text.secondary">
                        습도: {weatherInfo.humidity}% |
                        {weatherInfo.forecast[0].precipitationProbability
                          ? ` 강수확률: ${weatherInfo.forecast[0].precipitationProbability}%`
                          : ''}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* 날씨 예보 정보 */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {weatherInfo.forecast.map(
                    (
                      day: {
                        day: string;
                        icon: string;
                        temp: number;
                        minTemp?: number;
                        maxTemp?: number;
                        precipitationProbability?: number;
                      },
                      index: number
                    ) => (
                      <Box key={index} sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {day.day}
                        </Typography>
                        <Box sx={{ fontSize: '1.8rem', mb: 0.5 }}>{day.icon}</Box>
                        <Typography variant="body2">{day.temp}°C</Typography>
                        {day.minTemp !== undefined && day.maxTemp !== undefined && (
                          <Typography variant="caption" color="text.secondary">
                            {day.minTemp}° / {day.maxTemp}°
                          </Typography>
                        )}
                        {day.precipitationProbability !== undefined && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            강수확률: {day.precipitationProbability}%
                          </Typography>
                        )}
                      </Box>
                    )
                  )}
                </Box>

                {/* 날씨 기반 추천 활동 */}
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  오늘 같은 날씨에 어울리는 활동
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {getWeatherBasedRecommendations(weatherInfo.current, t)
                    .sort(() => Math.random() - 0.5) // 랜덤 정렬
                    .slice(0, 3) // 3개만 선택
                    .map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: item.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ fontSize: '1.2rem', mr: 1.5 }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* 사용자 관심사 기반 콘텐츠 */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  나의 관심사
                </Typography>
              </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* 관심사 태그들 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {userPreference?.interests?.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      size="small"
                      sx={{
                        bgcolor: getInterestColor(interest).bg,
                        color: getInterestColor(interest).color,
                        fontWeight: 500,
                      }}
                    />
                  )) || (
                    <Typography variant="caption" color="text.secondary">
                      관심사를 설정해보세요!
                    </Typography>
                  )}
                </Box>

                {/* 관심사 기반 랜덤 이미지/콘텐츠 */}
                {userPreference?.interests && userPreference.interests.length > 0 && (
                  <Box
                    sx={{
                      position: 'relative',
                      height: 120,
                      borderRadius: 2,
                      overflow: 'hidden',
                      background: getRandomGradient(userPreference.interests),
                display: 'flex',
                alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
              }}
            >
                    <Box
                      sx={{
                        textAlign: 'center',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {getRandomEmoji(userPreference.interests)}
                </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getRandomQuote(userPreference.interests)}
                </Typography>
              </Box>
                  </Box>
                )}

                {/* 관심사 기반 추천 콘텐츠 */}
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  관심사 기반 추천
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {getInterestBasedContent(userPreference?.interests || [])
                    .slice(0, 2)
                    .map((item, index) => (
                    <Box
                      key={index}
                sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: item.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                }}
              >
                      <Box sx={{ fontSize: '1.2rem', mr: 1.5 }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// 날씨 상태에 따른 아이콘 반환
const getWeatherIcon = (status: string): string => {
  if (status.includes('비') && status.includes('눈')) return '🌨️';
  if (status.includes('비')) return '🌧️';
  if (status.includes('눈')) return '❄️';
  if (status.includes('구름많음')) return '⛅';
  if (status.includes('흐림')) return '☁️';
  return '☀️'; // 기본값은 맑음
};

// 관심사별 색상 매핑
const getInterestColor = (interest: string) => {
  const colorMap: { [key: string]: { color: string; bg: string } } = {
    '여행': { color: '#2196f3', bg: '#e3f2fd' },
    '음식': { color: '#f44336', bg: '#ffebee' },
    '사진': { color: '#9c27b0', bg: '#f3e5f5' },
    '음악': { color: '#ff9800', bg: '#fff3e0' },
    '역사': { color: '#795548', bg: '#efebe9' },
    '문화': { color: '#607d8b', bg: '#eceff1' },
    '스포츠': { color: '#4caf50', bg: '#e8f5e9' },
    '예술': { color: '#e91e63', bg: '#fce4ec' },
    '기술': { color: '#3f51b5', bg: '#e8eaf6' },
    '자연': { color: '#8bc34a', bg: '#f1f8e9' },
  };
  return colorMap[interest] || { color: '#757575', bg: '#f5f5f5' };
};

// 관심사 기반 랜덤 그라디언트 생성
const getRandomGradient = (interests: string[]): string => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  ];
  
  // 관심사에 따라 특정 그라디언트 선택하거나 랜덤 선택
  const index = interests.length > 0 ? interests[0].length % gradients.length : Math.floor(Math.random() * gradients.length);
  return gradients[index];
};

// 관심사 기반 랜덤 이모지 생성
const getRandomEmoji = (interests: string[]): string => {
  const emojiMap: { [key: string]: string[] } = {
    '여행': ['✈️', '🗺️', '🏖️', '🏔️', '🎒'],
    '음식': ['🍕', '🍜', '🍰', '🥘', '🍣'],
    '사진': ['📸', '🎨', '🖼️', '📷', '🌅'],
    '음악': ['🎵', '🎸', '🎹', '🎤', '🎧'],
    '역사': ['🏛️', '📚', '⚱️', '🗿', '📜'],
    '문화': ['🎭', '🎪', '🎨', '🏛️', '📖'],
    '스포츠': ['⚽', '🏀', '🎾', '🏃', '🚴'],
    '예술': ['🎨', '🖌️', '🎭', '🖼️', '✨'],
    '기술': ['💻', '🔬', '🚀', '⚡', '🤖'],
    '자연': ['🌿', '🌸', '🦋', '🌳', '🌺'],
  };
  
  const allEmojis = interests.flatMap(interest => emojiMap[interest] || ['✨']);
  return allEmojis.length > 0 ? allEmojis[Math.floor(Math.random() * allEmojis.length)] : '✨';
};

// 관심사 기반 랜덤 명언 생성
const getRandomQuote = (interests: string[]): string => {
  const quotes: { [key: string]: string[] } = {
    '여행': ['여행은 마음을 넓혀줍니다', '새로운 곳에서 새로운 나를 발견하세요', '모험이 기다리고 있어요'],
    '음식': ['맛있는 음식은 행복의 시작', '새로운 맛을 탐험해보세요', '요리는 사랑의 표현입니다'],
    '사진': ['순간을 영원히 담아보세요', '렌즈 너머의 세상을 발견하세요', '아름다운 순간을 기록하세요'],
    '음악': ['음악은 마음의 언어입니다', '멜로디가 당신을 위로해줄 거예요', '리듬에 몸을 맡겨보세요'],
    '역사': ['과거에서 미래를 배워요', '역사는 최고의 스승입니다', '시간을 거슬러 올라가보세요'],
    '문화': ['다양성 속에서 아름다움을 찾아요', '문화는 우리를 연결합니다', '새로운 문화를 경험해보세요'],
    '스포츠': ['건강한 몸에 건강한 정신', '도전하고 성장하세요', '운동으로 활력을 충전하세요'],
    '예술': ['창의성을 발휘해보세요', '예술은 영혼의 표현입니다', '아름다움을 창조하세요'],
    '기술': ['기술로 세상을 바꿔보세요', '혁신은 상상에서 시작됩니다', '미래를 만들어가세요'],
    '자연': ['자연과 하나가 되어보세요', '푸른 자연에서 힐링하세요', '자연의 소중함을 느껴보세요'],
  };
  
  const allQuotes = interests.flatMap(interest => quotes[interest] || ['오늘도 좋은 하루 되세요!']);
  return allQuotes.length > 0 ? allQuotes[Math.floor(Math.random() * allQuotes.length)] : '오늘도 좋은 하루 되세요!';
};

// 관심사 기반 추천 콘텐츠 생성
const getInterestBasedContent = (interests: string[]): Array<{
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}> => {
  const contentMap: { [key: string]: Array<{ icon: string; title: string; description: string; bgColor: string }> } = {
    '여행': [
      { icon: '🗺️', title: '서울 숨은 명소 탐방', description: '현지인만 아는 특별한 장소들', bgColor: 'rgba(33, 150, 243, 0.1)' },
      { icon: '📍', title: '주변 관광지 추천', description: '가까운 곳의 아름다운 여행지', bgColor: 'rgba(33, 150, 243, 0.1)' },
    ],
    '음식': [
      { icon: '🍜', title: '맛집 탐방 코스', description: '이 지역 최고의 맛집들', bgColor: 'rgba(244, 67, 54, 0.1)' },
      { icon: '👨‍🍳', title: '요리 클래스 추천', description: '새로운 요리 기술을 배워보세요', bgColor: 'rgba(244, 67, 54, 0.1)' },
    ],
    '사진': [
      { icon: '📸', title: '포토 스팟 추천', description: '인스타그램에 올릴 완벽한 장소', bgColor: 'rgba(156, 39, 176, 0.1)' },
      { icon: '🌅', title: '사진 촬영 팁', description: '더 나은 사진을 위한 노하우', bgColor: 'rgba(156, 39, 176, 0.1)' },
    ],
    '음악': [
      { icon: '🎵', title: '콘서트 정보', description: '이번 주 열리는 공연들', bgColor: 'rgba(255, 152, 0, 0.1)' },
      { icon: '🎸', title: '음악 레슨 추천', description: '새로운 악기를 배워보세요', bgColor: 'rgba(255, 152, 0, 0.1)' },
    ],
    '역사': [
      { icon: '🏛️', title: '역사 박물관 투어', description: '과거로의 시간 여행', bgColor: 'rgba(121, 85, 72, 0.1)' },
      { icon: '📚', title: '역사 도서 추천', description: '흥미진진한 역사 이야기', bgColor: 'rgba(121, 85, 72, 0.1)' },
    ],
  };
  
  const defaultContent = [
    { icon: '✨', title: '새로운 취미 찾기', description: '관심사를 설정하고 맞춤 추천을 받아보세요', bgColor: 'rgba(96, 125, 139, 0.1)' },
    { icon: '🎯', title: '목표 설정하기', description: '새로운 도전을 시작해보세요', bgColor: 'rgba(76, 175, 80, 0.1)' },
  ];
  
  if (interests.length === 0) return defaultContent;
  
  const allContent = interests.flatMap(interest => contentMap[interest] || []);
  return allContent.length > 0 ? allContent : defaultContent;
};

// 날씨 기반 추천 활동 생성
const getWeatherBasedRecommendations = (
  weatherStatus: string,
  t: (key: string) => string
): Array<{
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}> => {
  if (weatherStatus.includes('비')) {
    // 비 오는 날 추천 (6개 활동)
    return [
      {
        icon: '📚',
        title: '독서하기',
        description: '비 오는 날엔 따뜻한 실내에서 책 읽기',
        bgColor: 'rgba(96, 125, 139, 0.1)',
      },
      {
        icon: '🎬',
        title: '영화 감상',
        description: '집에서 편안하게 영화 보기',
        bgColor: 'rgba(233, 30, 99, 0.1)',
      },
      {
        icon: '🍲',
        title: '요리하기',
        description: '새로운 레시피로 요리 도전',
        bgColor: 'rgba(0, 188, 212, 0.1)',
      },
      {
        icon: '🎨',
        title: '그림 그리기',
        description: '창의적인 시간 보내기',
        bgColor: 'rgba(255, 193, 7, 0.1)',
      },
      {
        icon: '🧘',
        title: '명상하기',
        description: '빗소리와 함께 마음 정리',
        bgColor: 'rgba(103, 58, 183, 0.1)',
      },
      {
        icon: '🎵',
        title: '음악 듣기',
        description: '감성적인 음악과 함께',
        bgColor: 'rgba(233, 30, 99, 0.1)',
      },
    ];
  } else if (weatherStatus.includes('흐림')) {
    // 흐린 날 추천 (6개 활동)
    return [
      {
        icon: '🎭',
        title: '전시회 관람',
        description: '실내 문화 활동 즐기기',
        bgColor: 'rgba(255, 152, 0, 0.1)',
      },
      {
        icon: '☕',
        title: '카페 투어',
        description: '분위기 좋은 카페에서 휴식',
        bgColor: 'rgba(121, 85, 72, 0.1)',
      },
      {
        icon: '🛍️',
        title: '쇼핑하기',
        description: '실내 쇼핑몰에서 여유롭게',
        bgColor: 'rgba(156, 39, 176, 0.1)',
      },
      {
        icon: '📖',
        title: '도서관 가기',
        description: '조용한 공간에서 공부하기',
        bgColor: 'rgba(63, 81, 181, 0.1)',
      },
      {
        icon: '🎪',
        title: '박물관 방문',
        description: '역사와 문화 탐방',
        bgColor: 'rgba(255, 87, 34, 0.1)',
      },
      {
        icon: '🎯',
        title: '실내 스포츠',
        description: '볼링, 당구 등 실내 활동',
        bgColor: 'rgba(76, 175, 80, 0.1)',
      },
    ];
  } else {
    // 맑은 날 추천 (8개 활동)
    return [
      {
        icon: '🏞️',
        title: '한강 피크닉',
        description: '맑은 날씨에 야외 피크닉',
        bgColor: 'rgba(33, 150, 243, 0.1)',
      },
      {
        icon: '🚲',
        title: '자전거 타기',
        description: '상쾌한 바람과 함께 라이딩',
        bgColor: 'rgba(76, 175, 80, 0.1)',
      },
      {
        icon: '📸',
        title: '사진 촬영',
        description: '아름다운 풍경 담기',
        bgColor: 'rgba(156, 39, 176, 0.1)',
      },
      {
        icon: '🥾',
        title: '등산하기',
        description: '산에서 자연과 함께',
        bgColor: 'rgba(139, 195, 74, 0.1)',
      },
      {
        icon: '🏃',
        title: '조깅하기',
        description: '공원에서 가벼운 운동',
        bgColor: 'rgba(255, 152, 0, 0.1)',
      },
      {
        icon: '🌸',
        title: '공원 산책',
        description: '여유롭게 자연 감상',
        bgColor: 'rgba(233, 30, 99, 0.1)',
      },
      {
        icon: '⛵',
        title: '수상 스포츠',
        description: '강이나 바다에서 액티비티',
        bgColor: 'rgba(0, 188, 212, 0.1)',
      },
      {
        icon: '🎪',
        title: '야외 축제',
        description: '지역 축제나 이벤트 참여',
        bgColor: 'rgba(255, 193, 7, 0.1)',
      },
    ];
  }
};

export default UserStatusWidget;
