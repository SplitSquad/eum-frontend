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
    console.log(position);
    console.log(window.scrollY);

    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 모달 포탈 root 엘리먼트 준비
  const portalRoot =
    document.getElementById('modal-root') ||
    (() => {
      const el = document.createElement('div');
      el.id = 'modal-root';
      document.body.appendChild(el);
      return el;
    })();
  // 포탈을 사용해 모달 렌더링
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 모달 래퍼 */}
          <motion.div className="z-[1050] pointer-events-none">
            <div
              className="
                pointer-events-auto
                bg-white rounded-2xl shadow-xl 
                max-w-sm w-[600px] overflow-hidden
                z-[1051]
              "
              style={
                position
                  ? ({
                      position: 'fixed',
                      top: position.y,
                      left: position.x,
                      transform: 'translate(0, 0)',
                    } as CSSProperties)
                  : undefined
              }
            >
              <div className="relative p-4">
                {/* 닫기(X) 버튼 */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent shadow-none border-none"
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
