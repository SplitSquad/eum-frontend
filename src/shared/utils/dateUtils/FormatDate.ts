/**
 * formatDate 함수는 Date 객체 또는 날짜 문자열을 받아
 * 지정한 옵션에 따라 포맷된 날짜 문자열을 반환
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @param locale - 선택 사항, 기본값 'en-US'
 * @param options - Intl.DateTimeFormat 옵션 객체
 * @returns 포맷된 날짜 문자열
 */

/**
 * 입력 받은 date가 문자열이면 Date 객체로 변환
 * toLocaleDateString을 사용하여, 옵션에 맞게 날짜를 포맷
 * 기본 Locale은 'en-US'로 설정되어 있으며, 원하는 옵션을 전달할 수 있음
 */
export const FormatDate = (
  date: Date | string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options);
};
