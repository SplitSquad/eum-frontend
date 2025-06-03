import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemButton,
  Snackbar,
  Alert,
  AlertTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';
import GoogleIcon from '@mui/icons-material/Google';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';
import CalendarService, {
  CalendarEvent,
  GoogleCalendarEventRequest,
} from '../../services/calendar/calendarService';

// 이벤트 폼 데이터 타입
interface EventFormData {
  summary: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  category: string;
}

// 이벤트 타입별 색상 - 구글 캘린더 이벤트는 타입이 없으므로 이름 기반으로 임의 분류
const getEventTypeColor = (summary: string) => {
  if (summary.includes('회의') || summary.includes('미팅') || summary.includes('meeting')) {
    return { bg: 'rgba(33, 150, 243, 0.1)', color: '#2196F3', icon: '👥' };
  } else if (
    summary.includes('보고') ||
    summary.includes('제출') ||
    summary.includes('마감') ||
    summary.includes('deadline')
  ) {
    return { bg: 'rgba(244, 67, 54, 0.1)', color: '#F44336', icon: '⏰' };
  } else if (
    summary.includes('중요') ||
    summary.includes('필수') ||
    summary.includes('important')
  ) {
    return { bg: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0', icon: '⭐' };
  } else if (summary.includes('여행') || summary.includes('출장') || summary.includes('travel')) {
    return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', icon: '✈️' };
  } else if (summary.includes('학습') || summary.includes('공부') || summary.includes('study')) {
    return { bg: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', icon: '📚' };
  } else {
    return { bg: 'rgba(96, 125, 139, 0.1)', color: '#607D8B', icon: '📌' };
  }
};

// 우선순위 계산 (시간이 가까울수록 높은 우선순위)
const calculatePriority = (event: CalendarEvent): 'high' | 'medium' | 'low' => {
  if (!event.start?.dateTime) return 'low';

  const eventDate = new Date(event.start.dateTime);
  const now = new Date();
  const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours <= 24) return 'high';
  if (diffHours <= 72) return 'medium';
  return 'low';
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return '오늘';
  if (isTomorrow) return '내일';

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return `${diffDays}일 후`;
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
};

// 시간 포맷팅 함수
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

interface EventItemProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const eventConfig = getEventTypeColor(event.summary);
  const priority = calculatePriority(event);

  // 우선순위별 색상
  const priorityColors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50',
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(event);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    handleMenuClose();
  };

  return (
    <>
      <ListItem
        sx={{
          px: 0,
          py: 1.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'action.hover',
            cursor: 'pointer',
          },
          transition: 'background-color 0.2s ease',
        }}
      >
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Avatar
            sx={{
              bgcolor: eventConfig.bg,
              color: eventConfig.color,
              width: 40,
              height: 40,
              fontSize: '1.2rem',
            }}
          >
            {eventConfig.icon}
          </Avatar>
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
                {event.summary}
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: priorityColors[priority],
                  ml: 1,
                }}
              />
            </Box>
          }
          secondary={
            <Box>
              {/* 날짜와 시간 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(event.start.dateTime)}
                </Typography>
                {event.start.dateTime && (
                  <>
                    <AccessTimeIcon sx={{ fontSize: 12, mx: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(event.start.dateTime)}
                    </Typography>
                  </>
                )}
              </Box>

              {/* 위치 */}
              {event.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
              )}

              {/* 주최자 */}
              {event.organizer?.displayName && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {event.organizer.displayName}
                  </Typography>
                </Box>
              )}
            </Box>
          }
        />

        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          수정
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          삭제
        </MenuItem>
      </Menu>
    </>
  );
};

