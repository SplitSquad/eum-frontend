// src/features/auth/tokenUtils.ts
const TOKEN_KEY = 'auth_token';

/**
 * JWT 토큰에서 페이로드를 디코딩
 * @param token JWT 토큰
 * @returns 토큰의 페이로드(claims) 객체
 */
export const decodeToken = (token: string): any | null => {
  if (!token) return null;

  try {
    // JWT 구조: header.payload.signature
    const base64Payload = token.split('.')[1];
    // base64 디코딩 및 JSON 파싱
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

/**
 * 토큰 만료 여부 확인
 * @param token JWT 토큰
 * @returns 만료되었으면 true, 아니면 false
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    // exp는 초 단위, Date.now()는 밀리초 단위임을 고려
    const expTime = payload.exp * 1000;
    return Date.now() >= expTime;
  } catch (error) {
    console.error('토큰 만료 확인 실패:', error);
    return true; // 오류 시 만료된 것으로 간주
  }
};

/**
 * 토큰에서 사용자 ID 추출
 * @param token JWT 토큰
 * @returns 사용자 ID (없으면 null)
 */
export const getUserIdFromToken = (token: string): number | null => {
  if (!token) return null;
  
  try {
    const payload = decodeToken(token);
    return payload?.userId || null;
  } catch (error) {
    console.error('토큰에서 사용자 ID 추출 실패:', error);
    return null;
  }
};

/**
 * 토큰에서 사용자 역할 추출
 * @param token JWT 토큰
 * @returns 사용자 역할 (없으면 null)
 */
export const getRoleFromToken = (token: string): string | null => {
  if (!token) return null;
  
  try {
    const payload = decodeToken(token);
    return payload?.role || null;
  } catch (error) {
    console.error('토큰에서 역할 추출 실패:', error);
    return null;
  }
};

/**
 * 토큰 가져오기
 * @returns 저장된 인증 토큰
 */
export const getToken = (): string | null => {
  // 먼저 sessionStorage에서 찾고, 없으면 localStorage에서 찾음
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken) return sessionToken;
  
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 토큰 저장하기
 * @param token 저장할 인증 토큰
 */
export const setToken = (token: string): void => {
  if (!token) return;
  
  // 두 스토리지 모두에 저장
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 토큰 제거하기
 */
export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 유효한 토큰이 있는지 확인
 * @returns 유효한 토큰이 있으면 true, 없으면 false
 */
export const hasValidToken = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};
