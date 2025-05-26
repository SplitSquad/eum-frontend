import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Badge,
  Tooltip,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  IconButton,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ForumIcon from '@mui/icons-material/Forum';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';
import apiClient from '../../config/axios';
import DebateApi from '../../features/debate/api/debateApi';
import infoApi from '../../features/info/api/infoApi';
import { useTranslation } from '../../shared/i18n';

// 탭 타입 정의
type TabType = 'community' | 'debate' | 'info';

// 추천 키워드 인터페이스
interface RecommendedKeyword {
  id: string;
  name: string;
  weight: number; // 1-10 사이 가중치
}

// 카테고리 데이터 인터페이스
interface CategoryData {
  id: string;
  name: string;
  percent: number;
  color: string;
}

// 지역별 방문 빈도 인터페이스
interface RegionData {
  id: string;
  name: string;
  visits: number;
  avatar: string;
}

// 사용자 선호도 데이터 인터페이스
interface PreferenceData {
  categoryData: CategoryData[];
  recommendedKeywords: RecommendedKeyword[];
}

const UserPreferenceWidget: React.FC = () => {
  const { t } = useTranslation();
  
  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('community');
  const [regionData, setRegionData] = useState<RegionData[]>([]);

  // 각 탭별 선호도 데이터
  const [communityPreferences, setCommunityPreferences] = useState<PreferenceData>({
    categoryData: [],
    recommendedKeywords: [],
  });

  const [debatePreferences, setDebatePreferences] = useState<PreferenceData>({
    categoryData: [],
    recommendedKeywords: [],
  });

  const [infoPreferences, setInfoPreferences] = useState<PreferenceData>({
    categoryData: [],
    recommendedKeywords: [],
  });

  // 컬러 매핑
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
    // 토론 카테고리
    '정치/사회': '#3f51b5',
    경제: '#009688',
    '과학/기술': '#2196f3',
    '생활/문화': '#f44336',
    스포츠: '#4caf50',
    엔터테인먼트: '#9c27b0',
    // 정보 카테고리
    교통: '#03a9f4',
    '비자/법률': '#607d8b',
    '금융/세금': '#4db6ac',
    교육: '#673ab7',
    '주거/부동산': '#ff9800',
    '의료/건강': '#f44336',
    쇼핑: '#e91e63',
    '취업/직장': '#8bc34a',
  };

  // 다음 탭으로 이동
  const handleNextTab = () => {
    if (activeTab === 'community') setActiveTab('debate');
    else if (activeTab === 'debate') setActiveTab('info');
    else setActiveTab('community');
  };

  // 이전 탭으로 이동
  const handlePrevTab = () => {
    if (activeTab === 'community') setActiveTab('info');
    else if (activeTab === 'debate') setActiveTab('community');
    else setActiveTab('debate');
  };

  // 데이터 로드
  useEffect(() => {
    const loadPreferenceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 병렬로 커뮤니티와 토론, 정보 추천 API 호출
        const [communityResponse, debateResponse, infoResponse] = await Promise.all([
          // 커뮤니티 추천 API
          apiClient.get<any>('/community/post/recommendation', {
            params: { address: '자유' }, // 자유 게시글 기준 추천
          }),

          // 토론 추천 API
          DebateApi.getRecommendedDebates(),

          // 정보 추천 API
          infoApi.getRecommendations(),
        ]);

        // 1. 커뮤니티 분석 데이터 처리
        const communityAnalysis = communityResponse.analysis || {};
        if (Object.keys(communityAnalysis).length > 0) {
          // 분석 데이터를 내림차순으로 정렬
          const sortedPreferences = Object.entries(communityAnalysis)
            .map(([key, value]) => ({
              id: key,
              name: key,
              value: typeof value === 'number' ? value : 0,
            }))
            .sort((a, b) => b.value - a.value);

          // 카테고리 데이터 처리
          const topCategories = sortedPreferences.slice(0, 5).map(item => {
            // 확률값을 퍼센트로 변환 (최대 100%)
            const percent = Math.min(Math.round(item.value * 100), 100);
            return {
              id: item.id,
              name: item.name,
              percent: Math.max(percent, 1), // 최소 1% 이상으로 조정
              color:
                tagColors[item.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          });

          // 키워드 추천 데이터 처리
          const keywords = sortedPreferences.slice(0, 6).map(item => {
            // 가중치 계산 (1-10 사이)
            const weight = Math.max(1, Math.min(10, Math.round((item.value * 100) / 10) + 1));
            return {
              id: item.id,
              name: item.name,
              weight: weight,
            };
          });

          // 커뮤니티 선호도 데이터 저장
          setCommunityPreferences({
            categoryData: topCategories,
            recommendedKeywords: keywords,
          });
        }

        // 2. 토론 분석 데이터 처리
        const debateAnalysis = debateResponse?.analysis || {};
        if (Object.keys(debateAnalysis).length > 0) {
          // 분석 데이터를 내림차순으로 정렬
          const sortedPreferences = Object.entries(debateAnalysis)
            .map(([key, value]) => ({
              id: key,
              name: key,
              value: typeof value === 'number' ? value : 0,
            }))
            .sort((a, b) => b.value - a.value);

          // 카테고리 데이터 처리
          const topCategories = sortedPreferences.slice(0, 5).map(item => {
            // 확률값을 퍼센트로 변환 (최대 100%)
            const percent = Math.min(Math.round(item.value * 100), 100);
            return {
              id: item.id,
              name: item.name,
              percent: Math.max(percent, 1), // 최소 1% 이상으로 조정
              color:
                tagColors[item.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          });

          // 키워드 추천 데이터 처리
          const keywords = sortedPreferences.slice(0, 6).map(item => {
            // 가중치 계산 (1-10 사이)
            const weight = Math.max(1, Math.min(10, Math.round((item.value * 100) / 10) + 1));
            return {
              id: item.id,
              name: item.name,
              weight: weight,
            };
          });

          // 토론 선호도 데이터 저장
          setDebatePreferences({
            categoryData: topCategories,
            recommendedKeywords: keywords,
          });
        }

        // 3. 정보 분석 데이터 처리
        const infoAnalysis = infoResponse?.analysis || {};
        if (Object.keys(infoAnalysis).length > 0) {
          // 분석 데이터를 내림차순으로 정렬
          const sortedInfoPreferences = Object.entries(infoAnalysis)
            .map(([key, value]) => ({
              id: key,
              name: key,
              value: typeof value === 'number' ? value : 0,
            }))
            .sort((a, b) => b.value - a.value);

          // 카테고리 데이터 처리
          const infoCategories = sortedInfoPreferences.map(item => {
            // 확률값을 퍼센트로 변환 (최대 100%)
            const percent = Math.min(Math.round(item.value * 100), 100);
            return {
              id: item.id,
              name: item.name,
              percent: Math.max(percent, 1), // 최소 1% 이상으로 조정
              color:
                tagColors[item.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          });

          // 키워드 추천 데이터 처리
          const infoKeywords = sortedInfoPreferences.map(item => {
            // 가중치 계산 (1-10 사이)
            const weight = Math.max(1, Math.min(10, Math.round(item.value * 10) + 1));
            return {
              id: item.id,
              name: item.name,
              weight: weight,
            };
          });

          // 정보 선호도 데이터 저장
          setInfoPreferences({
            categoryData: infoCategories,
            recommendedKeywords: infoKeywords,
          });
        } else {
          // API 응답에 분석 데이터가 없는 경우 기본 더미 데이터 사용
          const infoDummyData = {
            교통: 0.45,
            '비자/법률': 0.35,
            '금융/세금': 0.25,
            교육: 0.2,
            '주거/부동산': 0.15,
          };

          // 기본 더미 데이터를 사용한 정렬 및 처리
          const sortedInfoPreferences = Object.entries(infoDummyData)
            .map(([key, value]) => ({
              id: key,
              name: key,
              value: value,
            }))
            .sort((a, b) => b.value - a.value);

          const infoCategories = sortedInfoPreferences.map(item => {
            const percent = Math.min(Math.round(item.value * 100), 100);
            return {
              id: item.id,
              name: item.name,
              percent: Math.max(percent, 1),
              color:
                tagColors[item.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          });

          const infoKeywords = sortedInfoPreferences.map(item => {
            const weight = Math.max(1, Math.min(10, Math.round(item.value * 10) + 1));
            return {
              id: item.id,
              name: item.name,
              weight: weight,
            };
          });

          setInfoPreferences({
            categoryData: infoCategories,
            recommendedKeywords: infoKeywords,
          });
        }

        // 지역 데이터 - 더미 데이터 유지 (실제 지역 데이터는 별도 API 필요)
        const regions = [
          { id: 'gangnam', name: '강남구', visits: 24, avatar: '강' },
          { id: 'mapo', name: '마포구', visits: 18, avatar: '마' },
          { id: 'jongro', name: '종로구', visits: 12, avatar: '종' },
          { id: 'yongsan', name: '용산구', visits: 8, avatar: '용' },
          { id: 'songpa', name: '송파구', visits: 5, avatar: '송' },
        ];
        setRegionData(regions);
      } catch (error) {
        console.error('선호도 데이터 로드 실패:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');

        // 에러 시 더미 데이터 사용
        const dummyCategories = [
          { id: 'restaurant', name: '음식점', percent: 35, color: '#f44336' },
          { id: 'cafe', name: '카페', percent: 25, color: '#795548' },
          { id: 'culture', name: '문화/예술', percent: 20, color: '#9c27b0' },
          { id: 'nature', name: '자연/경관', percent: 15, color: '#4caf50' },
          { id: 'shopping', name: '쇼핑', percent: 5, color: '#2196f3' },
        ];

        const dummyKeywords = [
          { id: 'italian', name: '이탈리안', weight: 9 },
          { id: 'dessert', name: '디저트', weight: 8 },
          { id: 'cafe', name: '카페', weight: 7 },
          { id: 'korean', name: '한식', weight: 7 },
          { id: 'beer', name: '맥주', weight: 6 },
          { id: 'park', name: '공원', weight: 5 },
        ];

        setCommunityPreferences({
          categoryData: dummyCategories,
          recommendedKeywords: dummyKeywords,
        });

        setDebatePreferences({
          categoryData: [
            { id: 'politics', name: '정치/사회', percent: 40, color: '#3f51b5' },
            { id: 'economy', name: '경제', percent: 30, color: '#009688' },
            { id: 'technology', name: '과학/기술', percent: 15, color: '#2196f3' },
            { id: 'culture', name: '생활/문화', percent: 10, color: '#f44336' },
            { id: 'sports', name: '스포츠', percent: 5, color: '#4caf50' },
          ],
          recommendedKeywords: [
            { id: 'ai', name: '인공지능', weight: 9 },
            { id: 'climate', name: '기후변화', weight: 8 },
            { id: 'policy', name: '정책', weight: 7 },
            { id: 'covid', name: '코로나', weight: 6 },
            { id: 'education', name: '교육', weight: 5 },
            { id: 'housing', name: '주거', weight: 4 },
          ],
        });

        setInfoPreferences({
          categoryData: [
            { id: 'education', name: '교육', percent: 30, color: '#673ab7' },
            { id: 'transport', name: '교통', percent: 25, color: '#03a9f4' },
            { id: 'visa', name: '비자/법률', percent: 20, color: '#607d8b' },
            { id: 'housing', name: '주거/부동산', percent: 15, color: '#ff9800' },
            { id: 'medical', name: '의료/건강', percent: 10, color: '#f44336' },
          ],
          recommendedKeywords: [
            { id: 'study', name: '교육', weight: 9 },
            { id: 'transport', name: '교통', weight: 8 },
            { id: 'visa', name: '비자', weight: 7 },
            { id: 'housing', name: '주거', weight: 6 },
            { id: 'medical', name: '의료', weight: 5 },
            { id: 'job', name: '취업', weight: 4 },
          ],
        });

        setRegionData([
          { id: 'gangnam', name: '강남구', visits: 24, avatar: '강' },
          { id: 'mapo', name: '마포구', visits: 18, avatar: '마' },
          { id: 'jongro', name: '종로구', visits: 12, avatar: '종' },
          { id: 'yongsan', name: '용산구', visits: 8, avatar: '용' },
          { id: 'songpa', name: '송파구', visits: 5, avatar: '송' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferenceData();
  }, []);

  // 최대 방문 수 계산
  const maxVisits = Math.max(...regionData.map(region => region.visits));

  // 활동 통계
  const activityStats = [
    {
      id: 'visits',
      name: '방문',
      value: 32,
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
      color: '#2196f3',
    },
    {
      id: 'likes',
      name: '좋아요',
      value: 18,
      icon: <FavoriteIcon sx={{ fontSize: 16 }} />,
      color: '#f44336',
    },
    {
      id: 'reviews',
      name: '리뷰',
      value: 7,
      icon: <RateReviewIcon sx={{ fontSize: 16 }} />,
      color: '#4caf50',
    },
    {
      id: 'ratings',
      name: '평점',
      value: 4.8,
      icon: <StarIcon sx={{ fontSize: 16 }} />,
      color: '#ff9800',
    },
  ];

  // 현재 활성화된 탭에 따라 데이터 선택
  const getCurrentData = (): PreferenceData => {
    switch (activeTab) {
      case 'community':
        return communityPreferences;
      case 'debate':
        return debatePreferences;
      case 'info':
        return infoPreferences;
      default:
        return communityPreferences;
    }
  };

  // 탭 제목 가져오기
  const getTabTitle = (): string => {
    switch (activeTab) {
      case 'community':
        return t('userPreference.analysis.community');
      case 'debate':
        return t('userPreference.analysis.debate');
      case 'info':
        return t('userPreference.analysis.info');
      default:
        return t('userPreference.analysis.default');
    }
  };

  // 탭 아이콘 가져오기
  const getTabIcon = () => {
    switch (activeTab) {
      case 'community':
        return <PeopleIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 22 }} />;
      case 'debate':
        return <ForumIcon sx={{ color: '#f44336', mr: 1.5, fontSize: 22 }} />;
      case 'info':
        return <NewspaperIcon sx={{ color: '#4caf50', mr: 1.5, fontSize: 22 }} />;
      default:
        return <ShowChartIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 22 }} />;
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.yellow,
          p: 2.5,
          height: '100%',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t('userPreference.loading')}
          </Typography>
        </Box>
      </Paper>
    );
  }

  const currentData = getCurrentData();

  return (
    <Paper
      elevation={0}
      sx={{
        ...widgetPaperBase,
        background: widgetGradients.yellow,
        p: 2.5,
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 배경 장식 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33,150,243,0.05) 0%, rgba(33,150,243,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
        {getTabIcon()}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
            {getTabTitle()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('userPreference.analysis.recentActivity')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IconButton
            size="small"
            onClick={handlePrevTab}
            sx={{
              width: 26,
              height: 26,
              bgcolor: 'background.paper',
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleNextTab}
            sx={{
              width: 26,
              height: 26,
              ml: 0.5,
              bgcolor: 'background.paper',
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>

      {/* 스크롤 가능한 메인 컨텐츠 */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pb: 1, zIndex: 1 }}>
        {/* 태그 클라우드 - 추천 키워드 */}
        <Box
          sx={{
            mb: 2,
            position: 'relative',
            zIndex: 1,
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'rgba(250,250,250,0.7)',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
          >
            <LoyaltyIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
            {t('userPreference.keywords.title')}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {currentData.recommendedKeywords.map(keyword => {
              // 가중치에 따라 스타일 조정
              const fontWeight = 400 + keyword.weight * 30;
              const fontSize = 0.65 + keyword.weight * 0.03;
              return (
                <Chip
                  key={keyword.id}
                  label={keyword.name}
                  size="small"
                  sx={{
                    height: 'auto',
                    py: 0.5,
                    fontSize: `${fontSize}rem`,
                    fontWeight: fontWeight,
                    bgcolor: keyword.weight > 7 ? 'rgba(63, 81, 181, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
        <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
          >
            <LocalOfferIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            {t('userPreference.categories.title')}
          </Typography>

          {currentData.categoryData.slice(0, 5).map((category, index) => (
            <Box key={category.id} sx={{ mb: index !== 4 ? 1 : 0 }}>
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
                  <Typography variant="caption" color="text.secondary">
                    {category.name}
                  </Typography>
                </Box>
                <Typography variant="caption" fontWeight={600} color={category.color}>
                  {category.percent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={category.percent}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  mb: 1,
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

        {/* 모바일 친화적인 인디케이터 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: activeTab === 'community' ? 'primary.main' : 'action.disabled',
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: activeTab === 'debate' ? 'primary.main' : 'action.disabled',
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: activeTab === 'info' ? 'primary.main' : 'action.disabled',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserPreferenceWidget;
