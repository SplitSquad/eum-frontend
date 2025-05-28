import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 계절 타입 정의
export type Season = 'spring' | 'hanji' | 'professional';

// 테마 상태 인터페이스
interface ThemeState {
  season: Season;
  setSeason: (season: Season) => void;
}

// Helper: body에 테마 클래스 적용
function setBodyThemeClass(season: Season) {
  const classList = document.body.classList;
  classList.remove('theme-spring', 'theme-hanji', 'theme-professional');
  if (season === 'spring') classList.add('theme-spring');
  if (season === 'hanji') classList.add('theme-hanji');
  if (season === 'professional') classList.add('theme-professional');
}

// Zustand 스토어 생성
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 초기 상태 - 현재 월에 따른 기본 계절
      season: 'spring' as Season,

      // 계절 설정 함수
      setSeason: (season: Season) => {
        set({ season });
        setBodyThemeClass(season);
      },
    }),
    {
      name: 'theme-storage', // 로컬 스토리지 키
      partialize: state => ({ season: state.season }), // 저장할 상태 선택
    }
  )
);

// 앱 시작 시 현재 season에 맞는 body 클래스 적용
if (typeof window !== 'undefined') {
  const season = useThemeStore.getState().season;
  setBodyThemeClass(season);
}
