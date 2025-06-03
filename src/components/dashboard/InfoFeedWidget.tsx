import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  Rating,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  widgetPaperBase,
  widgetGradients,
  widgetCardBase,
  widgetChipBase,
} from './theme/dashboardWidgetTheme';
import infoApi from '../../features/info/api/infoApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n';
import { useLanguageStore } from '../../features/theme/store/languageStore';

// 정보 콘텐츠 타입 정의 (API에서 받아오는 데이터 구조에 맞춤)
interface InfoContent {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  bookmarks: number;
  rating: number;
  createdAt: string;
  matchScore?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentType: 'guide' | 'tip' | 'news' | 'tutorial';
  author: string;
}

// 정보 취향 분석 데이터
interface InfoPreferenceData {
  categoryData: { id: string; name: string; percent: number; color: string }[];
  recommendedKeywords: { id: string; name: string; weight: number }[];
}

// 카테고리별 색상 매핑
const categoryColors: Record<string, string> = {
  교통: '#03a9f4',
  '비자/법률': '#607d8b',
  '금융/세금': '#4db6ac',
  교육: '#673ab7',
  '주거/부동산': '#ff9800',
  '의료/건강': '#f44336',
  쇼핑: '#e91e63',
  '취업/직장': '#8bc34a',
  생활정보: '#2196f3',
  '문화/여가': '#9c27b0',
  기타: '#757575',
};

// 난이도별 색상
const DIFFICULTY_COLORS = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
};

// 콘텐츠 타입별 색상
const CONTENT_TYPE_COLORS = {
  guide: '#2196F3',
  tip: '#9C27B0',
  news: '#FF5722',
  tutorial: '#607D8B',
};

// 정보 아이템 컴포넌트
const InfoItem = memo(
  ({ info, onClick, t }: { info: InfoContent; onClick?: () => void; t: any }) => {
    const difficultyColor =
      info.difficulty === 'beginner'
        ? '#4caf50'
        : info.difficulty === 'intermediate'
          ? '#ff9800'
          : '#f44336';

    return (
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          borderRadius: 2,
          background:
            'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(243,254,246,0.95) 100%)',
          border: '1px solid rgba(134, 239, 172, 0.3)',
          backdropFilter: 'blur(10px)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClick
            ? {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(76, 175, 80, 0.15), 0 8px 20px rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.4)',
                background:
                  'linear-gradient(135deg, rgba(240,253,244,0.95) 0%, rgba(243,254,246,1) 100%)',
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
            background:
              'linear-gradient(90deg, rgba(76, 175, 80, 0.4), rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.4))',
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 1 }}>
            <InfoIcon sx={{ fontSize: 14, mr: 0.5, color: '#4caf50' }} />
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600, mr: 1 }}>
              {t('home.infoFeed.subtitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(info.createdAt, t)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* 매치 점수 배지 */}
            {info.matchScore && info.matchScore > 0 && (
              <Chip
                label={`${info.matchScore}%`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                  bgcolor:
                    info.matchScore > 90
                      ? 'rgba(76, 175, 80, 0.1)'
                      : info.matchScore > 80
                        ? 'rgba(33, 150, 243, 0.1)'
                        : 'rgba(255, 152, 0, 0.1)',
                  color:
                    info.matchScore > 90 ? '#4caf50' : info.matchScore > 80 ? '#2196f3' : '#ff9800',
                }}
              />
            )}

            <Chip
              label={t(`home.infoFeed.difficultyLabels.${info.difficulty}`)}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 22,
                bgcolor: `${difficultyColor}20`,
                color: difficultyColor,
              }}
            />
          </Box>
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
          {info.title}
        </Typography>

        {/* 작성자 정보 */}
        {info.author && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 20, height: 20, mr: 1 }}>
              {!info.author.includes('정보 제공자') && info.author.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {info.author}
            </Typography>
          </Box>
        )}

        {/* 하단 정보 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ fontSize: 14, color: 'action.active', mr: 0.3 }} />
            <Typography variant="caption" color="text.secondary">
              {info.views > 1000 ? `${(info.views / 1000).toFixed(1)}k` : info.views}
            </Typography>
          </Box>

          {/* 카테고리 표시 */}
          {info.category && (
            <Chip
              label={translateInfoCategory(info.category, t)}
              size="small"
              sx={{
                fontSize: '0.65rem',
                height: 18,
                bgcolor: '#e3f2fd',
                color: '#1976d2',
              }}
            />
          )}
        </Box>
      </Box>
    );
  }
);

// 시간 전 포맷 함수
const formatTimeAgo = (dateString: string, t: any): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return t('home.infoFeed.timeAgo.justNow');
  } else if (diffMinutes === 1) {
    return t('home.infoFeed.timeAgo.minuteAgo');
  } else if (diffMinutes < 60) {
    return t('home.infoFeed.timeAgo.minutesAgo', { count: diffMinutes.toString() });
  } else if (diffHours === 1) {
    return t('home.infoFeed.timeAgo.hourAgo');
  } else if (diffHours < 24) {
    return t('home.infoFeed.timeAgo.hoursAgo', { count: diffHours.toString() });
  } else if (diffDays === 1) {
    return t('home.infoFeed.timeAgo.dayAgo');
  } else {
    return t('home.infoFeed.timeAgo.daysAgo', { count: diffDays.toString() });
  }
};

