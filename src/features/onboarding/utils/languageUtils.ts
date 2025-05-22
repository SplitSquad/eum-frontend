// 언어 관련 상수
const LANGUAGE_STORAGE_KEY = 'preferred_ui_language';
const DEFAULT_LANGUAGE = 'ko';
const DEFAULT_FALLBACK_LANGUAGE = 'en';

// 지원하는 언어 코드 목록
export const SUPPORTED_LANGUAGE_CODES = ['ko', 'en', 'ja', 'zh', 'de', 'fr', 'es', 'ru'];

/**
 * 사용자가 선호하는 UI 언어를 로컬 스토리지에 저장
 * @param language 언어 코드 (ko, en, ja, zh 등)
 */
export const savePreferredLanguage = (language: string): void => {
  if (language && SUPPORTED_LANGUAGE_CODES.includes(language.toLowerCase())) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language.toLowerCase());
  } else {
    // 지원하지 않는 언어면 기본 언어로 저장
    localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
  }
};

/**
 * 사용자가 선호하는 UI 언어를 로컬 스토리지에서 가져오기
 * @returns 언어 코드 (기본값: ko 또는 en)
 */
export const getPreferredLanguage = (): string => {
  // 로컬 스토리지에서 저장된 값을 먼저 확인
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGE_CODES.includes(savedLanguage.toLowerCase())) {
    return savedLanguage.toLowerCase();
  }
  
  // 로컬 스토리지에 없으면 브라우저 언어 설정 확인
  const browserLanguage = navigator.language.split('-')[0].toLowerCase(); // 'ko-KR'에서 'ko'만 추출
  
  // 지원하는 언어인지 확인
  if (SUPPORTED_LANGUAGE_CODES.includes(browserLanguage)) {
    return browserLanguage;
  }
  
  // 브라우저 언어가 지원되지 않는 경우, 영어권 국가인지 확인
  const englishSpeakingCountryCodes = ['us', 'gb', 'au', 'ca', 'nz', 'ie', 'za'];
  const countryCode = (navigator.language.split('-')[1] || '').toLowerCase();
  
  // 영어권 국가라면 영어를 기본값으로 사용
  if (englishSpeakingCountryCodes.includes(countryCode)) {
    return DEFAULT_FALLBACK_LANGUAGE;
  }
  
  // 그 외의 경우는 한국어를 기본값으로 사용
  return DEFAULT_LANGUAGE;
};

/**
 * 현재 언어가 RTL(오른쪽에서 왼쪽) 표기인지 확인
 * @param language 언어 코드
 * @returns RTL 여부
 */
export const isRTLLanguage = (language: string): boolean => {
  // RTL 언어 목록 (아랍어, 히브리어 등)
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(language.toLowerCase());
};

/**
 * 유효한 언어 코드인지 확인
 * @param language 언어 코드
 * @returns 유효성 여부
 */
export const isValidLanguage = (language: string): boolean => {
  return SUPPORTED_LANGUAGE_CODES.includes(language.toLowerCase());
}; 