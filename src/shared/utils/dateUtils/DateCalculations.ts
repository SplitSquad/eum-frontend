/**
 * 두 날짜 사이의 일(day) 차이를 반환
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 두 날짜 사이의 일 수 차이
 */

/**
 * differenceInDays는 두 날짜 사이의 차이를 밀로초로 계산한 후, 일(day) 단위로 변환
 */
export const differenceInDays = (startDate: Date, endDate: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay);
};

/**
 * 주어진 날짜에 지정한 일 수를 더한 새로운 날짜를 반환
 * @param date - 기준 날짜
 * @param days - 더할 일 수 (음수일 경우 빼게 됨)
 * @returns 새로운 Date 객체
 */

/**
 * addDays는 기준 날짜에서 주어진 일 수만큼 더한 후 새 Date 객체를 반환
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};