// 정보 태그/카테고리 번역 함수
const translateInfoTag = (tag: string, t: any): string => {
  const tagMap: Record<string, string> = {
    // 정보 카테고리
    교육: 'infoPage.categories.education',
    '금융/세금': 'infoPage.categories.finance',
    '비자/법률': 'infoPage.categories.visa',
    쇼핑: 'infoPage.categories.shopping',
    '의료/건강': 'infoPage.categories.healthcare',
    '주거/부동산': 'infoPage.categories.housing',
    '취업/직장': 'infoPage.categories.employment',
    교통: 'infoPage.categories.transportation',

    // 일반 관심 태그
    비자: 'interestTags.visa_legal',
    법률: 'interestTags.visa_legal',
    금융: 'interestTags.finance_tax',
    세금: 'interestTags.finance_tax',
    의료: 'interestTags.healthcare',
    건강: 'interestTags.healthcare',
    주거: 'interestTags.housing_realestate',
    부동산: 'interestTags.housing_realestate',
    취업: 'interestTags.employment_workplace',
    직장: 'interestTags.employment_workplace',
    교통정보: 'interestTags.transportation_info',
  };

  return tagMap[tag] ? t(tagMap[tag]) : tag;
};

// 정보 카테고리 번역 함수
const translateInfoCategory = (category: string, t: any): string => {
  const categoryMap: Record<string, string> = {
    교육: 'infoPage.categories.education',
    '금융/세금': 'infoPage.categories.finance',
    '비자/법률': 'infoPage.categories.visa',
    쇼핑: 'infoPage.categories.shopping',
    '의료/건강': 'infoPage.categories.healthcare',
    '주거/부동산': 'infoPage.categories.housing',
    '취업/직장': 'infoPage.categories.employment',
    교통: 'infoPage.categories.transportation',
    전체: 'infoPage.categories.all',
  };

  return categoryMap[category] ? t(categoryMap[category]) : category;
};

// 정보 취향 분석 모달 컴포넌트
interface InfoPreferenceModalProps {
  open: boolean;
  onClose: () => void;
  preference: InfoPreferenceData;
  t: any;
}

