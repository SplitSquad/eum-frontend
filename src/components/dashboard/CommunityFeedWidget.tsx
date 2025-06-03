import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Modal,
  Backdrop,
  Fade,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ForumIcon from '@mui/icons-material/Forum';
import { useTranslation } from '../../shared/i18n';
import {
  widgetPaperBase,
  widgetGradients,
  widgetTabsBase,
  widgetCardBase,
  widgetChipBase,
} from './theme/dashboardWidgetTheme';
import CommunityService, { Post } from '../../services/community/communityService';
import WeatherService from '../../services/weather/weatherService';
import { env } from '@/config/env';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/axios';
import { useLanguageStore } from '../../features/theme/store/languageStore';

// 배열을 랜덤하게 섞는 유틸리티 함수 (DynamicFeedWidget과 동일)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 포스트 소스별 라벨 매핑 - i18n 적용
const getSourceLabel = (source: string, t: (key: string) => string): string => {
  const sourceLabels: Record<string, string> = {
    community: t('home.communityFeed.sourceLabels.community'),
    discussion: t('home.communityFeed.sourceLabels.discussion'),
    debate: t('home.communityFeed.sourceLabels.debate'),
    information: t('home.communityFeed.sourceLabels.information'),
  };
  return sourceLabels[source] || source;
};

// 소스별 색상 매핑 (DynamicFeedWidget과 동일)
const sourceColors: Record<string, string> = {
  community: '#2196f3',
  discussion: '#9c27b0',
  debate: '#3f51b5',
  information: '#4caf50',
};

// 시간 포맷팅 유틸리티 함수 - i18n 적용
const formatTimeAgo = (dateString: string, t: (key: string) => string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1
      ? t('home.communityFeed.timeAgo.oneDayAgo')
      : `${diffDay}${t('home.communityFeed.timeAgo.daysAgo')}`;
  } else if (diffHour > 0) {
    return diffHour === 1
      ? t('home.communityFeed.timeAgo.oneHourAgo')
      : `${diffHour}${t('home.communityFeed.timeAgo.hoursAgo')}`;
  } else if (diffMin > 0) {
    return diffMin === 1
      ? t('home.communityFeed.timeAgo.oneMinuteAgo')
      : `${diffMin}${t('home.communityFeed.timeAgo.minutesAgo')}`;
  } else {
    return t('home.communityFeed.timeAgo.justNow');
  }
};

// 주소 정제 함수 (DynamicFeedWidget과 동일)
const formatAddress = (address: string): string => {
  if (!address || address === '자유') return '자유';

  const parts = address.split(' ');

  if (parts.length >= 3) {
    const city = parts[0]; // 예: 서울특별시
    const district = parts[1]; // 예: 중구, 양천구
    let dong = parts[2]; // 예: 장충동, 목2동, 장충동2가

    // "가"가 포함된 주소는 그대로 사용 (장충동2가 형태)
    if (dong.endsWith('가')) {
      return `${city} ${district} ${dong}`;
    }

    // 일반 "동"으로 끝나는 주소에서는 숫자만 제거
    if (dong.endsWith('동')) {
      // 숫자를 제거하되 '동' 부분은 유지 (목2동 -> 목동)
      const dongName = dong.replace(/(\D+)(\d+)(동)/, '$1$3');
      return `${city} ${district} ${dongName}`;
    }

    // 기타 케이스
    return `${city} ${district} ${dong}`;
  } else if (parts.length >= 2) {
    // 시/도와 구/군만 있는 경우
    return `${parts[0]} ${parts[1]}`;
  }

  return address;
};

// UserPreferenceWidget과 동일한 색상 매핑
const tagColors: Record<string, string> = {
  '주거지 관리/유지': '#f44336',
  '기숙사/주거': '#ff9800',
  '행정/비자/서류': '#3f51b5',
  '학사/캠퍼스': '#9c27b0',
  '학업지원/시설': '#673ab7',
  '생활환경/편의': '#4caf50',
  '알바/파트타임': '#2196f3',
  '관광/체험': '#009688',
  '숙소/지역': '#795548',
  '식도락/맛집': '#e91e63',
  '비자/법률/노동': '#607d8b',
  '문화/생활': '#ff5722',
  '이력/채용': '#8bc34a',
  '교통/이동': '#03a9f4',
  '부동산/계약': '#9e9e9e',
  '잡페어/네트워킹': '#cddc39',
  '대사관/응급': '#f44336',
  여행: '#2196f3',
  맛집: '#f44336',
  사진: '#9c27b0',
  음악: '#4caf50',
  역사: '#ff9800',
  영화: '#795548',
  독서: '#607d8b',
  예술: '#e91e63',
  스포츠: '#00bcd4',
  취미: '#673ab7',
  일상: '#009688',
  질문: '#3f51b5',
  정보: '#4db6ac',
  기타: '#757575',
};

