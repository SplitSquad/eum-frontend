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
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { styled } from '@mui/material/styles';

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
  background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
}));

const FireIcon = styled('span')(({ theme }) => ({
  fontSize: '1.5rem',
  marginRight: theme.spacing(0.5),
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
    POLITICS: '#1976d2',
    ECONOMY: '#ff9800',
    CULTURE: '#4caf50',
    TECHNOLOGY: '#9c27b0',
    SPORTS: '#f44336',
    ENTERTAINMENT: '#2196f3',
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
    <SidebarContainer>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t('debate.categories.title')}
        </Typography>
      </Box>
      <List disablePadding>
        {Object.entries(categoryMappings).map(([key, { display }]) => (
          <CategoryItem
            key={key}
            selected={selectedCategory === key}
            onClick={() => handleCategoryClick(key)}
          >
            <ListItemText primary={display} />
          </CategoryItem>
        ))}
      </List>
    </SidebarContainer>
  );

  // 토론 카드 렌더링
  const renderDebateCard = (
    debate: EnhancedDebate,
    specialLabel: { text: string; color: string } | null = null
  ) => {
    if (!debate) return null; // debate가 null이면 렌더링하지 않음

    // category 필드 안전하게 처리
    const category = debate.category || '';
    const categoryColor = (categoryColors as Record<string, string>)[category] || '#757575';
    const voteRatio = calculateVoteRatio(debate.proCount, debate.conCount);

    // content를 description으로 사용 (description이 없는 경우)
    const description = debate.description || debate.content || '';

    let backgroundStyle = 'rgba(255, 255, 255, 0.5)'; // 기본 배경색
    const agreePercent = voteRatio.agree;
    const disagreePercent = voteRatio.disagree;
    const difference = Math.abs(agreePercent - disagreePercent);

    if (difference <= 5) {
      // 차이가 5% 미만일 경우: 연한 주황색에서 흰색으로 그라데이션
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(255, 218, 185, 0.4), rgba(255, 255, 255, 0.8))';
    } else if (agreePercent > disagreePercent) {
      // 찬성이 높을 경우: 연한 연두색에서 흰색으로 그라데이션
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(144, 238, 144, 0.3), rgba(255, 255, 255, 0.8))';
    } else {
      // 반대가 높을 경우: 연한 빨간색에서 흰색으로 그라데이션
      backgroundStyle =
        'linear-gradient(to bottom right, rgba(255, 182, 193, 0.3), rgba(255, 255, 255, 0.8))';
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
            <DebateCardContent sx={{ width: '100%', pl: 3 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <Box>
                  {specialLabel && (
                    <CategoryBadge color={specialLabel.color}>{specialLabel.text}</CategoryBadge>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
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
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(debate.createdAt)}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
              </Typography>

              <VoteProgressWrapper>
                <Typography variant="body2" fontWeight={600} color="#4caf50" width={40}>
                  {voteRatio.agree}%
                </Typography>
                <VoteProgressBar>
                  <AgreeBar width={voteRatio.agree} />
                  <DisagreeBar width={voteRatio.disagree} />
                </VoteProgressBar>
                <Typography variant="body2" fontWeight={600} color="#f44336" width={40}>
                  {voteRatio.disagree}%
                </Typography>
              </VoteProgressWrapper>
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
          <IssueSectionTitle variant="h5">
            <FireIcon>🔥</FireIcon>
            {t('debate.todayIssue')}
            <FireIcon>🔥</FireIcon>
          </IssueSectionTitle>
          <ViewAllLink to="/debate/list">{t('debate.moreIssue')} &gt;</ViewAllLink>
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
              backgroundColor: 'rgba(253, 217, 217, 0.59)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#E91E63' }}>
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
          <IssueSectionTitle variant="h5">
            <FireIcon>🔥</FireIcon>
            {t('debate.mostHotIssue')}
            <FireIcon>🔥</FireIcon>
          </IssueSectionTitle>
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
              backgroundColor: 'rgba(253, 217, 217, 0.59)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#E91E63' }}>
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
          <IssueSectionTitle variant="h5">
            <FireIcon>🔥</FireIcon>
            {t('debate.halfAndHalfIssue')}
            <FireIcon>🔥</FireIcon>
          </IssueSectionTitle>
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
              backgroundColor: 'rgba(253, 217, 217, 0.59)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: '#E91E63' }}>
              등록된 토론이 없습니다.
            </Typography>
          </Paper>
        )}
      </IssueSection>
    );
  };

  // 이전 이슈 링크
  const renderOldIssuesLink = () => (
    <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
      <Link
        to="/debate/list"
        style={{
          color: '#666',
          textDecoration: 'none',
          fontSize: '1rem',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '20px',
          display: 'inline-block',
        }}
      >
        {t('debate.oldIssues')}
      </Link>
    </Box>
  );

  // 메인 컨텐츠 렌더링
  const renderContent = () => (
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
                backgroundColor: 'rgba(253, 217, 217, 0.59)',
                backdropFilter: 'blur(4px)',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                {categoryMappings[selectedCategory].display} {t('debate.noIssues')}
              </Typography>
            </Paper>
          ) : (
            filteredDebates.map(debate => renderDebateCard(debate as EnhancedDebate))
          )}
        </Box>
      )}
      {renderOldIssuesLink()}
    </Box>
  );

  return (
    <DebateLayout
      sidebar={renderSidebar()}
      headerProps={{
        title: '토론',
        showBackButton: false,
        showUserIcons: true,
      }}
    >
      {renderContent()}
    </DebateLayout>
  );
};

export default MainIssuesPage;
