import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { SidebarMenu } from '.';
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
  min-height: 20vh;
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
  max-width: 1000px;
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
  const [contentVisible, setContentVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(children);
  const location = useLocation();

  // 페이지 전환 감지 및 애니메이션 처리 - 부드러운 전환을 위한 개선
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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };
  console.log('title-모바일 확인', isMobileSidebarOpen);
  return (
    <AppRoot>
      {/* 고정된 배경 레이어 - 항상 유지됨 */}
      {/* BackgroundLayer는 제거, App.tsx의 SeasonalBackground만 사용 */}

      {/* 콘텐츠 레이어 - 페이지 전환 시 내용만 변경됨 */}
      <ContentLayer>
        <BookContainer>
          <Book>
            <LeftPage>
              {/* <BookmarkRibbon /> */}
              {/* <CornerOrnament /> */}
              {/* <BottomOrnament /> */}
              <SidebarMenu />
            </LeftPage>

            {/* Mobile sidebar */}
            <MobileSidebar isOpen={isMobileSidebarOpen}>
              <SidebarMenu />
            </MobileSidebar>
            <Overlay isOpen={isMobileSidebarOpen} onClick={closeMobileSidebar} />

            {/* <MobileMenuButton onClick={toggleMobileSidebar} aria-label="메뉴 열기/닫기">
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
            </MobileMenuButton> */}

            {/* 내용 영역 - 페이지 전환 시 이 부분만 변경됨 */}
            <ContentArea isVisible={contentVisible} isLeaving={isLeaving}>
              {/* <CornerOrnament /> */}
              {/* <BottomOrnament /> */}
              <PageContent>
                <BookTitle>{title}</BookTitle>
                {content}
              </PageContent>
            </ContentArea>
          </Book>
        </BookContainer>
      </ContentLayer>
    </AppRoot>
  );
};

export default PageLayout;
