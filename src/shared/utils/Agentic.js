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
export async function callAgentic(query, uid) {
    // localStorage에서 토큰 읽기
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
    const res = await fetch('http://af9c53d0f69ea45c793da25cdc041496-1311657830.ap-northeast-2.elb.amazonaws.com:80/api/v1/agentic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ query, uid, state: 'first' }),
    });
    if (!res.ok) {
        throw new Error(`Agentic API error ${res.status}`);
    }
    return res.json();
}
