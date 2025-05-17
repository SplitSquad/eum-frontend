import { useEffect, RefObject } from 'react';

/**
 * useFocusManagement
 * - 컨테이너 내부에서 탭 키 순환(& Shift+Tab) 시 포커스가 벗어나지 않도록 관리
 * @param containerRef 포커스 트랩을 적용할 컨테이너의 RefObject
 */
const UseFocusManagement = (containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',');

    const focusableEls = Array.from(container.querySelectorAll<HTMLElement>(selectors));
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusableEls.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
};

export default UseFocusManagement;
