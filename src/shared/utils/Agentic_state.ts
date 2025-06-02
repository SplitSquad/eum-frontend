// Agentic_state.ts
let currentAgenticState: string = 'first'; // 초기 상태
// 🔹 위치 정보 저장용 변수
let userLocation: { latitude: number; longitude: number } | null = null;

/**
 * 현재 상태 반환
 */
export function getAgenticState(): string {
  return currentAgenticState;
}

/**
 * 상태 업데이트
 * @param newState 새로 받은 상태값
 */
export function setAgenticState(newState: string): void {
  currentAgenticState = newState;
}

/**
 * 상태 초기화
 */
export function resetAgenticState(): void {
  currentAgenticState = 'initial';
}

/**
 * 현재 위치 반환
 */
export function getUserLocation(): { latitude: number; longitude: number } | null {
  return userLocation;
}

/**
 * 위치 설정
 * @param location 위도, 경도
 */
export function setUserLocation(location: { latitude: number; longitude: number }): void {
  userLocation = location;
}
