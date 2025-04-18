import React from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/feedback/Notification';
import logo from '@/assets/images/characters/이음로고.png';
import Eum from '@/assets/images/characters/이음이.png';
import { mockNotifications } from '@/tests/mocks';

/*notification 호출 여기서 추후 api 추가*/

type NotificationItem = {
  id: number;
  content: string;
  language: string;
};

type HeaderProps = {
  isPlaying?: boolean;
  userName?: string;
  userCountry?: string;
  userType?: string;
  notifications?: NotificationItem[];
};

function countryEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

function Header({ userName = '기본값', userCountry = '한국', userType = '유학' }: HeaderProps) {
  const navigate = useNavigate();
  const flagEmoji = countryEmoji(userCountry);

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-100 z-50">
        <div className="h-16 px-4 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
            <img src={logo} alt="EUM 로고" className="h-auto max-h-10 w-auto object-contain" />
          </div>

          {/* 메뉴 + 유저영역 */}
          <div className="flex items-center gap-6">
            {/* 메뉴 버튼들 */}
            <nav className="flex gap-3 text-sm">
              <button
                onClick={() => navigate('/info')}
                className="text-gray-800 font-medium hover:text-primary"
              >
                한국생활 가이드
              </button>
              <button
                onClick={() => navigate('/community')}
                className="text-gray-800 font-medium hover:text-primary"
              >
                모임과 이야기
              </button>
              <button
                onClick={() => navigate('/debate')}
                className="text-gray-800 font-medium hover:text-primary"
              >
                핫 이슈 토론
              </button>
              <button
                onClick={() => navigate('/ai-assistant')}
                className="text-gray-800 font-medium hover:text-primary"
              >
                AI 전문가
              </button>
              <button
                onClick={() => navigate('/mypage')}
                className="text-gray-800 font-medium hover:text-primary"
              >
                마이페이지
              </button>
            </nav>

            {/* 유저 정보 + 알림 */}
            <div className="flex items-center gap-4">
              {/* 프로필 */}
              <div className="flex items-center gap-2">
                <img src={Eum} alt="profile" className="w-9 h-9 rounded-full" />
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-800">{userName}</span>
                    <div className="text-xs text-gray-500">
                      {flagEmoji} {userCountry}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{userType}</span>
                </div>
              </div>

              {/* 알림 */}
              <div className="ml-2">
                <Notification items={mockNotifications} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
