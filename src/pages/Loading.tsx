import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UnifiedLoading from '../components/loading/UnifiedLoading';
import { useAuthStore } from '../features/auth';

// 로딩 화면을 한 번만 보여주기 위한 세션 키
const LOADING_SHOWN_KEY = 'loading_animation_shown_v3';

/**
 * 로딩 화면 컴포넌트
 * 로딩 후 로그인 상태 및 온보딩 완료 여부에 따라 적절한 페이지로 이동합니다.
 * - 로그인 안 함: /google-login
 * - 로그인 함 & 온보딩 미완료: /onboarding
 * - 로그인 함 & 온보딩 완료: /home
 */
const Loading: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationComplete, setAnimationComplete] = useState(false);
  const { isAuthenticated, user, loadUser, isLoading, getOnBoardDone } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 디버깅용: 세션 스토리지 삭제 (개발 중 테스트용)
  useEffect(() => {
    // URL에 ?reset=true 파라미터가 있으면 세션 스토리지 삭제
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      console.log('🔄 세션 스토리지 초기화 (reset=true)');
      sessionStorage.removeItem(LOADING_SHOWN_KEY);
      window.location.href = '/'; // 파라미터 없이 리다이렉트
      return;
    }
    
    // 페이지 초기 로드 시 이미 로딩을 한 번 봤으면 바로 홈으로 리다이렉트
    if (sessionStorage.getItem(LOADING_SHOWN_KEY) === 'true' && location.pathname === '/') {
      // URL 직접 변경하여 화면 깜빡임 방지
      navigate('/home', { replace: true });
      return;
    }
    
    // 이미 인증된 상태라면 로딩 화면 건너뛰기
    const checkAuth = async () => {
      try {
        // 토큰이 있는지 확인
        const token = localStorage.getItem('auth_token');
        if (token) {
          await loadUser();
          
          if (isAuthenticated) {
            const isOnBoardDone = getOnBoardDone();
            
            // 세션 스토리지에 로딩 화면 표시 여부 저장 (다음 방문 시 로딩 화면 스킵용)
            sessionStorage.setItem(LOADING_SHOWN_KEY, 'true');
            
            if (isOnBoardDone) {
              navigate('/home', { replace: true });
            } else {
              navigate('/onboarding', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('초기 인증 확인 중 오류:', error);
      }
    };
    
    checkAuth();
  }, [navigate, loadUser, isAuthenticated, getOnBoardDone, location.pathname]);

  // 사용자 정보에 따라 적절한 페이지로 리다이렉트하는 함수
  const redirectBasedOnUserStatus = useCallback(() => {
    // 이미 리다이렉팅 중이면 중복 실행 방지
    if (isRedirecting) return;
    
    // 개선된 getOnBoardDone 함수로 온보딩 상태 확인 (항상 boolean 값 반환)
    const isOnBoardDone = getOnBoardDone();
    
    console.log('사용자 상태 확인:', { 
      isAuthenticated,
      isOnBoardDone
    });
    
    // 리다이렉트 상태 설정으로 중복 리다이렉트 방지
    setIsRedirecting(true);
    
    if (!isAuthenticated) {
      // 로그인하지 않은 경우 항상 로그인 페이지로 이동 (replace 사용)
      console.log('✅ 미인증 사용자: 로그인으로 이동');
      navigate('/google-login', { replace: true });
    } else {
      // 인증 상태라면 온보딩 상태에 따라 분기
      if (isOnBoardDone) {
        // 로그인 완료 및 온보딩 완료
        console.log('✅ 인증된 사용자: 홈으로 이동');
        navigate('/home', { replace: true });
      } else {
        // 로그인했지만 온보딩을 완료하지 않은 경우
        console.log('✅ 온보딩 미완료 사용자: 온보딩으로 이동');
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, isRedirecting, navigate, getOnBoardDone]);
  
  // 초기 로딩 시 인증 상태 확인
  useEffect(() => {
    // 이미 리다이렉팅 중이면 추가 로직 실행 방지
    if (isRedirecting) return;
    
    // 로딩 애니메이션을 표시하기 위해 초기 인증 상태만 확인
    const checkAuth = async () => {
      console.log('인증 상태 확인 시작 (로딩 화면 표시)');
      try {
        await loadUser();
        console.log('인증 상태 확인 완료:', { 
          isAuthenticated, 
          user,
          onBoardingStatus: getOnBoardDone()
        });
      } catch (error) {
        console.error('인증 상태 확인 중 오류 발생:', error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [loadUser, isAuthenticated, user, isRedirecting, getOnBoardDone]);
  
  // 로딩 완료 핸들러
  const handleLoadingComplete = useCallback(() => {
    // 애니메이션이 완료되면 상태 업데이트
    console.log('로딩 애니메이션 완료');
    setAnimationComplete(true);
    // 로딩 화면을 봤다고 표시 (이후 방문 시 로딩 화면 스킵)
    sessionStorage.setItem(LOADING_SHOWN_KEY, 'true');
  }, []);

  // 애니메이션 완료 후 인증 상태에 따라 리다이렉트
  useEffect(() => {
    // 이미 리다이렉팅 중이면 중복 실행 방지
    if (isRedirecting) return;
    
    if (animationComplete && authChecked && !isLoading) {
      console.log('애니메이션 완료 및 인증 상태 확인 완료, 리다이렉트 준비');
      // 인증 상태에 따라 적절한 페이지로 이동 (500ms 지연)
      const redirectTimer = setTimeout(() => {
        redirectBasedOnUserStatus();
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [animationComplete, authChecked, isLoading, redirectBasedOnUserStatus, isRedirecting]);

  // 리다이렉트 중이면 빈 화면 표시 (깜빡임 방지)
  if (isRedirecting) {
    return <div className="fixed inset-0 z-50 bg-white" />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <UnifiedLoading onLoadingComplete={handleLoadingComplete} />
    </div>
  );
};

export default Loading;