const InfoPreferenceModal: React.FC<InfoPreferenceModalProps> = ({
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
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
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
              <MenuBookIcon sx={{ color: 'white', mr: 1.5, fontSize: 22 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('home.infoFeed.modal.title')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('home.infoFeed.modal.subtitle')}
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
                {t('home.infoFeed.modal.sections.keywords')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {preference.recommendedKeywords.map(keyword => {
                  const fontWeight = 400 + keyword.weight * 30;
                  const fontSize = 0.65 + keyword.weight * 0.03;
                  return (
                    <Chip
                      key={keyword.id}
                      label={translateInfoTag(keyword.name, t)}
                      size="small"
                      sx={{
                        height: 'auto',
                        py: 0.5,
                        fontSize: `${fontSize}rem`,
                        fontWeight: fontWeight,
                        bgcolor:
                          keyword.weight > 7 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        color: keyword.weight > 7 ? '#4CAF50' : 'text.primary',
                        '&:hover': {
                          bgcolor: 'rgba(76, 175, 80, 0.15)',
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
                {t('home.infoFeed.modal.sections.topCategories')}
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
                        #{index + 1} {translateInfoCategory(category.name, t)}
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

const InfoFeedWidget: React.FC = () => {
  const [content, setContent] = useState<InfoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [preference, setPreference] = useState<InfoPreferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 정보 추천 데이터 가져오기
  const fetchInfoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 정보 추천 API 호출
      const result = await infoApi.getRecommendations();
      console.log('정보 추천 API 응답:', result);

      const infoList = result?.informationList || [];
      const infoAnalysis = result?.analysis || {};

      if (infoList && infoList.length > 0) {
        // 정보 데이터를 InfoContent로 변환
        const infoContents: InfoContent[] = infoList.flat().map((info: any) => {
          let matchScore = 0;
          if (info.category && infoAnalysis[info.category]) {
            matchScore = Math.round(infoAnalysis[info.category] * 100);
          }

          // HTML 태그 제거
          const plainContent = info.content ? info.content.replace(/<[^>]*>/g, '').trim() : '';

          return {
            id: String(info.informationId || Math.random()),
            title: info.title || '',
            content: plainContent,
            category: info.category || '기타',
            views: info.views || 0,
            bookmarks: Math.floor(Math.random() * 50), // 임시 데이터
            rating: 3.5 + Math.random() * 1.5, // 임시 데이터 (3.5-5.0)
            createdAt: info.createdAt || new Date().toISOString(),
            matchScore: matchScore,
            difficulty: ['beginner', 'intermediate', 'advanced'][
              Math.floor(Math.random() * 3)
            ] as any,
            contentType: ['guide', 'tip', 'news', 'tutorial'][Math.floor(Math.random() * 4)] as any,
            author: info.userName || '정보 제공자',
          };
        });

        setContent(infoContents.slice(0, 6)); // 최대 6개만 표시

        // 분석 데이터 생성
        const categories = infoContents.reduce(
          (acc, info) => {
            const category = info.category || '기타';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const totalContent = infoContents.length;

        // 실제 API 분석 데이터 또는 계산된 데이터 사용
        let apiAnalysisData: Record<string, number> = {};

        // API에서 분석 데이터가 있으면 사용
        if (infoAnalysis && Object.keys(infoAnalysis).length > 0) {
          apiAnalysisData = infoAnalysis;
        } else {
          // 없으면 카테고리 비율로 계산
          apiAnalysisData = Object.entries(categories).reduce(
            (acc, [category, count]) => {
              acc[category] = count / totalContent;
              return acc;
            },
            {} as Record<string, number>
          );
        }

        // 분석 데이터를 정렬하고 상위 5개 추출
        const sortedAnalysis = Object.entries(apiAnalysisData)
          .map(([name, value]) => ({
            name,
            count: categories[name] || 0,
            percentage: Math.min(Math.round(value * 100), 100),
            color: categoryColors[name] || categoryColors['기타'],
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        const preferenceData: InfoPreferenceData = {
          categoryData: sortedAnalysis.map(category => ({
            id: category.name,
            name: category.name,
            percent: category.percentage,
            color: category.color,
          })),
          recommendedKeywords: sortedAnalysis
            .map(category => ({
              id: category.name,
              name: category.name,
              weight: Math.max(1, Math.min(10, Math.round(category.percentage / 10) + 1)),
            }))
            .slice(0, 6),
        };

        setPreference(preferenceData);
      } else {
        setContent([]);
        setPreference(null);
      }
    } catch (error) {
      console.error('정보 데이터 가져오기 실패:', error);
      setError('FETCH_ERROR'); // 번역 키를 위한 임시 값
    } finally {
      setIsLoading(false);
    }
  }, [language]); // language를 의존성에 추가하여 언어 변경 시 함수가 새로 생성되도록 함

  // 데이터 로딩
  useEffect(() => {
    fetchInfoData();
  }, [fetchInfoData]);

  // 언어 변경 감지 및 데이터 새로고침
  useEffect(() => {
    console.log('[DEBUG] InfoFeedWidget - 언어 변경 감지:', language);

    // 커뮤니티 피드와 동일한 방식: 로딩 상태만 설정하고 fetchData가 내부적으로 처리하도록 함
    setIsLoading(true);
    setError(null);

    // 충분한 로딩 시간을 확보하여 부드러운 전환 보장 (커뮤니티 피드와 동일한 UX)
    setTimeout(() => {
      fetchInfoData();
    }, 300); // 300ms로 늘려서 로딩 스피너가 충분히 보이도록 함
  }, [language, fetchInfoData]);

  // 모달 핸들러
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchInfoData();
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.green,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.green,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error === 'FETCH_ERROR' ? t('home.infoFeed.messages.error') : error}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{ borderRadius: 2 }}
        >
          {t('home.infoFeed.actions.retry')}
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.green,
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
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(0, 150, 136, 0.2)',
                color: '#009688',
                width: 32,
                height: 32,
                mr: 1,
              }}
            >
              <InfoIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {t('home.infoFeed.title')}
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
        <Box>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              handleRefresh();
            }}
            sx={{
              bgcolor: 'action.hover',
              mr: 1,
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              handleOpenModal();
            }}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <TrendingUpIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 정보 목록 */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {(isMobile ? !isCollapsed : true) &&
            (content.length > 0 ? (
              <List disablePadding>
                {content.map((info, index) => (
                  <React.Fragment key={info.id}>
                    <InfoItem info={info} onClick={() => navigate(`/info/${info.id}`)} t={t} />
                    {index < content.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  py: 4,
                }}
              >
                <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('home.infoFeed.messages.noInfos')}
                </Typography>
              </Box>
            ))}
        </Box>

        {/* 하단 요약 + 더보기 버튼 */}
        {content.length > 0 && (isMobile ? !isCollapsed : true) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 1, display: 'block' }}
            >
              {t('home.infoFeed.messages.infoCount', { count: content.length.toString() })}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3, width: '100%' }}
              onClick={() => navigate('/info')}
            >
              {t('home.infoFeed.actions.viewMore')}
            </Button>
          </Box>
        )}
      </Paper>

      {/* 취향 분석 모달 */}
      {preference && (
        <InfoPreferenceModal
          open={modalOpen}
          onClose={handleCloseModal}
          preference={preference}
          t={t}
        />
      )}
    </>
  );
};

export default InfoFeedWidget;
