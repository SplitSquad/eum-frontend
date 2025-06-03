'use client';

import { ReactNode, useEffect, useState } from 'react';
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
  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Escape 키 누르면 모달 닫기 핸들링
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  console.log(position);
  console.log(window.scrollY);

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
              className={
                `pointer-events-auto bg-white shadow-2xl z-[1051] border border-gray-100 backdrop-blur-sm ` +
                (isMobile
                  ? 'rounded-2xl'
                  : 'rounded-2xl w-[400px] min-h-[450px] max-h-[550px] overflow-hidden')
              }
              style={
                {
                  ...(isMobile
                    ? {
                        width: '90vw',
                        maxWidth: 400,
                        maxHeight: '80vh',
                        borderRadius: 16,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        margin: 'auto',
                        overflow: 'auto',
                      }
                    : {}),
                  ...(position && !isMobile
                    ? {
                        position: 'fixed',
                        top: position.y,
                        left: position.x,
                        transform: 'translate(0, 0)',
                      }
                    : {}),
                } as CSSProperties
              }
            >
              <div className="relative">
                {/* 닫기(X) 버튼 */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-3 right-3 w-9 h-9 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-lg border border-gray-200 hover:border-gray-300"
                  tabIndex={0}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
