import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { SidebarMenu, SpringBackground } from '.';
import { useLocation } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-5px); }
`;

// 한지/봄/분홍 테마 스타일 제거, 회색 테마로 변경
const grayBookStyle = `
  background-color: #fafafa;
  color: #222;
  border: 1px solid #e0e0e0;
  position: relative;
`;

// 레이아웃 기본 구조
const AppRoot = styled.div`
  width: 100%;
  min-height: 60vh;
  position: relative;
  overflow-x: hidden;
  padding: 0 0 0 0;
`;

// 고정된 배경 레이어
const BackgroundLayer = styled.div`
  display: none;
`;

// 콘텐츠 레이어 (책 컨테이너)
const ContentLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 0;
  z-index: 1;
`;

// 책 컨테이너 스타일
const BookContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 85vh;
  margin: 0 0 0 0;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;

const Book = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  padding: 0 0 0 0;

  &:before {
    content: '';
    position: absolute;
    left: 250px;
    top: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #e0e0e0 0%, #fafafa 100%);
    z-index: 5;
    box-shadow: 0 0 10px #e0e0e0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    &:before {
      display: none;
    }
  }
`;

const LeftPage = styled.aside`
  ${grayBookStyle}
  padding: 30px 20px;
  height: 100%;
  overflow-y: auto;
  position: relative;
  box-shadow: inset -5px 0 15px -5px #e0e0e0;
  border-radius: 10px 0 0 10px;
  z-index: 2;

  &:after {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSidebar = styled.aside<{ isOpen: boolean }>`
  display: none;
  ${grayBookStyle}
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  z-index: 1000;
  transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  box-shadow: 3px 0 15px #e0e0e0;
  background-color: #fafafa;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease-in-out;
  backdrop-filter: blur(3px);

  @media (max-width: 768px) {
    display: block;
  }
`;

// 콘텐츠 영역 - 탭 전환되는 부분
const ContentArea = styled.main<{ isVisible: boolean; isLeaving: boolean }>`
  ${grayBookStyle}
  padding: 30px;
  height: 100%;
  overflow-y: auto;
  position: relative;
  box-shadow: inset 5px 0 15px -5px #e0e0e0;
  border-radius: 0 10px 10px 0;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  animation: ${props => (props.isVisible ? fadeIn : props.isLeaving ? fadeOut : 'none')} 0.3s
    ease-in-out forwards;
  z-index: 2;

  &:before {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
  }
`;

const PageContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  height: 100%;
  position: relative;
  padding: 20px;
`;

// BookTitle 회색 테마
const BookTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 30px;
  color: #222;
  position: relative;
  display: inline-block;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  letter-spacing: -0.5px;

  &:after {
    display: none;
  }
`;

const BookmarkRibbon = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  width: 30px;
  height: 70px;
  background-color: rgb(209, 209, 209);
  border-radius: 0 0 5px 5px;
  box-shadow: 0 5px 10px rgba(209, 209, 209, 0.2);
  z-index: 10;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 15px 0 15px;
    border-color: rgb(209, 209, 209) transparent transparent transparent;
  }
`;

// 벚꽃 문양 장식
const FlowerOrnament = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23ffcad4' d='M50,5 C42,5 35,12 35,20 C35,22 36,25 37,28 C27,27 18,34 15,44 C14,46 15,48 16,50 C17,52 15,54 13,54 C9,55 5,59 5,65 C5,73 12,80 20,80 C22,80 25,79 28,78 C27,88 34,97 44,99 C46,100 48,99 50,98 C52,99 54,100 56,99 C66,97 73,88 72,78 C75,79 78,80 80,80 C88,80 95,73 95,65 C95,59 91,55 87,54 C85,54 83,52 84,50 C85,48 86,46 85,44 C82,34 73,27 63,28 C64,25 65,22 65,20 C65,12 58,5 50,5 Z' opacity='0.2'/%3E%3C/svg%3E");
  opacity: 0.5;
  pointer-events: none;
  z-index: 3;
`;

