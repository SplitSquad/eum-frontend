import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Debate } from '../types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  List,
  ListItemText,
  ListItemButton,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  Button,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { styled } from '@mui/material/styles';
import { PieChart } from 'react-minimal-pie-chart';

import DebateLayout from '../components/common/DebateLayout';
import { formatDate } from '../utils/dateUtils';

import { useTranslation } from '@/shared/i18n';

// 스타일 컴포넌트
const CategoryItem = styled(ListItemButton)(({ theme }) => ({
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  '& .MuiListItemText-primary': {
    fontWeight: 500,
  },
}));

const IssueSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const IssueTitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const IssueSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#222',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.25rem',
}));

const GrayFireIcon = styled('span')(({ theme }) => ({
  fontSize: '1.5rem',
  marginRight: theme.spacing(0.5),
  color: '#888',
  display: 'inline-flex',
  alignItems: 'center',
}));

const ViewAllLink = styled(Link)(({ theme }) => ({
  marginLeft: 'auto',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const DebateCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(4px)',
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}));

const DebateCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const DebateItemWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
}));

interface CategoryIndicatorProps {
  color?: string;
}

const CategoryIndicator = styled(Box, {
  shouldForwardProp: prop => prop !== 'color',
})<CategoryIndicatorProps>(({ color }) => ({
  width: 6,
  backgroundColor: color || '#1976d2',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
}));

// 카테고리 뱃지 버튼 스타일
const CategoryBadgeButton = styled(Button)<{ bgcolor: string; selected: boolean }>(
  ({ bgcolor, selected, theme }) => ({
    background: selected ? bgcolor : '#f5f5f5',
    color: selected ? '#fff' : bgcolor,
    fontWeight: 600,
    borderRadius: 20,
    minWidth: 0,
    padding: '6px 18px',
    margin: '0 8px 8px 0',
    boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
    border: selected ? `2px solid ${bgcolor}` : '2px solid transparent',
    transition: 'all 0.15s',
    '&:hover': {
      background: selected ? bgcolor : '#e0e0e0',
      color: selected ? '#fff' : bgcolor,
      border: `2px solid ${bgcolor}`,
    },
  })
);

interface CategoryBadgeProps {
  color?: string;
}

const CategoryBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'color',
})<CategoryBadgeProps>(({ color }) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: 4,
  backgroundColor: color || '#e0e0e0',
  color: '#fff',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 8,
}));

const VoteProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const VoteProgressBar = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 8,
  backgroundColor: '#f0f0f0',
  borderRadius: 4,
  overflow: 'hidden',
  display: 'flex',
}));

interface BarProps {
  width: number;
}

const AgreeBar = styled(Box, {
  shouldForwardProp: prop => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#4caf50',
}));

const DisagreeBar = styled(Box, {
  shouldForwardProp: prop => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#f44336',
}));

const FlagWrapper = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: 14,
  marginLeft: theme.spacing(1),
}));

const SidebarContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgb(255, 255, 255)',
  backdropFilter: 'blur(8px)',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  position: 'sticky',
  top: theme.spacing(2),
  maxHeight: `calc(100vh - ${theme.spacing(4)})`,
  overflowY: 'auto',
  alignSelf: 'flex-start',
  zIndex: 5,
  width: '100%',
  padding: 0,
}));

// Enhanced Debate type based on usage in this component
interface EnhancedDebate extends Debate {
  category?: string; // 카테고리가 없을 수 있으므로 optional로 변경
  description?: string;
  content: string; // 원본 Debate 인터페이스의 content 필드 명시
  agreeCount?: number; // DebateListPage.tsx와의 호환성을 위해 추가
  disagreeCount?: number; // DebateListPage.tsx와의 호환성을 위해 추가
}

