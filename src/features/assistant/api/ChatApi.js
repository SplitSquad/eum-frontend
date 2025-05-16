'use client';
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
export async function fetchChatbotResponse(query, uid) {
    // API 엔드포인트로 요청
    const res = await fetch('http://127.0.0.1:8000/api/v1/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, uid }),
    });
    // HTTP 상태 코드 확인
    if (!res.ok) {
        throw new Error(`API 호출 실패: ${res.status}`);
    }
    // JSON 파싱 후 반환
    return res.json();
}
