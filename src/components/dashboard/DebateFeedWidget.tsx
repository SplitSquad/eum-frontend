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
  Alert,
  Modal,
  Backdrop,
  Fade,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import PollIcon from '@mui/icons-material/Poll';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ForumIcon from '@mui/icons-material/Forum';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  widgetPaperBase,
  widgetGradients,
  widgetCardBase,
  widgetChipBase,
} from './theme/dashboardWidgetTheme';
import DebateApi from '../../features/debate/api/debateApi';
import { Debate } from '../../features/debate/types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n';
import { useLanguageStore } from '../../features/theme/store/languageStore';

// 토론 포스트 타입 정의 (API에서 받아오는 데이터 구조에 맞춤)
interface DebatePost {
  id: string;
  title: string;
  content: string;
  category: string;
  proCount: number;
  conCount: number;
  commentCount: number;
  createdAt: string;
  matchScore?: number;
  status: 'active' | 'closed' | 'pending';
  authorName?: string;
  authorProfileImage?: string;
  agreePercent: number;
  disagreePercent: number;
  voteCount: number;
}

// 토론 취향 분석 데이터
interface DebatePreferenceData {
  categoryData: { id: string; name: string; percent: number; color: string }[];
  recommendedKeywords: { id: string; name: string; weight: number }[];
}

// 카테고리별 색상 매핑
const categoryColors: Record<string, string> = {
  '정치/사회': '#3f51b5',
  경제: '#009688',
  '과학/기술': '#2196f3',
  '생활/문화': '#f44336',
  '스포츠/레저': '#4caf50',
  엔터테인먼트: '#9c27b0',
  교육: '#673ab7',
  환경: '#795548',
  기타: '#757575',
};

// 시간 포맷팅 함수
const formatTimeAgo = (dateString: string, t: any): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1
      ? t('home.debateFeed.timeAgo.dayAgo')
      : t('home.debateFeed.timeAgo.daysAgo', { count: diffDay });
  } else if (diffHour > 0) {
    return diffHour === 1
      ? t('home.debateFeed.timeAgo.hourAgo')
      : t('home.debateFeed.timeAgo.hoursAgo', { count: diffHour });
  } else if (diffMin > 0) {
    return diffMin === 1
      ? t('home.debateFeed.timeAgo.minuteAgo')
      : t('home.debateFeed.timeAgo.minutesAgo', { count: diffMin });
  } else {
    return t('home.debateFeed.timeAgo.justNow');
  }
};

// 투표 비율 계산
const calculateVotePercentage = (
  agree: number,
  disagree: number,
  type: 'agree' | 'disagree'
): number => {
  const total = agree + disagree;
  if (total === 0) return 0;
  return type === 'agree'
    ? Math.round((agree / total) * 100)
    : Math.round((disagree / total) * 100);
};

