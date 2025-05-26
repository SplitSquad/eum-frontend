import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import { useInfoFormStore } from '../store/InfoFormStore';
import useAuthStore from '@/features/auth/store/authStore';

const InfoDetailHeader: React.FC<{ onEdit?: () => void; onDelete?: () => void }> = ({
  onEdit,
  onDelete,
}) => {
  const { title, userName, createdAt, views } = useInfoFormStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        pt: 2,
        pl: 2,
        pr: 2,
        pb: 2,
        mb: 0,
        boxShadow:
          '0 -2px 8px -2px rgba(0,0,0,0.04), 2px 0 8px -2px rgba(0,0,0,0.04), -2px 0 8px -2px rgba(0,0,0,0.04)',
        background: 'transparent',
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 italic">
          {userName} · {createdAt} · 조회수 {views}
        </p>
        {isAdmin && (
          <div className="flex space-x-4">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onEdit}
            >
              수정하기
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onDelete}
            >
              삭제하기
            </Typography>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InfoDetailHeader;
