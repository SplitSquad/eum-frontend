import { log } from 'console';
import { getAgenticState, setAgenticState, resetAgenticState } from './Agentic_state';
import { getUserLocation } from './Agentic_state'; // 📌 위치 정보 가져오기
import { logout } from '@/features/auth';

/**
 * callAgentic
 * - Agentic 백엔드 서비스에 POST 요청을 보내 사용자 입력(query)과
 *   사용자 ID(uid)를 전달합니다.
 * - 하드코딩된 JWT 토큰을 Authorization 헤더에 담아 전송
 *
 * @param query 사용자 질문 문자열
 * @param uid   사용자 고유 ID (세션/추적용)
 * @returns     Promise<{ response: string; metadata: { query: string; state: string; uid: string; error: string } }>
 * @throws      네트워크 오류 또는 HTTP 에러 상태 코드 시 Error 발생
 */
export async function callAgentic(
  query: string,
  uid: string
): Promise<{
  response: string;
  metadata: { query: string; state: string; uid: string; error: string };
  state: string;
  url: string;
}> {
  // localStorage에서 토큰 읽기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  const state = getAgenticState(); // 현재 상태 가져오기
  const location = getUserLocation(); // 📌 현재 위치 정보 가져오기

  console.log('[location] ', location);
  console.log('[location] ', location?.latitude);
  console.log('[location] ', location?.longitude);

  const body: any = {
    query,
    uid,
    state,
  };

  // 📍 위치 정보가 있을 경우에만 추가
  if (location) {
    body.location = {
      latitude: location?.latitude.toString(),
      longitude: location?.longitude.toString(),
    };
  }

  console.log('[body] ', body);

  const res = await fetch('http://localhost:8000/api/v1/agentic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Agentic API error ${res.status}`);
  }

  const result = await res.json();

  // ✅ 응답 로그 확인
  console.log('[Agentic] 백엔드 응답:', result);

  if (result?.state) {
    setAgenticState(result.state); // ✅ 응답 기반으로 상태 업데이트
  }

  return result;
}
