import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  liked: boolean;
  tags: string[];
}

// You can use sample data if API key is not available
const sampleImages: ImageItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1538485399081-7c438a4d63c5',
    alt: '남산타워',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['서울', '랜드마크'],
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58',
    alt: '한옥마을',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['전통', '한옥'],
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1578037571214-25e07ed4a487',
    alt: '부산 해운대',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['부산', '바다'],
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1588401273876-39568d3e851f',
    alt: '경복궁',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['서울', '궁궐'],
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1625043484590-a64ea41074bd',
    alt: '제주도 성산일출봉',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['제주', '자연'],
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1617541086271-4d43983805cf',
    alt: '한강 야경',
    photographer: 'Unsplash User',
    liked: false,
    tags: ['서울', '야경'],
  },
];

const UnsplashGalleryWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  // Check if Unsplash API key is available
  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  // Fetch images from Unsplash API
  const fetchImages = async (query: string = 'korea') => {
    // If API key is missing, use sample images
    if (!unsplashAccessKey) {
      setApiKeyMissing(true);
      setImages(sampleImages);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=6&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash');
      }

      const data = await response.json();
      
      const formattedImages: ImageItem[] = data.results.map((image: any) => ({
        id: image.id,
        src: image.urls.small,
        alt: image.alt_description || 'Unsplash image',
        photographer: image.user.name,
        liked: false,
        tags: image.tags?.length ? 
          image.tags.map((tag: any) => tag.title).slice(0, 2) : 
          (query.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 2)),
      }));

      setImages(formattedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load images on initial render
  useEffect(() => {
    fetchImages();
  }, []);

  // 검색어 변경 핸들러
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 검색 실행
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      fetchImages(searchTerm);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = (id: string) => {
    setImages(prevImages =>
      prevImages.map(image =>
        image.id === id ? { ...image, liked: !image.liked } : image
      )
    );
  };

  // 이미지 다운로드
  const handleDownload = (src: string, alt: string) => {
    window.open(src, '_blank');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...widgetPaperBase,
        background: widgetGradients.pink,
        p: 2,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={600}>
          추천 이미지 갤러리
        </Typography>
      </Box>

      {apiKeyMissing && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Unsplash API 키가 설정되지 않았습니다. 샘플 이미지가 표시됩니다.
        </Alert>
      )}

      {/* 검색 폼 */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
        <TextField
          placeholder="이미지 검색 (예: 서울, 바다, 음식 등)"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 이미지 그리드 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', p: 2, color: 'error.main' }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {images.map(image => (
              <Box
                key={image.id}
                sx={{
                  width: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 12px)' },
                  position: 'relative',
                }}
              >
                <Card
                  sx={{
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      '& .overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" height="120" image={image.src} alt={image.alt} />

                    {/* 오버레이 */}
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => handleLikeToggle(image.id)}
                      >
                        {image.liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => handleDownload(image.src, image.alt)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', fontSize: '0.7rem' }}
                    >
                      By {image.photographer}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}>
                      {image.alt}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {image.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{ textAlign: 'center', mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="caption" color="text.secondary">
          Powered by Unsplash API
        </Typography>
      </Box>
    </Paper>
  );
};

export default UnsplashGalleryWidget; 