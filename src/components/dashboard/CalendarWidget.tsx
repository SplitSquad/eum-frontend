import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle,
  Pagination,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SyncIcon from '@mui/icons-material/Sync';
import GoogleIcon from '@mui/icons-material/Google';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarService, {
  CalendarEvent,
  GoogleCalendarEventRequest,
} from '../../services/calendar/calendarService';
import { useTranslation } from '../../shared/i18n';
import useAuthStore from '../../features/auth/store/authStore';

// ISO 문자열을 한국 시간대로 변환하는 유틸리티 함수
const formatToKoreanTimezone = (date: Date): string => {
  // 한국 시간대(UTC+9)로 변환해서 ISO 문자열 반환
  const offset = 9 * 60; // 한국 시간대 오프셋 (분 단위)
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000); // UTC 시간 (밀리초)
  const koreanTime = new Date(utc + (offset * 60000)); // 한국 시간
  return koreanTime.toISOString();
};

const CalendarWidget: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore(); // Auth 스토어에서 사용자 정보 가져오기
  
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<number[][]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // 접기/펴기 상태 추가
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Auth 스토어에서 사용자 정보를 통해 OAuth 사용자 확인
  const isOAuthUser = user?.email?.includes('@gmail.com') || false;
  
  // 초기값 설정 시 한국 시간대로 변환
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  
  const [newEvent, setNewEvent] = useState<GoogleCalendarEventRequest>({
    summary: '',
    location: '',
    description: '',
    startDateTime: formatToKoreanTimezone(startDate),
    endDateTime: formatToKoreanTimezone(endDate),
  });

  // 오늘 날짜
  const today = new Date();

  // 완료된 일정 (실제로는 이벤트에 완료 속성이 있어야 함)
  const completedDays: number[] = [];

  // 요일 레이블
  const weekdays = [
    t('calendar.weekdays.sunday'),
    t('calendar.weekdays.monday'),
    t('calendar.weekdays.tuesday'),
    t('calendar.weekdays.wednesday'),
    t('calendar.weekdays.thursday'),
    t('calendar.weekdays.friday'),
    t('calendar.weekdays.saturday'),
  ];

  // 이벤트 타입별 색상 - 구글 캘린더 이벤트는 타입이 없으므로 이름 기반으로 임의 분류
  const getEventTypeColor = (summary: string) => {
    if (summary.includes('회의') || summary.includes('미팅')) {
      return { bg: '#e3f2fd', color: '#1976d2', icon: '👥' };
    } else if (summary.includes('보고') || summary.includes('제출') || summary.includes('마감')) {
      return { bg: '#ffebee', color: '#d32f2f', icon: '⏰' };
    } else if (summary.includes('중요') || summary.includes('필수')) {
      return { bg: '#fce4ec', color: '#c2185b', icon: '⭐' };
    } else if (summary.includes('여행') || summary.includes('출장')) {
      return { bg: '#e8f5e9', color: '#388e3c', icon: '✈️' };
    } else if (summary.includes('보고서') || summary.includes('리포트')) {
      return { bg: '#f3e5f5', color: '#7b1fa2', icon: '📊' };
    } else {
      return { bg: '#f5f5f5', color: '#757575', icon: '📌' };
    }
  };

  // 날짜 차이 계산 (오늘 기준)
  const getDateDiff = (date: Date) => {
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('calendar.dateLabels.today');
    else if (diffDays === 1) return t('calendar.dateLabels.tomorrow');
    else if (diffDays === 2) return t('calendar.dateLabels.dayAfterTomorrow');
    else if (diffDays > 0) return t('calendar.dateLabels.daysLater', { days: diffDays.toString() });
    else return t('calendar.dateLabels.daysAgo', { days: Math.abs(diffDays).toString() });
  };

  // 구글 캘린더 연동 상태 확인
  const checkGoogleCalendarConnection = async () => {
    try {
      setIsGoogleConnected(true);
      if (isOAuthUser) {
        fetchEvents();
      }
    } catch (error) {
      console.error('구글 캘린더 연동 상태 확인 실패:', error);
      setIsGoogleConnected(true);
    }
  };

  // 캘린더 이벤트 가져오기
  const fetchEvents = async () => {
    if (!isOAuthUser) return;
    
    setIsLoading(true);
    try {
      const calendarEvents = await CalendarService.getEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('캘린더 이벤트 가져오기 실패:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜를 기준으로 이벤트 필터링
  const getEventsForDay = (day: number): CalendarEvent[] => {
    if (!isOAuthUser || events.length === 0) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const date = new Date(year, month, day);
    
    if (isNaN(date.getTime())) return [];

    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return events.filter(event => {
      if (!event.start || !event.start.dateTime) return false;

      try {
        const eventDate = new Date(event.start.dateTime);
        if (isNaN(eventDate.getTime())) return false;
        
        const eventDateString = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        
        return eventDateString === localDateString;
      } catch (error) {
        console.error('Invalid date in event:', event);
        return false;
      }
    });
  };

  // 오늘 또는 앞으로 다가오는 이벤트들을 가져옴
  const getUpcomingEvents = (): CalendarEvent[] => {
    if (!isOAuthUser || events.length === 0) return [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return events
      .filter(event => {
        if (!event.start || !event.start.dateTime) return false;

        try {
          const eventDate = new Date(event.start.dateTime);
          if (isNaN(eventDate.getTime())) return false;

          return eventDate >= todayStart;
        } catch (error) {
          console.error('Invalid date in event:', event);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(a.start.dateTime);
          const dateB = new Date(b.start.dateTime);

          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }

          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          console.error('Error sorting dates:', error);
          return 0;
        }
      })
      .slice(0, 5);
  };

  // 페이지네이션을 적용한 이벤트 목록 가져오기
  const getPaginatedEvents = () => {
    const allEvents = getUpcomingEvents();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allEvents.slice(startIndex, endIndex);
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(getUpcomingEvents().length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // 이벤트 생성 또는 수정 열기
  const openEventDialog = (event?: CalendarEvent) => {
    if (!isOAuthUser) return;
    
    if (event) {
      setSelectedEvent(event);
      setNewEvent({
        summary: event.summary,
        location: event.location || '',
        description: event.description || '',
        startDateTime: event.start.dateTime,
        endDateTime: event.end.dateTime,
      });
    } else {
      setSelectedEvent(null);
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      setNewEvent({
        summary: '',
        location: '',
        description: '',
        startDateTime: formatToKoreanTimezone(startDate),
        endDateTime: formatToKoreanTimezone(endDate),
      });
    }
    setIsDialogOpen(true);
  };

  // 이벤트 저장
  const saveEvent = async () => {
    if (!isOAuthUser) return;
    
    setIsLoading(true);
    try {
      if (selectedEvent) {
        await CalendarService.updateEvent(selectedEvent.id, newEvent);
      } else {
        await CalendarService.addEvent(newEvent);
      }
      fetchEvents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('이벤트 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 삭제
  const deleteEvent = async (event: CalendarEvent) => {
    if (!isOAuthUser) return;
    if (!window.confirm(t('calendar.events.deleteConfirm'))) return;

    setIsLoading(true);
    try {
      await CalendarService.deleteEvent(event.id);
      fetchEvents();
    } catch (error) {
      console.error('이벤트 삭제 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 캘린더 연동 처리
  const handleGoogleSync = async () => {
    if (isOAuthUser) {
      fetchEvents();
    }
  };

  // 컴포넌트 마운트 시 캘린더 연동 상태 확인
  useEffect(() => {
    checkGoogleCalendarConnection();
  }, [isOAuthUser]);

  // 이벤트가 변경될 때 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // 달력 데이터 생성 함수
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    setCurrentMonth(`${month + 1}월`);
    setCurrentYear(`${year}년`);

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const monthLength = new Date(year, month + 1, 0).getDate();
    const prevMonthLength = new Date(year, month, 0).getDate();

    const calendar: number[][] = [];

    let day = 1;
    const firstWeek: number[] = [];

    for (let i = 0; i < startingDay; i++) {
      firstWeek.push(prevMonthLength - startingDay + i + 1);
    }

    for (let i = startingDay; i < 7; i++) {
      firstWeek.push(day++);
    }

    calendar.push(firstWeek);

    while (day <= monthLength) {
      const week: number[] = [];
      for (let i = 0; i < 7 && day <= monthLength; i++) {
        week.push(day++);
      }

      if (week.length < 7) {
        let nextMonthDay = 1;
        while (week.length < 7) {
          week.push(nextMonthDay++);
        }
      }

      calendar.push(week);
    }

    if (calendar.length < 5) {
      const lastWeek: number[] = [];
      let nextMonthDay = 1;
      for (let i = 0; i < 7; i++) {
        lastWeek.push(nextMonthDay++);
      }
      calendar.push(lastWeek);
    }

    setDaysInMonth(calendar);
  }, [currentDate]);

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 날짜가 현재 월인지 확인
  const isCurrentMonth = (weekIndex: number, day: number) => {
    if (weekIndex === 0 && day > 7) return false;
    if (weekIndex >= 4 && day < 15) return false;
    return true;
  };

  // 특정 날짜가 오늘인지 확인
  const isToday = (weekIndex: number, day: number) => {
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate() &&
      isCurrentMonth(weekIndex, day)
    );
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: isCollapsed ? 1.5 : 2.5,
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        background: 'linear-gradient(to right, #fff, #fafafa)',
        overflow: 'hidden',
        position: 'relative',
        ...(isCollapsed ? {
          height: 'auto',
          minHeight: 60,
          maxHeight: 60
        } : {
          height: '100%',
          minHeight: 'auto'
        }),
        display: 'flex',
        flexDirection: 'column',
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
          background: 'radial-gradient(circle, rgba(233,245,255,0.7) 0%, rgba(233,245,255,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* 헤더 - 접기/펴기 버튼 포함 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1.5 }} />
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
              {isCollapsed ? '캘린더' : `${currentYear} ${currentMonth}`}
            </Typography>
            {!isCollapsed && (
              <Typography variant="body2" color="text.secondary">
                {t('calendar.events.calendarAndSchedule')}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isCollapsed && (
            <>
              <IconButton
                size="small"
                onClick={goToPrevMonth}
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  color: 'text.secondary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={goToNextMonth}
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  color: 'text.secondary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>

              <Tooltip title={t('calendar.events.goToToday')} placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={goToToday}
                  sx={{
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    width: 32,
                    height: 32,
                    mr: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    },
                  }}
                >
                  <TodayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.main',
              width: 36,
              height: 36,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* 메인 컨텐츠 - 접기/펴기 가능 */}
      {!isCollapsed && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            position: 'relative',
            zIndex: 1,
            flexGrow: 1,
          }}
        >
          {/* OAuth 사용자가 아닌 경우 접근 제한 */}
          {!isOAuthUser ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Alert
                severity="info"
                sx={{
                  width: '100%',
                  maxWidth: 500,
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
                  캘린더 기능은 구글 계정으로 로그인한 사용자만 이용하실 수 있습니다.
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
          ) : (
            <>
              {/* 좌측: 달력 영역 */}
              <Box sx={{ flex: { xs: '1', md: '3' } }}>
                {/* 요일 표시 행 */}
                <Box
                  sx={{
                    display: 'flex',
                    mb: 1,
                    width: '100%',
                    minHeight: 32,
                  }}
                >
                  {weekdays.map((day, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          color: index === 0 ? '#f44336' : index === 6 ? '#2196f3' : 'text.primary',
                          fontSize: '0.8rem',
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* 날짜 그리드 */}
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
                    minHeight: 220,
                  }}
                >
                  {daysInMonth.map((week, weekIndex) => (
                    <Box
                      key={weekIndex}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        mb: weekIndex < daysInMonth.length - 1 ? 1 : 0,
                      }}
                    >
                      {week.map((day, dayIndex) => {
                        const isPrevNextMonth = !isCurrentMonth(weekIndex, day);
                        const isTodayFlag = isToday(weekIndex, day);
                        const dayEvents = getEventsForDay(day);
                        const hasEvent = dayEvents.length > 0 && !isPrevNextMonth;
                        const isCompleted = completedDays.includes(day) && !isPrevNextMonth;
                        const isWeekend = dayIndex === 0 || dayIndex === 6;

                        return (
                          <Box
                            key={`${weekIndex}-${dayIndex}`}
                            sx={{
                              flex: 1,
                              p: 0.5,
                              position: 'relative',
                              cursor: hasEvent ? 'pointer' : 'default',
                              height: 40,
                            }}
                            onMouseEnter={() => setHoveredDate(day)}
                            onMouseLeave={() => setHoveredDate(null)}
                            onClick={() => {
                              if (isOAuthUser && !isPrevNextMonth) {
                                const selectedDate = new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  day
                                );
                                const endDate = new Date(selectedDate.getTime() + 60 * 60 * 1000);
                                setNewEvent({
                                  ...newEvent,
                                  startDateTime: selectedDate.toISOString(),
                                  endDateTime: endDate.toISOString(),
                                });
                                openEventDialog();
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                position: 'relative',
                                ...(isTodayFlag && {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  fontWeight: 600,
                                  boxShadow: '0 2px 8px rgba(63, 81, 181, 0.3)',
                                }),
                                ...(hasEvent &&
                                  !isTodayFlag && {
                                    bgcolor: 'rgba(63, 81, 181, 0.08)',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                  }),
                                ...(!isTodayFlag &&
                                  !hasEvent &&
                                  isPrevNextMonth && {
                                    color: 'text.disabled',
                                  }),
                                ...(!isTodayFlag &&
                                  !hasEvent &&
                                  !isPrevNextMonth &&
                                  isWeekend && {
                                    color: dayIndex === 0 ? '#f44336' : '#2196f3',
                                  }),
                              }}
                            >
                              {day}

                              {hasEvent && !isTodayFlag && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 1,
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    bgcolor:
                                      dayEvents.length > 0
                                        ? getEventTypeColor(dayEvents[0].summary).color
                                        : 'primary.main',
                                  }}
                                />
                              )}

                              {isCompleted && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    color: '#4caf50',
                                    fontSize: 14,
                                    bgcolor: 'white',
                                    borderRadius: '50%',
                                    width: 14,
                                    height: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <CheckCircleIcon fontSize="inherit" />
                                </Box>
                              )}
                            </Box>

                            {hasEvent && hoveredDate === day && (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    {dayEvents.map(event => (
                                      <Box key={event.id} sx={{ mb: 0.5 }}>
                                        <Typography variant="caption" fontWeight={600} display="block">
                                          {event.summary}
                                        </Typography>
                                        <Typography variant="caption" color="inherit">
                                          {new Date(event.start.dateTime).toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                }
                                placement="top"
                                arrow
                                open={true}
                              >
                                <Box
                                  sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* 우측: 이벤트 목록 */}
              <Box sx={{ flex: { xs: '1', md: '2' }, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('calendar.events.upcomingEvents')}
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      width: 32,
                      height: 32,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      },
                    }}
                    onClick={() => openEventDialog()}
                    disabled={!isOAuthUser}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {isLoading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : getPaginatedEvents().length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        p: 2,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      <EventIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('calendar.events.noScheduledEvents')}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => openEventDialog()}
                        sx={{ mt: 1 }}
                      >
                        {t('calendar.events.newScheduleAdd')}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {getEventsForDay(today.getDate()).map(event => (
                        <Box
                          key={event.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: getEventTypeColor(event.summary).bg,
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          }}
                          onClick={() => openEventDialog(event)}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: 4,
                              height: '100%',
                              bgcolor: getEventTypeColor(event.summary).color,
                            }}
                          />

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 0.5,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip
                                label={t('calendar.dateLabels.today')}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: 'error.light',
                                  color: 'error.main',
                                  fontWeight: 600,
                                  mr: 1,
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {(() => {
                                  try {
                                    const date = new Date(event.start.dateTime);
                                    if (!isNaN(date.getTime())) {
                                      return date.toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      });
                                    }
                                    return t('calendar.events.timeInfoNotAvailable');
                                  } catch (error) {
                                    return t('calendar.events.timeInfoNotAvailable');
                                  }
                                })()}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex' }}>
                              <IconButton
                                size="small"
                                onClick={e => {
                                  e.stopPropagation();
                                  openEventDialog(event);
                                }}
                                sx={{ width: 20, height: 20 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={e => {
                                  e.stopPropagation();
                                  deleteEvent(event);
                                }}
                                sx={{ width: 20, height: 20 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>

                          <Typography variant="body2" fontWeight={600} sx={{ pl: 1 }}>
                            {event.summary}
                          </Typography>

                          {event.location && (
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                              {event.location}
                            </Typography>
                          )}
                        </Box>
                      ))}

                      {getPaginatedEvents()
                        .filter(event => {
                          try {
                            const eventDate = new Date(event.start.dateTime);
                            if (isNaN(eventDate.getTime())) return false;
                            return eventDate.toDateString() !== today.toDateString();
                          } catch (error) {
                            return false;
                          }
                        })
                        .map(event => (
                          <Box
                            key={event.id}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                              position: 'relative',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'pointer',
                            }}
                            onClick={() => openEventDialog(event)}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 4,
                                height: '100%',
                                bgcolor: getEventTypeColor(event.summary).color,
                              }}
                            />

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 0.5,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip
                                  label={(() => {
                                    try {
                                      const date = new Date(event.start.dateTime);
                                      if (!isNaN(date.getTime())) {
                                        return getDateDiff(date);
                                      }
                                      return t('calendar.events.dateInfoNotAvailable');
                                    } catch (error) {
                                      return t('calendar.events.dateInfoNotAvailable');
                                    }
                                  })()}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: 'primary.light',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {(() => {
                                    try {
                                      const date = new Date(event.start.dateTime);
                                      if (!isNaN(date.getTime())) {
                                        return date.toLocaleTimeString('ko-KR', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        });
                                      }
                                      return t('calendar.events.timeInfoNotAvailable');
                                    } catch (error) {
                                      return t('calendar.events.timeInfoNotAvailable');
                                    }
                                  })()}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex' }}>
                                <IconButton
                                  size="small"
                                  onClick={e => {
                                    e.stopPropagation();
                                    openEventDialog(event);
                                  }}
                                  sx={{ width: 20, height: 20 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteEvent(event);
                                  }}
                                  sx={{ width: 20, height: 20 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            <Typography variant="body2" fontWeight={600} sx={{ pl: 1 }}>
                              {event.summary}
                            </Typography>

                            {event.location && (
                              <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                                {event.location}
                              </Typography>
                            )}
                          </Box>
                        ))}
                    </>
                  )}
                </Box>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* 이벤트 추가/수정 다이얼로그 */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle>{selectedEvent ? t('calendar.events.eventEditTitle') : t('calendar.events.newEventTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('calendar.events.eventTitle')}
              fullWidth
              value={newEvent.summary}
              onChange={e => setNewEvent({ ...newEvent, summary: e.target.value })}
              required
            />

            <TextField
              label={t('calendar.events.location')}
              fullWidth
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />

            <TextField
              label={t('calendar.events.description')}
              fullWidth
              multiline
              rows={3}
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
              <DateTimePicker
                label={t('calendar.events.startTime')}
                value={new Date(newEvent.startDateTime)}
                onChange={date =>
                  date &&
                  setNewEvent({
                    ...newEvent,
                    startDateTime: formatToKoreanTimezone(date),
                  })
                }
              />

              <DateTimePicker
                label={t('calendar.events.endTime')}
                value={new Date(newEvent.endDateTime)}
                onChange={date =>
                  date &&
                  setNewEvent({
                    ...newEvent,
                    endDateTime: formatToKoreanTimezone(date),
                  })
                }
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>{t('calendar.events.cancel')}</Button>
          <Button variant="contained" onClick={saveEvent} disabled={isLoading || !newEvent.summary}>
            {isLoading ? <CircularProgress size={24} /> : t('calendar.events.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CalendarWidget;
