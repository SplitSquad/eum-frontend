/**
 * translations 객체에서 주어진 key의 번역 문자열을 반환
 * 만약 해당 키가 없으면 fallback 문자열(기본값: 빈 문자열)을 반환
 *
 * @param translations - 번역 사전 객체 (키: 번역 문자열)
 * @param key - 찾고자 하는 번역 키
 * @param fallback - 기본값 (옵션)
 * @returns 번역 문자열 또는 fallback 문자열
 */
/**
 * getTranslation 함수는 번역 데이터 객체와 번역 키를 받아 해당 키에 해당하는 번역
 * 문자열이 있으면 반환하고, 없으면 기본값(fallback)을 반환
 */
export const GetTranslation = (translations, key, fallback = '') => {
    return translations[key] || fallback;
};
