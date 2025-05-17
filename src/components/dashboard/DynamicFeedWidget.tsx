import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Tab, Tabs, Avatar, Divider, Chip, IconButton, Button, CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CommunityService, { Post } from '../../services/community/communityService';

// 배열을 랜덤하게 섞는 유틸리티 함수
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// 시간 포맷팅 유틸리티 함수
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1 ? '1일 전' : `${diffDay}일 전`;
  } else if (diffHour > 0) {
    return diffHour === 1 ? '1시간 전' : `${diffHour}시간 전`;
  } else if (diffMin > 0) {
    return diffMin === 1 ? '1분 전' : `${diffMin}분 전`;
  } else {
    return '방금 전';
  }
};

const DynamicFeedWidget: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [discussionPosts, setDiscussionPosts] = useState<Post[]>([]);
  const [debatePosts, setDebatePosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 데이터 로딩 함수
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 커뮤니티, 모임, 토론 게시글을 병렬로 가져오기
      const [communityResponse, discussionResponse, debateResponse] = await Promise.all([
        CommunityService.getCommunityPosts(0, 4),
        CommunityService.getDiscussionPosts(0, 2),
        CommunityService.getDebatePosts(0, 3) // 토론 게시글 3개 가져오기
      ]);
      
      // 채워진 데이터 저장
      setCommunityPosts(communityResponse.content);
      setDiscussionPosts(discussionResponse.content);
      setDebatePosts(debateResponse.content);
      
      // 추천 탭에 표시할 게시글 - 서버에서 매칭 점수 정보를 가져옴
      try {
        // 추천 게시글 API를 호출
        const recommendedData = await CommunityService.getRecommendedPosts(6);
        if (recommendedData && recommendedData.length > 0) {
          setRecommendedPosts(recommendedData);
        } else {
          // 서버에서 추천 게시글을 가져오지 못한 경우 커뮤니티, 모임, 토론에서 랜덤하게 채움
          const allPosts = [
            ...communityResponse.content, 
            ...discussionResponse.content,
            ...debateResponse.content
          ];
          // 랜덤하게 섞고 매칭 점수 추가
          const shuffledPosts = shuffleArray(allPosts).map(post => ({
            ...post,
            matchScore: post.matchScore || Math.floor(Math.random() * 15) + 80 // 80~95 사이 랜덤 점수
          }));
          setRecommendedPosts(shuffledPosts);
        }
      } catch (err) {
        console.error('추천 게시글 가져오기 실패:', err);
        // 대체 로직: 모든 게시글 중 랜덤하게 사용
        const allPosts = [
          ...communityResponse.content, 
          ...discussionResponse.content,
          ...debateResponse.content
        ];
        const shuffledPosts = shuffleArray(allPosts).map(post => ({
          ...post,
          matchScore: post.matchScore || Math.floor(Math.random() * 15) + 80 // 80~95 사이 랜덤 점수
        }));
        setRecommendedPosts(shuffledPosts);
      }
    } catch (err) {
      console.error('Feed 데이터 로딩 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  // 콘텐츠 렌더링 함수
  const renderPostItem = (post: Post) => (
    <Box 
      key={post.id} 
      sx={{ 
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* 헤더: 작성자 정보, 카테고리 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={post.author.profileImagePath} 
            sx={{ width: 28, height: 28, mr: 1 }}
          >
            {!post.author.profileImagePath && <PersonIcon fontSize="small" />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {post.author.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {post.matchScore && (
            <Chip 
              label={`${post.matchScore}% 매치`} 
              size="small"
              sx={{ 
                height: 20, 
                fontSize: '0.65rem',
                mr: 1,
                bgcolor: post.matchScore > 90 
                  ? 'rgba(76, 175, 80, 0.1)'
                  : post.matchScore > 80
                    ? 'rgba(33, 150, 243, 0.1)'
                    : 'rgba(255, 152, 0, 0.1)',
                color: post.matchScore > 90 
                  ? '#388e3c'
                  : post.matchScore > 80
                    ? '#1976d2'
                    : '#f57c00',
              }}
            />
          )}
          <Chip 
            label={post.category} 
            size="small"
            sx={{ 
              height: 20, 
              fontSize: '0.7rem',
              bgcolor: `${post.categoryColor}15`,
              color: post.categoryColor,
            }}
          />
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* 콘텐츠 제목 및 내용 */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {post.content}
        </Typography>
        
        {/* 이미지가 있으면 표시 */}
        {post.images && post.images.length > 0 && (
          <Box 
            sx={{ 
              height: 120, 
              borderRadius: 1.5, 
              bgcolor: 'action.hover',
              overflow: 'hidden',
              mb: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: `url(${post.images[0]}) center/cover no-repeat`,
            }}
          />
        )}

        {/* 태그가 있으면 표시 */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: 'rgba(0,0,0,0.04)',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* 액션 버튼들 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ThumbUpAltIcon />}
            size="small"
            sx={{ 
              mr: 1, 
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.likeCount}
          </Button>
          <Button 
            startIcon={<CommentIcon />}
            size="small"
            sx={{ 
              mr: 1,
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.commentCount}
          </Button>
          <Button 
            startIcon={<VisibilityIcon />}
            size="small"
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.viewCount}
          </Button>
        </Box>
        <Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  // 로딩 컴포넌트
  const renderLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} />
    </Box>
  );

  // 에러 컴포넌트
  const renderError = () => (
    <Alert 
      severity="error" 
      icon={<ErrorOutlineIcon />}
      sx={{ mt: 2 }}
      action={
        <Button 
          color="inherit" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={loadData}
        >
          다시 시도
        </Button>
      }
    >
      {error}
    </Alert>
  );

  // 데이터 없음 컴포넌트
  const renderEmpty = (message: string) => (
    <Box sx={{ 
      py: 4, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'action.hover',
      borderRadius: 2,
      textAlign: 'center'
    }}>
      <Box sx={{ 
        p: 1.5, 
        bgcolor: 'background.paper', 
        borderRadius: '50%',
        mb: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <ErrorOutlineIcon color="action" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2.5, 
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        background: 'linear-gradient(to right, #fff, #fafafa)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 헤더 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          탐색
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={loadData}
            sx={{ 
              bgcolor: 'action.hover',
              mr: 1
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              bgcolor: 'action.hover' 
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* 탭 네비게이션 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }
          }}
        >
          <Tab label="추천" id="tab-0" />
          <Tab label="커뮤니티" id="tab-1" />
          <Tab label="토론" id="tab-2" />
        </Tabs>
      </Box>
      
      {/* 에러 메시지 */}
      {error && renderError()}
      
      {/* 탭 패널: 추천 탭 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          {isLoading ? renderLoading() : 
            recommendedPosts.length > 0 ? 
              recommendedPosts.map(post => renderPostItem(post)) : 
              renderEmpty('추천 게시글이 없습니다')}
        </Box>
      </TabPanel>
      
      {/* 탭 패널: 커뮤니티 탭 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          {isLoading ? renderLoading() : 
            communityPosts.length > 0 ? 
              communityPosts.map(post => renderPostItem(post)) : 
              renderEmpty('커뮤니티 게시글이 없습니다')}
        </Box>
      </TabPanel>
      
      {/* 탭 패널: 토론 탭 */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          {isLoading ? renderLoading() : 
            debatePosts.length > 0 ? 
              debatePosts.map(post => renderPostItem(post)) : 
              renderEmpty('토론 게시글이 없습니다')}
        </Box>
      </TabPanel>
      
      {/* 더 보기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
        <Button 
          variant="outlined"
          size="small"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          {tabValue === 0 ? '추천' : tabValue === 1 ? '커뮤니티' : '토론'} 더 보기
        </Button>
      </Box>
    </Paper>
  );
};

export default DynamicFeedWidget; 