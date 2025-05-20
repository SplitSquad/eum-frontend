'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import Header from './Header';
import GuestHeader from './GuestHeader';
import Footer from './Footer';
import { useUserStore } from '@/shared/store/UserStore';
import { useModalStore } from '@/shared/store/ModalStore';
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import { useLocation } from 'react-router-dom';
export default function LegacyAppLayout({ children }) {
    const { isAuthenticated } = useUserStore();
    const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
    const btnRef = useRef(null);
    const location = useLocation();
    // 현재 경로가 루트('/')인 경우 Header를 숨김
    const showHeader = location.pathname !== '/';
    const onButtonClick = () => {
        if (isModalOpen) {
            closeModal();
        }
        else if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            const offset = 8;
            const MODAL_WIDTH = 350;
            let x = rect.left - offset - MODAL_WIDTH + scrollX;
            const y = rect.top + scrollY - 400;
            if (x < 0)
                x = rect.right + offset + scrollX;
            openModal(_jsx(ModalContent, {}), { x, y });
        }
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Modal, { isOpen: isModalOpen, onClose: closeModal, position: position, children: content ?? _jsx(ModalContent, {}) }), showHeader && (isAuthenticated ? _jsx(Header, {}) : _jsx(GuestHeader, {})), _jsx("main", { className: "flex-1 flex flex-col", children: _jsx("div", { className: "flex-1", children: children }) }), _jsx(Footer, {}), _jsx("button", { ref: btnRef, onClick: onButtonClick, className: "fixed bottom-4 right-4 z-60 p-3 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700", children: isModalOpen ? 'Close Modal' : 'Open Modal' })] }));
}
