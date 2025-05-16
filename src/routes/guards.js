import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth';
/**
 * 인증 가드 - 로그인한 사용자만 접근 가능
 * @param children 보호할 컴포넌트
 *
 * TODO: 백엔드 API 연동 시 실제 인증 상태 검증 로직 구현 필요
 */
export const AuthGuard = ({ children }) => {
    const { isAuthenticated, user, isLoading, loadUser } = useAuthStore();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    useEffect(() => {
        // 인증 상태 확인
        const checkAuthentication = async () => {
            try {
                // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
                if (!isAuthenticated && !isLoading) {
                    await loadUser();
                }
            }
            catch (error) {
                console.error('인증 상태 확인 실패:', error);
            }
            finally {
                // 인증 체크가 완료되었음을 표시
                setIsChecking(false);
            }
        };
        checkAuthentication();
    }, [isAuthenticated, isLoading, loadUser]);
    if (isLoading || isChecking) {
        // 인증 확인 중에는 로딩 상태 표시
        return _jsx("div", { children: "\uC778\uC99D \uD655\uC778 \uC911..." });
    }
    if (!isAuthenticated) {
        // 비로그인 상태면 로그인 페이지로 리다이렉트 (현재 위치 정보 저장)
        return _jsx(Navigate, { to: "/google-login", state: { from: location }, replace: true });
    }
    // 인증된 사용자는 자식 컴포넌트 렌더링
    return _jsx(_Fragment, { children: children });
};
/**
 * 게스트 가드 - 비로그인 사용자만 접근 가능 (로그인, 회원가입 등)
 * @param children 보호할 컴포넌트
 */
export const GuestGuard = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
    // 이미 로그인했으면 홈 또는 이전 페이지로 리다이렉트
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return _jsx(Navigate, { to: from, replace: true });
    }
    // 비로그인 사용자는 자식 컴포넌트 렌더링
    return _jsx(_Fragment, { children: children });
};
/**
 * 역할 가드 - 특정 역할을 가진 사용자만 접근 가능 (관리자 페이지 등)
 * @param children 보호할 컴포넌트
 * @param requiredRole 필요한 역할 (예: 'admin')
 */
export const RoleGuard = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();
    // 비로그인 상태면 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/google-login", state: { from: location }, replace: true });
    }
    // 필요한 역할이 없으면 접근 거부 페이지로 리다이렉트
    if (user?.role !== requiredRole) {
        return _jsx(Navigate, { to: "/access-denied", replace: true });
    }
    // 인증 및 권한 검사를 통과한 사용자는 자식 컴포넌트 렌더링
    return _jsx(_Fragment, { children: children });
};