const CornerOrnament = styled(FlowerOrnament)`
  top: 10px;
  left: 10px;
`;

const BottomOrnament = styled(FlowerOrnament)`
  bottom: 10px;
  right: 10px;
  transform: rotate(180deg);
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background-color: rgba(255, 249, 249, 0.9);
  border: 1px solid rgb(209, 209, 209);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(212, 212, 212, 0.2);

  &:hover {
    background-color: rgba(215, 215, 215, 0.2);
    box-shadow: 0 4px 12px rgba(196, 196, 196, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, rgb(237, 237, 237), rgb(209, 209, 209));
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-of-type(1) {
      top: 0px;
    }

    &:nth-of-type(2),
    &:nth-of-type(3) {
      top: 8px;
    }

    &:nth-of-type(4) {
      top: 16px;
    }
  }
`;

const CloseIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, rgb(237, 237, 237), rgb(209, 209, 209));
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-of-type(1) {
      top: 8px;
      transform: rotate(45deg);
    }

    &:nth-of-type(2) {
      top: 8px;
      transform: rotate(-45deg);
    }
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

/**
 * 마이페이지의 레이아웃 컴포넌트 - 봄 테마 책 형태
 * 구조: 고정 배경 위에 책 컨테이너가 있고, 왼쪽/오른쪽 페이지로 구성
 * 페이지 전환 시 배경은 유지되고 내용만 부드럽게 전환됨
 */
const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // 페이지 전환 애니메이션 제거 - 이중 깜빡임 방지
  // const [contentVisible, setContentVisible] = useState(true);
  // const [isLeaving, setIsLeaving] = useState(false);
  // const [content, setContent] = useState<React.ReactNode>(children);
  const location = useLocation();

  // 페이지 전환 감지 및 애니메이션 처리 - 제거하여 이중 애니메이션 방지
  /*
  useEffect(() => {
    if (location && content !== children) {
      // 1. 페이드 아웃
      setIsLeaving(true);
      setContentVisible(false);

      // 2. 콘텐츠 변경 및 페이드 인 (페이드 아웃이 완료된 후)
      const timer = setTimeout(() => {
        setContent(children);
        setIsLeaving(false);
        setContentVisible(true);
      }, 200); // 페이드 아웃 애니메이션(0.3s)보다 짧게 설정하여 부드러운 전환

      return () => clearTimeout(timer);
    }
  }, [children, location.pathname]);
  */

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <AppRoot>
      {/* 고정된 배경 레이어 - 항상 유지됨 */}
      {/* BackgroundLayer는 제거, App.tsx의 SeasonalBackground만 사용 */}

      {/* 콘텐츠 레이어 - 페이지 전환 시 내용만 변경됨 */}
      <ContentLayer>
        <BookContainer>
          <Book>
            <LeftPage>
              <BookmarkRibbon />
              <CornerOrnament />
              <BottomOrnament />
              <SidebarMenu />
            </LeftPage>

            {/* Mobile sidebar */}
            <MobileSidebar isOpen={isMobileSidebarOpen}>
              <SidebarMenu />
            </MobileSidebar>
            <Overlay isOpen={isMobileSidebarOpen} onClick={closeMobileSidebar} />

            <MobileMenuButton onClick={toggleMobileSidebar} aria-label="메뉴 열기/닫기">
              {isMobileSidebarOpen ? (
                <CloseIcon>
                  <span></span>
                  <span></span>
                </CloseIcon>
              ) : (
                <MenuIcon>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </MenuIcon>
              )}
            </MobileMenuButton>

            {/* 내용 영역 - 이중 애니메이션 제거로 즉시 표시 */}
            <ContentArea isVisible={true} isLeaving={false}>
              <CornerOrnament />
              <BottomOrnament />
              <PageContent>
                <BookTitle>{title}</BookTitle>
                {children}
              </PageContent>
            </ContentArea>
          </Book>
        </BookContainer>
      </ContentLayer>
    </AppRoot>
  );
};

export default PageLayout;
