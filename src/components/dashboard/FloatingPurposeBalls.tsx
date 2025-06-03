import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Typography,
  Avatar,
  IconButton,
  Card,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useMypageStore } from '../../features/mypage/store/mypageStore';
import { useLanguageStore } from '../../features/theme/store/languageStore';
import { 
  getContentByLanguageAndPurpose,
  SupportedLanguage,
  FloatingBallContent,
  detailLabels
} from './data/floatingBallsData';

// 사용자 목적 타입
type UserPurpose = 'travel' | 'work' | 'residence' | 'study';

// 목적별 정보
const PURPOSE_INFO: Record<UserPurpose, {
  label: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
}> = {
  travel: {
    label: '여행',
    icon: <TravelExploreIcon />,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
  },
  work: {
    label: '취업',
    icon: <WorkIcon />,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
  },
  residence: {
    label: '거주',
    icon: <HomeIcon />,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  },
  study: {
    label: '학업',
    icon: <SchoolIcon />,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
  },
};

// 동적 공 타입
interface FloatingBall {
  id: string;
  purpose: UserPurpose;
  title: string;
  description: string;
  icon: React.ReactElement;
  category: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: number;
  zIndex: number;
  data: any;
}

// 목적 매핑 함수 (KakaoMapWidget에서 가져옴)
const mapVisitPurposeToUserPurpose = (visitPurpose?: string): UserPurpose => {
  if (!visitPurpose) return 'travel';
  
  const purposeMap: Record<string, UserPurpose> = {
    'Travel': 'travel',
    'Study': 'study', 
    'Work': 'work',
    'Living': 'residence',
    'travel': 'travel',
    'study': 'study',
    'work': 'work',
    'living': 'residence',
    'residence': 'residence',
    'job': 'work'
  };

  return purposeMap[visitPurpose] || 'travel';
};

// 랜덤 위치 생성
const generateRandomPosition = (containerWidth: number, containerHeight: number, itemSize: number) => {
  const margin = itemSize / 2 + 20;
  return {
    x: Math.random() * (containerWidth - margin * 2) + margin,
    y: Math.random() * (containerHeight - margin * 2) + margin,
  };
};

// 랜덤 속도 생성
const generateRandomVelocity = () => ({
  x: (Math.random() - 0.5) * 2, // -1 ~ 1
  y: (Math.random() - 0.5) * 2,
});

