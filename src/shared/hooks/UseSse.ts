// src/hooks/useSse.ts
import { useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import type { AlarmDetail } from '@/services/notification/alarmService';

export function useSse(userId: number, onAlarm: (a: AlarmDetail) => void) {
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('auth_token')!;
    const lastIdKey = `sse-last-event-id-${userId}`;
    const lastEventId = localStorage.getItem(lastIdKey) || '';
    const url = `${import.meta.env.VITE_API_BASE_URL}/sse/subscribe/${userId}`;

    const es = new EventSourcePolyfill(url, {
      headers: {
        Authorization: token,
        'Last-Event-ID': lastEventId,
      },
      // 24시간 동안 타임아웃 없이 연결 유지
      heartbeatTimeout: 24 * 60 * 60 * 1000, // 86,400,000 ms (24h)
      // 끊길 경우 5초 후 재연결
      reconnectInterval: 5 * 1000, // 5,000 ms (5s)
      // transport 옵션을 XHR로 바꾸면 chunked 이슈도 완화됩니다.
      transport: 'xhr',
    });

    // 'alarm' 이벤트만 처리 (INIT 등은 무시)
    es.addEventListener('alarm', (e: MessageEvent) => {
      try {
        const alarm = JSON.parse(e.data) as AlarmDetail;
        onAlarm(alarm);
        if (e.lastEventId) {
          localStorage.setItem(lastIdKey, e.lastEventId);
        }
      } catch (err) {
        console.error('SSE 알람 파싱 실패', err);
      }
    });

    es.onerror = err => {
      console.error('SSE 연결 에러', err);
    };

    return () => es.close();
  }, [userId, onAlarm]);
}