// 커뮤니티 취향 분석 데이터
interface CommunityPreferenceData {
  categoryData: { id: string; name: string; percent: number; color: string }[];
  recommendedKeywords: { id: string; name: string; weight: number }[];
}

// PostItem 컴포넌트 (DynamicFeedWidget과 동일)
const PostItem = memo(
  ({ post, onClick, t }: { post: Post; onClick?: () => void; t: (key: string) => string }) => {
    // 소스에 따라 다른 스타일 적용
    const sourceColor = sourceColors[post.source] || '#757575';

    // 카테고리 색상
    const categoryColor = post.categoryColor || '#757575';

    // 매칭 점수 색상 계산
    const matchScoreColor = useMemo(() => {
      if (!post.matchScore) return '#757575';
      if (post.matchScore > 90) return '#388e3c';
      if (post.matchScore > 80) return '#1976d2';
      return '#f57c00';
    }, [post.matchScore]);

    // 매칭 점수 배경색 계산
    const matchScoreBgColor = useMemo(() => {
      if (!post.matchScore) return 'rgba(0,0,0,0.04)';
      if (post.matchScore > 90) return 'rgba(76, 175, 80, 0.1)';
      if (post.matchScore > 80) return 'rgba(33, 150, 243, 0.1)';
      return 'rgba(255, 152, 0, 0.1)';
    }, [post.matchScore]);

    // 게시글 유형에 따른 아이콘 결정
    const getSourceIcon = () => {
      switch (post.source) {
        case 'community':
          return <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        case 'discussion':
          return <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        case 'debate':
          return <CommentIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        case 'information':
          return <ErrorOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        default:
          return null;
      }
    };

    return (
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          borderRadius: 2,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(10px)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClick
            ? {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)',
              }
            : {},
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${sourceColor}40, ${sourceColor}80, ${sourceColor}40)`,
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 1 }}>
            {getSourceIcon()}
            <Typography variant="caption" sx={{ color: sourceColor, fontWeight: 600, mr: 1 }}>
              {getSourceLabel(post.source, t)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(post.createdAt, t)}
            </Typography>
          </Box>

          {/* 매칭 점수 배지 */}
          {post.matchScore && post.matchScore > 0 && (
            <Chip
              label={`${post.matchScore}%`}
              size="small"
              sx={{
                ...widgetChipBase,
                bgcolor: matchScoreBgColor,
                color: matchScoreColor,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}
        </Box>

        {/* 제목 */}
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Typography>

        {/* 작성자 정보 */}
        {post.author && post.author.name && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={post.author.profileImagePath || ''} sx={{ width: 20, height: 20, mr: 1 }}>
              {!post.author.profileImagePath && post.author.name ? (
                post.author.name.charAt(0)
              ) : (
                <PersonIcon sx={{ fontSize: 12 }} />
              )}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {post.author.name}
            </Typography>
          </Box>
        )}

        {/* 내용 미리보기 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.content}
        </Typography>

        {/* 주소 정보 (모임 게시글의 경우) */}
        {post.address && post.address !== '자유' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'action.active', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {post.address}
            </Typography>
          </Box>
        )}

        {/* 하단 정보 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUpAltIcon sx={{ fontSize: 14, color: 'action.active', mr: 0.3 }} />
              <Typography variant="caption" color="text.secondary">
                {post.likeCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ fontSize: 14, color: 'action.active', mr: 0.3 }} />
              <Typography variant="caption" color="text.secondary">
                {post.commentCount}
              </Typography>
            </Box>
          </Box>

          {/* 태그 표시 */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {post.tags.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  label={translateCommunityTag(tag, t)}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 18,
                    bgcolor: tagColors[tag] || '#e0e0e0',
                    color: 'white',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

// 커뮤니티 태그 번역 함수
const translateCommunityTag = (tag: string, t: (key: string) => string): string => {
  // 커뮤니티 태그 매핑
  const tagMap: Record<string, string> = {
    // 여행 태그
    '관광/체험': 'interestTags.tourism',
    '식도락/맛집': 'interestTags.food_tour',
    '교통/이동': 'interestTags.transportation',
    '숙소/지역정보': 'interestTags.accommodation',
    '대사관/응급': 'interestTags.embassy',

    // 생활 태그
    '부동산/계약': 'interestTags.realestate',
    '생활환경/편의': 'interestTags.living_env',
    '문화/생활': 'interestTags.cultural_living',
    '주거지 관리/유지': 'interestTags.housing_mgmt',

    // 유학 태그
    '학사/캠퍼스': 'interestTags.academic',
    '학업지원/시설': 'interestTags.study_support',
    '행정/비자/서류': 'interestTags.admin_visa',
    '기숙사/주거': 'interestTags.dormitory',

    // 취업 태그
    '이력/채용준비': 'interestTags.resume',
    '비자/법률/노동': 'interestTags.visa_law',
    '잡페어/네트워킹': 'interestTags.job_networking',
    '알바/파트타임': 'interestTags.part_time',

    // 카테고리 태그
    여행: 'mainCategories.travel',
    주거: 'mainCategories.living',
    유학: 'mainCategories.study',
    취업: 'mainCategories.job',
  };

  return tagMap[tag] ? t(tagMap[tag]) : tag;
};

// 커뮤니티 카테고리 번역 함수
const translateCommunityCategory = (category: string, t: (key: string) => string): string => {
  const categoryMap: Record<string, string> = {
    여행: 'mainCategories.travel',
    주거: 'mainCategories.living',
    유학: 'mainCategories.study',
    취업: 'mainCategories.job',
    자유: 'community.postTypes.free',
    모임: 'community.postTypes.meeting',
  };

  return categoryMap[category] ? t(categoryMap[category]) : category;
};

// 커뮤니티 취향 분석 모달 컴포넌트 (UserPreferenceWidget 스타일)
interface CommunityPreferenceModalProps {
  open: boolean;
  onClose: () => void;
  preference: CommunityPreferenceData;
  t: (key: string) => string;
}

const CommunityPreferenceModal: React.FC<CommunityPreferenceModalProps> = ({
  open,
  onClose,
  preference,
  t,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: 'blur(4px)' },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 500 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: 3,
            overflow: 'hidden',
            animation: 'modalSlideIn 0.3s ease-out',
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 3,
              position: 'relative',
            }}
          >
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ color: 'white', mr: 1.5, fontSize: 22 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('home.communityFeed.modal.title')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('home.communityFeed.modal.subtitle')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 콘텐츠 */}
          <Box sx={{ p: 3, maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
            {/* 추천 키워드 */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}
              >
                <LoyaltyIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                {t('home.communityFeed.modal.sections.keywords')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {preference.recommendedKeywords.map(keyword => {
                  const fontWeight = 400 + keyword.weight * 30;
                  const fontSize = 0.65 + keyword.weight * 0.03;
                  return (
                    <Chip
                      key={keyword.id}
                      label={translateCommunityTag(keyword.name, t)}
                      size="small"
                      sx={{
                        height: 'auto',
                        py: 0.5,
                        fontSize: `${fontSize}rem`,
                        fontWeight: fontWeight,
                        bgcolor:
                          keyword.weight > 7 ? 'rgba(63, 81, 181, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        color: keyword.weight > 7 ? 'primary.main' : 'text.primary',
                        '&:hover': {
                          bgcolor: 'rgba(63, 81, 181, 0.15)',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* 카테고리별 선호도 */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}
              >
                <LocalOfferIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                {t('home.communityFeed.modal.sections.topCategories')}
              </Typography>

              {preference.categoryData.slice(0, 5).map((category, index) => (
                <Box key={category.id} sx={{ mb: index !== 4 ? 1.5 : 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: category.color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        #{index + 1} {translateCommunityTag(category.name, t)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color={category.color}>
                      {category.percent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={category.percent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(0,0,0,0.04)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: category.color,
                        backgroundImage: `linear-gradient(90deg, ${category.color}90, ${category.color})`,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const CommunityFeedWidget: React.FC = () => {
  const [isCommunitySubTabOpen, setIsCommunitySubTabOpen] = useState(true); // 바로 서브탭 열린 상태로 시작
  const [communitySubTab, setCommunitySubTab] = useState<'자유' | '모임'>('자유');
  const [jaYuPosts, setJaYuPosts] = useState<Post[]>([]);
  const [moimPosts, setMoimPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [preference, setPreference] = useState<CommunityPreferenceData | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 유저 위치 정보 가져오기 (DynamicFeedWidget과 동일)
  const getUserLocation = useCallback(async (): Promise<string> => {
    try {
      if (userLocation) return userLocation;

      const position = await WeatherService.getCurrentPosition();

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
      const address = await new Promise<string>(resolve => {
        geocoder.coord2RegionCode(
          position.longitude,
          position.latitude,
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              const city = result[0].region_1depth_name;
              const district = result[0].region_2depth_name;
              const dong = result[0].region_3depth_name || '';

              const address = dong ? `${city} ${district} ${dong}` : `${city} ${district}`;
              const formattedAddress = formatAddress(address);

              resolve(formattedAddress);
            } else {
              resolve('자유');
            }
          }
        );
      });

      setUserLocation(address);
      return address;
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      return '자유';
    }
  }, []);

  // 데이터 로딩 함수 (DynamicFeedWidget과 동일)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userAddress = await getUserLocation();

      // 병렬로 모든 종류의 게시글을 가져오기
      try {
        // 자유/모임 게시글 주소 설정
        const jaYuAddress = '자유';
        const moimAddress = userAddress;

        // 병렬로 API 호출
        const [jaYuPostsData, moimPostsData] = await Promise.all([
          // 자유 게시글 - address를 '자유'로 설정
          CommunityService.getRecommendedPosts(jaYuAddress, 4),

          // 모임 게시글 - 현재 위치 정보 사용
          CommunityService.getRecommendedPosts(moimAddress, 4),
        ]);

        // 자유 게시글 필터링 및 설정 - source가 community인 글만
        const filteredJaYuPosts = jaYuPostsData.filter(post => post.source === 'community');
        setJaYuPosts(filteredJaYuPosts.length > 0 ? filteredJaYuPosts : []);

        // 모임 게시글 필터링 및 설정 - source가 discussion인 글만
        const filteredMoimPosts = moimPostsData.filter(post => post.source === 'discussion');
        setMoimPosts(filteredMoimPosts.length > 0 ? filteredMoimPosts : []);

        // 분석 데이터 생성
        const allPosts = [...filteredJaYuPosts, ...filteredMoimPosts];
        const totalPosts = allPosts.length;
        const totalLikes = allPosts.reduce((sum, post) => sum + post.likeCount, 0);
        const totalComments = allPosts.reduce((sum, post) => sum + post.commentCount, 0);

        // 실제 API에서 분석 데이터 가져오기 (사용자 취향 기반)
        let analysisData: Record<string, number> = {};

        try {
          // 커뮤니티 분석 데이터 가져오기 (사용자 취향 기반)
          const communityResponse = await apiClient.get<any>('/community/post/recommendation', {
            params: { address: '자유' },
          });

          if (communityResponse.analysis) {
            analysisData = communityResponse.analysis;
            console.log('사용자 취향 분석 데이터:', analysisData);
          }
        } catch (error) {
          console.log('커뮤니티 분석 데이터 가져오기 실패:', error);
        }

        // API에서 받은 분석 데이터를 그대로 사용하여 모달 데이터 생성
        // API 분석 데이터를 퍼센트로 변환하고 정렬
        const sortedAnalysis = Object.entries(analysisData)
          .map(([name, value]) => ({
            id: name,
            name,
            percent: Math.round(value * 100), // 0~1 값을 0~100으로 변환
            color: tagColors[name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }))
          .sort((a, b) => b.percent - a.percent) // 높은 퍼센트부터 정렬
          .slice(0, 5); // 상위 5개만

        // 키워드 생성 (상위 6개)
        const keywords = Object.entries(analysisData)
          .map(([name, value]) => ({
            id: name,
            name,
            weight: Math.max(1, Math.min(10, Math.round((value * 100) / 10) + 1)),
          }))
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 6);

        const preferenceData: CommunityPreferenceData = {
          categoryData: sortedAnalysis,
          recommendedKeywords: keywords,
        };

        setPreference(preferenceData);
        console.log('커뮤니티 선호도 데이터 설정:', preferenceData);
      } catch (err) {
        console.error('게시글 데이터 가져오기 실패:', err);
        throw err;
      }
    } catch (err) {
      console.error('Feed 데이터 로딩 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [getUserLocation]);

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 탭이 변경될 때 데이터 다시 로드
  useEffect(() => {
    if (isCommunitySubTabOpen) {
      loadData();
    }
  }, [communitySubTab, isCommunitySubTabOpen, loadData]);

  // 언어 변경 감지 및 데이터 새로고침
  useEffect(() => {
    console.log('[DEBUG] CommunityFeedWidget - 언어 변경 감지:', language);
    loadData();
  }, [language, loadData]);

  // 로딩 컴포넌트
  const renderLoading = useCallback(
    () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    ),
    []
  );

  // 에러 컴포넌트
  const renderError = useCallback(
    () => (
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon />}
        sx={{ mt: 2 }}
        action={
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={loadData}>
            {t('home.communityFeed.actions.retry')}
          </Button>
        }
      >
        {error === '데이터를 불러오는 중 오류가 발생했습니다.'
          ? t('home.communityFeed.messages.error')
          : error}
      </Alert>
    ),
    [error, loadData, t]
  );

  // 데이터 없음 컴포넌트
  const renderEmpty = useCallback(
    (message: string) => (
      <Box
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            mb: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <ErrorOutlineIcon color="action" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    ),
    []
  );

  // 탭 렌더링 (DynamicFeedWidget과 동일)
  const renderTabs = useCallback(() => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={communitySubTab}
          onChange={(_, v) => setCommunitySubTab(v)}
          sx={{ ...widgetTabsBase, flex: 1 }}
        >
          <Tab label={t('home.communityFeed.tabs.free')} value="자유" />
          <Tab label={t('home.communityFeed.tabs.meeting')} value="모임" />
        </Tabs>
      </Box>
    );
  }, [communitySubTab, t]);

  // 현재 탭에 따른 컨텐츠 렌더링
  const renderTabContent = useMemo(() => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    // 커뮤니티 하위 탭 컨텐츠
    const posts = communitySubTab === '자유' ? jaYuPosts : moimPosts;
    const emptyMessage =
      communitySubTab === '자유'
        ? t('home.communityFeed.messages.noFreePosts')
        : t('home.communityFeed.messages.noMeetingPosts');

    return posts.length > 0
      ? posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onClick={() => navigate(`/community/post/${post.id}`)}
            t={t}
          />
        ))
      : renderEmpty(emptyMessage);
  }, [
    isLoading,
    error,
    communitySubTab,
    jaYuPosts,
    moimPosts,
    renderLoading,
    renderError,
    renderEmpty,
    navigate,
    t,
  ]);

  // 모달 핸들러
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.purple,
          height: isMobile ? (isCollapsed ? '56px' : 'auto') : '100%',
          ...(isMobile && { minHeight: 'unset', maxHeight: 'unset', flex: 'unset' }),
          overflow: isMobile && isCollapsed ? 'hidden' : 'auto',
          transition: 'height 0.2s',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* 헤더 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <PeopleIcon sx={{ mr: 1, color: 'primary.main', flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                width: '100%',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t('home.communityFeed.title')}
            </Typography>
          </Box>
          <IconButton
            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1, flexShrink: 0 }}
            size="small"
            onClick={() => setIsCollapsed(v => !v)}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* 상단 탭/소탭 */}
        {(isMobile ? !isCollapsed : true) && renderTabs()}

        {/* 탭별 컨텐츠 */}
        <Box sx={{ overflowY: 'auto', flex: 1, pb: 2 }}>
          {(isMobile ? !isCollapsed : true) && renderTabContent}
        </Box>

        {/* 더보기 버튼 */}
        {(isMobile ? !isCollapsed : true) && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                onClick={() => navigate('/community')}
              >
                {communitySubTab === '자유'
                  ? t('home.communityFeed.actions.seeMoreFree')
                  : t('home.communityFeed.actions.seeMoreMeeting')}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* 취향 분석 모달 */}
      {preference && (
        <CommunityPreferenceModal
          open={modalOpen}
          onClose={handleCloseModal}
          preference={preference}
          t={t}
        />
      )}
    </>
  );
};

export default CommunityFeedWidget;
