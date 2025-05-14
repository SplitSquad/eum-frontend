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
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { ko } from 'date-fns/locale';
import { useLocation } from 'react-router-dom';

/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

// 로그 전송 타입 정의
interface WebLog {
  userId: number;
  content: string;
}

// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;

// 로그 전송 함수
export function sendWebLog(log: WebLog) {
  // jwt token 가져오기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  fetch(`${BASE}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(log),
  }).catch(err => {
    console.error('WebLog 전송 실패:', err);
  });
  // 전송 완료
  console.log('WebLog 전송 성공:', log);
}

// useTrackedPost 훅
export function useTrackedPost() {
  const location = useLocation();

  return (title: string, content: string, tag: string | null = null) => {
    const userId = getUserId() || 0;
    const postLogPayload = {
      UID: userId,
      ClickPath: location.pathname,
      TAG: tag,
      CurrentPath: location.pathname,
      Event: 'click',
      Content: { title: title, content: content },
      Timestamp: new Date().toISOString(),
    };
    sendWebLog({ userId, content: JSON.stringify(postLogPayload) });
  };
}
/**------------------------------------------------------------------------------------**/

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

// 게시글 타입 칩 스타일
const PostTypeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  zIndex: 1,
  backgroundColor: props =>
    props.label === '모임' ? 'rgba(102, 187, 255, 0.85)' : 'rgba(255, 170, 165, 0.85)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  height: '24px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

// 지역 정보 스타일
const AddressInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.8rem',
  color: '#666',
  gap: '4px',
  marginTop: '8px',
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

  const handleCardClick = async () => {
    const uid = getUserId() || 0;
    // content는 받아 올 수가 없어, api 호출 후 값을 받아와서 웹 로그로 전송
    const res = await fetch(`${BASE}/community/post/${post.postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('auth_token') || '',
      },
    });
    const postContent = await res.json();

    if (onClick) {
      onClick(post);
    } else {
      navigate(`/community/post/${post.postId}`);
    }

    // 웹로그 전송
    sendWebLog({
      userId: uid,
      content: JSON.stringify({
        UID: uid,
        ClickPath: location.pathname,
        TAG: post.category,
        CurrentPath: location.pathname,
        Event: 'click',
        Content: { title: post.title, content: postContent.content },
        Timestamp: new Date().toISOString(),
      }),
    });
  };

  // 기본 썸네일 이미지
  const defaultThumbnail = '/assets/images/default-post-thumbnail.jpg';

  // 게시글 섬네일 이미지 결정 (files, thumbnail 속성 확인)
  const thumbnailUrl = post.thumbnail
    ? post.thumbnail
    : post.files && post.files.length > 0
      ? post.files[0]
      : defaultThumbnail;

  // 날짜 포맷팅
  const formattedDate = format(new Date(post.createdAt), 'yyyy년 MM월 dd일', { locale: ko });
  return (
    <StyledCard>
      {/* 좌상단: 대분류(카테고리) 칩 */}
      <CategoryChip
        label={post.category || '전체'}
        size="small"
        sx={{ backgroundColor: 'rgba(255, 170, 165, 0.85)' }}
      />

      {/* 우상단: 게시글 타입(자유/모임) 칩 */}
      <CategoryChip
        label={post.postType || '자유'}
        size="small"
        sx={{
          backgroundColor:
            post.postType === '모임' ? 'rgba(144, 202, 249, 0.85)' : 'rgba(129, 199, 132, 0.85)',
          right: '12px',
          left: 'auto',
        }}
      />

      {/* 게시글 이미지 */}
      {!hideImage && (
        <CardMediaWrapper onClick={handleCardClick}>
          <CardMedia
            component="img"
            className="post-card-image"
            image={thumbnailUrl}
            alt={post.title}
          />
        </CardMediaWrapper>
      )}

      <CardContentStyled onClick={handleCardClick}>
        <PostTitle variant="h6">{post.title}</PostTitle>
        <PostContent variant="body2">{post.content}</PostContent>

        {/* 태그 표시 */}
        {post.tags && post.tags.length > 0 && (
          <TagsContainer>
            {post.tags.map((tag, index) => (
              <TagChip key={index} label={typeof tag === 'string' ? tag : tag.name} size="small" />
            ))}
          </TagsContainer>
        )}

        {/* 지역 정보 표시 (모임일 경우) */}
        {post.postType === '모임' && post.address && post.address !== '자유' && (
          <AddressInfo>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">{post.address}</Typography>
          </AddressInfo>
        )}

        {/* 작성자 정보 */}
        <AuthorContainer>
          <StyledAvatar>
            {post.writer?.nickname?.charAt(0) || post.userName?.charAt(0) || '?'}
          </StyledAvatar>
          <AuthorName variant="body2">
            {post.writer?.nickname || post.userName || '익명'}
          </AuthorName>
        </AuthorContainer>
      </CardContentStyled>

      <CardActionsStyled>
        {/* 메타 정보 (조회수, 좋아요, 싫어요, 댓글 수) */}
        <MetaContainer>
          <EnhancedTooltip title="조회수">
            <MetaItem>
              <VisibilityOutlinedIcon fontSize="small" />
              <Typography variant="body2">{post.viewCount || post.views || 0}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          <EnhancedTooltip title="좋아요">
            <MetaItem>
              <ThumbUpOutlinedIcon fontSize="small" />
              <Typography variant="body2">{post.likeCount || post.like || 0}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          <EnhancedTooltip title="싫어요">
            <MetaItem>
              <ThumbDownOutlinedIcon fontSize="small" />
              <Typography variant="body2">{post.dislikeCount || post.dislike || 0}</Typography>
            </MetaItem>
          </EnhancedTooltip>

          {/* 댓글 수 표시 추가 */}
          <EnhancedTooltip title="댓글">
            <MetaItem>
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body2">{post.commentCount || post.commentCnt || 0}</Typography>
            </MetaItem>
          </EnhancedTooltip>
        </MetaContainer>

        {/* 날짜 표시 */}
        <Typography variant="caption" color="text.secondary">
          {formattedDate}
        </Typography>
      </CardActionsStyled>
    </StyledCard>
  );
};

export default PostCard;
