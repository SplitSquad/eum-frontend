import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';
import { useMypageStore } from '../../features/mypage/store/mypageStore';

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

// 여행 관련 데이터 (사용자가 제공한 콘텐츠 기반)
const TRAVEL_CONTENT = [
    {
    id: 'hanbok-experience',
    title: '한복 입고 경복궁 체험',
      icon: <TravelExploreIcon />,
    category: '문화체험',
    description: '전통의상을 입고 고궁을 거닐며 인생샷을 남기세요',
    details: {
      location: '서울 종로구 세종로 161',
      transport: '지하철 3호선 경복궁역 5번 출구 도보 5분',
      hours: '매일 09:00 ~ 18:00 (매주 화요일 휴무)',
      price: '일반 입장료: 성인 3,000원 / 한복 착용 시 무료',
      tips: ['경복궁 근처에 다양한 한복 대여점이 있어요', '1시간 ~ 하루 종일 대여 가능 (약 15,000원부터)']
    }
    },
    {
    id: 'gwangjang-market',
    title: '광장시장 먹거리 투어',
      icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '한국 전통 먹거리를 저렴하게 즐길 수 있는 명소',
    details: {
      location: '서울 종로구 창경궁로 88',
      transport: '지하철 1호선 종로5가역 8번 출구 도보 2분',
      specialties: ['마약김밥 (Mini Gimbap)', '빈대떡 (Mung Bean Pancake)', '떡볶이 (Spicy Rice Cake)', '잡채, 육회 등'],
      tips: ['현금 결제가 편해요! (카드 가능한 곳도 많음)', '점심시간보다 이른 시간에 가면 덜 붐벼요']
    }
    },
    {
    id: 'temple-stay',
    title: '템플스테이: 사찰 체험',
    icon: <AccountBalanceIcon />,
    category: '문화체험',
    description: '한국의 전통 불교문화를 체험할 수 있는 특별한 프로그램',
    details: {
      locations: ['서울 조계사', '양평 전통사찰 봉선사', '경주 골굴사 (선무도 체험 가능)'],
      program: '1박 2일 또는 당일 체험',
      activities: ['명상', '사찰음식 체험', '스님과의 대화', '다도 체험'],
      price: '약 50,000 ~ 100,000원 (사찰마다 상이)',
      website: 'https://www.templestay.com'
    }
  },
    {
    id: 'korean-bbq',
    title: '한국식 바비큐',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '직접 고기를 구워 먹는 독특한 문화',
    details: {
      areas: {
        '홍대': '젊은 분위기, 영어 메뉴 가능한 곳 다수',
        '강남': '프리미엄 고깃집 많음',
        '이태원': '외국인 친화적, 다양한 고기 옵션 제공'
      },
      tips: ['고기는 직원이 구워주는 경우도 있어요!', '쌈장 + 마늘 + 채소 조합을 추천!', '대부분 1인분(150g) 기준 주문 (2인 이상 방문 추천)']
    }
    },
    {
    id: 'bibimbap',
    title: '전주 비빔밥',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '건강하고 화려한 한국 전통 음식',
    details: {
      restaurants: {
        '전주 한옥마을': '전통 비빔밥의 성지',
        '명동 고궁': '서울 중심에서 제대로 된 비빔밥',
        '인사동 한정식집': '비빔밥과 함께 전통 반찬도 제공'
      },
      tips: ['고추장이 매울 수 있어요, 양 조절 가능', '채식 비빔밥도 메뉴에 있는 경우 많아요']
    }
    },
    {
    id: 'street-food',
    title: '한국 길거리 간식 BEST 3',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '저렴하고 맛있는 길거리 간식',
    details: {
      foods: [
        '호떡 (Hotteok): 달콤한 시나몬 견과류가 들어간 겨울 간식',
        '튀김 + 떡볶이 세트: 매콤한 소스와 환상 궁합',
        '붕어빵: 생선 모양 안에 단팥 or 크림이 들어간 간식'
      ],
      locations: ['명동 거리: 다양한 종류의 포장마차', '광장시장: 저렴하고 전통적인 분위기', '홍대 걷고싶은 거리: 젊은 감성의 트렌디 간식'],
      price: '대부분 1,000원~3,000원 사이'
    }
  }
];

