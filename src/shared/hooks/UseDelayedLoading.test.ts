import { renderHook, act } from '@testing-library/react';
import { UseDelayedLoading } from './UseDelayedLoading';

describe('UseDelayedLoading hook', () => {
  beforeAll(() => {
    // 타이머를 가짜로 바꿔서 setTimeout을 컨트롤
    jest.useFakeTimers();
  });
  afterAll(() => {
    // 실제 타이머로 복원
    jest.useRealTimers();
  });

  it('초기에는 false이다', () => {
    const { result } = renderHook(() => UseDelayedLoading(true, 500));
    expect(result.current).toBe(false);
  });

  it('delay 시간 지나면 true로 바뀐다', () => {
    const { result } = renderHook(() => UseDelayedLoading(true, 500));

    // 499ms 전까지는 여전히 false
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe(false);

    // 1ms 더 지나면 true
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('loading이 false로 바뀌면 즉시 false로 리셋된다', () => {
    const { result, rerender } = renderHook(
      ({ loading, delay }) => UseDelayedLoading(loading, delay),
      { initialProps: { loading: true, delay: 300 } }
    );

    // 300ms 지나서 true 된 상태
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);

    // loading을 false로 바꿔주면 즉시 false
    rerender({ loading: false, delay: 300 });
    expect(result.current).toBe(false);
  });
});
