import React from 'react';
import { useUserStore } from '../../shared/store/UserStore';

const UserProfile: React.FC = () => {
  const { userProfile, isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <div>당신의 프로필을 보기 위해 로그인을 하세요.</div>; // 로그인이 되지 않은 경우
  }

  if (!userProfile) {
    return <div>유저 정보를 로딩중입니다....</div>; // 유저 정보가 없는 경우
  }

  return (
    <div>
      <h1>환영해요, {userProfile.name}</h1>
      <p>이메일: {userProfile.email}</p>
      <p>주소: {userProfile.address || 'Not provided'}</p>
      <p>국가: {userProfile.nation}</p>
      <p>언어: {userProfile.language}</p>
      <p>방문 목적: {userProfile.visitPurpose}</p>
      {userProfile.profileImagePath && <img src={userProfile.profileImagePath} alt="Profile" />}
      <div>
        <p>알림: {userProfile.onBoardingPreference.notifications ? 'Enabled' : 'Disabled'}</p>
        <p>다크 모드: {userProfile.onBoardingPreference.darkMode ? 'Enabled' : 'Disabled'}</p>
      </div>
    </div>
  );
};

export default UserProfile;
