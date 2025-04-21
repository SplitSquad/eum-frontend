import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Tooltip,
  styled,
  CardActions,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { PostSummary } from '../../types';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ko } from 'date-fns/locale';

// 스타일 컴포넌트
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 170, 165, 0.3)',
  boxShadow: '0 8px 20px rgba(255, 170, 165, 0.15)',

  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(255, 107, 107, 0.25)',
    borderColor: 'rgba(255, 170, 165, 0.6)',
  },
}));

const CardMediaWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '56.25%', // 16:9 비율

  '& .post-card-image': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40%',
    background: 'linear-gradient(to top, rgba(255, 170, 165, 0.4), transparent)',
    pointerEvents: 'none',
  },

  '&:hover .post-card-image': {
    transform: 'scale(1.05)',
  },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px !important',
  display: 'flex',
  flexDirection: 'column',
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: '8px',
  fontSize: '1.2rem',
  transition: 'color 0.3s ease',
  color: '#555',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',

  '$:hover &': {
    color: '#d23669',
  },
}));

const PostContent = styled(Typography)(({ theme }) => ({
  color: '#666',
  marginBottom: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginBottom: '12px',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 235, 235, 0.8)',
  border: '1px solid rgba(255, 170, 165, 0.3)',
  color: '#d23669',
  fontSize: '0.75rem',
  height: '24px',

  '&:hover': {
    backgroundColor: 'rgba(255, 170, 165, 0.2)',
  },
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
  padding: '8px 16px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px dashed rgba(255, 170, 165, 0.3)',
}));

const MetaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const AuthorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '28px',
  height: '28px',
  border: '2px solid rgba(255, 170, 165, 0.4)',
}));

const AuthorName = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: '#666',
  fontWeight: 500,
}));

// 툴크 스타일 개선
const EnhancedTooltip = styled(Tooltip)(({ theme }) => ({
  tooltip: {
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '0.75rem',
  },
}));

// 메타 아이템 스타일 개선 - hover 효과 추가
const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#888',
  fontSize: '0.8rem',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: 'rgba(255, 170, 165, 0.1)',
    color: '#FF6B6B',
  },

  '& svg': {
    fontSize: '16px',
    color: 'rgba(255, 107, 107, 0.7)',
    transition: 'color 0.2s ease',
  },

  '&:hover svg': {
    color: '#FF6B6B',
  },
}));

// 카드 미디어 스타일
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 비율
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(0deg, rgba(255,250,250,0.1) 0%, rgba(255,230,230,0) 100%)',
  },
}));

// 카테고리 칩 스타일
const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  left: '12px',
  zIndex: 1,
  backgroundColor: 'rgba(255, 170, 165, 0.85)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  height: '24px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

// 태그 스타일
const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#FFF5F5',
  color: '#888',
  border: '1px solid #FFE5E5',
  margin: '0 4px 4px 0',
  fontSize: '0.7rem',
  height: '24px',

  '&:hover': {
    backgroundColor: '#FFE5E5',
  },
}));

// 반응 표시 컨테이너
const ReactionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '12px',
  padding: '8px 0',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
}));

// 반응 아이템 스타일
const ReactionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: '#888',
  fontSize: '0.75rem',

  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '4px',
  },
}));

interface PostCardProps {
  post: PostSummary;
  hideImage?: boolean;
  onClick?: (post: PostSummary) => void;
}

/**
 * 게시글 카드 컴포넌트
 * 게시글 목록에서 각 게시글을 카드 형태로 표시합니다.
 */
const PostCard: React.FC<PostCardProps> = ({ post, hideImage = false, onClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(post);
    } else {
      navigate(`/community/${post.postId}`);
    }
  };

  // 날짜 형식 변환 (절대적인 날짜 형식)
  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
    : '알 수 없음';

  // 백엔드 필드명 매핑
  const views = post.views || 0; // viewCount → views로 변경
  const likes = post.like || 0; // likeCount → like로 변경 
  const dislikes = post.dislike || 0; // dislikeCount → dislike로 변경
  const comments = post.commentCount || 0;

  // 썸네일 이미지 URL (배열 또는 단일 문자열에 따라 처리)
  const thumbnailUrl = Array.isArray(post.files) && post.files.length > 0 
    ? post.files[0] 
    : post.thumbnailUrl || '/images/default-post-image.jpg';

  return (
    <StyledCard>
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {!hideImage && (
          <Box sx={{ position: 'relative' }}>
            <CategoryChip label={post.category || '자유'} size="small" />
            <StyledCardMedia image={thumbnailUrl} title={post.title} />
          </Box>
        )}

        <CardContentStyled>
          <PostTitle variant="h6" gutterBottom>
            {post.title}
          </PostTitle>

          {post.content && (
            <PostContent variant="body2" color="text.secondary">
              {/* HTML 태그 제거 및 줄바꿈 처리 */}
              {post.content.replace(/<\/?[^>]+(>|$)/g, '').replace(/\n/g, ' ')}
            </PostContent>
          )}

          {post.tags && post.tags.length > 0 && (
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <StyledChip
                  key={index}
                  label={typeof tag === 'string' ? tag : tag.name}
                  size="small"
                  variant="outlined"
                />
              ))}
            </TagsContainer>
          )}

          <AuthorContainer sx={{ mt: 'auto' }}>
            <StyledAvatar src={post.writer?.profileImageUrl} />
            <AuthorName>{post.writer?.nickname || post.userName || '익명'}</AuthorName>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {formattedDate}
            </Typography>
          </AuthorContainer>
        </CardContentStyled>
      </CardActionArea>

      <CardActionsStyled>
        <MetaContainer>
          {/* 조회수 표시 */}
          <EnhancedTooltip title={`조회수: ${views}회`} arrow placement="top">
            <MetaItem>
              <VisibilityOutlinedIcon fontSize="small" />
              <Typography variant="caption">{views}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          {/* 좋아요 표시 */}
          <EnhancedTooltip title={`좋아요: ${likes}개`} arrow placement="top">
            <MetaItem>
              <ThumbUpOutlinedIcon fontSize="small" />
              <Typography variant="caption">{likes}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          {/* 싫어요 표시 */}
          <EnhancedTooltip title={`싫어요: ${dislikes}개`} arrow placement="top">
            <MetaItem>
              <ThumbDownOutlinedIcon fontSize="small" />
              <Typography variant="caption">{dislikes}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          {/* 댓글 수 표시 */}
          <EnhancedTooltip title={`댓글: ${comments}개`} arrow placement="top">
            <MetaItem>
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="caption">{comments}</Typography>
            </MetaItem>
          </EnhancedTooltip>
        </MetaContainer>
      </CardActionsStyled>
    </StyledCard>
  );
};

export default PostCard;
