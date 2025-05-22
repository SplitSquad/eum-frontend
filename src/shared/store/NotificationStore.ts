import { create } from 'zustand';

// API 로부터 받아오는 알림 객체 타입 정의
export interface Notification {
  alarmDetailId: number;
  alarmId: number;
  content: string;
  language: string;
}

// Zustand를 이용한 알림 상태 관리 타입 정의
interface NotificationStore {
  notifications: Notification[];
  // API 호출 결과로 한 번에 세팅할 때
  setNotifications: (notifications: Notification[]) => void;
  // 실시간 알림 추가
  addNotification: (notification: Notification) => void;
  // 전체 알림 초기화
  clearNotifications: () => void;
}

// NotificationStore 생성
export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],

  setNotifications: notifications => set({ notifications }),

  addNotification: notification =>
    set(state => ({
      notifications: [...state.notifications, notification],
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