// 이벤트 추가/수정 다이얼로그
interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (eventData: EventFormData) => void;
  event?: CalendarEvent | null;
  isLoading?: boolean;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  onSave,
  event,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    summary: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    category: 'general',
  });

  // 이벤트 데이터로 폼 초기화
  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end?.dateTime || event.start.dateTime);

      setFormData({
        summary: event.summary || '',
        description: event.description || '',
        location: event.location || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        category: 'general',
      });
    } else {
      // 새 이벤트의 경우 기본값 설정
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setFormData({
        summary: '',
        description: '',
        location: '',
        startDate: now.toISOString().split('T')[0],
        startTime: now.toTimeString().slice(0, 5),
        endDate: oneHourLater.toISOString().split('T')[0],
        endTime: oneHourLater.toTimeString().slice(0, 5),
        category: 'general',
      });
    }
  }, [event, open]);

  const handleInputChange =
    (field: keyof EventFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = () => {
    if (!formData.summary.trim()) return;
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
          {event ? '일정 수정' : '새 일정 추가'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="제목"
            value={formData.summary}
            onChange={handleInputChange('summary')}
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="설명"
            value={formData.description}
            onChange={handleInputChange('description')}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />

          <TextField
            label="위치"
            value={formData.location}
            onChange={handleInputChange('location')}
            fullWidth
            variant="outlined"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="시작 날짜"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange('startDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="시작 시간"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange('startTime')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="종료 날짜"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange('endDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="종료 시간"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange('endTime')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>카테고리</InputLabel>
            <Select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              label="카테고리"
            >
              <MenuItem value="general">일반</MenuItem>
              <MenuItem value="meeting">회의</MenuItem>
              <MenuItem value="important">중요</MenuItem>
              <MenuItem value="travel">여행</MenuItem>
              <MenuItem value="study">학습</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />} disabled={isLoading}>
          취소
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!formData.summary.trim() || isLoading}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? <CircularProgress size={20} /> : event ? '수정' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UpcomingEventsWidget: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isDialogLoading, setIsDialogLoading] = useState(false);

  // OAuth 로그인 상태 체크 추가
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // OAuth 사용자 체크 함수 추가
  const checkOAuthUser = () => {
    try {
      // 로컬 스토리지에서 사용자 정보 확인
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');

      if (token && userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserProfile(parsedUserInfo);

        // OAuth 제공자가 있는지 확인 (Google OAuth)
        // 또는 이메일이 Gmail인지 확인
        const isGoogleOAuth =
          parsedUserInfo.provider === 'google' ||
          parsedUserInfo.email?.includes('@gmail.com') ||
          parsedUserInfo.oauth_provider === 'google';

        setIsOAuthUser(isGoogleOAuth);

        if (isGoogleOAuth) {
          checkGoogleCalendarConnection();
        } else {
          setIsLoading(false);
        }
      } else {
        setIsOAuthUser(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('OAuth 사용자 확인 실패:', error);
      setIsOAuthUser(false);
      setIsLoading(false);
    }
  };

  // 구글 캘린더 연동 상태 확인
  const checkGoogleCalendarConnection = async () => {
    try {
      const isConnected = await CalendarService.checkGoogleCalendarConnection();
      setIsGoogleConnected(isConnected);
      if (isConnected) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('구글 캘린더 연동 상태 확인 실패:', error);
      setIsGoogleConnected(false);
      setError('구글 캘린더 연동 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 캘린더 이벤트 가져오기
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const calendarEvents = await CalendarService.getEvents();

      // 다가오는 이벤트만 필터링 (오늘부터 앞으로 30일간)
      const now = new Date();
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const upcomingEvents = calendarEvents
        .filter(event => {
          if (!event.start?.dateTime) return false;
          const eventDate = new Date(event.start.dateTime);
          return eventDate >= now && eventDate <= thirtyDaysLater;
        })
        .sort((a, b) => {
          const dateA = new Date(a.start.dateTime);
          const dateB = new Date(b.start.dateTime);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 10); // 최대 10개만 표시

      setEvents(upcomingEvents);
    } catch (error) {
      console.error('캘린더 이벤트 가져오기 실패:', error);
      setError('일정을 불러오는데 실패했습니다.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    // OAuth 사용자 체크 먼저 실행
    checkOAuthUser();
  }, []);

  // 새로고침 핸들러
  const handleRefresh = () => {
    checkGoogleCalendarConnection();
  };

  // 구글 캘린더 동기화 핸들러
  const handleGoogleSync = async () => {
    setIsLoading(true);
    try {
      await fetchEvents();
      showSnackbar('캘린더가 동기화되었습니다.', 'success');
    } catch (error) {
      console.error('구글 캘린더 동기화 실패:', error);
      setError('동기화에 실패했습니다.');
      showSnackbar('동기화에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 일정 추가 핸들러
  const handleAddEvent = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  // 일정 수정 핸들러
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  // 일정 삭제 핸들러
  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) return;

    try {
      await CalendarService.deleteEvent(eventId);
      await fetchEvents();
      showSnackbar('일정이 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      showSnackbar('일정 삭제에 실패했습니다.', 'error');
    }
  };

  // 일정 저장 핸들러
  const handleSaveEvent = async (eventData: EventFormData) => {
    setIsDialogLoading(true);
    try {
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);

      const calendarEventData: GoogleCalendarEventRequest = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      };

      if (editingEvent) {
        await CalendarService.updateEvent(editingEvent.id, calendarEventData);
        showSnackbar('일정이 수정되었습니다.', 'success');
      } else {
        await CalendarService.addEvent(calendarEventData);
        showSnackbar('일정이 추가되었습니다.', 'success');
      }

      setDialogOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error('일정 저장 실패:', error);
      showSnackbar('일정 저장에 실패했습니다.', 'error');
    } finally {
      setIsDialogLoading(false);
    }
  };

  // 스낵바 표시 함수
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // 스낵바 닫기
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.blue,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  // OAuth 사용자가 아닌 경우 접근 제한 UI 표시
  if (!isOAuthUser) {
    return (
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.blue,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          borderRadius: 3,
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 장식 */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(233,245,255,0.7) 0%, rgba(233,245,255,0) 70%)',
            zIndex: 0,
          }}
        />

        {/* 접근 제한 메시지 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Alert
            severity="info"
            sx={{
              width: '100%',
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '2rem',
              },
            }}
          >
            <AlertTitle sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
              <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              구글 로그인 필요
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              일정 관리 기능은 구글 계정으로 로그인한 사용자만 이용하실 수 있습니다.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                • 구글 캘린더와 연동하여 일정을 관리할 수 있습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 실시간 동기화로 모든 기기에서 일정을 확인할 수 있습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 알림 설정으로 중요한 일정을 놓치지 마세요
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          ...widgetPaperBase,
          background: widgetGradients.blue,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.2)',
                color: '#2196F3',
                width: 32,
                height: 32,
                mr: 1,
              }}
            >
              <EventIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              다가오는 일정
            </Typography>
            <IconButton
              sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }}
              size="small"
              onClick={() => setIsCollapsed(v => !v)}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={handleAddEvent}
              sx={{
                bgcolor: 'action.hover',
                mr: 1,
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleRefresh}
              sx={{
                bgcolor: 'action.hover',
                mr: 1,
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            {isGoogleConnected && (
              <IconButton
                size="small"
                onClick={handleGoogleSync}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <SyncIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* 이벤트 목록 */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {error ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                sx={{ borderRadius: 2 }}
              >
                다시 시도
              </Button>
            </Box>
          ) : !isGoogleConnected ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                py: 4,
              }}
            >
              <GoogleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                구글 캘린더 연동이 필요합니다
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<GoogleIcon />}
                onClick={handleRefresh}
                sx={{ borderRadius: 2 }}
              >
                연동 확인
              </Button>
            </Box>
          ) : events.length > 0 ? (
            <List disablePadding>
              {events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <EventItem event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                  {index < events.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                py: 4,
              }}
            >
              <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                예정된 일정이 없습니다
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddEvent}
                sx={{ borderRadius: 2 }}
              >
                일정 추가
              </Button>
            </Box>
          )}
        </Box>

        {/* 하단 요약 */}
        {events.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              다음 {events.length}개의 일정 • 구글 캘린더와 동기화됨
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 일정 추가/수정 다이얼로그 */}
      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        isLoading={isDialogLoading}
      />

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpcomingEventsWidget;