const FloatingPurposeBalls: React.FC = () => {
  const { profile, fetchProfile } = useMypageStore();
  const { language } = useLanguageStore();
  
  // Internal state management
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language as SupportedLanguage || 'ko');
  const [purpose, setPurpose] = useState<'travel' | 'work' | 'residence' | 'study'>('travel');
  const [userPurpose, setUserPurpose] = useState<UserPurpose>('travel');
  const [selectedBall, setSelectedBall] = useState<FloatingBall | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [balls, setBalls] = useState<FloatingBall[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);

  // Update selectedLanguage when global language changes
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language as SupportedLanguage);
    }
  }, [language]);

  // Update purpose based on user profile
  useEffect(() => {
    if (userPurpose) {
      setPurpose(userPurpose);
    }
  }, [userPurpose]);

  // 마이페이지에서 사용자 목적 가져오기
  useEffect(() => {
    if (profile?.role) {
      const mappedPurpose = mapVisitPurposeToUserPurpose(profile.role);
      setUserPurpose(mappedPurpose);
    } else {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // 프로필이 없으면 가져오기
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // 화면 크기 측정
  const updateContainerDimensions = useCallback(() => {
    setContainerDimensions({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
  }, []);

  // 공들 초기화 (랜덤으로 3개 선택)
  const initializeBalls = useCallback(() => {
    const currentLanguage = language as SupportedLanguage;
    const contentArray = getContentByLanguageAndPurpose(currentLanguage, userPurpose);
    
    // 랜덤으로 3개 선택
    const shuffled = [...contentArray].sort(() => 0.5 - Math.random());
    const selectedContent = shuffled.slice(0, 3);
    
    const newBalls: FloatingBall[] = selectedContent.map((content, index) => ({
      id: content.id,
      purpose: userPurpose,
      title: content.title,
      description: content.description,
      icon: PURPOSE_INFO[userPurpose].icon,
      category: content.category,
      position: generateRandomPosition(containerDimensions.width, containerDimensions.height, 60 + index * 10),
      velocity: generateRandomVelocity(),
      size: 60 + index * 10, // 크기 다양화
      zIndex: Math.floor(Math.random() * 100),
      data: content.details
    }));
    
    setBalls(newBalls);
  }, [userPurpose, containerDimensions, language]);

  // 애니메이션 업데이트
  const updateAnimation = useCallback(() => {
    if (!isAnimating) return;

    setBalls(prevBalls => 
      prevBalls.map(ball => {
        let newPosition = {
          x: ball.position.x + ball.velocity.x,
          y: ball.position.y + ball.velocity.y,
        };
        let newVelocity = { ...ball.velocity };

        // 경계 충돌 검사 및 반사
        const margin = ball.size / 2;
        if (newPosition.x <= margin || newPosition.x >= containerDimensions.width - margin) {
          newVelocity.x = -newVelocity.x;
          newPosition.x = Math.max(margin, Math.min(containerDimensions.width - margin, newPosition.x));
        }
        if (newPosition.y <= margin || newPosition.y >= containerDimensions.height - margin) {
          newVelocity.y = -newVelocity.y;
          newPosition.y = Math.max(margin, Math.min(containerDimensions.height - margin, newPosition.y));
        }

        return {
          ...ball,
          position: newPosition,
          velocity: newVelocity,
        };
      })
    );

    animationRef.current = requestAnimationFrame(updateAnimation);
  }, [isAnimating, containerDimensions]);

  // 공 클릭 핸들러 (펑 터지는 효과)
  const handleBallClick = useCallback((ball: FloatingBall) => {
    setSelectedBall(ball);
    setModalOpen(true);
    setIsAnimating(false); // 애니메이션 일시 정지
    
    // 클릭 효과: 일시적으로 크기 확대
    setBalls(prevBalls => 
      prevBalls.map(prevBall => 
        prevBall.id === ball.id 
          ? { ...prevBall, size: prevBall.size * 1.5 }
          : prevBall
      )
    );
    
    // 0.3초 후 원래 크기로 복원
    setTimeout(() => {
      setBalls(prevBalls => 
        prevBalls.map(prevBall => 
          prevBall.id === ball.id 
            ? { ...prevBall, size: prevBall.size / 1.5 }
            : prevBall
        )
      );
    }, 300);
  }, []);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedBall(null);
    setTimeout(() => setIsAnimating(true), 300); // 애니메이션 재시작
  }, []);

  // 리사이즈 핸들러
  useEffect(() => {
    const handleResize = () => updateContainerDimensions();
    window.addEventListener('resize', handleResize);
    updateContainerDimensions();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateContainerDimensions]);

  // 공들 초기화
  useEffect(() => {
    if (containerDimensions.width > 0 && containerDimensions.height > 0) {
      initializeBalls();
    }
  }, [initializeBalls]);

  // 애니메이션 시작
  useEffect(() => {
    if (isAnimating && balls.length > 0) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateAnimation, isAnimating, balls.length]);

  const getLocalizedLabel = (key: string): string => {
    return detailLabels[selectedLanguage]?.[key] || detailLabels['ko'][key] || key;
  };

  return (
    <>
      {/* 플로팅 공들 컨테이너 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none', // 다른 요소와의 상호작용 방해하지 않음
          zIndex: 50, // 위젯들보다 낮은 z-index
          overflow: 'hidden',
        }}
      >
        {balls.map((ball) => (
          <Box
            key={ball.id}
            onClick={() => handleBallClick(ball)}
            sx={{ 
              position: 'absolute',
              left: ball.position.x - ball.size / 2,
              top: ball.position.y - ball.size / 2,
              width: ball.size,
              height: ball.size,
              borderRadius: '50%',
              background: PURPOSE_INFO[ball.purpose].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: ball.zIndex,
              pointerEvents: 'auto', // 클릭 가능하게 함
              '&:hover': {
                transform: 'scale(1.2)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                zIndex: 1000,
              },
              '&:active': {
                transform: 'scale(1.5)',
                transition: 'transform 0.1s ease',
              },
            }}
          >
            <Box sx={{ color: 'white', fontSize: ball.size * 0.3 }}>
              {ball.icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* 정보 상세 모달 */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backdropFilter: 'blur(4px)' }
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 600 },
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            {selectedBall && (
              <Box>
                {/* 헤더 */}
                <Box sx={{ 
                  background: PURPOSE_INFO[selectedBall.purpose].gradient,
                  color: 'white',
                  p: 3,
                  position: 'relative'
                }}>
                  <IconButton 
                    onClick={handleCloseModal} 
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 2, width: 48, height: 48 }}>
                      {selectedBall.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedBall.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {selectedBall.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={selectedBall.category}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>

                {/* 콘텐츠 */}
                <Box sx={{ p: 3, maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
                  {selectedBall.data && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* 동적 콘텐츠 렌더링 */}
                      {Object.entries(selectedBall.data).map(([key, value]) => {
                        if (!value) return null;

                        // 배열 형태의 데이터 처리
                        if (Array.isArray(value)) {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {getLocalizedLabel(key)}
                                </Typography>
                              </Box>
                              {value.map((item: string, index: number) => (
                                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                  • {item}
                                </Typography>
                              ))}
                            </Card>
                          );
                        }

                        // 객체 형태의 데이터 처리
                        if (typeof value === 'object' && value !== null) {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {getLocalizedLabel(key)}
                                </Typography>
                              </Box>
                              {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                                <Box key={subKey} sx={{ mb: 1 }}>
                                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    📌 {subKey}
                                  </Typography>
                                  <Typography variant="body2" sx={{ ml: 2, mb: 0.5 }}>
                                    {typeof subValue === 'string' ? subValue : 
                                     Array.isArray(subValue) ? subValue.join(', ') : 
                                     JSON.stringify(subValue)}
                                  </Typography>
                                </Box>
                              ))}
                            </Card>
                          );
                        }

                        // 문자열 형태의 데이터 처리 
                        if (typeof value === 'string') {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {key === 'location' ? <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'transport' ? <DirectionsTransitIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'hours' ? <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'price' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'program' ? <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'website' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'basic' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {getLocalizedLabel(key)}
                                </Typography>
                              </Box>
                              <Typography variant="body2">
                                {value}
                              </Typography>
                            </Card>
                          );
                        }

                        return null;
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FloatingPurposeBalls; 