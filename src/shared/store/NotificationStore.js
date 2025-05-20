import { create } from 'zustand';
// NotificationStore 생성
export const useNotificationStore = create(set => ({
    notifications: [],
    setNotifications: notifications => set({ notifications }),
    addNotification: notification => set(state => ({
        notifications: [...state.notifications, notification],
    })),
    clearNotifications: () => set({ notifications: [] }),
}));
