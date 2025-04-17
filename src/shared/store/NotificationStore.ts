import { create } from 'zustand';

// 알림 상태 관리 타입 정의
interface NotificationStore {
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

// Zustand를 이용해 알림 상태(store) 생성
export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  addNotification: message => set(state => ({ notifications: [...state.notifications, message] })),
  clearNotifications: () => set({ notifications: [] }),
}));
