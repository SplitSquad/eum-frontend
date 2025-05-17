import React from 'react';
import { Paper, Box, Typography, IconButton, Card, CardMedia, CardContent, Chip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface CardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  likes: number;
  views: number;
  liked: boolean;
}

const SliderCardsWidget: React.FC = () => {
  // 샘플 카드 데이터
  const cardItems: CardItem[] = [
    {
      id: '1',
      title: '목표 설정의 중요성',
      description: '명확한 목표 설정이 성공의 첫 단계입니다.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGdvYWxzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      tags: ['목표', '성공', '계획'],
      likes: 42,
      views: 128,
      liked: false
    },
    {
      id: '2',
      title: '효율적인 시간 관리법',
      description: '시간 관리의 핵심은 우선순위 설정에 있습니다.',
      image: 'https://images.unsplash.com/photo-1584381296550-c954bca97d13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGltZSUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      tags: ['시간관리', '생산성', '효율'],
      likes: 28,
      views: 95,
      liked: true
    },
    {
      id: '3',
      title: '스트레스 관리 기술',
      description: '일상에서 스트레스를 효과적으로 관리하는 방법',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVsYXh8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      tags: ['스트레스', '건강', '마음챙김'],
      likes: 35,
      views: 112,
      liked: false
    }
  ];

  // 현재 표시 중인 카드 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이전 카드로 이동
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cardItems.length - 1 : prev - 1));
  };

  // 다음 카드로 이동
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cardItems.length - 1 ? 0 : prev + 1));
  };

  // 좋아요 토글
  const handleLikeToggle = (id: string) => {
    // 실제 구현에서는 API 호출 등을 통해 상태 변경
    console.log(`Toggle like for card ${id}`);
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          트렌드 토픽
        </Typography>
        
        <Box>
          <IconButton size="small" onClick={handlePrev}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleNext}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex',
          overflowX: 'hidden',
          position: 'relative',
          minHeight: 270
        }}
      >
        {cardItems.map((card, index) => (
          <Card 
            key={card.id}
            sx={{ 
              minWidth: '100%',
              borderRadius: 2,
              position: 'absolute',
              transition: 'transform 0.3s ease-in-out',
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              boxShadow: 'none',
              border: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={card.image}
                alt={card.title}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  bgcolor: 'rgba(0,0,0,0.6)', 
                  color: 'white',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.75rem'
                }}
              >
                <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {card.views}
              </Box>
            </Box>
            
            <CardContent sx={{ pt: 1.5, pb: 1, px: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                {card.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {card.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem',
                      bgcolor: '#f3e5f5',
                      color: '#9c27b0'
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleLikeToggle(card.id)} 
                  color={card.liked ? 'error' : 'default'}
                >
                  {card.liked ? 
                    <FavoriteIcon fontSize="small" /> : 
                    <FavoriteBorderIcon fontSize="small" />
                  }
                </IconButton>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  {card.likes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* 페이지네이션 인디케이터 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        {cardItems.map((_, index) => (
          <Box 
            key={index}
            sx={{ 
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? '#9c27b0' : '#e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SliderCardsWidget; 