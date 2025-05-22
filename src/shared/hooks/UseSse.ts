import { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import type { AlarmDetail } from '@/services/notification/alarmService';
import { fetchUnreadAlarms } from '@/services/notification/alarmService';

type OnAlarm = (a: AlarmDetail) => void;
type OnFullList = (list: AlarmDetail[]) => void;

export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

export function useSseWithPolling(
  userId: number,
  onAlarm: OnAlarm,
  onFullList: OnFullList,
  pollInterval = 2_000
) {
  const poller = useRef<number>();

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('auth_token')!;
    const lastIdKey = `sse-last-event-id-${userId}`;

    const url = `${import.meta.env.VITE_API_BASE_URL}/sse/subscribe/${userId}`;
    const lastEventId = localStorage.getItem(lastIdKey) ?? undefined;
    const es = new EventSourcePolyfill(url, {
      headers: { Authorization: token },
      lastEventId,
    });

    // 메시지 이벤트만 처리 (이미 'data'만 전달됨)
    es.onmessage = evt => {
      const text = evt.data?.trim();
      if (text?.startsWith('{')) {
        try {
          const alarm = JSON.parse(text) as AlarmDetail;
          onAlarm(alarm);
          if (evt.lastEventId) {
            localStorage.setItem(lastIdKey, evt.lastEventId);
          }
        } catch {
          console.warn('SSE JSON 파싱 실패, 무시합니다:', text);
        }
      }
    };

    es.onopen = () => {
      // 연결 성공 시, 폴링 중단
      if (poller.current) {
        clearInterval(poller.current);
        poller.current = undefined;
      }
    };

    es.onerror = () => {
      console.error('SSE 에러 발생, 폴링 모드로 전환');
      es.close();
      // 전체 알람 조회
      fetchUnreadAlarms(userId).then(onFullList);
      // 폴링 시작
      poller.current = window.setInterval(() => {
        fetchUnreadAlarms(userId).then(onFullList);
      }, pollInterval);
    };

    return () => {
      es.close();
      if (poller.current) {
        clearInterval(poller.current);
      }
    };
  }, [userId, onAlarm, onFullList, pollInterval]);
}
