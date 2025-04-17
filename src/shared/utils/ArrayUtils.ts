/**
 * removeDuplicates 함수는 배열 내 중복 항목을 제거한 배열을 반환
 *
 * @param array - 중복 제거할 배열
 * @returns 중복 없는 배열
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * flattenArray 함수는 다차원 배열을 1차원 배열로 평탄화합니다.
 *
 * @param arr - 다차원 배열
 * @returns 평탄화된 1차원 배열
 */
export const flattenArray = (arr: any[]): any[] => {
  return arr.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val)),
    []
  );
};
