import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Avatar, Tooltip, styled, CardActions, } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
const CategoryChip = styled(Chip)('');
// 태그 스타일
const TagChip = styled(Chip)('');
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
const PostTypeChip = styled(Chip)('');
// 지역 정보 스타일
const AddressInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#666',
    gap: '4px',
    marginTop: '8px',
}));
/**
 * 게시글 카드 컴포넌트
 * 게시글 목록에서 각 게시글을 카드 형태로 표시합니다.
 */
const PostCard = ({ post, hideImage = false, onClick }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        if (onClick) {
            onClick(post);
        }
        else {
            navigate(`/community/post/${post.postId}`);
        }
    };
    // 기본 썸네일 이미지
    const defaultThumbnail = '/assets/images/default-post-thumbnail.jpg';
    // 게시글 섬네일 이미지 결정 (files, thumbnail 속성 확인)
    const thumbnailUrl = post.files && post.files.length > 0 ? post.files[0] : undefined;
    // 날짜 포맷팅
    const formattedDate = post.createdAt
        ? format(new Date(post.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
        : '날짜 없음';
    return (_jsxs(StyledCard, { children: [_jsx(CategoryChip, { label: post.category || '전체', size: "small", sx: { backgroundColor: 'rgba(255, 170, 165, 0.85)' } }), _jsx(CategoryChip, { label: post.postType || '자유', size: "small", sx: {
                    backgroundColor: post.postType === '모임' ? 'rgba(144, 202, 249, 0.85)' : 'rgba(129, 199, 132, 0.85)',
                    right: '12px',
                    left: 'auto',
                } }), !hideImage && (_jsx(CardMediaWrapper, { onClick: handleCardClick, children: _jsx(CardMedia, { component: "img", className: "post-card-image", image: thumbnailUrl || defaultThumbnail, alt: post.title }) })), _jsxs(CardContentStyled, { onClick: handleCardClick, children: [_jsx(PostTitle, { variant: "h6", children: post.title }), _jsx(PostContent, { variant: "body2", children: post.content }), post.tags && post.tags.length > 0 && (_jsx(TagsContainer, { children: post.tags.map((tag, index) => (_jsx(TagChip, { label: typeof tag === 'string' ? tag : '', size: "small" }, index))) })), post.postType === '모임' && post.address && post.address !== '자유' && (_jsxs(AddressInfo, { children: [_jsx(LocationOnIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: post.address })] })), _jsxs(AuthorContainer, { children: [_jsx(StyledAvatar, { children: post.writer?.nickname?.charAt(0) || '?' }), _jsx(AuthorName, { variant: "body2", children: post.writer?.nickname || '익명' })] })] }), _jsxs(CardActionsStyled, { children: [_jsxs(MetaContainer, { children: [_jsx(EnhancedTooltip, { title: "\uC870\uD68C\uC218", children: _jsxs(MetaItem, { children: [_jsx(VisibilityOutlinedIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: post.viewCount || post.views || 0 })] }) }), _jsx(EnhancedTooltip, { title: "\uC88B\uC544\uC694", children: _jsxs(MetaItem, { children: [_jsx(ThumbUpOutlinedIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: post.likeCount || post.like || 0 })] }) }), _jsx(EnhancedTooltip, { title: "\uC2EB\uC5B4\uC694", children: _jsxs(MetaItem, { children: [_jsx(ThumbDownOutlinedIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: post.dislikeCount || post.dislike || 0 })] }) }), _jsx(EnhancedTooltip, { title: "\uB313\uAE00", children: _jsxs(MetaItem, { children: [_jsx(ChatBubbleOutlineIcon, { sx: { fontSize: 18, color: '#888', mr: 0.5 } }), _jsx("span", { children: post.commentCount ?? 0 })] }) })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: formattedDate })] })] }));
};
export default PostCard;
