import { renderHook } from '@testing-library/react';
import { UseDeviceDetect } from './UseDeviceDetect';

describe('UseDeviceDetect hook', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    // 테스트 후 원래 userAgent로 복원
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });

  it('모바일 디바이스일 때 isMobile은 true, isDesktop은 false를 반환한다', () => {
    // 모바일 userAgent로 설정
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      configurable: true,
    });

    const { result } = renderHook(() => UseDeviceDetect());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('데스크톱 디바이스일 때 isMobile은 false, isDesktop은 true를 반환한다', () => {
    // 데스크톱 userAgent로 설정
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });

    const { result } = renderHook(() => UseDeviceDetect());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });
});
