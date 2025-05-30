// Agentic_state.ts
let currentAgenticState: string = 'first'; // 초기 상태

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
