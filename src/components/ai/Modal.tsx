'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CSSProperties } from 'react';

// Modal 컴포넌트에 전달할 props 타입 정의
interface ModalProps {
  isOpen: boolean; // 모달 오픈 여부
  onClose: () => void; // 모달 닫기 함수
  children: ReactNode; // 모달 내부 컨텐츠
  position?: { x: number; y: number }; // 포탈 위치 지정(옵션)
}

/**
 * Modal 컴포넌트
 * - 포탈을 통해 body 밖에 모달을 렌더링
 * - Escape 키로 닫힘
 * - Framer Motion으로 애니메이션 처리
 */
export default function Modal({ isOpen, onClose, children, position }: ModalProps) {
  // Escape 키 누르면 모달 닫기 핸들링
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 모달 위치 보정 함수
  const getAdjustedPosition = (pos: { x: number; y: number }) => {
    const modalWidth = 400;
    const modalHeight = 520;
    const padding = 20;
    
    let { x, y } = pos;
    
    // 화면 경계 확인 및 조정
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    console.log('=== Modal 위치 보정 시작 ===');
    console.log('원본 위치:', { x, y });
    console.log('화면 크기:', { viewportWidth, viewportHeight });
    
    // 오른쪽 경계 체크 (가장 중요!)
    if (x + modalWidth > viewportWidth - padding) {
      const newX = viewportWidth - modalWidth - padding;
      console.log(`오른쪽 경계 초과! x: ${x} -> ${newX}`);
      x = newX;
    }
    
    // 왼쪽 경계 체크
    if (x < padding) {
      console.log(`왼쪽 경계 초과! x: ${x} -> ${padding}`);
      x = padding;
    }
    
    // 아래쪽 경계 체크 (푸터 고려)
    const footerHeight = 180;
    const maxBottomY = viewportHeight - footerHeight - padding;
    if (y + modalHeight > maxBottomY) {
      const newY = maxBottomY - modalHeight;
      console.log(`아래쪽 경계 초과! y: ${y} -> ${newY}`);
      y = Math.max(padding, newY);
    }
    
    // 위쪽 경계 체크
    if (y < padding) {
      console.log(`위쪽 경계 초과! y: ${y} -> ${padding}`);
      y = padding;
    }
    
    // 최종 검증
    const finalCheck = {
      x: x >= padding && (x + modalWidth) <= (viewportWidth - padding),
      y: y >= padding && (y + modalHeight) <= (viewportHeight - padding),
      right: x + modalWidth,
      bottom: y + modalHeight,
      viewportRight: viewportWidth - padding,
      viewportBottom: viewportHeight - padding
    };
    
    console.log('최종 위치 검증:', finalCheck);
    console.log('최종 보정된 위치:', { x, y });
    console.log('=== Modal 위치 보정 완료 ===');
    
    return { x, y };
  };

  // 모달 포탈 root 엘리먼트 준비
  const portalRoot =
    document.getElementById('modal-root') ||
    (() => {
      const el = document.createElement('div');
      el.id = 'modal-root';
      document.body.appendChild(el);
      return el;
    })();
    
  // 위치 보정
  const adjustedPosition = position ? getAdjustedPosition(position) : undefined;
    
  // 포탈을 사용해 모달 렌더링
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 모달 래퍼 */}
          <motion.div 
            className="pointer-events-none"
            style={{ zIndex: 100000 }} // 모달 버튼보다 높은 z-index
          >
            <div
              className="
                pointer-events-auto
                bg-white rounded-2xl shadow-xl 
                overflow-hidden
              "
              style={
                adjustedPosition
                  ? ({
                      position: 'fixed',
                      top: adjustedPosition.y,
                      left: adjustedPosition.x,
                      width: '400px',
                      height: '520px',
                      transform: 'translate(0, 0)',
                      zIndex: 100001, // 래퍼보다 높은 z-index
                    } as CSSProperties)
                  : {
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      width: '400px',
                      height: '520px',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 100001,
                    }
              }
            >
              <div className="relative w-full h-full">
                {/* 닫기(X) 버튼 */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent shadow-none border-none z-50"
                  style={{ boxShadow: 'none', background: 'none', outline: 'none' }}
                  tabIndex={0}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 7L17 17M17 7L7 17"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {/* 모달 컨텐츠 */}
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalRoot
  );
}
