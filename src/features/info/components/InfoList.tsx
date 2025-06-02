import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { cleanInfoContent } from '../utils';

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

interface InfoListProps {
  posts: any[];
  onClick: (id: number) => void;
  onBookmark: (id: number) => void;
  bookmarkedIds: number[];
}

const InfoList: React.FC<InfoListProps> = ({ posts, onClick, onBookmark, bookmarkedIds }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {posts.map(item => {
        const isBookmarked = bookmarkedIds.includes(item.informationId);
        const thumbnail = PLACEHOLDER_IMG;
        return (
          <Card
            key={item.informationId}
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
              overflow: 'hidden',
              width: '100%',
              minHeight: { xs: 90, sm: 120, md: 140 },
            }}
            variant="outlined"
          >
            {/* 왼쪽: 텍스트/메타 */}
            <CardContent
              sx={{
                flex: 1,
                minWidth: 0,
                p: 2,
                pr: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar sx={{ width: 28, height: 28, mr: 1 }} />
                <Typography variant="subtitle2" sx={{ color: '#222', fontWeight: 600, mr: 1 }}>
                  {item.userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.createdAt}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => onClick(item.informationId)}
                noWrap
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cleanInfoContent(item.content || '')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  조회수 {item.views}
                </Typography>
                {/* 카테고리 뱃지 */}
                <Box
                  component="span"
                  sx={{
                    bgcolor: '#f0f0f0',
                    color: '#666',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderRadius: '12px',
                    px: 1.2,
                    py: 0.3,
                    ml: 0.5,
                    display: 'inline-block',
                  }}
                >
                  {item.category}
                </Box>
              </Box>
            </CardContent>
            {/* 오른쪽: 북마크(위) + 썸네일(아래) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                p: 1,
                pl: 0,
              }}
            >
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => onBookmark(item.informationId)}
                  disableFocusRipple
                  disableRipple
                  sx={{
                    outline: 'none',
                    boxShadow: 'none',
                    '&:focus': { outline: 'none', boxShadow: 'none' },
                    '&:active': { outline: 'none', boxShadow: 'none' },
                    '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none' },
                    border: isBookmarked ? 'none' : '1.5px solid #bdbdbd',
                    borderRadius: '50%',
                    bgcolor: isBookmarked ? '#00C853' : 'transparent',
                    color: isBookmarked ? 'white' : '#bdbdbd',
                    transition: 'all 0.15s',
                    '&:hover': {
                      bgcolor: isBookmarked ? '#00C853' : '#f5f5f5',
                      color: isBookmarked ? 'white' : '#00C853',
                      borderColor: '#00C853',
                    },
                    width: 36,
                    height: 36,
                    aspectRatio: '1 / 1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    flexShrink: 0,
                    flexGrow: 0,
                  }}
                >
                  {isBookmarked ? (
                    <BookmarkIcon fontSize="medium" />
                  ) : (
                    <BookmarkBorderIcon fontSize="medium" />
                  )}
                </IconButton>
              </Box>
              <CardMedia
                component="img"
                image={thumbnail}
                alt={item.title}
                sx={{
                  width: { xs: 100, sm: 130, md: 160 },
                  height: { xs: 70, sm: 90, md: 110 },
                  borderRadius: 2,
                  objectFit: 'cover',
                  background: '#f5f5f5',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default InfoList;
