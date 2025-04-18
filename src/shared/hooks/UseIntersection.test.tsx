import { renderHook, act } from '@testing-library/react';
import { RefObject } from 'react';
import UseIntersection from './UseIntersection';

describe('UseIntersection hook', () => {
  let mockObserverCallback: (entries: IntersectionObserverEntry[]) => void;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    mockObserverCallback = () => {};
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    // IntersectionObserver 모의 구현
    (global as any).IntersectionObserver = jest.fn(callback => {
      mockObserverCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ref가 없을 때는 observer를 생성하지 않는다', () => {
    const ref = { current: null } as unknown as RefObject<Element>;
    renderHook(() => UseIntersection(ref));
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('ref가 있을 때 observer를 생성하고 관찰을 시작한다', () => {
    const element = document.createElement('div');
    const ref = { current: element } as RefObject<Element>;
    renderHook(() => UseIntersection(ref));

    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('options를 전달하면 observer 생성 시 사용된다', () => {
    const element = document.createElement('div');
    const ref = { current: element } as RefObject<Element>;
    const options = { threshold: 0.5 };

    renderHook(() => UseIntersection(ref, options));
    expect(global.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options);
  });

  it('요소가 화면에 나타나면 isIntersecting이 true가 된다', () => {
    const element = document.createElement('div');
    const ref = { current: element } as RefObject<Element>;
    const { result } = renderHook(() => UseIntersection(ref));

    expect(result.current).toBe(false);

    // 요소가 화면에 나타남을 시뮬레이션
    act(() => {
      mockObserverCallback([
        {
          isIntersecting: true,
          target: element,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ]);
    });

    expect(result.current).toBe(true);
  });

  it('언마운트 시 observer를 정리한다', () => {
    const element = document.createElement('div');
    const ref = { current: element } as RefObject<Element>;
    const { unmount } = renderHook(() => UseIntersection(ref));

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
