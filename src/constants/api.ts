// API 기본 URL 설정
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' // 프로덕션 환경 URL
  : 'http://localhost:8080'; // 개발 환경 URL

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
  },
  POSTS: {
    LIST: '/api/v1/posts',
    DETAIL: (id: string) => `/api/v1/posts/${id}`,
    CREATE: '/api/v1/posts',
    UPDATE: (id: string) => `/api/v1/posts/${id}`,
    DELETE: (id: string) => `/api/v1/posts/${id}`,
  },
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE: '/api/v1/users/profile',
  },
}; 