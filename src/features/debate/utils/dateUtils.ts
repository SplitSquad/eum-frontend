/**
 * 날짜 포맷을 변환하여 반환합니다.
 * @param dateString 변환할 날짜 문자열
 * @returns 포맷팅된 날짜 (YYYY.MM.DD)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

/**
 * 날짜와 시간 포맷을 변환하여 반환합니다.
 * @param dateString 변환할 날짜 문자열
 * @returns 포맷팅된 날짜 및 시간 (YYYY.MM.DD HH:MM)
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * 현재 시간과 비교하여 상대적인 시간 표현을 반환합니다.
 * @param dateString 비교할 날짜 문자열
 * @returns 상대적 시간 표현 (예: "방금 전", "1시간 전", "어제", "YYYY.MM.DD")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return '어제';
  if (diffDay < 7) return `${diffDay}일 전`;
  
  return formatDate(dateString);
};

/**
 * 주어진 날짜가 오늘인지 확인합니다.
 * @param dateString 확인할 날짜 문자열
 * @returns 오늘인 경우 true, 아닌 경우 false
 */
export const isToday = (dateString: string): boolean => {
  const now = new Date();
  const date = new Date(dateString);
  
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}; 