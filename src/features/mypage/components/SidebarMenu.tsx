import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-15px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled components
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItem = styled.li`
  animation: ${slideInLeft} 0.5s ease-out forwards;
  opacity: 0;

  &:nth-of-type(1) {
    animation-delay: 0.1s;
  }
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.3s;
  }
  &:nth-of-type(4) {
    animation-delay: 0.4s;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #555;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    color: rgb(181, 180, 180);
    background-color: rgba(224, 224, 224, 0.1);
    transform: translateX(4px);
  }

  &.active {
    color: rgb(143, 142, 142);
    background-color: rgba(224, 224, 224, 0.2);
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(180deg, rgb(237, 237, 237), rgb(209, 209, 209));
      border-radius: 0 4px 4px 0;
      box-shadow: 2px 0 6px rgba(209, 209, 209, 0.3);
    }

    svg {
      filter: drop-shadow(0 1px 2px rgba(209, 209, 209, 0.4));
    }
  }

  svg {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

// Custom SVG Icons
const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 12H18L15 21L9 3L6 12H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2554 20.3766 17.7863 20.3766 18.34C20.3766 18.8937 20.1656 19.4246 19.79 19.8C19.4146 20.1756 18.8837 20.3866 18.33 20.3866C17.7763 20.3866 17.2454 20.1756 16.87 19.8L16.81 19.74C16.3278 19.2683 15.6071 19.1377 14.99 19.41C14.3866 19.6647 14.0041 20.2628 14 20.92V21C14 21.5304 13.7893 22.0391 13.4142 22.4142C13.0391 22.7893 12.5304 23 12 23C11.4696 23 10.9609 22.7893 10.5858 22.4142C10.2107 22.0391 10 21.5304 10 21V20.91C9.98831 20.2328 9.58107 19.6204 8.96 19.36C8.34292 19.0877 7.62224 19.2183 7.14 19.69L7.08 19.75C6.70461 20.1256 6.17368 20.3366 5.62 20.3366C5.06632 20.3366 4.53539 20.1256 4.16 19.75C3.78438 19.3746 3.57339 18.8437 3.57339 18.29C3.57339 17.7363 3.78438 17.2054 4.16 16.83L4.22 16.77C4.69171 16.2878 4.82227 15.5671 4.55 14.95C4.29534 14.3466 3.69722 13.9641 3.04 13.96H3C2.46957 13.96 1.96086 13.7493 1.58579 13.3742C1.21071 12.9991 1 12.4904 1 11.96C1 11.4296 1.21071 10.9209 1.58579 10.5458C1.96086 10.1707 2.46957 9.96 3 9.96H3.09C3.76722 9.94831 4.3796 9.54107 4.64 8.92C4.9123 8.30292 4.78174 7.58224 4.31 7.1L4.25 7.04C3.87438 6.66461 3.66339 6.13368 3.66339 5.58C3.66339 5.02632 3.87438 4.49539 4.25 4.12C4.62539 3.74438 5.15632 3.53339 5.71 3.53339C6.26368 3.53339 6.79461 3.74438 7.17 4.12L7.23 4.18C7.71224 4.65171 8.43292 4.78227 9.05 4.51H9.1C9.70344 4.25534 10.0859 3.65722 10.09 3V3C10.09 2.46957 10.3007 1.96086 10.6758 1.58579C11.0509 1.21071 11.5596 1 12.09 1C12.6204 1 13.1291 1.21071 13.5042 1.58579C13.8793 1.96086 14.09 2.46957 14.09 3V3.09C14.0917 3.74722 14.4741 4.3496 15.09 4.61C15.7071 4.87227 16.4278 4.74171 16.91 4.27L16.97 4.21C17.3454 3.83438 17.8763 3.62339 18.43 3.62339C18.9837 3.62339 19.5146 3.83438 19.89 4.21C20.2656 4.58539 20.4766 5.11632 20.4766 5.67C20.4766 6.22368 20.2656 6.75461 19.89 7.13L19.83 7.19C19.3583 7.67224 19.2277 8.39292 19.5 9.01V9.01C19.7547 9.61344 20.3528 9.99594 21.01 10H21.1C21.6304 10 22.1391 10.2107 22.5142 10.5858C22.8893 10.9609 23.1 11.4696 23.1 12C23.1 12.5304 22.8893 13.0391 22.5142 13.4142C22.1391 13.7893 21.6304 14 21.1 14H21C20.3328 14.0017 19.7204 14.4089 19.46 15.03L19.4 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 마이페이지의 사이드바 메뉴 컴포넌트
 * 프로필, 활동내역, 설정 페이지로 이동하는 링크를 포함합니다.
 */
const SidebarMenu: React.FC = () => {
  return (
    <Nav aria-label="마이페이지 메뉴">
      <MenuList>
        <MenuItem>
          <StyledNavLink to="/mypage" end>
            <IconWrapper>
              <ProfileIcon />
            </IconWrapper>
            프로필
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/mypage/activities">
            <IconWrapper>
              <ActivityIcon />
            </IconWrapper>
            활동내역
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/mypage/settings">
            <IconWrapper>
              <SettingsIcon />
            </IconWrapper>
            설정
          </StyledNavLink>
        </MenuItem>
      </MenuList>
    </Nav>
  );
};

export default SidebarMenu;
