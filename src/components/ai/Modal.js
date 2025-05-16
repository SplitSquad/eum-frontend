'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * Modal 컴포넌트
 * - 포탈을 통해 body 밖에 모달을 렌더링
 * - Escape 키로 닫힘
 * - Framer Motion으로 애니메이션 처리
 */
export default function Modal({ isOpen, onClose, children, position }) {
    // Escape 키 누르면 모달 닫기 핸들링
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);
    // 모달 포탈 root 엘리먼트 준비
    const portalRoot = document.getElementById('modal-root') ||
        (() => {
            const el = document.createElement('div');
            el.id = 'modal-root';
            document.body.appendChild(el);
            return el;
        })();
    // 포탈을 사용해 모달 렌더링
    return createPortal(_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/50 z-40", initial: { opacity: 0 }, animate: { opacity: 0.5 }, exit: { opacity: 0 }, onClick: onClose }), _jsx(motion.div, { className: "fixed inset-0 z-50 pointer-events-none", children: _jsx("div", { className: "\n                pointer-events-auto\n                bg-white rounded-2xl shadow-xl \n                max-w-sm w-[600px] overflow-hidden\n              ", style: position
                            ? {
                                position: 'absolute',
                                top: position.y,
                                left: position.x,
                                transform: 'translate(0, 0)',
                            }
                            : undefined, children: _jsx("div", { className: "relative p-4", children: children }) }) })] })) }), portalRoot);
}
