import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from '@/components/ai/Modal';
import ModalContent from '@/components/ai/ModalContent';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useModalStore } from '@/shared/store/ModalStore';
import { IconButton } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import { SeasonalBackground } from '../features/theme';
import FloatingNavigator from '@/components/layout/FloatingNavigator';
import './App.css';
import eum2Image from '@/assets/images/characters/이음이.png';
/**
 * 애플리케이션 레이아웃 컴포넌트
 * 모든 라우트의 부모 컴포넌트로 작동
 */
const App = () => {
    const { loadUser } = useAuthStore();
    const { isModalOpen, content, position, openModal, closeModal } = useModalStore();
    const btnRef = useRef(null);
    const location = useLocation();
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(true);
    // 현재 링크와 이전 링크를 추적하는 refs
    const currentPathRef = useRef(location.pathname);
    const previousPathRef = useRef('');
    // 경로에 따른 컴포넌트 가시성 설정
    const updateVisibility = (path) => {
        // 루트 경로 체크
        if (path === '/') {
            setIsHeaderVisible(false);
            setIsModalVisible(false);
            return;
        }
        // onboarding 경로 체크 (하위 경로 포함)
        if (path.startsWith('/onboarding')) {
            setIsHeaderVisible(false);
            setIsModalVisible(false);
            return;
        }
        // assistant 경로 체크 (하위 경로 포함)
        if (path.startsWith('/assistant')) {
            setIsHeaderVisible(true);
            setIsModalVisible(false);
            return;
        }
        // 기본 상태
        setIsHeaderVisible(true);
        setIsModalVisible(true);
    };
    // 초기 마운트와 경로 변경 시 실행
    useEffect(() => {
        // 현재 경로 업데이트
        if (currentPathRef.current !== location.pathname) {
            previousPathRef.current = currentPathRef.current;
            currentPathRef.current = location.pathname;
            console.log('Route changed:', {
                from: previousPathRef.current,
                to: currentPathRef.current,
            });
        }
        // 현재 경로에 따른 가시성 업데이트
        updateVisibility(location.pathname);
    }, [location.pathname]);
    // 초기 마운트 시 한 번 실행
    useEffect(() => {
        updateVisibility(location.pathname);
    }, []);
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
    // 앱 초기화 시 인증 상태 확인
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    console.log('App 초기화: 저장된 토큰 발견, 인증 상태 복원 시도');
                    await loadUser();
                }
            }
            catch (error) {
                console.error('인증 상태 초기화 실패:', error);
            }
        };
        initAuth();
    }, [loadUser]);
    return (_jsx(SnackbarProvider, { maxSnack: 3, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }, autoHideDuration: 3000, children: _jsxs("div", { className: `app-container ${isModalOpen ? 'modal-open' : ''}`, children: [isModalVisible && (_jsx(Modal, { isOpen: isModalOpen, onClose: closeModal, position: position, children: content ?? _jsx(ModalContent, {}) })), _jsxs("div", { className: `app-content ${isModalOpen ? 'dimmed' : ''}`, children: [_jsx(Header, { isVisible: isHeaderVisible }), _jsxs(SeasonalBackground, { children: [_jsx("main", { className: "main-content", children: _jsx("div", { style: { paddingTop: '2.5rem', height: '100%' }, children: _jsx(Outlet, {}) }) }), isModalVisible && (_jsx("div", { className: "fixed bottom-[170px] right-8 z-[1001]", children: _jsx(IconButton, { ref: btnRef, onClick: onButtonClick, className: "modal-toggle-button", sx: {
                                            backgroundColor: 'rgba(255, 182, 193, 0.4)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 182, 193, 0.6)',
                                            },
                                            padding: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }, children: _jsx("img", { src: eum2Image, alt: "\uC774\uC74C\uC774", style: {
                                                width: 32,
                                                height: 32,
                                                objectFit: 'contain',
                                                transition: 'transform 0.3s',
                                                transform: isModalOpen ? 'rotate(90deg)' : 'none',
                                            } }) }) }))] }), _jsx(Footer, {})] }), _jsx(FloatingNavigator, { isHeaderVisible: isHeaderVisible })] }) }));
};
export default App;
