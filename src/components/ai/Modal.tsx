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
 * - Escape 키 및 백드롭 클릭(포함되지 않았으므로 필요 시 추가)으로 닫힘
 * - Framer Motion으로 애니메이션 처리
 */

export default function Modal({ isOpen, onClose, children, position }: ModalProps) {
  // Escape 키 누르면 모달 닫기 핸들링
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 모달 오픈 시 body 스크롤 잠금 처리
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

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
          {/* 백드롭: 투명도가 있지만 클릭 이벤트를 자식으로 통과 */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 래퍼: 클릭 이벤트 통과 */}
          <motion.div className="fixed inset-0 z-50 pointer-events-none">
            {/* 실제 모달 박스: 포지션 및 스타일 적용 */}
            <div
              className="
                pointer-events-auto
                bg-white rounded-2xl shadow-xl 
                max-w-sm w-[600px] overflow-hidden
              "
              style={
                position
                  ? ({
                      position: 'absolute',
                      top: position.y,
                      left: position.x,
                      transform: 'translate(0, 0)',
                    } as CSSProperties)
                  : undefined
              }
            >
              <div className="relative p-4">
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
