import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import useOutsideClick from './UseOutsideClick';

describe('useOutsideClick hook', () => {
  let mockCallback: jest.Mock;
  let mockRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockCallback = jest.fn();
    mockRef = { current: document.createElement('div') };
  });

  it('요소 외부 클릭 시 callback이 호출된다', () => {
    renderHook(() => useOutsideClick(mockRef, mockCallback));

    // 외부 요소 클릭 이벤트 시뮬레이션
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('요소 내부 클릭 시 callback이 호출되지 않는다', () => {
    renderHook(() => useOutsideClick(mockRef, mockCallback));

    // 내부 요소 클릭 이벤트 시뮬레이션
    const event = new MouseEvent('mousedown', { bubbles: true });
    mockRef.current?.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('ref가 null일 때 외부 클릭 시 callback이 호출되지 않는다', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useOutsideClick(ref, mockCallback);
      return ref;
    });

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('컴포넌트 언마운트 시 이벤트 리스너가 제거된다', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useOutsideClick(mockRef, mockCallback));

    // 이벤트 리스너가 추가되었는지 확인
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

    // 컴포넌트 언마운트
    unmount();

    // 이벤트 리스너가 제거되었는지 확인
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('callback이 변경되면 새로운 callback이 사용된다', () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();

    const { rerender } = renderHook(({ callback }) => useOutsideClick(mockRef, callback), {
      initialProps: { callback: firstCallback },
    });

    // 첫 번째 callback으로 이벤트 발생
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);
    expect(firstCallback).toHaveBeenCalledTimes(1);

    // callback 변경
    rerender({ callback: secondCallback });

    // 두 번째 callback으로 이벤트 발생
    document.dispatchEvent(event);
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(firstCallback).toHaveBeenCalledTimes(1); // 첫 번째 callback은 더 이상 호출되지 않음
  });

  it('ref가 변경되면 새로운 ref가 사용된다', () => {
    const firstRef = { current: document.createElement('div') };
    const secondRef = { current: document.createElement('div') };

    const { rerender } = renderHook(({ ref }) => useOutsideClick(ref, mockCallback), {
      initialProps: { ref: firstRef },
    });

    // 첫 번째 ref의 외부 클릭
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // ref 변경
    rerender({ ref: secondRef });

    // 두 번째 ref의 외부 클릭
    document.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
