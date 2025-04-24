import React from 'react';
import { useUserStore } from '@/shared/store/UserStore';
function Footer() {
  const setAuthStatus = useUserStore(state => state.setAuthStatus);
  const setRegion = useUserStore(state => state.setUserProfile);
  const { isAuthenticated, userProfile } = useUserStore();

  const testClickHandelr = () => {
    setAuthStatus(!isAuthenticated);
  };

  const testRegionHandler = () => {
    setRegion({
      userId: 1,
      email: 'test@example.com',
      name: '테스트유저',
      profileImagePath: '',
      address: '서울특별시 종로구 청운동', // ⭐ 여기 주소 세팅!
      signedAt: new Date().toISOString(),
      isDeactivated: false,
      nation: 'KR',
      language: 'ko',
      gender: 'male',
      visitPurpose: '유학',
      onBoardingPreference: {
        notifications: true,
        darkMode: false,
      },
      isOnBoardDone: true,
    });
  };
  console.log(userProfile);
  return (
    <footer className="w-full bg-gray-100 py-4 text-center text-sm text-gray-500 mt-auto">
      © 프롱프롱프론트 팀<button onClick={testClickHandelr}> 로그인 전환</button>
      <button onClick={testRegionHandler} className="ml-4 text-green-500">
        지역 설정
      </button>
    </footer>
  );
}

export default Footer;