// 스페셜 이슈 사이드바 컴포넌트
const SpecialIssueSidebar: React.FC<{
  selectedSpecialLabel: 'special' | 'today' | 'hot' | 'balanced';
  setSelectedSpecialLabel: (v: 'special' | 'today' | 'hot' | 'balanced') => void;
  t: any;
  navigate: any;
}> = ({ selectedSpecialLabel, setSelectedSpecialLabel, t, navigate }) => (
  <Box
    sx={{ p: 2, borderRadius: 2, background: '#fafbfc', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)' }}
  >
    <Box
      sx={{
        borderBottom: '1.5px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        pb: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={selectedSpecialLabel === 'special' ? 700 : 500}
        color={selectedSpecialLabel === 'special' ? 'primary' : 'inherit'}
        sx={{ userSelect: 'none', cursor: 'pointer' }}
        onClick={() => setSelectedSpecialLabel('special')}
      >
        {t('debate.specialIssues')}
      </Typography>
    </Box>
    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        variant={selectedSpecialLabel === 'today' ? 'contained' : 'outlined'}
        color="warning"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => setSelectedSpecialLabel('today')}
        fullWidth
      >
        {t('debate.todayIssue')}
      </Button>
      <Button
        variant={selectedSpecialLabel === 'hot' ? 'contained' : 'outlined'}
        color="error"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => setSelectedSpecialLabel('hot')}
        fullWidth
      >
        {t('debate.mostHotIssue')}
      </Button>
      <Button
        variant={selectedSpecialLabel === 'balanced' ? 'contained' : 'outlined'}
        color="secondary"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => setSelectedSpecialLabel('balanced')}
        fullWidth
      >
        {t('debate.halfAndHalfIssue')}
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        sx={{
          fontWeight: 600,
          borderRadius: 2,
          textAlign: 'left',
          color: '#555',
          borderColor: '#e0e0e0',
          background: '#fff',
          mt: 1,
          '&:hover': {
            background: '#f0f0f0',
            borderColor: '#bdbdbd',
          },
        }}
        onClick={() => navigate('/debate/list')}
        fullWidth
      >
        {t('debate.oldIssues')}
      </Button>
    </Box>
  </Box>
);

