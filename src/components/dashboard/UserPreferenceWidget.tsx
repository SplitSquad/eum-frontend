import React from 'react';
import { Paper, Box, Typography, Divider, Badge, Tooltip, Avatar, Chip, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

const UserPreferenceWidget: React.FC = () => {
  // 유저 취향 카테고리별 데이터 (샘플)
  const categoryData = [
    { id: 'restaurant', name: '음식점', percent: 35, color: '#f44336' },
    { id: 'cafe', name: '카페', percent: 25, color: '#795548' },
    { id: 'culture', name: '문화/예술', percent: 20, color: '#9c27b0' },
    { id: 'nature', name: '자연/경관', percent: 15, color: '#4caf50' },
    { id: 'shopping', name: '쇼핑', percent: 5, color: '#2196f3' },
  ];

  // 지역별 방문 빈도 데이터 (샘플)
  const regionData = [
    { id: 'gangnam', name: '강남구', visits: 24, avatar: '강' },
    { id: 'mapo', name: '마포구', visits: 18, avatar: '마' },
    { id: 'jongro', name: '종로구', visits: 12, avatar: '종' },
    { id: 'yongsan', name: '용산구', visits: 8, avatar: '용' },
    { id: 'songpa', name: '송파구', visits: 5, avatar: '송' },
  ];

  // 최대 방문 수 계산
  const maxVisits = Math.max(...regionData.map(region => region.visits));
  
  // 활동 통계
  const activityStats = [
    { id: 'visits', name: '방문', value: 32, icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: '#2196f3' },
    { id: 'likes', name: '좋아요', value: 18, icon: <FavoriteIcon sx={{ fontSize: 16 }} />, color: '#f44336' },
    { id: 'reviews', name: '리뷰', value: 7, icon: <RateReviewIcon sx={{ fontSize: 16 }} />, color: '#4caf50' },
    { id: 'ratings', name: '평점', value: 4.8, icon: <StarIcon sx={{ fontSize: 16 }} />, color: '#ff9800' },
  ];

  // 추천 키워드
  const recommendedKeywords = [
    { id: 'italian', name: '이탈리안', weight: 9 },
    { id: 'dessert', name: '디저트', weight: 8 },
    { id: 'cafe', name: '카페', weight: 7 },
    { id: 'korean', name: '한식', weight: 7 },
    { id: 'beer', name: '맥주', weight: 6 },
    { id: 'park', name: '공원', weight: 5 },
  ];

  // 최근 획득한 배지
  const recentBadges = [
    { id: 'explorer', name: '탐험가', description: '10개 이상의 새로운 장소 방문', icon: '🧭', color: '#3f51b5' },
    { id: 'foodie', name: '맛집 탐험가', description: '음식점 리뷰 5개 작성', icon: '🍽️', color: '#e91e63' }
  ];

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2.5, 
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)',
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
          zIndex: 0
        }} 
      />
      
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
        <ShowChartIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 22 }} />
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
            나의 취향 분석
          </Typography>
          <Typography variant="caption" color="text.secondary">
            최근 3개월 활동 기준
          </Typography>
        </Box>
      </Box>
      
      {/* 활동 통계 */}
      <Box sx={{ 
        display: 'flex', 
        mb: 2,
        gap: 1,
        position: 'relative',
        zIndex: 1
      }}>
        {activityStats.map(stat => (
          <Box 
            key={stat.id} 
            sx={{ 
              flex: 1, 
              p: 1, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  bgcolor: stat.color, 
                  borderRadius: '50%',
                  border: '1px solid white'
                }} />
              }
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: `${stat.color}15`,
                color: stat.color,
                mb: 0.5
              }}>
                {stat.icon}
              </Box>
            </Badge>
            <Typography variant="body1" fontWeight={700} sx={{ fontSize: '0.9rem' }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {stat.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 태그 클라우드 - 추천 키워드 */}
      <Box sx={{ 
        mb: 2, 
        position: 'relative', 
        zIndex: 1,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'rgba(250,250,250,0.7)'
      }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <LoyaltyIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
          추천 키워드
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {recommendedKeywords.map((keyword) => {
            // 가중치에 따라 스타일 조정
            const fontWeight = 400 + (keyword.weight * 30);
            const fontSize = 0.65 + (keyword.weight * 0.03);
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
                  bgcolor: keyword.weight > 7 
                    ? 'rgba(63, 81, 181, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  color: keyword.weight > 7 
                    ? 'primary.main' 
                    : 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.15)',
                  }
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* 카테고리별 선호도 */}
      <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <LocalOfferIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          관심 카테고리
        </Typography>
        
        {categoryData.slice(0, 3).map((category, index) => (
          <Box key={category.id} sx={{ mb: index !== 2 ? 1 : 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: category.color,
                    mr: 1
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
                  backgroundImage: `linear-gradient(90deg, ${category.color}90, ${category.color})`
                }
              }} 
            />
          </Box>
        ))}
      </Box>
      
      {/* 지역별 방문 빈도 */}
      <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto' }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <LocalActivityIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          자주 방문한 지역
        </Typography>
        
        {regionData.slice(0, 3).map((region, index) => (
          <Box key={region.id} sx={{ display: 'flex', alignItems: 'center', mb: index !== 2 ? 1 : 0 }}>
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                mr: 1, 
                fontSize: '0.7rem',
                bgcolor: index === 0 
                  ? 'primary.light' 
                  : index === 1 
                    ? 'primary.main' 
                    : `rgba(33, 150, 243, ${0.7 - (index * 0.15)})`
              }}
            >
              {region.avatar}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                <Typography variant="body2" fontWeight={500} fontSize="0.8rem">
                  {region.name}
                </Typography>
                <Typography variant="body2" fontWeight={600} color={index === 0 ? 'primary.main' : 'text.primary'} fontSize="0.8rem">
                  {region.visits}회
                </Typography>
              </Box>
              
              <Box sx={{ 
                width: '100%', 
                height: 5, 
                bgcolor: 'rgba(0,0,0,0.04)', 
                borderRadius: 4
              }}>
                <Box 
                  sx={{ 
                    width: `${(region.visits / maxVisits) * 100}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: index === 0 
                      ? 'linear-gradient(90deg, #2196f3, #1976d2)' 
                      : `linear-gradient(90deg, rgba(33, 150, 243, ${0.9 - (index * 0.1)}), rgba(25, 118, 210, ${0.9 - (index * 0.2)}))`
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default UserPreferenceWidget; 