// 업무 관련 데이터
const WORK_CONTENT = [
    {
    id: 'job-search',
    title: '취업 정보',
      icon: <BusinessIcon />,
    category: '채용',
    description: '최신 채용 공고와 취업 정보',
    details: {
      websites: ['사람인', '잡코리아', '워크넷'],
      tips: ['정기적으로 채용공고를 확인하세요', '자기소개서는 기업별로 맞춤 작성']
    }
    },
    {
    id: 'resume-tips',
    title: '이력서 작성 팁',
    icon: <WorkIcon />,
    category: '이력서',
    description: '합격하는 이력서 작성법',
    details: {
      tips: ['경험 중심으로 작성', '구체적인 성과 기재', '맞춤법 검사 필수']
    }
    }
];

// 거주 관련 데이터
const RESIDENCE_CONTENT = [
    {
    id: 'real-estate',
    title: '부동산 정보',
    icon: <HomeIcon />,
    category: '부동산',
    description: '매물 및 시세 정보',
    details: {
      websites: ['직방', '다방', '네이버 부동산'],
      tips: ['주변 환경도 꼼꼼히 체크하세요', '교통편도 중요한 고려사항입니다']
    }
    },
    {
    id: 'convenience',
    title: '생활 편의시설',
      icon: <BusinessIcon />,
    category: '편의시설',
    description: '주변 편의시설 정보',
    details: {
      facilities: ['마트', '병원', '학교', '은행', '관공서'],
      tips: ['도보 10분 내 편의시설 확인', '대중교통 접근성 체크']
    }
  }
];

// 학업 관련 데이터
const STUDY_CONTENT = [
    {
    id: 'study-materials',
    title: '학습 자료',
    icon: <SchoolIcon />,
    category: '학습자료',
    description: '유용한 학습 리소스',
    details: {
      resources: ['온라인 강의', '도서관 자료', '스터디 그룹'],
      tips: ['계획적인 학습 스케줄 작성', '복습의 중요성']
    }
    },
    {
    id: 'study-group',
    title: '스터디 그룹',
      icon: <BusinessIcon />,
    category: '스터디',
    description: '함께 공부할 동료들',
    details: {
      benefits: ['동기부여', '정보 공유', '학습 효율 증대'],
      tips: ['비슷한 수준의 사람들과 그룹 형성', '정기적인 모임 일정 유지']
    }
  }
];

// 목적별 콘텐츠 매핑
const CONTENT_BY_PURPOSE: Record<UserPurpose, any[]> = {
  travel: TRAVEL_CONTENT,
  work: WORK_CONTENT,
  residence: RESIDENCE_CONTENT,
  study: STUDY_CONTENT,
};

// 동적 아이템 타입
interface FloatingItem {
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

// 랜덤 위치 생성
const generateRandomPosition = (containerWidth: number, containerHeight: number, itemSize: number) => {
  const margin = itemSize / 2 + 10;
  return {
    x: Math.random() * (containerWidth - margin * 2) + margin,
    y: Math.random() * (containerHeight - margin * 2) + margin,
  };
};

// 랜덤 속도 생성
const generateRandomVelocity = () => ({
  x: (Math.random() - 0.5) * 1.5, // -0.75 ~ 0.75
  y: (Math.random() - 0.5) * 1.5,
});

const PurposeFeedWidget: React.FC = () => {
  const { profile } = useMypageStore();
  const [userPurpose, setUserPurpose] = useState<UserPurpose>('travel');
  const [selectedItem, setSelectedItem] = useState<FloatingItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 250 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);

