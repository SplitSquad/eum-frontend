import { useCallback } from 'react';

/**
 * useScrollToTop
 * - Returns a function that scrolls window to top with smooth behavior.
 */
export function useScrollToTop(): () => void {
  return useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
}
