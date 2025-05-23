// 알람 상세 정보 타입
export interface AlarmDetail {
  alarmDetailId: number;
  alarmId: number;
  content: string;
  language: string;
  timestamp?: string;
}

/**
 * 읽지 않은 알람 전체 조회
 * GET /alarms/{userId}
 */

export async function fetchUnreadAlarms(userId: string | number): Promise<AlarmDetail[]> {
  const token = localStorage.getItem('auth_token')!;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/alarms/${userId}`, {
      method: 'GET',
      headers: { Authorization: token },
    });
    if (!res.ok) throw await res.text();
    console.log('알림 조회 성공', res);
    return (await res.json()) as AlarmDetail[];
  } catch (err) {
    console.error('알림 조회 실패', err);
    // 방어적 처리: 빈 배열 반환
    return [];
  }
}

/**
 * 알람 읽음 처리
 * PATCH /alarms/read
 * body: { alarmIds: number[] }
 */
export async function markAlarmsRead(alarmIds: number[]): Promise<void> {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('토큰이 없습니다. 다시 로그인해주세요.');

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/alarms/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ alarmIds }),
  });
  if (res.status !== 204) {
    const err = await res.text();
    throw new Error(`알림 읽기 실패: ${res.status} ${err}`);
  }
}
