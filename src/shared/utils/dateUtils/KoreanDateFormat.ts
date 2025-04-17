/**
 * koreanDateFormat 함수는 날짜를 한국식 포맷("YYYY년 MM월 DD일")으로 변환합니다.
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 한국식으로 포맷된 날짜 문자열
 */

/**
 * 입력 받은 날짜를 Date 객체로 변환하고 연, 월, 일을 각각 추출
 * 월과 일이 한 자릿수일 경우 앞에 0을 붙여 두 자리로 만듬
 * 최종적으로 "YYYY년 MM월 DDdlf" 형식으로 포맷하여 반환
 */
export const KoreanDateFormat = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 월은 0부터 시작
  const day = d.getDate();

  // 각 항목을 2자리로 맞추기 위해 padStart 사용
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  return `${year}년 ${formattedMonth}월 ${formattedDay}일`;
};
