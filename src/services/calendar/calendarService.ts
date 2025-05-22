import apiClient from '../../config/axios';

/**
 * 구글 캘린더 이벤트 요청 DTO
 */
export interface GoogleCalendarEventRequest {
  summary: string;
  location?: string;
  description?: string;
  startDateTime: string; // ISO 형식 (예: 2023-05-01T10:00:00+09:00)
  endDateTime: string;
}

/**
 * 구글 캘린더 이벤트 응답 타입
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  status: string;
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
  htmlLink?: string;
}

/**
 * 구글 캘린더 서비스
 */
const CalendarService = {
  /**
   * 사용자의 캘린더 이벤트 목록 조회
   * @returns 이벤트 목록
   */
  getEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const response = await apiClient.get<CalendarEvent[]>('/calendar');
      return response;
    } catch (error) {
      console.error('캘린더 이벤트 조회 실패:', error);
      return [];
    }
  },

  /**
   * 새 캘린더 이벤트 추가
   * @param event 이벤트 데이터
   * @returns 생성된 이벤트
   */
  addEvent: async (event: GoogleCalendarEventRequest): Promise<CalendarEvent> => {
    try {
      const response = await apiClient.post<CalendarEvent>('/calendar', event);
      return response;
    } catch (error) {
      console.error('캘린더 이벤트 추가 실패:', error);
      throw error;
    }
  },

  /**
   * 캘린더 이벤트 삭제
   * @param eventId 삭제할 이벤트 ID
   * @returns 삭제 결과
   */
  deleteEvent: async (eventId: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/calendar/${eventId}`);
      return response;
    } catch (error) {
      console.error('캘린더 이벤트 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 캘린더 이벤트 업데이트
   * @param eventId 수정할 이벤트 ID
   * @param event 수정할 이벤트 데이터
   * @returns 수정된 이벤트
   */
  updateEvent: async (eventId: string, event: GoogleCalendarEventRequest): Promise<CalendarEvent> => {
    try {
      const response = await apiClient.patch<CalendarEvent>(`/calendar/${eventId}`, event);
      return response;
    } catch (error) {
      console.error('캘린더 이벤트 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 구글 캘린더 연동 상태 확인
   * 백엔드에서 이벤트 조회가 성공하면 연동된 것으로 간주
   * @returns 연동 상태
   */
  checkGoogleCalendarConnection: async (): Promise<boolean> => {
    try {
      await CalendarService.getEvents();
      return true;
    } catch (error) {
      console.error('구글 캘린더 연동 상태 확인 실패:', error);
      return false;
    }
  }
};

export default CalendarService; 