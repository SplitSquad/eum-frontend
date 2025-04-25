import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Debate } from '../types';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  CircularProgress,
  Container,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import ChatIcon from '@mui/icons-material/Chat';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';

import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import DebateLayout from '../components/common/DebateLayout';

// Import the recharts library for pie charts
// The recharts package should be installed with: npm install recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Styled components
const DebateCard = styled(Paper)(({ theme }) => ({
  borderRadius: 8,
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
}));

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

const VoteButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface VoteButtonProps {
  color: string;
  selected?: boolean;
}

const VoteButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'selected',
})<VoteButtonProps>(({ theme, color, selected }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: selected ? `${color}22` : 'transparent',
  border: `2px solid ${color}`,
  color: color,
  '&:hover': {
    backgroundColor: `${color}33`,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 36,
    marginBottom: theme.spacing(1),
  },
}));

const EmotionButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface EmotionButtonProps {
  selected?: boolean;
}

const EmotionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<EmotionButtonProps>(({ theme, selected }) => ({
  flex: '1 0 30%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: 8,
  backgroundColor: selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 24,
    marginBottom: theme.spacing(0.5),
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
}));

const VoteBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const VoteBar = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 24,
  backgroundColor: '#f0f0f0',
  borderRadius: 12,
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
  backgroundColor: '#e91e63',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
}));

const DisagreeBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width',
})<BarProps>(({ width }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: '#9c27b0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
}));

const CountryStatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: 4,
  backgroundColor: 'rgba(248, 249, 250, 0.7)',
  marginBottom: theme.spacing(1),
}));

const CountryFlag = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const CommentForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const CommentItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid #eee',
  padding: theme.spacing(2, 1),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 280,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// Enhanced Debate type based on usage in this component
interface EnhancedDebate extends Debate {
  category?: string;
  isHot?: boolean;
  proCount: number;
  conCount: number;
  commentCount: number;
  comments?: Array<{
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    stance?: 'pro' | 'con';
    reactions?: {
      like: number;
    };
  }>;
}

// Define the vote type
type VoteType = 'pro' | 'con';
type EmotionType = 'like' | 'dislike' | 'sad' | 'angry' | 'happy' | 'confused';

/**
 * 토론 상세 페이지
 * 선택한 토론의 상세 내용과 댓글을 표시
 */
const DebateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentDebate: debate, 
    isLoading: loading, 
    error, 
    getDebateById: fetchDebateById, 
    voteOnDebate 
  } = useDebateStore();
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [userEmotion, setUserEmotion] = useState<EmotionType | null>(null);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchDebateById(parseInt(id));
    }
  }, [id, fetchDebateById]);

  const handleVote = (voteType: VoteType) => {
    if (id) {
      voteOnDebate(parseInt(id), voteType);
      setUserVote(voteType);
    }
  };

  const handleEmotionSelect = (emotionType: EmotionType) => {
    setUserEmotion(emotionType);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Add logic to submit comment
      console.log('Submitting comment:', comment);
      setComment('');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Category colors for styling
  const categoryColors = {
    '정치/사회': '#1976d2',
    '경제': '#ff9800',
    '생활/문화': '#4caf50',
    '과학/기술': '#9c27b0',
    '스포츠': '#f44336',
    '엔터테인먼트': '#2196f3',
  };

  // Special labels (예시)
  const specialLabels = {
    '오늘의 이슈': '#ff9800',
    '모스트 핫 이슈': '#f44336',
    '반반 이슈': '#9c27b0',
  };

  // Sample country statistics (would come from the API)
  const countryStats = [
    { country: '한국', code: 'KR', agreeCount: 210, disagreeCount: 150 },
    { country: '미국', code: 'US', agreeCount: 180, disagreeCount: 120 },
    { country: '일본', code: 'JP', agreeCount: 90, disagreeCount: 110 },
    { country: '중국', code: 'CN', agreeCount: 75, disagreeCount: 85 },
  ];

  // Calculate vote ratios
  const calculateVoteRatio = (agree: number, disagree: number) => {
    const total = agree + disagree;
    if (total === 0) return { agree: 50, disagree: 50 };
    
    const agreePercent = Math.round((agree / total) * 100);
    return {
      agree: agreePercent,
      disagree: 100 - agreePercent
    };
  };

  // Prepare data for pie chart
  const prepareChartData = (agree: number, disagree: number) => {
    return [
      { name: '찬성', value: agree },
      { name: '반대', value: disagree },
    ];
  };

  const COLORS = ['#e91e63', '#9c27b0'];

  // Render loading state
  if (loading) {
    return (
      <DebateLayout
        headerProps={{
          title: '토론 상세',
          showBackButton: true,
          onBackClick: handleGoBack,
          showUserIcons: true
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </DebateLayout>
    );
  }

  // Render error state
  if (error || !debate) {
    return (
      <DebateLayout
        headerProps={{
          title: '토론 상세',
          showBackButton: true,
          onBackClick: handleGoBack,
          showUserIcons: true
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error" variant="h6">
              {error || '토론을 찾을 수 없습니다.'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoBack}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              뒤로 가기
            </Button>
          </Box>
        </Container>
      </DebateLayout>
    );
  }

  const enhancedDebate = debate as EnhancedDebate;

  // Calculate vote percentages
  const voteRatio = calculateVoteRatio(
    enhancedDebate.proCount || 0, 
    enhancedDebate.conCount || 0
  );
  const chartData = prepareChartData(
    enhancedDebate.proCount || 0, 
    enhancedDebate.conCount || 0
  );
  const categoryColor = (enhancedDebate.category && categoryColors[enhancedDebate.category as keyof typeof categoryColors]) || '#757575';
  
  return (
    <DebateLayout
      headerProps={{
        title: '토론 상세',
        showBackButton: true,
        onBackClick: handleGoBack,
        showUserIcons: true
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* 토론 메인 카드 */}
        <DebateCard>
          <CategoryIndicator color={categoryColor} />
          <Box sx={{ p: 3, pl: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                {enhancedDebate.isHot && (
                  <CategoryBadge color={specialLabels['모스트 핫 이슈']}>
                    모스트 핫 이슈
                  </CategoryBadge>
                )}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {enhancedDebate.category}
                  <CountryFlag>
                    <FlagIcon fontSize="small" />
                    한국
                  </CountryFlag>
                  <Box component="span" sx={{ mx: 1 }}>•</Box>
                  {formatDate(enhancedDebate.createdAt)}
                </Typography>
                <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
                  {enhancedDebate.title}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ my: 3, lineHeight: 1.7 }}>
              {enhancedDebate.content}
            </Typography>
          </Box>
        </DebateCard>
        
        {/* 투표 섹션 */}
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          찬성과 반대, 당신의 의견은?
        </Typography>
        
        <VoteButtonGroup>
          <VoteButton 
            variant="outlined"
            color="inherit"
            selected={userVote === 'pro'}
            onClick={() => handleVote('pro')}
            sx={{ 
              color: '#e91e63', 
              borderColor: '#e91e63',
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
              }
            }}
          >
            <SentimentSatisfiedAltIcon />
            <Typography variant="subtitle1" fontWeight={600}>
              찬성
            </Typography>
          </VoteButton>
          
          <VoteButton 
            variant="outlined" 
            color="inherit"
            selected={userVote === 'con'}
            onClick={() => handleVote('con')}
            sx={{ 
              color: '#9c27b0', 
              borderColor: '#9c27b0',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
              }
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            <Typography variant="subtitle1" fontWeight={600}>
              반대
            </Typography>
          </VoteButton>
        </VoteButtonGroup>

        {/* 감정표현 섹션 */}
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          이 토론에 대한 감정을 표현해주세요
        </Typography>
        
        <EmotionButtonGroup>
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'like'}
            onClick={() => handleEmotionSelect('like')}
            sx={{ 
              color: '#4caf50', 
              borderColor: '#4caf50',
              backgroundColor: userEmotion === 'like' ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.12)',
              }
            }}
          >
            <ThumbUpIcon />
            <Typography variant="body2">
              좋아요
            </Typography>
          </EmotionButton>
          
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'dislike'}
            onClick={() => handleEmotionSelect('dislike')}
            sx={{ 
              color: '#f44336', 
              borderColor: '#f44336',
              backgroundColor: userEmotion === 'dislike' ? 'rgba(244, 67, 54, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.12)',
              }
            }}
          >
            <ThumbUpIcon sx={{ transform: 'rotate(180deg)' }} />
            <Typography variant="body2">
              싫어요
            </Typography>
          </EmotionButton>
          
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'sad'}
            onClick={() => handleEmotionSelect('sad')}
            sx={{ 
              color: '#2196f3', 
              borderColor: '#2196f3',
              backgroundColor: userEmotion === 'sad' ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.12)',
              }
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            <Typography variant="body2">
              슬퍼요
            </Typography>
          </EmotionButton>
          
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'angry'}
            onClick={() => handleEmotionSelect('angry')}
            sx={{ 
              color: '#ff9800', 
              borderColor: '#ff9800',
              backgroundColor: userEmotion === 'angry' ? 'rgba(255, 152, 0, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.12)',
              }
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            <Typography variant="body2">
              화나요
            </Typography>
          </EmotionButton>
          
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'happy'}
            onClick={() => handleEmotionSelect('happy')}
            sx={{ 
              color: '#e91e63', 
              borderColor: '#e91e63',
              backgroundColor: userEmotion === 'happy' ? 'rgba(233, 30, 99, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.12)',
              }
            }}
          >
            <SentimentSatisfiedAltIcon />
            <Typography variant="body2">
              행복해요
            </Typography>
          </EmotionButton>
          
          <EmotionButton 
            variant="outlined"
            selected={userEmotion === 'confused'}
            onClick={() => handleEmotionSelect('confused')}
            sx={{ 
              color: '#9c27b0', 
              borderColor: '#9c27b0',
              backgroundColor: userEmotion === 'confused' ? 'rgba(156, 39, 176, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.12)',
              }
            }}
          >
            <SentimentSatisfiedAltIcon />
            <Typography variant="body2">
              글쎄요
            </Typography>
          </EmotionButton>
        </EmotionButtonGroup>
        
        {/* 투표 결과 */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <ProgressSection>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent' 
              }}>
                투표 결과
              </Typography>
              
              <VoteBarContainer>
                <Typography variant="body2" fontWeight={600} color="#e91e63" width={40}>
                  {voteRatio.agree}%
                </Typography>
                <VoteBar>
                  <AgreeBar width={voteRatio.agree}>
                    {voteRatio.agree > 10 && '찬성'}
                  </AgreeBar>
                  <DisagreeBar width={voteRatio.disagree}>
                    {voteRatio.disagree > 10 && '반대'}
                  </DisagreeBar>
                </VoteBar>
                <Typography variant="body2" fontWeight={600} color="#9c27b0" width={40}>
                  {voteRatio.disagree}%
                </Typography>
              </VoteBarContainer>
              
              <Typography variant="body2" textAlign="right">
                총 투표수: {(enhancedDebate.proCount || 0) + (enhancedDebate.conCount || 0)}
              </Typography>
              
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ProgressSection>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <ProgressSection>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                국가별 참여 현황
              </Typography>
              
              {countryStats.map((stat, index) => {
                const countryRatio = calculateVoteRatio(stat.agreeCount, stat.disagreeCount);
                return (
                  <CountryStatItem key={index}>
                    <CountryFlag>
                      <FlagIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>{stat.country}</Typography>
                    </CountryFlag>
                    <Box sx={{ flex: 1 }}>
                      <VoteBar>
                        <AgreeBar width={countryRatio.agree} />
                        <DisagreeBar width={countryRatio.disagree} />
                      </VoteBar>
                    </Box>
                    <Typography variant="body2">
                      {stat.agreeCount + stat.disagreeCount}명
                    </Typography>
                  </CountryStatItem>
                );
              })}
            </ProgressSection>
          </Box>
        </Box>
        
        {/* 댓글 섹션 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
            background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            댓글 {enhancedDebate.commentCount || 0}개
          </Typography>
          
          <CommentForm onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="댓글을 작성해주세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 2,
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!comment.trim()}
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#e91e63',
                '&:hover': {
                  backgroundColor: '#c2185b',
                }
              }}
            >
              등록
            </Button>
          </CommentForm>
          
          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)', 
              backdropFilter: 'blur(8px)',
              borderRadius: 2 
            }}
          >
            <List disablePadding>
              {enhancedDebate.comments && enhancedDebate.comments.length > 0 ? (
                enhancedDebate.comments.map((comment) => (
                  <CommentItem key={comment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {comment.userName}
                            {comment.stance && (
                              <Box 
                                component="span" 
                                sx={{ 
                                  ml: 1, 
                                  px: 1, 
                                  py: 0.25, 
                                  borderRadius: 1, 
                                  fontSize: '0.75rem',
                                  backgroundColor: comment.stance === 'pro' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                  color: comment.stance === 'pro' ? '#4caf50' : '#f44336',
                                }}
                              >
                                {comment.stance === 'pro' ? '찬성' : '반대'}
                              </Box>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(comment.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                            {comment.content}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              startIcon={<ThumbUpIcon />}
                              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                            >
                              {comment.reactions?.like || 0}
                            </Button>
                            <Button 
                              size="small" 
                              startIcon={<ReplyIcon />}
                              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                            >
                              답글
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </CommentItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography align="center" color="text.secondary">
                        첫 댓글을 작성해보세요!
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      </Container>
    </DebateLayout>
  );
};

export default DebateDetailPage;