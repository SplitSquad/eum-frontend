'use client';

// 서버로부터 받을 챗봇 응답 형식 정의
export interface ChatResponse {
  response: string; // 실질적으로 채팅에 뿌려질 메시지
  metadata?: {
    // 추가 정보 (선택 사항 추가해도 무방)
    query: string; // 원본 질문 내용
    state?: string; // 세션 상태 값
    uid?: string; // 사용자 식별자
    error?: string; // 에러 메시지
    rag_type?: string; // 분류 정보 (RAG 매핑용)
  };
}

/**
 * fetchChatbotResponse
 * - 백엔드 챗봇 API에 POST 요청을 보내고,
 * - 결과를 ChatResponse 형태로 파싱하여 반환
 *
 * @param query 사용자 질문 문자열
 * @param uid   사용자 고유 ID (세션 관리용)
 * @returns     Promise<ChatResponse>
 * @throws      네트워크 혹은 서버 오류 시 Error 발생
 */

export async function fetchChatbotResponse(query: string, uid: string): Promise<ChatResponse> {
  // localStorage에서 토큰 읽기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  // API 엔드포인트로 요청
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, uid }),
  });

  // HTTP 상태 코드 확인
  if (!res.ok) {
    throw new Error(`API 호출 실패: ${res.status}`);
  }

  // JSON 파싱 후 반환
  return res.json();
}
