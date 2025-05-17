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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton as MuiIconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { env } from '../../config/env';
import axios from 'axios';

interface VideoItem {
  id: string;
  thumbnail: string;
  title: string;
  channelName: string;
  liked: boolean;
  tags: string[];
  views: string;
}

const YoutubeGalleryWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ id: string; title: string } | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchDefaultVideos();
  }, []);

  // 대화상자 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // 약간의 딜레이 후 재생 비디오 정보 초기화 (애니메이션 완료 후)
    setTimeout(() => {
      setPlayingVideo(null);
    }, 300);
  };

  // 기본 인기 영상 가져오기
  const fetchDefaultVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // YouTube API 키 확인
      if (!env.YOUTUBE_API_KEY) {
        setError('YouTube API 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      // TODO: 유저 취향에 맞춰서 검색어 바꿔주도록 유동적으로 해줘야함!
      // 한국 여행 관련 인기 영상 가져오기
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 3,
          q: '한국 여행 Korea travel',
          type: 'video',
          key: env.YOUTUBE_API_KEY,
          regionCode: 'KR',
          relevanceLanguage: 'ko',
        },
      });

      if (response.data.items) {
        // 비디오 ID 목록 추출
        const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

        // 비디오 통계 정보 가져오기
        const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'statistics,snippet',
            id: videoIds,
            key: env.YOUTUBE_API_KEY,
          },
        });

        // 검색 결과와 통계 정보 결합
        const videoData = statsResponse.data.items.map((item: any) => {
          // 조회수 포맷팅
          const viewCount = parseInt(item.statistics.viewCount);
          let formattedViews = '';

          if (viewCount >= 10000) {
            formattedViews = `${(viewCount / 10000).toFixed(1)}만`;
          } else if (viewCount >= 1000) {
            formattedViews = `${(viewCount / 1000).toFixed(1)}천`;
          } else {
            formattedViews = viewCount.toString();
          }

          // 태그 추출 (최대 2개)
          const tags = item.snippet.tags ? item.snippet.tags.slice(0, 2) : ['여행'];

          return {
            id: item.id,
            thumbnail: item.snippet.thumbnails.high.url,
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            liked: false,
            tags: tags,
            views: formattedViews,
          };
        });

        setVideos(videoData);
      }
    } catch (err) {
      console.error('YouTube API 오류:', err);
      setError('영상을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 검색 실행
  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // YouTube API 키 확인
      if (!env.YOUTUBE_API_KEY) {
        setError('YouTube API 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      // 검색 쿼리 실행
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 3,
          q: `${searchTerm} 한국`,
          type: 'video',
          key: env.YOUTUBE_API_KEY,
          regionCode: 'KR',
          relevanceLanguage: 'ko',
        },
      });

      if (response.data.items) {
        // 비디오 ID 목록 추출
        const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

        // 비디오 통계 정보 가져오기
        const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'statistics,snippet',
            id: videoIds,
            key: env.YOUTUBE_API_KEY,
          },
        });

        // 검색 결과와 통계 정보 결합
        const videoData = statsResponse.data.items.map((item: any) => {
          // 조회수 포맷팅
          const viewCount = parseInt(item.statistics.viewCount);
          let formattedViews = '';

          if (viewCount >= 10000) {
            formattedViews = `${(viewCount / 10000).toFixed(1)}만`;
          } else if (viewCount >= 1000) {
            formattedViews = `${(viewCount / 1000).toFixed(1)}천`;
          } else {
            formattedViews = viewCount.toString();
          }

          // 태그 추출 (최대 2개)
          const tags = item.snippet.tags ? item.snippet.tags.slice(0, 2) : [searchTerm];

          return {
            id: item.id,
            thumbnail: item.snippet.thumbnails.high.url,
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            liked: false,
            tags: tags,
            views: formattedViews,
          };
        });

        setVideos(videoData);
      }
    } catch (err) {
      console.error('YouTube 검색 오류:', err);
      setError('영상을 검색하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = (id: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video => (video.id === id ? { ...video, liked: !video.liked } : video))
    );
  };

  // 비디오 재생
  const handlePlayVideo = (id: string, title: string) => {
    setPlayingVideo({ id, title });
    setOpenDialog(true);
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
        <YouTubeIcon sx={{ mr: 1, color: 'error.main' }} />
        <Typography variant="subtitle1" fontWeight={600}>
          추천 영상 갤러리
        </Typography>
      </Box>

      {/* 검색 폼 */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
        <TextField
          placeholder="영상 검색 (예: 여행, 음식, 음악 등)"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" type="submit" disabled={loading}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} color="primary" />
        </Box>
      )}

      {/* 비디오 그리드 */}
      {!loading && videos.length > 0 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {videos.map(video => (
              <Box
                key={video.id}
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
                    <CardMedia
                      component="img"
                      height="120"
                      image={video.thumbnail}
                      alt={video.title}
                    />

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
                        onClick={() => handleLikeToggle(video.id)}
                      >
                        {video.liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => handlePlayVideo(video.id, video.title)}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {video.channelName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {video.views} 조회
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}
                    >
                      {video.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {video.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            color: 'error.main',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* 비디오가 없을 때 */}
      {!loading && videos.length === 0 && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography color="text.secondary">검색 결과가 없습니다.</Typography>
        </Box>
      )}

      <Box
        sx={{ textAlign: 'center', mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="caption" color="text.secondary">
          YouTube 데이터 API를 통해 제공됩니다.
        </Typography>
      </Box>

      {/* 비디오 재생 모달 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1" noWrap sx={{ maxWidth: '80%' }}>
            {playingVideo?.title}
          </Typography>
          <MuiIconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              color: theme => theme.palette.grey[500],
            }}
            size="small"
          >
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: { xs: '250px', sm: '400px', md: '500px' } }}>
          {playingVideo && (
            <Box
              component="iframe"
              sx={{
                border: 0,
                width: '100%',
                height: '100%',
              }}
              src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0`}
              title={playingVideo.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default YoutubeGalleryWidget;
