import React from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const TodoWidget: React.FC = () => {
  // 샘플 할일 데이터
  const sampleTodos: TodoItem[] = [
    { id: '1', text: '회의 문서 검토하기', completed: true, priority: 'high' },
    { id: '2', text: '발표 자료 준비하기', completed: false, priority: 'high' },
    { id: '3', text: '이메일 답장하기', completed: false, priority: 'medium' },
    { id: '4', text: '보고서 작성하기', completed: false, priority: 'medium' },
    { id: '5', text: '동료와 점심 약속', completed: false, priority: 'low' },
  ];

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { color: '#ff5252', bg: '#ffebee' };
      case 'medium': return { color: '#fb8c00', bg: '#fff3e0' };
      case 'low': return { color: '#4caf50', bg: '#e8f5e9' };
      default: return { color: '#757575', bg: '#f5f5f5' };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
      default: return '';
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        ...widgetPaperBase,
        background: widgetGradients.yellow,
        p: 2, 
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src="/assets/profile.jpg" 
          alt="사용자 프로필"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            홍길동 님
          </Typography>
          <Typography variant="body2" color="text.secondary">
            오늘도 화이팅하세요!
          </Typography>
        </Box>
      </Box>
      
      {/* 할 일 목록 상단 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          오늘의 할 일
        </Typography>
        <Chip 
          label={`${sampleTodos.filter(t => t.completed).length}/${sampleTodos.length}`} 
          size="small" 
          sx={{ 
            bgcolor: '#e3f2fd', 
            color: '#1565c0',
            fontWeight: 500,
            fontSize: '0.7rem'
          }} 
        />
      </Box>
      
      {/* 할 일 목록 */}
      <List dense sx={{ mt: 0 }}>
        {sampleTodos.map((todo) => (
          <ListItem 
            key={todo.id}
            sx={{ 
              py: 0.8, 
              px: 1,
              borderRadius: 1,
              mb: 0.5,
              bgcolor: todo.completed ? 'rgba(0,0,0,0.03)' : 'transparent',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {todo.completed ? 
                <CheckCircleOutlineIcon color="success" fontSize="small" /> : 
                <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
              }
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.disabled' : 'text.primary',
                  }}
                >
                  {todo.text}
                </Typography>
              } 
            />
            <Chip 
              label={getPriorityLabel(todo.priority)} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.65rem',
                bgcolor: getPriorityColor(todo.priority).bg,
                color: getPriorityColor(todo.priority).color,
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TodoWidget; 