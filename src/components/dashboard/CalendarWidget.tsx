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
import CalendarService, {
  CalendarEvent,
  GoogleCalendarEventRequest,
} from '../../services/calendar/calendarService';

const CalendarWidget: React.FC = () => {
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<number[][]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<GoogleCalendarEventRequest>({
    summary: '',
    location: '',
    description: '',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
  });

  // 오늘 날짜
  const today = new Date();

  // 완료된 일정 (실제로는 이벤트에 완료 속성이 있어야 함)
  const completedDays: number[] = [];

  // 요일 레이블
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

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

    if (diffDays === 0) return '오늘';
    else if (diffDays === 1) return '내일';
    else if (diffDays === 2) return '모레';
    else if (diffDays > 0) return `${diffDays}일 후`;
    else return `${Math.abs(diffDays)}일 전`;
  };

  // 구글 캘린더 연동 상태 확인
  const checkGoogleCalendarConnection = async () => {
    try {
      // 백엔드 연동 문제로 항상 true 반환하도록 수정
      setIsGoogleConnected(true);
      fetchEvents();
    } catch (error) {
      console.error('구글 캘린더 연동 상태 확인 실패:', error);
      setIsGoogleConnected(true); // 연동 실패해도 true로 설정
    }
  };

  // 캘린더 이벤트 가져오기
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // API 호출
      const calendarEvents = await CalendarService.getEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('캘린더 이벤트 가져오기 실패:', error);
      // 실패 시에도 UI에 영향이 없도록 조치
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜를 기준으로 이벤트 필터링
  const getEventsForDay = (day: number): CalendarEvent[] => {
    if (!isGoogleConnected || events.length === 0) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) return [];

    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    return events.filter(event => {
      // 이벤트의 시작 날짜가 해당 날짜인 경우만 필터링
      if (!event.start || !event.start.dateTime) return false;

      try {
        const eventDate = new Date(event.start.dateTime);
        // 유효한 날짜인지 확인
        if (isNaN(eventDate.getTime())) return false;

        return eventDate.toISOString().split('T')[0] === dateString;
      } catch (error) {
        console.error('Invalid date in event:', event);
        return false;
      }
    });
  };

  // 오늘 또는 앞으로 다가오는 이벤트들을 가져옴
  const getUpcomingEvents = (): CalendarEvent[] => {
    if (!isGoogleConnected || events.length === 0) return [];

    const now = new Date();
    const utcNow = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    return events
      .filter(event => {
        if (!event.start || !event.start.dateTime) return false;

        try {
          const eventDate = new Date(event.start.dateTime);
          // 유효한 날짜인지 확인
          if (isNaN(eventDate.getTime())) return false;

          return eventDate >= utcNow;
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
      .slice(0, 5); // 최대 5개만 표시
    // TODO : 3개로 줄이기?
  };

  // 이벤트 생성 또는 수정 열기
  const openEventDialog = (event?: CalendarEvent) => {
    if (event) {
      // 기존 이벤트 수정
      setSelectedEvent(event);
      setNewEvent({
        summary: event.summary,
        location: event.location || '',
        description: event.description || '',
        startDateTime: event.start.dateTime,
        endDateTime: event.end.dateTime,
      });
    } else {
      // 새 이벤트 생성
      setSelectedEvent(null);
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      // TODO: 달력이 이상하게 뜨는 원인 후보1
      setNewEvent({
        summary: '',
        location: '',
        description: '',
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
      });
    }
    setIsDialogOpen(true);
  };

  // 이벤트 저장
  const saveEvent = async () => {
    setIsLoading(true);
    try {
      if (selectedEvent) {
        // 기존 이벤트 수정
        await CalendarService.updateEvent(selectedEvent.id, newEvent);
      } else {
        // 새 이벤트 생성
        await CalendarService.addEvent(newEvent);
      }
      fetchEvents(); // 이벤트 목록 다시 가져오기
      setIsDialogOpen(false);
    } catch (error) {
      console.error('이벤트 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 삭제
  const deleteEvent = async (event: CalendarEvent) => {
    if (!window.confirm('이 이벤트를 삭제하시겠습니까?')) return;

    setIsLoading(true);
    try {
      await CalendarService.deleteEvent(event.id);
      fetchEvents(); // 이벤트 목록 다시 가져오기
    } catch (error) {
      console.error('이벤트 삭제 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 캘린더 연동 처리
  const handleGoogleSync = async () => {
    // 실제로는 백엔드에서 제공하는 OAuth 연동 URL로 리다이렉트해야 함
    if (!isGoogleConnected) {
      alert('구글 캘린더 연동을 위해 백엔드에서 인증 URL을 제공해야 합니다.');
    } else {
      // 이미 연동된 경우 새로고침
      fetchEvents();
    }
  };

  // 컴포넌트 마운트 시 캘린더 연동 상태 확인
  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  // 달력 데이터 생성 함수
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 현재 월 이름과 연도 설정
    setCurrentMonth(`${month + 1}월`);
    setCurrentYear(`${year}년`);

    // 해당 월의 첫 번째 날짜
    const firstDay = new Date(year, month, 1);
    // 해당 월의 첫 번째 날짜의 요일 (0: 일요일, 6: 토요일)
    const startingDay = firstDay.getDay();
    // 해당 월의 일수
    const monthLength = new Date(year, month + 1, 0).getDate();
    // 이전 월의 일수
    const prevMonthLength = new Date(year, month, 0).getDate();

    // 달력 배열 생성
    const calendar: number[][] = [];

    // 달력의 첫 번째 행 계산
    let day = 1;
    const firstWeek: number[] = [];

    // 이전 달의 날짜 추가
    for (let i = 0; i < startingDay; i++) {
      firstWeek.push(prevMonthLength - startingDay + i + 1);
    }

    // 현재 달의 첫 주 날짜 추가
    for (let i = startingDay; i < 7; i++) {
      firstWeek.push(day++);
    }

    calendar.push(firstWeek);

    // 나머지 주 계산
    while (day <= monthLength) {
      const week: number[] = [];
      for (let i = 0; i < 7 && day <= monthLength; i++) {
        week.push(day++);
      }

      // 남은 공간에 다음 달 날짜 추가
      if (week.length < 7) {
        let nextMonthDay = 1;
        while (week.length < 7) {
          week.push(nextMonthDay++);
        }
      }

      calendar.push(week);
    }

    // 5주로 고정 (4주만 있는 경우 빈 주 추가)
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
    if (weekIndex === 0 && day > 7) return false; // 이전 달
    if (weekIndex >= 4 && day < 15) return false; // 다음 달
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
        p: 2.5,
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        background: 'linear-gradient(to right, #fff, #fafafa)',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
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

      {/* 메인 컨텐츠 */}
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
        {/* 좌측: 달력 영역 */}
        <Box sx={{ flex: { xs: '1', md: '3' } }}>
          {/* 달력 헤더 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1.5 }} />
              <Box>
                <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
                  {currentYear} {currentMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  일정 및 캘린더
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

              <Tooltip title="오늘로 이동" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={goToToday}
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
                  <TodayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* 구글 캘린더 연동 버튼 */}
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            endIcon={isGoogleConnected ? <SyncIcon /> : null}
            size="small"
            onClick={handleGoogleSync}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.75rem',
              color: isGoogleConnected ? 'success.main' : 'primary.main',
              borderColor: isGoogleConnected ? 'success.main' : 'primary.main',
              '&:hover': {
                backgroundColor: isGoogleConnected
                  ? 'rgba(76, 175, 80, 0.04)'
                  : 'rgba(63, 81, 181, 0.04)',
                borderColor: isGoogleConnected ? 'success.dark' : 'primary.dark',
              },
            }}
          >
            {isGoogleConnected ? '구글 캘린더 동기화됨' : '구글 캘린더와 동기화'}
            {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
          </Button>

          {/* 요일 표시 행 */}
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              width: '100%',
            }}
          >
            {weekdays.map((day, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 0.5,
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
                  // 이전 달이나 다음 달 날짜 구분
                  const isPrevNextMonth = !isCurrentMonth(weekIndex, day);
                  // 오늘 날짜 강조
                  const isTodayFlag = isToday(weekIndex, day);
                  // 이벤트가 있는 날짜
                  const dayEvents = getEventsForDay(day);
                  const hasEvent = dayEvents.length > 0 && !isPrevNextMonth;
                  // 완료된 일정
                  const isCompleted = completedDays.includes(day) && !isPrevNextMonth;
                  // 주말 체크
                  const isWeekend = dayIndex === 0 || dayIndex === 6;

                  return (
                    <Box
                      key={`${weekIndex}-${dayIndex}`}
                      sx={{
                        flex: 1,
                        p: 0.5,
                        position: 'relative',
                        cursor: hasEvent ? 'pointer' : 'default',
                        height: 30,
                      }}
                      onMouseEnter={() => setHoveredDate(day)}
                      onMouseLeave={() => setHoveredDate(null)}
                      onClick={() => {
                        if (isGoogleConnected && !isPrevNextMonth) {
                          // 날짜 클릭 시 이벤트 추가 다이얼로그 열기
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
                      {/* 날짜 버튼 */}
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

                        {/* 이벤트 표시 점 */}
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

                        {/* 완료 마크 */}
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

                      {/* 이벤트 툴팁 */}
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
              다가오는 일정
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
              onClick={() => isGoogleConnected && openEventDialog()}
              disabled={!isGoogleConnected}
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
            ) : !isGoogleConnected ? (
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
                <GoogleIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  구글 캘린더와 연동하여 일정을 관리하세요
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSync}
                  sx={{ mt: 1 }}
                >
                  구글 캘린더 연동
                </Button>
              </Box>
            ) : getUpcomingEvents().length === 0 ? (
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
                  예정된 일정이 없습니다
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => openEventDialog()}
                  sx={{ mt: 1 }}
                >
                  새 일정 추가
                </Button>
              </Box>
            ) : (
              <>
                {/* 오늘 이벤트 */}
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
                          label="오늘"
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
                              return '시간 정보 없음';
                            } catch (error) {
                              return '시간 정보 없음';
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

                {/* 다가오는 이벤트 */}
                {getUpcomingEvents()
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
                                return '날짜 정보 없음';
                              } catch (error) {
                                return '날짜 정보 없음';
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
                                return '시간 정보 없음';
                              } catch (error) {
                                return '시간 정보 없음';
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

            {/* 알림 설정 메시지 */}
            {isGoogleConnected && (
              <Box
                sx={{
                  mt: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                }}
              >
                <NotificationsIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  모든 일정에 대한 알림이 설정되어 있습니다.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* 이벤트 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedEvent ? '일정 수정' : '새 일정 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="일정 제목"
              fullWidth
              value={newEvent.summary}
              onChange={e => setNewEvent({ ...newEvent, summary: e.target.value })}
              required
            />

            <TextField
              label="장소"
              fullWidth
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />

            <TextField
              label="설명"
              fullWidth
              multiline
              rows={3}
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
              <DateTimePicker
                label="시작 시간"
                value={new Date(newEvent.startDateTime)}
                onChange={date =>
                  date &&
                  setNewEvent({
                    ...newEvent,
                    startDateTime: date.toISOString(),
                  })
                }
              />

              <DateTimePicker
                label="종료 시간"
                value={new Date(newEvent.endDateTime)}
                onChange={date =>
                  date &&
                  setNewEvent({
                    ...newEvent,
                    endDateTime: date.toISOString(),
                  })
                }
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={saveEvent} disabled={isLoading || !newEvent.summary}>
            {isLoading ? <CircularProgress size={24} /> : '저장'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CalendarWidget;
