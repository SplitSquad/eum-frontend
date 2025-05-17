import React from 'react';
import { Paper, Box, Typography, Grid, IconButton, Card, CardMedia, Chip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  type: 'image' | 'video';
  duration?: string;
  new: boolean;
}

const GalleryWidget: React.FC = () => {
  // 샘플 갤러리 아이템
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: '한강 야경 투어',
      image: 'https://images.unsplash.com/photo-1534959191486-2c7143739f7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNlb3VsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      type: 'image',
      new: true
    },
    {
      id: '2',
      title: '부산 여행 가이드',
      image: 'https://images.unsplash.com/photo-1588401064596-5a4a118c8a4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzYW58ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      type: 'video',
      duration: '3:45',
      new: false
    },
    {
      id: '3',
      title: '제주 올레길 탐방',
      image: 'https://images.unsplash.com/photo-1547269257-ca8066ecba78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8amVqdXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      type: 'image',
      new: false
    },
    {
      id: '4',
      title: '경복궁 역사 투어',
      image: 'https://images.unsplash.com/photo-1609153256088-ef8a0c7d4c4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3llb25nYm9rZ3VuZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      type: 'video',
      duration: '5:20',
      new: true
    },
    {
      id: '5',
      title: '전주 한옥마을',
      image: 'https://images.unsplash.com/photo-1612326548478-b14c3a4f7812?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8a29yZWElMjB0cmFkaXRpb25hbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      type: 'image',
      new: false
    },
    {
      id: '6',
      title: '설악산 등산 코스',
      image: 'https://images.unsplash.com/photo-1627283569444-a3ddb8b5cb86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a29yZWElMjBtb3VudGFpbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      type: 'video',
      duration: '4:10',
      new: true
    }
  ];

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
          갤러리
        </Typography>
        
        <IconButton size="small">
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {galleryItems.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              width: { xs: 'calc(50% - 4px)', sm: 'calc(33.333% - 4px)' },
              position: 'relative'
            }}
          >
            <Card 
              sx={{ 
                borderRadius: 1.5, 
                boxShadow: 'none',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="90"
                  image={item.image}
                  alt={item.title}
                  sx={{ borderRadius: 1.5 }}
                />
                
                {/* 새 콘텐츠 표시 */}
                {item.new && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 5,
                      left: 5,
                      height: 16,
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      bgcolor: '#f44336',
                      color: 'white',
                      px: 0.5
                    }}
                  />
                )}
                
                {/* 비디오 타입 표시 */}
                {item.type === 'video' && (
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: 1.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PlayArrowIcon sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                    
                    {item.duration && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 5,
                          right: 5,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          fontSize: '0.6rem',
                          padding: '1px 4px',
                          borderRadius: 0.5
                        }}
                      >
                        {item.duration}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
              
              <Box sx={{ pt: 1, pb: 0.5 }}>
                <Typography 
                  variant="caption" 
                  fontWeight={500}
                  sx={{ 
                    display: 'block', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography 
          variant="caption" 
          color="primary" 
          sx={{ cursor: 'pointer', fontWeight: 500 }}
        >
          모든 콘텐츠 보기
        </Typography>
      </Box>
    </Paper>
  );
};

export default GalleryWidget; 