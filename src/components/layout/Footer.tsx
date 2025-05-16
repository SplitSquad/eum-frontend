import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/shared/store/UserStore';
import useAuthStore from '@/features/auth/store/authStore';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  const setRegion = useUserStore(state => state.setUserProfile);
  const { isAuthenticated, handleLogout } = useAuthStore();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/google-login');
    }
  };

 

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-copyright">© EUM</p>
        <div className="footer-buttons">
          {/*<button onClick={handleAuthClick} className="footer-button login-button">
            {isAuthenticated ? '로그아웃' : '로그인'}
          </button>
          <button onClick={testRegionHandler} className="footer-button region-button">
            지역 설정
          </button>*/}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
