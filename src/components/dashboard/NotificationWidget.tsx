import React from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';

interface NotificationItem {
  id: string;
  title: string;
  type: 'info' | 'warning' | 'urgent';
  time: string;
}

const NotificationWidget: React.FC = () => {
  // 실제 알림 데이터를 사용 (현재는 빈 배열)
  const notifications: NotificationItem[] = [];

  // 알림 유형별 색상
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return { bg: '#e3f2fd', color: '#1976d2' };
      case 'warning': return { bg: '#fff3e0', color: '#e65100' };
      case 'urgent': return { bg: '#ffebee', color: '#c62828' };
      default: return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'info': return 'Info';
      case 'warning': return 'Warning';
      case 'urgent': return 'Urgent';
      default: return '';
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        ...widgetPaperBase,
        background: widgetGradients.blue,
        p: 2, 
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsActiveIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight={600}>
            알림
          </Typography>
        </Box>
        <Chip 
          label={`${notifications.length}개`} 
          size="small" 
          sx={{ 
            bgcolor: '#f5f5f5', 
            color: '#616161',
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 500
          }} 
        />
      </Box>
      
      <Divider sx={{ mb: 1.5 }} />
      
      <List sx={{ p: 0 }}>
        {notifications.length === 0 ? (
          <ListItem sx={{ justifyContent: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              새로운 알림이 없습니다
            </Typography>
          </ListItem>
        ) : (
          notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            {index > 0 && <Divider component="li" sx={{ my: 1 }} />}
            <ListItem disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={500}>
                      {notification.title}
                    </Typography>
                    <Chip 
                      label={getTypeLabel(notification.type)} 
                      size="small"
                      sx={{ 
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: getTypeColor(notification.type).bg,
                        color: getTypeColor(notification.type).color,
                        ml: 1
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
          ))
        )}
      </List>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography 
          variant="caption" 
          color="primary" 
          sx={{ cursor: 'pointer', fontWeight: 500 }}
        >
          모든 알림 보기
        </Typography>
      </Box>
    </Paper>
  );
};

export default NotificationWidget; 