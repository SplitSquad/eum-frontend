/**
 * callAgentic
 * - Agentic 백엔드 서비스에 POST 요청을 보내 사용자 입력(query)과 사용자 ID(uid)를 전달
 * - API 응답으로부터 JSON을 파싱하여 응답 텍스트와 메타데이터를 반환
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
  // Agentic API 엔드포인트로 POST 요청
  const res = await fetch('http://127.0.0.1:8001/api/v1/agentic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, uid }),
  });

  // HTTP 상태 코드 확인
  if (!res.ok) {
    throw new Error(`Agentic API error ${res.status}`);
  }

  // JSON 응답 파싱 및 반환
  return res.json();
}
