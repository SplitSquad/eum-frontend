// src/features/auth/tokenUtils.ts
const TOKEN_KEY = 'auth_token';
/**
 * 토큰 가져오기
 * @returns 저장된 인증 토큰
 */
export const getToken = () => {
    // 먼저 sessionStorage에서 찾고, 없으면 localStorage에서 찾음
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    if (sessionToken)
        return sessionToken;
    return localStorage.getItem(TOKEN_KEY);
};
/**
 * 토큰 저장하기
 * @param token 저장할 인증 토큰
 */
export const setToken = (token) => {
    if (!token)
        return;
    // 두 스토리지 모두에 저장
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
};
/**
 * 토큰 제거하기
 */
export const removeToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
};
