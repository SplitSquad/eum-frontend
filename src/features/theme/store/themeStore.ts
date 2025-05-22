import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 계절 타입 정의
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// 테마 상태 인터페이스
interface ThemeState {
  season: Season;
  setSeason: (season: Season) => void;
  getCurrentSeason: () => Season;
}

// 현재 월에 따른 계절 계산 함수
const getDefaultSeason = (): Season => {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) return 'spring'; // 3-5월: 봄
  if (month >= 6 && month <= 8) return 'summer'; // 6-8월: 여름
  if (month >= 9 && month <= 11) return 'autumn'; // 9-11월: 가을
  return 'winter'; // 12, 1, 2월: 겨울
};

// Zustand 스토어 생성
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 초기 상태 - 현재 월에 따른 기본 계절
      season: getDefaultSeason(),
      
      // 계절 설정 함수
      setSeason: (season: Season) => set({ season }),
      
      // 현재 계절 반환 함수
      getCurrentSeason: () => get().season,
    }),
    {
      name: 'theme-storage', // 로컬 스토리지 키
      partialize: (state) => ({ season: state.season }), // 저장할 상태 선택
    }
  )
); 