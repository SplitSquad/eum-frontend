import React from 'react';
import { Typography, Avatar, Box, IconButton, Tooltip } from '@mui/material';
import { useInfoFormStore } from '../store/InfoFormStore';
import useAuthStore from '@/features/auth/store/authStore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface InfoDetailHeaderProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const InfoDetailHeader: React.FC<InfoDetailHeaderProps> = ({ onEdit, onDelete, onBack }) => {
  const { title, userName, createdAt, views, informationId, bookmarkedIds, toggleBookmark } =
    useInfoFormStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isBookmarked = informationId && bookmarkedIds.includes(informationId);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          onClick={onBack}
          size="small"
          disableFocusRipple
          disableRipple
          sx={{
            mr: 1,
            outline: 'none',
            boxShadow: 'none',
            '&:focus': { outline: 'none', boxShadow: 'none' },
            '&:active': { outline: 'none', boxShadow: 'none' },
            '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Tooltip title={isBookmarked ? '북마크 해제' : '북마크'}>
          <IconButton
            onClick={() => informationId && toggleBookmark(informationId)}
            size="small"
            disableFocusRipple
            disableRipple
            sx={{
              ml: 1,
              outline: 'none',
              boxShadow: 'none',
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:active': { outline: 'none', boxShadow: 'none' },
              '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none' },
            }}
          >
            {isBookmarked ? (
              <BookmarkIcon sx={{ color: '#00C853' }} />
            ) : (
              <BookmarkBorderIcon sx={{ color: '#888' }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* 작성자/날짜/조회수 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={user?.profileImagePath}
            alt={userName || '작성자'}
            sx={{ width: 36, height: 36, mr: 1 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#555', mr: 1 }}>
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {createdAt}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} color="action" />
            <Typography variant="body2" color="text.secondary">
              {views}
            </Typography>
          </Box>
        </Box>
        {/* 수정/삭제 버튼 (관리자만) */}
        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={onEdit} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InfoDetailHeader;
