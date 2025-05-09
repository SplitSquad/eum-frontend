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
}> {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDY1OTc2MjMsImV4cCI6MTc0NjYzMzYyM30.fYB_vGhI7YXc9nW3iHkPM1nU3A8rzAr4i8olcrRitMI';

  // Agentic API 엔드포인트로 POST 요청 (JWT 포함)
  const res = await fetch('http://127.0.0.1:8001/api/v1/agentic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, uid }),
  });

  // HTTP 상태 코드 확인
  if (!res.ok) {
    throw new Error(`Agentic API error ${res.status}`);
  }

  // JSON 응답 파싱 및 반환
  return res.json();
}
