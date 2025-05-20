/**
 * toCamelCase 함수는 snake_case 또는 kebab-case 문자열을 camelCase로 변환
 *
 * @param str - 변환할 문자열
 * @returns camelCase 형식의 문자열
 */
/**
 * toCamelCase 함수는 하이픈(-)이나 언더스코어(_)로 구분된 문자열을 camelCase로 변환
 */
export const ToCamelCase = (str) => {
    return str.replace(/([-_][a-z])/gi, match => match.toUpperCase().replace('-', '').replace('_', ''));
};
/**
 * reverseString 함수는 문자열의 순서를 뒤집어 반환
 *
 * @param str - 변환할 문자열
 * @returns 뒤집힌 문자열
 */
/**
 * reverseString 함수는 주어진 문자열을 뒤집어 반환
 */
export const ReverseString = (str) => {
    return str.split('').reverse().join('');
};
