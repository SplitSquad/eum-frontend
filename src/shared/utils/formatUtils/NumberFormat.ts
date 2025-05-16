/**
 * formatNumber 함수는 숫자를 입력받아 천 단위 구분 기호(,)를 포함하여 문자열로 반환
 *
 * @param num - 포맷할 숫자
 * @param locale - 선택 사항, 기본값은 'en-US'
 * @returns 천 단위 구분 기호가 포함된 문자열
 */

/**
 * Intl.NumberFormat을 사용하여 숫자를 지정된 Locale 형식으로 포맷
 * 기본 Locale은 'en-US'로 설정되어 있으며, 필요에 따라 변경할 수 있음
 */
export const FormatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};
