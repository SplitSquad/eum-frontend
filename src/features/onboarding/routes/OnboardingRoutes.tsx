import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingGuard } from '../../../routes/guards';
import Loading from '../../../pages/Loading';

// 온보딩 페이지 지연 로딩
const PurposeSelection = lazy(() => import('../pages/PurposeSelection'));
const StudyProfile = lazy(() => import('../pages/StudyProfile'));
const TravelProfile = lazy(() => import('../pages/TravelProfile'));
const JobProfile = lazy(() => import('../pages/JobProfile'));
const LivingProfile = lazy(() => import('../pages/LivingProfile'));

/**
 * 로딩 화면
 */
const LoadingFallback = () => <Loading />;

/**
 * 온보딩 경로 라우팅 컴포넌트
 * 로그인된 사용자에게만 표시됩니다.
 */
const OnboardingRoutes: React.FC = () => {
  return (
    <OnboardingGuard>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 목적 선택 페이지 */}
          <Route path="/" element={<PurposeSelection />} />
          
          {/* 유학 프로필 페이지 */}
          <Route path="/study" element={<StudyProfile />} />
          
          {/* 여행 프로필 페이지 */}
          <Route path="/travel" element={<TravelProfile />} />
          
          {/* 취업 프로필 페이지 */}
          <Route path="/job" element={<JobProfile />} />
          
          {/* 거주 프로필 페이지 */}
          <Route path="/living" element={<LivingProfile />} />
          
          {/* 알 수 없는 경로는 목적 선택 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Suspense>
    </OnboardingGuard>
  );
};

export default OnboardingRoutes; 