// 토론 아이템 컴포넌트
const DebateItem = memo(
  ({ debate, onClick, t }: { debate: DebatePost; onClick?: () => void; t: any }) => {
    return (
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          borderRadius: 2,
          background:
            'linear-gradient(135deg, rgba(255,247,240,0.9) 0%, rgba(252,248,243,0.95) 100%)',
          border: '1px solid rgba(255, 204, 128, 0.3)',
          backdropFilter: 'blur(10px)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClick
            ? {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(255, 152, 0, 0.15), 0 8px 20px rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.4)',
                background:
                  'linear-gradient(135deg, rgba(255,247,240,0.95) 0%, rgba(252,248,243,1) 100%)',
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
              'linear-gradient(90deg, rgba(255, 152, 0, 0.4), rgba(255, 152, 0, 0.8), rgba(255, 152, 0, 0.4))',
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 1 }}>
            <HowToVoteIcon sx={{ fontSize: 14, mr: 0.5, color: '#3f51b5' }} />
            <Typography variant="caption" sx={{ color: '#3f51b5', fontWeight: 600, mr: 1 }}>
              {t('home.debateFeed.subtitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(debate.createdAt, t)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* 매치 점수 배지 */}
            {debate.matchScore && debate.matchScore > 0 && (
              <Chip
                label={`${debate.matchScore}%`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                  bgcolor:
                    debate.matchScore > 90
                      ? 'rgba(76, 175, 80, 0.1)'
                      : debate.matchScore > 80
                        ? 'rgba(33, 150, 243, 0.1)'
                        : 'rgba(255, 152, 0, 0.1)',
                  color:
                    debate.matchScore > 90
                      ? '#4caf50'
                      : debate.matchScore > 80
                        ? '#2196f3'
                        : '#ff9800',
                }}
              />
            )}

            <Chip
              label={t(`home.debateFeed.statusLabels.${debate.status}`)}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 22,
                bgcolor:
                  debate.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(156, 39, 176, 0.1)',
                color: debate.status === 'active' ? '#4caf50' : '#9c27b0',
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
          {debate.title}
        </Typography>

        {/* 작성자 정보 */}
        {debate.authorName && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={debate.authorProfileImage || ''} sx={{ width: 20, height: 20, mr: 1 }}>
              {!debate.authorProfileImage && debate.authorName ? (
                debate.authorName.charAt(0)
              ) : (
                <PersonIcon sx={{ fontSize: 12 }} />
              )}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {debate.authorName}
            </Typography>
          </Box>
        )}

        {/* 투표 진행률 바 */}
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUpIcon sx={{ fontSize: 12, color: '#4caf50', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {t('home.debateFeed.voteLabels.agreePercent', { percent: debate.agreePercent })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbDownIcon sx={{ fontSize: 12, color: '#f44336', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {t('home.debateFeed.voteLabels.disagreePercent', {
                  percent: debate.disagreePercent,
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: 'relative', height: 6, borderRadius: 3, bgcolor: 'action.hover' }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${debate.agreePercent}%`,
                bgcolor: '#4caf50',
                borderRadius: '3px 0 0 3px',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                height: '100%',
                width: `${debate.disagreePercent}%`,
                bgcolor: '#f44336',
                borderRadius: '0 3px 3px 0',
              }}
            />
          </Box>
        </Box>

        {/* 하단 정보 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('home.debateFeed.voteLabels.totalVotes', { count: debate.voteCount })}
          </Typography>

          {/* 카테고리 표시 */}
          {debate.category && (
            <Chip
              label={translateDebateCategory(debate.category, t)}
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

// 토론 태그/카테고리 번역 함수
const translateDebateTag = (tag: string, t: any): string => {
  const tagMap: Record<string, string> = {
    // 토론 카테고리
    '정치/사회': 'debate.categories.politics',
    경제: 'debate.categories.economy',
    '생활/문화': 'debate.categories.culture',
    '과학/기술': 'debate.categories.technology',
    '스포츠/레저': 'debate.categories.sports',
    엔터테인먼트: 'debate.categories.entertainment',
    교육: 'debate.categories.education',
    환경: 'debate.categories.environment',
    기타: 'debate.categories.all',

    // 일반 관심 태그 - 중복 키 제거하고 고유한 키로 수정
    정치: 'interestTags.politics',
    사회이슈: 'interestTags.politics', // 사회는 사회이슈로 변경
    경제정보: 'interestTags.economy', // 경제는 경제정보로 변경
    문화: 'interestTags.life_culture',
    생활정보: 'interestTags.life_culture', // 생활은 생활정보로 변경
    기술: 'interestTags.science_tech',
    과학: 'interestTags.science_tech',
    스포츠뉴스: 'interestTags.sports_news', // 스포츠는 스포츠뉴스로 변경
    연예뉴스: 'interestTags.entertainment_news', // 엔터테인먼트는 연예뉴스로 변경
  };

  return tagMap[tag] ? t(tagMap[tag]) : tag;
};

// 토론 카테고리 번역 함수
const translateDebateCategory = (category: string, t: any): string => {
  const categoryMap: Record<string, string> = {
    '정치/사회': 'debate.categories.politics',
    경제: 'debate.categories.economy',
    '생활/문화': 'debate.categories.culture',
    '과학/기술': 'debate.categories.technology',
    스포츠: 'debate.categories.sports',
    엔터테인먼트: 'debate.categories.entertainment',
    교육: 'debate.categories.education',
    환경: 'debate.categories.environment',
    기타: 'debate.categories.all',
  };

  return categoryMap[category] ? t(categoryMap[category]) : category;
};

// 토론 취향 분석 모달 컴포넌트
interface DebatePreferenceModalProps {
  open: boolean;
  onClose: () => void;
  preference: DebatePreferenceData;
  t: any;
}

const DebatePreferenceModal: React.FC<DebatePreferenceModalProps> = ({
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
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
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
              <ForumIcon sx={{ color: 'white', mr: 1.5, fontSize: 22 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('home.debateFeed.modal.title')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('home.debateFeed.modal.subtitle')}
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
                {t('home.debateFeed.modal.sections.keywords')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {preference.recommendedKeywords.map(keyword => {
                  const fontWeight = 400 + keyword.weight * 30;
                  const fontSize = 0.65 + keyword.weight * 0.03;
                  return (
                    <Chip
                      key={keyword.id}
                      label={translateDebateTag(keyword.name, t)}
                      size="small"
                      sx={{
                        height: 'auto',
                        py: 0.5,
                        fontSize: `${fontSize}rem`,
                        fontWeight: fontWeight,
                        bgcolor:
                          keyword.weight > 7 ? 'rgba(255, 152, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        color: keyword.weight > 7 ? '#FF9800' : 'text.primary',
                        '&:hover': {
                          bgcolor: 'rgba(255, 152, 0, 0.15)',
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
                {t('home.debateFeed.modal.sections.topCategories')}
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
                        #{index + 1} {translateDebateCategory(category.name, t)}
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

const DebateFeedWidget: React.FC = () => {
  const [debates, setDebates] = useState<DebatePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [preference, setPreference] = useState<DebatePreferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 토론 추천 데이터 가져오기
  const fetchDebateData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 토론 추천 API 호출
      const result = await DebateApi.getRecommendedDebates();
      console.log('토론 추천 API 응답:', result);

      const debates = result?.debates || [];
      const debateAnalysis = result?.analysis || {};

      if (debates && debates.length > 0) {
        // Debate 객체를 DebatePost로 변환
        const debatePosts: DebatePost[] = debates.map((debate: Debate) => {
          let matchScore = 0;
          if (debate.category && debateAnalysis[debate.category]) {
            matchScore = Math.round(debateAnalysis[debate.category] * 100);
          }

          return {
            id: String(debate.id),
            title: debate.title || '',
            content: debate.content || '',
            category: debate.category || '기타',
            proCount: debate.proCount || 0,
            conCount: debate.conCount || 0,
            commentCount: debate.commentCount || 0,
            createdAt: debate.createdAt,
            matchScore: matchScore,
            status: 'active' as const,
            authorName: undefined,
            authorProfileImage: undefined,
            agreePercent: calculateVotePercentage(debate.proCount, debate.conCount, 'agree'),
            disagreePercent: calculateVotePercentage(debate.proCount, debate.conCount, 'disagree'),
            voteCount: debate.proCount + debate.conCount,
          };
        });

        setDebates(debatePosts.slice(0, 6)); // 최대 6개만 표시

        // 분석 데이터 생성
        const categories = debatePosts.reduce(
          (acc, debate) => {
            const category = debate.category || '기타';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const totalDebates = debatePosts.length;

        // 실제 API 분석 데이터 또는 계산된 데이터 사용
        let apiAnalysisData: Record<string, number> = {};

        // API에서 분석 데이터가 있으면 사용
        if (debateAnalysis && Object.keys(debateAnalysis).length > 0) {
          apiAnalysisData = debateAnalysis;
        } else {
          // 없으면 카테고리 비율로 계산
          apiAnalysisData = Object.entries(categories).reduce(
            (acc, [category, count]) => {
              acc[category] = count / totalDebates;
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

        const preferenceData: DebatePreferenceData = {
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
        setDebates([]);
        setPreference(null);
      }
    } catch (error) {
      console.error('토론 데이터 가져오기 실패:', error);
      setError('FETCH_ERROR'); // 번역 키를 위한 임시 값
    } finally {
      setIsLoading(false);
    }
  }, [language]); // language를 의존성에 추가하여 언어 변경 시 함수가 새로 생성되도록 함

  // 데이터 로딩
  useEffect(() => {
    fetchDebateData();
  }, [fetchDebateData]);

  // 언어 변경 감지 및 데이터 새로고침
  useEffect(() => {
    console.log('[DEBUG] DebateFeedWidget - 언어 변경 감지:', language);

    // 언어 변경 시 즉시 로딩 상태로 전환하여 이전 데이터가 보이지 않도록 함
    setIsLoading(true);
    setDebates([]);
    setPreference(null);
    setError(null);

    // 다음 렌더 사이클에서 데이터 로딩하여 부드러운 전환 보장
    setTimeout(() => {
      fetchDebateData();
    }, 0);
  }, [language, fetchDebateData]);

  // 모달 핸들러
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchDebateData();
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.yellow,
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
          background: widgetGradients.yellow,
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
          {error === 'FETCH_ERROR' ? t('home.debateFeed.messages.error') : error}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{ borderRadius: 2 }}
        >
          {t('home.debateFeed.actions.retry')}
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
          background: widgetGradients.yellow,
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
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 152, 0, 0.2)',
              color: '#FF9800',
              width: 32,
              height: 32,
              mr: 1,
              flexShrink: 0,
            }}
          >
            <RecordVoiceOverIcon />
          </Avatar>
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
              {t('home.debateFeed.title')}
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

        {/* 토론 목록 */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {(isMobile ? !isCollapsed : true) &&
            (debates.length > 0 ? (
              <List disablePadding>
                {debates.map((debate, index) => (
                  <React.Fragment key={debate.id}>
                    <DebateItem
                      debate={debate}
                      onClick={() => navigate(`/debate/${debate.id}`)}
                      t={t}
                    />
                    {index < debates.length - 1 && <Divider sx={{ my: 0.5 }} />}
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
                <RecordVoiceOverIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('home.debateFeed.messages.noDebates')}
                </Typography>
              </Box>
            ))}
        </Box>

        {/* 하단 요약 + 더보기 버튼 */}
        {debates.length > 0 && (isMobile ? !isCollapsed : true) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 1, display: 'block' }}
            >
              {t('home.debateFeed.messages.debateCount', { count: debates.length.toString() })}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3, width: '100%' }}
              onClick={() => navigate('/debate')}
            >
              {t('home.debateFeed.actions.viewMore')}
            </Button>
          </Box>
        )}
      </Paper>

      {/* 취향 분석 모달 */}
      {preference && (
        <DebatePreferenceModal
          open={modalOpen}
          onClose={handleCloseModal}
          preference={preference}
          t={t}
        />
      )}
    </>
  );
};

export default DebateFeedWidget;
