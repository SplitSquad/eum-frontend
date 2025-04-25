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
  }
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
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}));

const DebateCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  }
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
  shouldForwardProp: (prop) => prop !== 'color',
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
  shouldForwardProp: (prop) => prop !== 'color',
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
  shouldForwardProp: (prop) => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#4caf50',
}));

const DisagreeBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#f44336',
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

const DebateListPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    debates, 
    isLoading: loading, 
    error, 
    getDebates: fetchDebates 
  } = useDebateStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리 목록
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'politics', name: '정치/사회' },
    { id: 'economy', name: '경제' },
    { id: 'culture', name: '생활/문화' },
    { id: 'technology', name: '과학/기술' },
    { id: 'sports', name: '스포츠' },
    { id: 'entertainment', name: '엔터테인먼트' },
  ];

  // 카테고리별 색상
  const categoryColors = {
    '정치/사회': '#1976d2',
    '경제': '#ff9800',
    '생활/문화': '#4caf50',
    '과학/기술': '#9c27b0',
    '스포츠': '#f44336',
    '엔터테인먼트': '#2196f3',
  };

  // 특별 라벨
  const specialLabels = {
    1: { text: '오늘의 이슈', color: '#ff9800' },
    2: { text: '모스트 핫 이슈', color: '#f44336' },
    3: { text: '반반 이슈', color: '#9c27b0' },
  };

  useEffect(() => {
    fetchDebates();
  }, [fetchDebates]);

  const handleDebateClick = (id: number) => {
    navigate(`/debate/${id}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // 카테고리별 필터링
  const filteredDebates = selectedCategory === '전체'
    ? debates as EnhancedDebate[]
    : (debates as EnhancedDebate[]).filter(debate => debate.category === selectedCategory);

  // 특별 라벨 할당 (예시용)
  const getSpecialLabel = (debate: EnhancedDebate) => {
    // 예시 로직 - 실제로는 API에서 받거나 다른 로직으로 결정될 것
    if (debate.id % 7 === 0) return specialLabels[1];
    if (debate.id % 5 === 0) return specialLabels[2];
    if (Math.abs(debate.agreeCount - debate.disagreeCount) < 3) return specialLabels[3];
    return null;
  };

  // 찬성/반대 비율 계산
  const calculateVoteRatio = (agree: number, disagree: number) => {
    const total = agree + disagree;
    if (total === 0) return { agree: 50, disagree: 50 };
    
    const agreePercent = Math.round((agree / total) * 100);
    return {
      agree: agreePercent,
      disagree: 100 - agreePercent
    };
  };

  // 사이드바 렌더링
  const renderSidebar = () => (
    <SidebarContainer>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          카테고리
        </Typography>
      </Box>
      <List disablePadding>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            selected={selectedCategory === category.name}
          >
            <ListItemText primary={category.name} />
          </CategoryItem>
        ))}
      </List>
    </SidebarContainer>
  );

  // 메인 컨텐츠 렌더링
  const renderContent = () => (
    <DebateListContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {selectedCategory} 토론
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress sx={{ alignSelf: 'center', my: 4 }} />
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          토론 목록을 불러오는데 실패했습니다: {error}
        </Typography>
      ) : filteredDebates.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <Typography>
            {selectedCategory === '전체'
              ? '등록된 토론이 없습니다.'
              : `${selectedCategory} 카테고리에 등록된 토론이 없습니다.`}
          </Typography>
        </Paper>
      ) : (
        filteredDebates.map((debate) => {
          const categoryColor = (categoryColors as Record<string, string>)[debate.category] || '#757575';
          const specialLabel = getSpecialLabel(debate);
          const voteRatio = calculateVoteRatio(debate.agreeCount, debate.disagreeCount);
          
          return (
            <DebateCard key={debate.id} onClick={() => handleDebateClick(debate.id)}>
              <CardActionArea>
                <DebateItemWrapper>
                  <CategoryIndicator color={categoryColor} />
                  <DebateCardContent sx={{ width: '100%', pl: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        {specialLabel && (
                          <CategoryBadge color={specialLabel.color}>
                            {specialLabel.text}
                          </CategoryBadge>
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          {debate.category}
                          <FlagWrapper>
                            <FlagIcon fontSize="small" />
                            한국
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
    <DebateLayout
      sidebar={renderSidebar()}
      headerProps={{
        title: '신규 토론',
        showUserIcons: true
      }}
    >
      {renderContent()}
    </DebateLayout>
  );
};

export default DebateListPage; 