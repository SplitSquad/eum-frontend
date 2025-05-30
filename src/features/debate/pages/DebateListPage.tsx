import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Debate } from '../types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  List,
  ListItemText,
  ListItemButton,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { styled } from '@mui/material/styles';

import DebateLayout from '../components/common/DebateLayout';
import { formatDate } from '../utils/dateUtils';
import { send } from 'process';
import { useTranslation } from '@/shared/i18n';
import { set } from 'date-fns';
import { setupDebateLanguageChangeListener } from '@/features/debate/store/debateStore';

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

const DebateListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
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

// Fix the type issue with styled components that have props
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
  backgroundColor: '#81C784',
}));

const DisagreeBar = styled(Box, {
  shouldForwardProp: prop => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#E57373',
}));

const FlagWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: 14,
}));

const SidebarContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  borderRadius: 8,
  overflow: 'hidden',
  height: 'fit-content',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}));

// Enhanced Debate type based on usage in this component
interface EnhancedDebate extends Debate {
  category: string;
  description?: string;
  agreeCount: number;
  disagreeCount: number;
}

// DebateListPage의 사이드바에 SpecialIssue 버튼 그룹 추가 (디자인만, onClick은 빈 함수)
const SpecialIssueSidebar: React.FC<{ t: any; navigate: any }> = ({ t, navigate }) => (
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
        fontWeight={700}
        color={'primary'}
        onClick={() => navigate('/debate', { state: { specialLabel: 'special' } })}
        sx={{ userSelect: 'none', cursor: 'pointer' }}
      >
        {t('debate.specialIssues')}
      </Typography>
    </Box>
    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        variant="outlined"
        color="warning"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => navigate('/debate', { state: { specialLabel: 'today' } })}
        fullWidth
      >
        {t('debate.todayIssue')}
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => navigate('/debate', { state: { specialLabel: 'hot' } })}
        fullWidth
      >
        {t('debate.mostHotIssue')}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        sx={{ fontWeight: 600, borderRadius: 2, textAlign: 'left' }}
        onClick={() => navigate('/debate', { state: { specialLabel: 'balanced' } })}
        fullWidth
      >
        {t('debate.halfAndHalfIssue')}
      </Button>
    </Box>
  </Box>
);

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

const DebateListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    debates,
    isLoading: loading,
    error,
    getDebates: fetchDebates,
    setCategory,
  } = useDebateStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>(t('debate.categories.all'));

  // 카테고리 목록
  const categories: Record<string, string> = {
    [t('debate.categories.all')]: '', // 전체 는 빈 문자열로 보내서 전체 조회
    [t('debate.categories.politics')]: '정치/사회',
    [t('debate.categories.economy')]: '경제',
    [t('debate.categories.culture')]: '생활/문화',
    [t('debate.categories.technology')]: '과학/기술',
    [t('debate.categories.sports')]: '스포츠',
    [t('debate.categories.entertainment')]: '엔터테인먼트',
  };
  // 카테고리별 색상 (MainIssuesPage와 동일하게)
  const categoryColors = {
    '정치/사회': '#42a5f5', // 진한 파스텔 블루
    경제: '#ffb300', // 진한 파스텔 오렌지
    '생활/문화': '#66bb6a', // 진한 파스텔 그린
    '과학/기술': '#ab47bc', // 진한 파스텔 퍼플
    스포츠: '#e57373', // 진한 파스텔 레드
    엔터테인먼트: '#29b6f6', // 진한 파스텔 하늘색
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
    fetchDebates();
  }, [fetchDebates]);

  const handleDebateClick = (id: number) => {
    navigate(`/debate/${id}`);
  };

  const handleCategoryClick = (label: string) => {
    setSelectedCategory(label);
    setCategory(label);
    // 클릭 즉시 API 호출 시에도 올바른 값을 넘겨줍니다.
    const apiCategory = categories[label];
    fetchDebates(1, 20, apiCategory);
  };

  // 필터링 로직 단순화
  const filteredDebates = useMemo(() => {
    console.log('필터링 수행:', selectedCategory);

    const apiCategory = categories[selectedCategory];
    // '전체'이면 그대로
    if (!apiCategory) return debates;

    return debates.filter((debate: any) => {
      const debateCategory = debate.category || '';
      const matched = debateCategory === apiCategory;
      console.log(`카테고리 비교: ${debateCategory} vs ${apiCategory} => ${matched}`);
      return matched;
    });
  }, [selectedCategory, debates]);

  // 특별 라벨 할당 (예시용)
  const getSpecialLabel = (debate: any): { text: string; color: string } | null => {
    // 카테고리 뷰에서는 특별 라벨을 표시하지 않음
    return null;
  };

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
    <SidebarContainer sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0 }}>
      <SpecialIssueSidebar t={t} navigate={navigate} />
      <Box sx={{ p: 2, borderRadius: 2, background: '#fff', boxShadow: 'none' }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {t('debate.categories.title')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          {Object.keys(categories).map((label, idx) => {
            // 카테고리별 색상 매핑
            const badgeColors: Record<string, string> = {
              [t('debate.categories.all')]: '#757575',
              [t('debate.categories.politics')]: '#1976d2',
              [t('debate.categories.economy')]: '#ff9800',
              [t('debate.categories.culture')]: '#4caf50',
              [t('debate.categories.technology')]: '#9c27b0',
              [t('debate.categories.sports')]: '#f44336',
              [t('debate.categories.entertainment')]: '#2196f3',
            };
            return (
              <CategoryBadgeButton
                key={label}
                bgcolor={badgeColors[label] || '#757575'}
                selected={selectedCategory === label}
                onClick={() => handleCategoryClick(label)}
              >
                {label}
              </CategoryBadgeButton>
            );
          })}
        </Box>
      </Box>
    </SidebarContainer>
  );

  // 메인 컨텐츠 렌더링
  const renderContent = () => (
    <DebateListContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {selectedCategory} {t('debate.name')}
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress sx={{ alignSelf: 'center', my: 4 }} />
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          토론 목록을 불러오는데 실패했습니다: {error}
        </Typography>
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
            {selectedCategory === '전체'
              ? '등록된 토론이 없습니다.'
              : `${selectedCategory} 카테고리에 등록된 토론이 없습니다.`}
          </Typography>
        </Paper>
      ) : (
        filteredDebates.map((debate: any) => {
          const categoryColor =
            (categoryColors as Record<string, string>)[debate.category] || '#757575';
          const specialLabel = getSpecialLabel(debate);
          const voteRatio = calculateVoteRatio(
            debate.agreeCount || debate.proCount || 0,
            debate.disagreeCount || debate.conCount || 0
          );

          return (
            <DebateCard key={debate.id} onClick={() => handleDebateClick(debate.id)}>
              <CardActionArea>
                <DebateItemWrapper>
                  <CategoryIndicator color={categoryColor} />
                  <DebateCardContent sx={{ width: '100%', pl: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box>
                        {specialLabel && (
                          <CategoryBadge color={specialLabel.color}>
                            {specialLabel.text}
                          </CategoryBadge>
                        )}
                        <Typography
                          variant="body2"
                          color={categoryColors[debate.category] || '#bdbdbd'}
                          sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          {categoryNameMap[debate.category] ||
                            debate.category ||
                            t('debate.categories.etc')}
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
                      {debate.description && debate.description.length > 100
                        ? `${debate.description.substring(0, 100)}...`
                        : debate.description}
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
        })
      )}
    </DebateListContainer>
  );

  return (
    <DebateLayout sidebar={renderSidebar()} specialLabelText={t('debate.oldIssues')}>
      {renderContent()}
    </DebateLayout>
  );
};

export default DebateListPage;