// 카테고리 사이드바 컴포넌트 (뱃지 버튼 형태)
const CategorySidebar: React.FC<{
  selectedCategory: string;
  setSelectedCategory: (v: any) => void;
  selectedSpecialLabel: string;
  setSelectedSpecialLabel: (v: 'special' | 'today' | 'hot' | 'balanced') => void;
  categoryMappings: Record<string, { code: string; display: string }>;
  t: any;
  navigate: any;
  fetchDebates: any;
}> = ({
  selectedCategory,
  setSelectedCategory,
  selectedSpecialLabel,
  setSelectedSpecialLabel,
  categoryMappings,
  t,
  navigate,
  fetchDebates,
}) => {
  // 카테고리별 색상
  const badgeColors: Record<string, string> = {
    all: '#757575',
    politics: '#1976d2',
    economy: '#ff9800',
    culture: '#4caf50',
    technology: '#9c27b0',
    sports: '#f44336',
    entertainment: '#2196f3',
  };
  return (
    <Box sx={{ p: 2, borderRadius: 2, background: '#fff', boxShadow: 'none' }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t('debate.categories.title')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
        {Object.entries(categoryMappings).map(([key, { display }]) => (
          <CategoryBadgeButton
            key={key}
            bgcolor={badgeColors[key] || '#757575'}
            selected={selectedCategory === key && selectedSpecialLabel === 'special'}
            onClick={() => {
              setSelectedCategory(key as typeof selectedCategory);
              setSelectedSpecialLabel('special');
              const apiCategory = categoryMappings[key].code;
              if (key === 'all') {
                navigate('/debate/list');
              } else {
                fetchDebates(1, 20, apiCategory);
              }
            }}
          >
            {display}
          </CategoryBadgeButton>
        ))}
      </Box>
    </Box>
  );
};

const MainIssuesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    debates,
    isLoading: storeLoading,
    error: storeError,
    getDebates,
    todayIssues,
    hotIssue,
    balancedIssue,
    loadingTodayIssues,
    loadingHotIssue,
    loadingBalancedIssue,
    todayIssuesError,
    hotIssueError,
    balancedIssueError,
    fetchSpecialIssues,
    fetchTodayIssues,
    fetchHotIssue,
    fetchBalancedIssue,
  } = useDebateStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const categoryMappings = {
    all: {
      code: '',
      display: t('debate.categories.all'),
    },
    politics: {
      code: '정치/사회',
      display: t('debate.categories.politics'),
    },
    economy: {
      code: '경제',
      display: t('debate.categories.economy'),
    },
    culture: {
      code: '생활/문화',
      display: t('debate.categories.culture'),
    },
    technology: {
      code: '과학/기술',
      display: t('debate.categories.technology'),
    },
    sports: {
      code: '스포츠',
      display: t('debate.categories.sports'),
    },
    entertainment: {
      code: '엔터테인먼트',
      display: t('debate.categories.entertainment'),
    },
  };

  // special label 상태 추가
  const [selectedSpecialLabel, setSelectedSpecialLabel] = useState<
    'special' | 'today' | 'hot' | 'balanced'
  >('special');
  // selectedCategory는 항상 key값('all', 'politics', ...)으로 관리
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'politics' | 'economy' | 'culture' | 'technology' | 'sports' | 'entertainment'
  >('all');
  const { isLoading: loading, error, getDebates: fetchDebates } = useDebateStore();

  // 카테고리 목록 (API 호출용)
  const categories: Record<string, string> = Object.values(categoryMappings).reduce(
    (acc, { code, display }) => ({
      ...acc,
      [display]: code,
    }),
    {}
  );

  // 카테고리별 색상
  const categoryColors = {
    POLITICS: '#42a5f5', // 진한 파스텔 블루
    ECONOMY: '#ffb300', // 진한 파스텔 오렌지
    CULTURE: '#66bb6a', // 진한 파스텔 그린
    TECHNOLOGY: '#ab47bc', // 진한 파스텔 퍼플
    SPORTS: '#e57373', // 진한 파스텔 레드
    ENTERTAINMENT: '#29b6f6', // 진한 파스텔 하늘색
  };

  // 특별 라벨
  const specialLabels = {
    1: { text: t('debate.todayIssue'), color: '#ff9800' },
    2: { text: t('debate.mostHotIssue'), color: '#f44336' },
    3: { text: t('debate.halfAndHalfIssue'), color: '#9c27b0' },
  };

  // 카테고리 한글명 → 번역 텍스트 매핑
  const categoryNameMap: Record<string, string> = {
    '정치/사회': t('debate.categories.politics'),
    경제: t('debate.categories.economy'),
    '생활/문화': t('debate.categories.culture'),
    '과학/기술': t('debate.categories.technology'),
    스포츠: t('debate.categories.sports'),
    엔터테인먼트: t('debate.categories.entertainment'),
    기타: t('debate.categories.etc'),
  };

  useEffect(() => {
    // 일반 토론 목록 가져오기 (기본 목록 페이지일 경우)
    getDebates();

    // 모든 특별 이슈를 한 번의 API 호출로 가져오기
    fetchSpecialIssues();
  }, [getDebates, fetchSpecialIssues]);

  const handleDebateClick = (id: number) => {
    navigate(`/debate/${id}`);
  };

  const handleCategoryClick = (key: string) => {
    const apiCategory = categoryMappings[key].code;
    if (key === 'all') {
      navigate('/debate/list');
    } else {
      setSelectedCategory(key as typeof selectedCategory);
      fetchDebates(1, 20, apiCategory);
    }
  };

  // 필터링된 토론 목록
  const filteredDebates = React.useMemo(() => {
    const apiCategory = categoryMappings[selectedCategory].code;
    if (!apiCategory) return debates;
    return debates.filter((debate: any) => {
      const debateCategory = debate.category || '';
      return debateCategory === apiCategory;
    });
  }, [selectedCategory, debates]);

  // 찬성/반대 비율 계산
  const calculateVoteRatio = (agree: number, disagree: number) => {
    const total = agree + disagree;
    if (total === 0) return { agree: 50, disagree: 50 };

    const agreePercent = Math.round((agree / total) * 100);
    return {
      agree: agreePercent,
      disagree: 100 - agreePercent,
    };
  };

  // 사이드바 렌더링
  const renderSidebar = () => (
    <SidebarContainer sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SpecialIssueSidebar
        selectedSpecialLabel={selectedSpecialLabel}
        setSelectedSpecialLabel={setSelectedSpecialLabel}
        t={t}
        navigate={navigate}
      />
      <CategorySidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSpecialLabel={selectedSpecialLabel}
        setSelectedSpecialLabel={setSelectedSpecialLabel}
        categoryMappings={categoryMappings}
        t={t}
        navigate={navigate}
        fetchDebates={fetchDebates}
      />
    </SidebarContainer>
  );

  // 토론 카드 렌더링
  const renderDebateCard = (
    debate: EnhancedDebate,
    specialLabel: { text: string; color: string } | null = null
  ) => {
    if (!debate) return null;
    const category = debate.category || '';
    // 카테고리 색상 매핑 (한글 → 영문)
    const categoryKeyMap: Record<string, keyof typeof categoryColors> = {
      '정치/사회': 'POLITICS',
      경제: 'ECONOMY',
      '생활/문화': 'CULTURE',
      '과학/기술': 'TECHNOLOGY',
      스포츠: 'SPORTS',
      엔터테인먼트: 'ENTERTAINMENT',
    };
    const categoryKey = categoryKeyMap[category] || undefined;
    const categoryColor = (categoryKey && categoryColors[categoryKey]) || '#bdbdbd';
    const voteRatio = calculateVoteRatio(debate.proCount, debate.conCount);
    const description = debate.description || debate.content || '';

    // Pie chart 데이터
    const pieData = [
      {
        title: '찬성',
        value: voteRatio.agree,
        color: '#81C784', // 한 단계 더 진한 연한 초록
      },
      {
        title: '반대',
        value: voteRatio.disagree,
        color: '#E57373', // 한 단계 더 진한 연한 빨강
      },
    ];

    // Pie chart 스타일: 찬/반 사이에 여백
    const pieLineWidth = 18;
    const pieGap = 14; // 각도 단위로 여백

    let backgroundStyle = 'rgba(255, 255, 255, 0.5)';
    const agreePercent = voteRatio.agree;
    const disagreePercent = voteRatio.disagree;
    const difference = Math.abs(agreePercent - disagreePercent);
    if (difference <= 5) {
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(240,240,240,0.4), rgba(255,255,255,0.8))';
    } else if (agreePercent > disagreePercent) {
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(220, 240, 220, 0.3), rgba(255,255,255,0.8))';
    } else {
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(240, 220, 220, 0.3), rgba(255,255,255,0.8))';
    }

    return (
      <DebateCard
        key={debate.id}
        onClick={() => handleDebateClick(debate.id)}
        sx={{ background: backgroundStyle }}
      >
        <CardActionArea>
          <DebateItemWrapper>
            <CategoryIndicator color={categoryColor} />
            <DebateCardContent
              sx={{
                width: '100%',
                pl: 3,
                pr: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {specialLabel && (
                  <CategoryBadge color={specialLabel.color}>{specialLabel.text}</CategoryBadge>
                )}
                <Typography
                  variant="body2"
                  color={categoryColor}
                  sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                  component="div"
                >
                  {categoryNameMap[category] || category || t('debate.categories.etc')}
                  <FlagWrapper>
                    <FlagIcon fontSize="small" />
                    {t('debate.korea')}
                  </FlagWrapper>
                </Typography>
                <Typography variant="h6" component="div" fontWeight={600} gutterBottom>
                  {debate.title}
                </Typography>
                <Typography variant="body2" color="#888" sx={{ mb: 1 }}>
                  {formatDate(debate.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </Typography>
              </Box>
              <Box
                sx={{
                  minWidth: 120,
                  ml: 2,
                  pr: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <PieChart
                  data={pieData}
                  lineWidth={pieLineWidth}
                  paddingAngle={pieGap}
                  rounded
                  style={{ height: 120, width: 120 }}
                  label={() => ''}
                  startAngle={-90}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1.5,
                    mt: 1,
                  }}
                >
                  <Typography
                    sx={{ color: '#81C784', fontWeight: 700, fontSize: '0.75rem', lineHeight: 1 }}
                  >
                    {t('debate.yes')} {voteRatio.agree}%
                  </Typography>
                  <Typography
                    sx={{ color: '#E57373', fontWeight: 700, fontSize: '0.75rem', lineHeight: 1 }}
                  >
                    {t('debate.no')} {voteRatio.disagree}%
                  </Typography>
                </Box>
              </Box>
            </DebateCardContent>
          </DebateItemWrapper>
        </CardActionArea>
      </DebateCard>
    );
  };

  // 오늘의 이슈 섹션
  const renderTodayIssues = () => {
    console.log('renderTodayIssues - 현재 todayIssues 데이터:', todayIssues);

    return (
      <IssueSection>
        <IssueTitleWrapper>
          <IssueSectionTitle variant="h5">{t('debate.todayIssue')}</IssueSectionTitle>
        </IssueTitleWrapper>

        {loadingTodayIssues ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : todayIssuesError ? (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography color="error">{todayIssuesError}</Typography>
          </Paper>
        ) : todayIssues.length > 0 ? (
          todayIssues.map(debate => renderDebateCard(debate as EnhancedDebate, specialLabels[1]))
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(240,240,240,0.7)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#888' }}>
              등록된 토론이 없습니다.
            </Typography>
          </Paper>
        )}
      </IssueSection>
    );
  };

  // 모스트 핫 이슈 섹션
  const renderHotIssues = () => {
    return (
      <IssueSection>
        <IssueTitleWrapper>
          <IssueSectionTitle variant="h5">{t('debate.mostHotIssue')}</IssueSectionTitle>
        </IssueTitleWrapper>

        {loadingHotIssue ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : hotIssueError ? (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography color="error">{hotIssueError}</Typography>
          </Paper>
        ) : hotIssue ? (
          renderDebateCard(hotIssue as EnhancedDebate, specialLabels[2])
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(240,240,240,0.7)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#888' }}>
              등록된 토론이 없습니다.
            </Typography>
          </Paper>
        )}
      </IssueSection>
    );
  };

  // 반반 이슈 섹션
  const renderBalancedIssues = () => {
    return (
      <IssueSection>
        <IssueTitleWrapper>
          <IssueSectionTitle variant="h5">{t('debate.halfAndHalfIssue')}</IssueSectionTitle>
        </IssueTitleWrapper>

        {loadingBalancedIssue ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : balancedIssueError ? (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography color="error">{balancedIssueError}</Typography>
          </Paper>
        ) : balancedIssue ? (
          renderDebateCard(balancedIssue as EnhancedDebate, specialLabels[3])
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(240,240,240,0.7)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#888' }}>
              등록된 토론이 없습니다.
            </Typography>
          </Paper>
        )}
      </IssueSection>
    );
  };

  // 메인 컨텐츠 렌더링
  const renderContent = () => {
    if (selectedSpecialLabel === 'special') {
      return (
        <Box>
          {renderTodayIssues()}
          {renderHotIssues()}
          {renderBalancedIssues()}
        </Box>
      );
    }
    if (selectedSpecialLabel === 'today') {
      return <Box>{renderTodayIssues()}</Box>;
    }
    if (selectedSpecialLabel === 'hot') {
      return <Box>{renderHotIssues()}</Box>;
    }
    if (selectedSpecialLabel === 'balanced') {
      return <Box>{renderBalancedIssues()}</Box>;
    }
    // 기존 카테고리별 렌더링
    return (
      <Box>
        {selectedCategory === 'all' ? (
          <>
            {renderTodayIssues()}
            {renderHotIssues()}
            {renderBalancedIssues()}
          </>
        ) : (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" fontWeight={600}>
                {categoryMappings[selectedCategory].display} {t('debate.name')}
              </Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : error ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Typography color="error">{error}</Typography>
              </Paper>
            ) : filteredDebates.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'rgba(240,240,240,0.7)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#888' }}>
                  {categoryMappings[selectedCategory].display} {t('debate.noIssues')}
                </Typography>
              </Paper>
            ) : (
              filteredDebates.map(debate => renderDebateCard(debate as EnhancedDebate))
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <DebateLayout
      sidebar={renderSidebar()}
      specialLabelText={
        selectedSpecialLabel === 'special'
          ? t('debate.specialIssues')
          : selectedSpecialLabel === 'today'
            ? t('debate.todayIssue')
            : selectedSpecialLabel === 'hot'
              ? t('debate.mostHotIssue')
              : selectedSpecialLabel === 'balanced'
                ? t('debate.halfAndHalfIssue')
                : undefined
      }
    >
      {renderContent()}
    </DebateLayout>
  );
};

export default MainIssuesPage;
