import { useLocation } from 'react-router-dom';
import useAuthStore from '@/features/auth/store/authStore';

/**
 * Custom hook to control header and modal visibility based on route and auth state.
 */
export function useLayoutVisibility() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const path = location.pathname;

  // Header: hide on /init and /onboarding/*
  const isHeaderVisible = !(path === '/init' || path.startsWith('/onboarding'));

  // Modal: hide on /onboarding/*, /assistant, and if not authenticated
  const isModalVisible =
    isAuthenticated && !path.startsWith('/onboarding') && path !== '/assistant';

  return { isHeaderVisible, isModalVisible };
}

export default useLayoutVisibility;