  // 마이페이지에서 사용자 목적 가져오기
  useEffect(() => {
    if (profile?.purpose) {
      // profile.purpose가 영어로 되어 있다면 매핑
      const purposeMapping: Record<string, UserPurpose> = {
        'TRAVEL': 'travel',
        'WORK': 'work', 
        'RESIDENCE': 'residence',
        'STUDY': 'study',
        '여행': 'travel',
        '취업': 'work',
        '거주': 'residence',
        '학업': 'study'
      };
      
      const mappedPurpose = purposeMapping[profile.purpose] || 'travel';
      setUserPurpose(mappedPurpose);
    }
  }, [profile]);

  // 컨테이너 크기 측정
  const updateContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: width - 20, height: height - 20 }); // 패딩 고려
    }
  }, []);

  // 아이템 초기화 (랜덤으로 3개 선택)
  const initializeItems = useCallback(() => {
    const contentArray = CONTENT_BY_PURPOSE[userPurpose] || TRAVEL_CONTENT;
    
    // 랜덤으로 3개 선택
    const shuffled = [...contentArray].sort(() => 0.5 - Math.random());
    const selectedContent = shuffled.slice(0, 3);
    
    const newItems: FloatingItem[] = selectedContent.map((content, index) => ({
      id: content.id,
      purpose: userPurpose,
      title: content.title,
      description: content.description,
      icon: content.icon,
      category: content.category,
      position: generateRandomPosition(containerDimensions.width, containerDimensions.height, 50 + index * 5),
      velocity: generateRandomVelocity(),
      size: 50 + index * 5, // 크기 다양화
      zIndex: Math.floor(Math.random() * 100),
      data: content.details
    }));
    
    setItems(newItems);
  }, [userPurpose, containerDimensions]);

  // 애니메이션 업데이트
  const updateAnimation = useCallback(() => {
    if (!isAnimating) return;

    setItems(prevItems => 
      prevItems.map(item => {
        let newPosition = {
          x: item.position.x + item.velocity.x,
          y: item.position.y + item.velocity.y,
        };
        let newVelocity = { ...item.velocity };

        // 경계 충돌 검사 및 반사
        const margin = item.size / 2;
        if (newPosition.x <= margin || newPosition.x >= containerDimensions.width - margin) {
          newVelocity.x = -newVelocity.x;
          newPosition.x = Math.max(margin, Math.min(containerDimensions.width - margin, newPosition.x));
        }
        if (newPosition.y <= margin || newPosition.y >= containerDimensions.height - margin) {
          newVelocity.y = -newVelocity.y;
          newPosition.y = Math.max(margin, Math.min(containerDimensions.height - margin, newPosition.y));
        }

        return {
          ...item,
          position: newPosition,
          velocity: newVelocity,
        };
      })
    );

    animationRef.current = requestAnimationFrame(updateAnimation);
  }, [isAnimating, containerDimensions]);

  // 아이템 클릭 핸들러 (펑 터지는 효과)
  const handleItemClick = useCallback((item: FloatingItem) => {
    setSelectedItem(item);
    setModalOpen(true);
    setIsAnimating(false); // 애니메이션 일시 정지
    
    // 클릭 효과: 일시적으로 크기 확대
    setItems(prevItems => 
      prevItems.map(prevItem => 
        prevItem.id === item.id 
          ? { ...prevItem, size: prevItem.size * 1.5 }
          : prevItem
      )
    );
    
    // 0.2초 후 원래 크기로 복원
    setTimeout(() => {
      setItems(prevItems => 
        prevItems.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, size: prevItem.size / 1.5 }
            : prevItem
        )
      );
    }, 200);
  }, []);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
    setTimeout(() => setIsAnimating(true), 300); // 애니메이션 재시작
  }, []);

  // 새로고침 핸들러 (새로운 랜덤 아이템들)
  const handleRefresh = useCallback(() => {
    initializeItems();
  }, [initializeItems]);

  // 리사이즈 핸들러
  useEffect(() => {
    const handleResize = () => updateContainerDimensions();
    window.addEventListener('resize', handleResize);
    updateContainerDimensions();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateContainerDimensions]);

  // 아이템 초기화
  useEffect(() => {
    if (containerDimensions.width > 0 && containerDimensions.height > 0) {
      initializeItems();
    }
  }, [initializeItems]);

  // 애니메이션 시작
  useEffect(() => {
    if (isAnimating && items.length > 0) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateAnimation, isAnimating, items.length]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.blue,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
          }
        }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: PURPOSE_INFO[userPurpose].color + '40', color: PURPOSE_INFO[userPurpose].color, width: 28, height: 28, mr: 1 }}>
              {PURPOSE_INFO[userPurpose].icon}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={600} fontSize="0.95rem">
              {PURPOSE_INFO[userPurpose].label} 정보
            </Typography>
          </Box>
            <IconButton 
              size="small"
              onClick={handleRefresh}
              sx={{ 
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
        </Box>

        {/* 동적 아이템 컨테이너 */}
        <Box 
          ref={containerRef}
                sx={{
            flex: 1, 
            position: 'relative',
            mx: 1,
            mb: 1,
                  borderRadius: 2,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
                }}
              >
          {items.map((item) => (
            <Box
              key={item.id}
              onClick={() => handleItemClick(item)}
                      sx={{ 
                position: 'absolute',
                left: item.position.x - item.size / 2,
                top: item.position.y - item.size / 2,
                width: item.size,
                height: item.size,
                borderRadius: '50%',
                background: PURPOSE_INFO[item.purpose].gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: item.zIndex,
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                  zIndex: 1000,
                },
                '&:active': {
                  transform: 'scale(1.5)',
                  transition: 'transform 0.1s ease',
                },
              }}
            >
              <Box sx={{ color: 'white', fontSize: item.size * 0.35 }}>
                {item.icon}
                </Box>
              </Box>
            ))}
        </Box>
      </Paper>

      {/* 아이템 상세 모달 */}
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
            {selectedItem && (
              <>
          {/* 헤더 */}
          <Box sx={{ 
                  background: PURPOSE_INFO[selectedItem.purpose].gradient,
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
                      {selectedItem.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedItem.title}
              </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {selectedItem.description}
                </Typography>
                    </Box>
                  </Box>
                <Chip 
                    label={selectedItem.category}
                  size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
          </Box>

          {/* 콘텐츠 */}
                <Box sx={{ p: 3, maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
                  {selectedItem.data && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* 위치 정보 */}
                      {selectedItem.data.location && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>위치</Typography>
                          </Box>
                          <Typography variant="body2">{selectedItem.data.location}</Typography>
                        </Card>
                      )}

                      {/* 교통 정보 */}
                      {selectedItem.data.transport && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <DirectionsTransitIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>교통편</Typography>
                          </Box>
                          <Typography variant="body2">{selectedItem.data.transport}</Typography>
                        </Card>
                      )}

                      {/* 운영시간 */}
                      {selectedItem.data.hours && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>운영시간</Typography>
                          </Box>
                          <Typography variant="body2">{selectedItem.data.hours}</Typography>
                        </Card>
                      )}

                      {/* 가격 정보 */}
                      {selectedItem.data.price && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>요금</Typography>
                          </Box>
                          <Typography variant="body2">{selectedItem.data.price}</Typography>
                        </Card>
                      )}

                      {/* 팁 */}
                      {selectedItem.data.tips && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>꿀팁</Typography>
                          </Box>
                          {selectedItem.data.tips.map((tip: string, index: number) => (
                            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                              • {tip}
                            </Typography>
                          ))}
                        </Card>
                      )}

                      {/* 추천 음식 */}
                      {selectedItem.data.specialties && (
                        <Card sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>추천 먹거리</Typography>
                          </Box>
                          {selectedItem.data.specialties.map((food: string, index: number) => (
                            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                              • {food}
                            </Typography>
                          ))}
                        </Card>
                      )}
                    </Box>
                  )}
          </Box>
              </>
            )}
        </Box>
      </Fade>
    </Modal>
    </>
  );
};

export default PurposeFeedWidget; 