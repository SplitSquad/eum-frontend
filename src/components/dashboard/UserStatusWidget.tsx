import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Chip, Divider, LinearProgress, AvatarGroup, Button, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RecommendIcon from '@mui/icons-material/Recommend';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorIcon from '@mui/icons-material/Error';
import UserService, { UserProfile, UserPreference, UserActivity } from '../../services/user/userService';
// @ts-ignore - 모듈을 찾을 수 없다는 오류를 무시
import WeatherService, { WeatherInfo } from '../../services/weather/weatherService';

interface RecommendItem {
  id: string;
  text: string;
  category: 'travel' | 'food' | 'activity' | 'event';
  match: number; // 매칭 점수 (0-100)
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
  // 사용자 정보 상태
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPreference, setUserPreference] = useState<UserPreference | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
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
      { day: '모레', icon: '🌧️', temp: 22 }
    ]
  });
  // 위치 정보 상태 추가
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  }>({
    latitude: 37.5665,
    longitude: 126.978,
    address: '서울시 강남구'
  });
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);

  // 샘플 AI 추천 데이터
  const recommendations: RecommendItem[] = [
    { id: '1', text: '석촌호수 벚꽃 축제', category: 'event', match: 95 },
    { id: '2', text: '북촌 한옥마을 탐방', category: 'travel', match: 88 },
    { id: '3', text: '강남 신상 카페 탐방', category: 'food', match: 82 },
    { id: '4', text: '남산 둘레길 트레킹', category: 'activity', match: 76 },
  ];

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel': return { color: '#2196f3', bg: '#e3f2fd' };
      case 'food': return { color: '#f44336', bg: '#ffebee' };
      case 'activity': return { color: '#4caf50', bg: '#e8f5e9' };
      case 'event': return { color: '#9c27b0', bg: '#f3e5f5' };
      default: return { color: '#757575', bg: '#f5f5f5' };
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'travel': return '여행';
      case 'food': return '맛집';
      case 'activity': return '활동';
      case 'event': return '행사';
      default: return '';
    }
  };
  
  // 유저 경험치
  const userExp = 75; // 백분율 (0-100)
  const userLevel = userProfile?.userId ? Math.floor(userProfile.userId % 20 + 1) : 1; // 임시로 userId를 이용해 레벨 생성
  const nextLevel = userLevel + 1;

  // 현재 시간
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  
  // 시간대별 인사말
  const getGreeting = () => {
    if (hours < 12) return '좋은 아침이에요';
    if (hours < 17) return '즐거운 오후예요';
    return '편안한 저녁이에요';
  };

  // 최근 달성한 뱃지
  const recentAchievement = {
    name: "탐험가",
    description: "10개 이상의 새로운 장소 방문",
    icon: "🌟",
    date: "오늘"
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

  // 사용자 정보 및 날씨 정보 가져오기
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
                      const region = result[0].region_1depth_name + ' ' + 
                                    result[0].region_2depth_name;
                      
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
            address = profile?.address || 
              `위도 ${position.latitude.toFixed(4)}, 경도 ${position.longitude.toFixed(4)}`;
          }
          
          setUserLocation({
            latitude: position.latitude,
            longitude: position.longitude,
            address
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
          role: 'ROLE_USER'
        });
        
        setUserPreference({
          userId: 1234,
          language: 'ko',
          nation: 'KR',
          interests: ['여행', '음식', '사진', '음악', '역사']
        });
        
        setUserActivities([
          { id: '1', type: '로그인', date: '오늘', streak: 7 },
          { id: '2', type: '리뷰 작성', date: '3일 전', streak: 0 },
          { id: '3', type: '장소 저장', date: '1주일 전', streak: 0 },
        ]);
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
          flexDirection: 'column'
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          {isMapScriptLoaded ? '사용자 정보를 불러오는 중입니다...' : '지도 정보를 준비하는 중입니다...'}
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
        flexDirection: 'column'
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
            alignItems: 'center'
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
          zIndex: 0
        }} 
      />
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2,
          position: 'relative', 
          zIndex: 1,
          height: '100%'
        }}
      >
        {/* 좌측 컬럼: 유저 프로필 + 액티비티 */}
        <Box sx={{ flex: { xs: '1', md: '7' }, width: { xs: '100%', md: '60%' } }}>
          {/* 유저 프로필 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={userProfile?.profileImagePath || ""} 
                alt={userProfile?.name || "사용자"}
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mr: 2,
                  border: '2px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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
                  border: '2px solid white'
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
                    fontSize: '0.7rem'
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
                      bgcolor: 'rgba(0,0,0,0.05)'
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {/* 날씨 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WbSunnyIcon sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
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
                    {now.toLocaleDateString('ko-KR', { weekday: 'short', month: 'short', day: 'numeric' })}
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
                    활동 중
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* 유저 활동 리스트 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              최근 활동
            </Typography>
            
            <List disablePadding sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              mb: 2
            }}>
              {userActivities.length > 0 ? userActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
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
                        label={`${activity.streak}일`}
                        sx={{ 
                          height: 24, 
                          bgcolor: 'rgba(244, 67, 54, 0.1)', 
                          color: 'error.main',
                          '& .MuiChip-icon': { 
                            color: 'error.main',
                            marginLeft: '4px' 
                          }
                        }}
                      />
                    )}
                  </ListItem>
                  {index < userActivities.length - 1 && <Divider component="li" />}
                </React.Fragment>
              )) : (
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        최근 활동 내역이 없습니다
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
            
            {/* 최근 달성 뱃지 */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box sx={{ 
                mr: 2, 
                width: 40, 
                height: 40, 
                bgcolor: 'warning.light', 
                color: 'warning.dark', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                fontSize: '1.5rem'
              }}>
                {recentAchievement.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    새로운 뱃지 획득
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {recentAchievement.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {recentAchievement.description}
                </Typography>
              </Box>
              <Chip 
                label={recentAchievement.date} 
                size="small"
                sx={{ 
                  height: 20, 
                  fontSize: '0.65rem',
                  bgcolor: 'background.default'
                }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* 우측 컬럼: AI 추천 + 관심사 */}
        <Box sx={{ flex: { xs: '1', md: '5' }, width: { xs: '100%', md: '40%' } }}>
          {/* AI 추천 섹션 */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                AI 맞춤 추천
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              mb: 2
            }}>
              <List disablePadding>
                {recommendations.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1.5, display: 'block' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <RecommendIcon sx={{ mt: 0.5, mr: 1.5, color: 'primary.light' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {item.text}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Chip 
                            label={getCategoryLabel(item.category)} 
                            size="small"
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              bgcolor: getCategoryColor(item.category).bg,
                              color: getCategoryColor(item.category).color,
                            }}
                          />
                          <Typography variant="caption" sx={{ 
                            color: 
                              item.match > 90 ? 'success.main' :
                              item.match > 80 ? 'primary.main' :
                              'text.secondary'
                          }}>
                            {item.match}% 매치
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Button 
                fullWidth
                variant="outlined" 
                size="small"
                endIcon={<OpenInNewIcon />}
                sx={{ mt: 1, borderRadius: 2, textTransform: 'none' }}
              >
                더 많은 추천 보기
              </Button>
            </Box>
          </Box>
          
          {/* 관심사 섹션 */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              날씨 기반 맞춤 추천
            </Typography>
            
            <Box sx={{ 
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              mb: 2
            }}>
              {/* 날씨 정보 표시 */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2, 
                pb: 2, 
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Box sx={{ 
                  mr: 2, 
                  width: 50, 
                  height: 50, 
                  bgcolor: 'primary.light', 
                  color: 'primary.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '1.8rem'
                }}>
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
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                mb: 2,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                {weatherInfo.forecast.map((day: {
                  day: string;
                  icon: string;
                  temp: number;
                  minTemp?: number;
                  maxTemp?: number;
                  precipitationProbability?: number;
                }, index: number) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {day.day}
                    </Typography>
                    <Box sx={{ fontSize: '1.8rem', mb: 0.5 }}>
                      {day.icon}
                    </Box>
                    <Typography variant="body2">
                      {day.temp}°C
                    </Typography>
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
                ))}
              </Box>
              
              {/* 날씨 기반 추천 활동 */}
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                오늘 같은 날씨에 어울리는 활동
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {getWeatherBasedRecommendations(weatherInfo.current).map((item, index) => (
                  <Box key={index} sx={{ 
                      p: 1.5, 
                      borderRadius: 1.5, 
                    bgcolor: item.bgColor,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
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
              
              <Button 
                fullWidth
                variant="outlined" 
                size="small"
                sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
              >
                더 많은 추천 보기
              </Button>
            </Box>
          </Box>
          
          {/* 알림 섹션 */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <NotificationsActiveIcon sx={{ fontSize: 20, color: 'primary.main', mr: 1.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                알림 설정
              </Typography>
              <Typography variant="caption" color="text.secondary">
                중요 이벤트와 알림을 받아보세요
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                minWidth: 'unset',
                borderRadius: 2,
                boxShadow: 'none',
                px: 2,
                textTransform: 'none'
              }}
            >
              설정
            </Button>
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

// 날씨 기반 추천 활동 생성
const getWeatherBasedRecommendations = (weatherStatus: string): Array<{
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}> => {
  if (weatherStatus.includes('비')) {
    // 비 오는 날 추천
    return [
      { 
        icon: '📚', 
        title: '독서하기 좋은 날', 
        description: '최근 인기 도서 추천',
        bgColor: 'rgba(96, 125, 139, 0.1)'
      },
      { 
        icon: '🎬', 
        title: '영화 감상', 
        description: 'OTT 인기 콘텐츠 추천',
        bgColor: 'rgba(233, 30, 99, 0.1)'
      },
      { 
        icon: '🍲', 
        title: '요리 도전하기', 
        description: '비 오는 날 어울리는 레시피',
        bgColor: 'rgba(0, 188, 212, 0.1)'
      }
    ];
  } else if (weatherStatus.includes('흐림')) {
    // 흐린 날 추천
    return [
      { 
        icon: '🎭', 
        title: '전시회 관람', 
        description: '현재 진행중인 전시회 정보',
        bgColor: 'rgba(255, 152, 0, 0.1)'
      },
      { 
        icon: '☕', 
        title: '카페 투어', 
        description: '주변 인기 카페 탐방하기',
        bgColor: 'rgba(121, 85, 72, 0.1)'
      },
      { 
        icon: '🛍️', 
        title: '쇼핑하기', 
        description: '시즌 오프 세일 정보',
        bgColor: 'rgba(156, 39, 176, 0.1)'
      }
    ];
  } else {
    // 맑은 날 추천
    return [
      { 
        icon: '🏞️', 
        title: '한강공원 피크닉', 
        description: '좋은 날씨, 공원에서 소풍 어때요?',
        bgColor: 'rgba(33, 150, 243, 0.1)'
      },
      { 
        icon: '🚲', 
        title: '자전거 라이딩', 
        description: '한강변 자전거 코스 추천',
        bgColor: 'rgba(76, 175, 80, 0.1)'
      },
      { 
        icon: '📸', 
        title: '야외 사진 촬영', 
        description: '좋은 빛으로 인생샷을 남겨보세요',
        bgColor: 'rgba(156, 39, 176, 0.1)'
      }
    ];
  }
};

export default UserStatusWidget; 