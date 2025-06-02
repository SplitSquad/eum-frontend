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
  CircularProgress,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from '@/shared/i18n';
import { useLanguageStore } from '../../features/theme/store/languageStore';
import { env } from '../../config/env';
import axios from 'axios';

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  liked: boolean;
  tags: string[];
}

// 한국 명소 검색어 배열 (영어로만 구성)
const koreanLandmarkSearchTerms = [
  'Seoul Tower Korea',
  'Gyeongbokgung Palace Seoul',
  'Bukchon Hanok Village Seoul',
  'Jeju Island Seongsan Peak',
  'Busan Haeundae Beach',
  'Changdeokgung Palace Seoul',
  'Namsan Tower Seoul',
  'Han River Seoul night',
  'Korean traditional temple',
  'Dongdaemun Design Plaza Seoul',
  'Myeongdong Seoul shopping',
  'Hongdae Seoul district',
  'Gangnam Seoul district',
  'Korean cherry blossom spring',
  'Incheon Chinatown Korea',
  'Seoraksan National Park Korea',
  'Korean traditional market',
  'Lotte World Tower Seoul',
  'Banpo Rainbow Bridge Seoul',
  'Korean palace architecture',
];

// 검색어에 해당하는 태그 매핑
const searchTermTagMapping: { [key: string]: string } = {
  'Seoul Tower Korea': 'seoul',
  'Gyeongbokgung Palace Seoul': 'palace',
  'Bukchon Hanok Village Seoul': 'traditional',
  'Jeju Island Seongsan Peak': 'nature',
  'Busan Haeundae Beach': 'beach',
  'Changdeokgung Palace Seoul': 'palace',
  'Namsan Tower Seoul': 'landmark',
  'Han River Seoul night': 'night',
  'Korean traditional temple': 'temple',
  'Dongdaemun Design Plaza Seoul': 'landmark',
  'Myeongdong Seoul shopping': 'seoul',
  'Hongdae Seoul district': 'seoul',
  'Gangnam Seoul district': 'seoul',
  'Korean cherry blossom spring': 'spring',
  'Incheon Chinatown Korea': 'culture',
  'Seoraksan National Park Korea': 'nature',
  'Korean traditional market': 'market',
  'Lotte World Tower Seoul': 'landmark',
  'Banpo Rainbow Bridge Seoul': 'night',
  'Korean palace architecture': 'palace',
};

// 검색어에 해당하는 alt 키 매핑
const searchTermAltMapping: { [key: string]: string } = {
  'Seoul Tower Korea': 'seoul_tower',
  'Gyeongbokgung Palace Seoul': 'gyeongbokgung',
  'Bukchon Hanok Village Seoul': 'hanok_village',
  'Jeju Island Seongsan Peak': 'jeju_seongsan',
  'Busan Haeundae Beach': 'busan_haeundae',
  'Changdeokgung Palace Seoul': 'gyeongbokgung',
  'Namsan Tower Seoul': 'seoul_tower',
  'Han River Seoul night': 'hangang_night',
  'Korean traditional temple': 'korean_temple',
  'Dongdaemun Design Plaza Seoul': 'seoul_skyline',
  'Myeongdong Seoul shopping': 'seoul_skyline',
  'Hongdae Seoul district': 'seoul_skyline',
  'Gangnam Seoul district': 'seoul_skyline',
  'Korean cherry blossom spring': 'korean_cherry_blossom',
  'Incheon Chinatown Korea': 'korean_market',
  'Seoraksan National Park Korea': 'korean_temple',
  'Korean traditional market': 'korean_market',
  'Lotte World Tower Seoul': 'seoul_tower',
  'Banpo Rainbow Bridge Seoul': 'hangang_night',
  'Korean palace architecture': 'gyeongbokgung',
};

const PexelsGalleryWidget: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  // 랜덤 한국 명소 이미지 가져오기
  const fetchRandomKoreanLandmarkImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Pexels API 키 확인
      if (!env.PEXELS_ACCESS_KEY) {
        setError('Pexels API 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      // 랜덤하게 3개의 서로 다른 검색어 선택
      const shuffledTerms = [...koreanLandmarkSearchTerms].sort(() => 0.5 - Math.random());
      const selectedTerms = shuffledTerms.slice(0, 3);

      // 각 검색어로 이미지 하나씩 가져오기
      const imagePromises = selectedTerms.map(async (searchTerm, index) => {
        const response = await axios.get('https://api.pexels.com/v1/search', {
          headers: {
            Authorization: env.PEXELS_ACCESS_KEY,
          },
          params: {
            query: searchTerm,
            per_page: 1,
            page: Math.floor(Math.random() * 5) + 1, // 1-5 페이지 중 랜덤
          },
        });

        if (response.data.photos && response.data.photos.length > 0) {
          const photo = response.data.photos[0];
          return {
            id: `${photo.id}-${index}`,
            src: photo.src.medium,
            alt: searchTermAltMapping[searchTerm] || 'korean_landmark',
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            liked: false,
            tags: [searchTermTagMapping[searchTerm] || 'korea'],
          };
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      const validImages = results.filter(img => img !== null) as ImageItem[];

      setImages(validImages);
    } catch (err) {
      console.error('Pexels API 오류:', err);
      setError('이미지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 이미지 로딩
  useEffect(() => {
    fetchRandomKoreanLandmarkImages();
  }, []);

  // 언어 변경 시 새로운 이미지 로딩
  useEffect(() => {
    if (language) {
      fetchRandomKoreanLandmarkImages();
    }
  }, [language]);

  // 좋아요 토글
  const handleLikeToggle = (id: string) => {
    setImages(prevImages =>
      prevImages.map(image => (image.id === id ? { ...image, liked: !image.liked } : image))
    );
  };

  // 이미지 다운로드
  const handleDownload = (src: string, alt: string) => {
    window.open(src, '_blank');
  };

  // 번역된 alt 텍스트 가져오기
  const getTranslatedAlt = (altKey: string): string => {
    return t(`widgets.imageGallery.images.${altKey}`) || altKey;
  };

  // 번역된 태그 가져오기
  const getTranslatedTag = (tagKey: string): string => {
    return t(`widgets.imageGallery.tags.${tagKey}`) || tagKey;
  };

  return (
    <Paper
      elevation={1}
      sx={{
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
          {t('widgets.imageGallery.title')}
        </Typography>
      </Box>

      {/* 오류 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 이미지 그리드 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={40} />
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}
                    >
                      {getTranslatedAlt(image.alt)}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {image.tags.slice(0, 1).map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={getTranslatedTag(tag)}
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
          {t('widgets.imageGallery.info.poweredBy')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PexelsGalleryWidget;
