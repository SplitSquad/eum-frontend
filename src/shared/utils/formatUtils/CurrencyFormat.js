/**
 * formatCurrency 함수는 숫자를 통화 형식으로 포맷하여 반환
 *
 * @param amount - 금액 숫자
 * @param currency - 통화 기호 (예: 'USD', 'KRW')
 * @param locale - 선택 사항, 기본값은 'en-US'
 * @returns 통화 형식으로 포맷된 문자열
 */
/**
 * Intl.NumberFormat을 사용하여 금액을 통화 스타일로 포맷
 * 기본 통화는 'USD'이며, Locale 역시 기본적으로 'en-US'로 설정
 * 다른 통화나 Locale을 파라미터로 전달할 수 있음
 */
export const FormatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};
