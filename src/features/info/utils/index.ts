// 모듈 진입점
export { default as InfoRoutes } from './InfoRoutes';

// 페이지 컴포넌트 내보내기
export { InfoListPage, InfoCreatePage, InfoDetailPage } from '../pages';

/**
 * API에서 받아온 content를 정제하는 함수 (임시: 구현은 추후)
 */
export function cleanInfoContent(content: string): string {
  // "text": 뒤에 오는 모든 값을 최대 20개까지 추출 (여러 줄)
  try {
    // 정규식으로 모든 "text": 뒤의 값을 배열로 추출
    const matches = [...content.matchAll(/"text"\s*:\s*"([^"]*)"/g)];
    if (matches.length > 0) {
      // 최대 20개까지 추출하여 줄바꿈으로 연결
      return matches
        .slice(0, 20)
        .map(m => m[1])
        .join('\n');
    }
  } catch (e) {
    // 파싱 실패 시 빈 문자열 반환
  }
  return '';
}
