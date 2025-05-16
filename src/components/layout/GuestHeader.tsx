import React from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/feedback/Notification';
import logo from '@/assets/images/characters/이음로고.png';
import Eum from '@/assets/images/characters/이음이.png';

/*notification 호출 여기서 추후 api 추가*/

function GuestHeader() {
  const navigate = useNavigate();

  const loginHandler = () => {
    alert('구글 소셜 로그인 호출 했다 칩시다.');
  };
  const registerHandler = () => {
    navigate('/onboarding');
  };

  return (
    <>
      <header className="w-full h-16 bg-white shadow-sm border-b border-gray-100 z-50">
        로그인 안함
        <div className="flex items-center gap-4">
          <button
            onClick={loginHandler}
            className="text-sm text-blue-600 hover:underline transition"
          >
            로그인
          </button>
          <button
            onClick={registerHandler}
            className="text-sm text-gray-500 hover:underline transition"
          >
            회원가입
          </button>
        </div>
      </header>
    </>
  );
}

export default GuestHeader;
