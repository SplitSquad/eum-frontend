/**
 * 환경변수 타입 정의
 */
export interface ENV {
  API_BASE_URL: string;
  KAKAO_MAP_API_KEY: string;
  WEATHER_API_KEY: string;
  TOUR_API_KEY: string;
  GPT_API_KEY: string;
}

/**
 * 환경변수 객체
 * Vite의 import.meta.env에서 환경변수를 가져와 타입을 가진 객체로 변환
 */
export const env: ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  KAKAO_MAP_API_KEY: import.meta.env.VITE_KAKAO_MAP_API_KEY || '',
  WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY || '',
  TOUR_API_KEY: import.meta.env.VITE_TOUR_API_KEY || '',
  GPT_API_KEY: import.meta.env.VITE_GPT_API_KEY || '',
};

/**
 * 현재 환경이 개발 환경인지 확인
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * 현재 환경이 프로덕션 환경인지 확인
 */
export const isProduction = import.meta.env.PROD;

/**
 * 개발 모드인 경우에만 로그를 출력하는 함수
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (isDevelopment) {
    console.log(`[DEV] ${message}`, ...args);
  }
};

/**
 * 필수 환경 변수 검증
 * 애플리케이션 시작 시 필수 환경 변수가 설정되어 있는지 확인
 */
export const validateEnv = (): boolean => {
  const requiredVars = ['API_BASE_URL'];

  const missingVars = requiredVars.filter(varName => !env[varName as keyof ENV]);

  if (missingVars.length > 0) {
    console.error(`환경 변수 누락: ${missingVars.join(', ')}`);
    return false;
  }

  return true;
};
