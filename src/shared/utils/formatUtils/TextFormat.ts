/**
 * truncateText 함수는 문자열을 지정한 길이로 자르고,
 * 초과하는 경우 말줄임표("...")를 붙여 반환
 *
 * @param text - 입력 문자열
 * @param maxLength - 최대 길이
 * @returns 최대 길이로 잘라진 문자열 (초과 시 "..." 추가)
 */

/**
 * truncateText 함수는 주어진 최대 길이보다 텍스트가 길면 해당
 * 길이까지 자르고 "..."를 추가하여 반환
 */
export const TruncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

/**
 * capitalize 함수는 입력 문자열의 첫 글자를 대문자로 변환
 *
 * @param text - 입력 문자열
 * @returns 첫 글자만 대문자로 변환된 문자열
 */

/**
 * capitalize 함수는 문자열의 첫 글자를 대문자로 변환
 */
export const Capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};
