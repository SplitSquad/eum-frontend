// src/features/auth/tokenUtils.ts
const TOKEN_KEY = 'auth_token';

/**
 * JWT 토큰 디코딩 (유효성 검증 없음)
 */
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * 토큰 만료 여부 확인
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true; // 페이로드가 없거나 만료 시간이 없으면 만료된 것으로 간주
    }
    
    // exp는 초 단위이므로 1000을 곱해서 밀리초로 변환
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    // 5분 버퍼를 두어 만료 직전에 갱신할 수 있도록 함
    const bufferTime = 5 * 60 * 1000; // 5분
    
    return expirationTime - bufferTime <= currentTime;
  } catch (error) {
    console.error('토큰 만료 확인 실패:', error);
    return true; // 에러 발생 시 만료된 것으로 간주
  }
};

/**
 * 유효한 토큰인지 확인 (존재 여부 + 만료 여부)
 */
export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
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
 * 유효한 토큰 가져오기 (만료된 토큰은 자동 제거)
 */
export const getValidToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    console.log('토큰이 만료되어 제거합니다.');
    removeToken();
    return null;
  }
  
  return token;
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
