// src/features/auth/tokenUtils.ts
export const getToken = (): string | null => localStorage.getItem('auth_token');

export const setToken = (token: string): void => localStorage.setItem('auth_token', token);

export const removeToken = (): void => localStorage.removeItem('auth_token');
