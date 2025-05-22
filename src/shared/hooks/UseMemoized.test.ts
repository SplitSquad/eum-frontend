import { renderHook } from '@testing-library/react';
import UseMemoized from './UseMemoized';

describe('UseMemoized hook', () => {
  it('함수 참조가 안정적으로 유지된다', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        const callback = () => value;
        return UseMemoized(callback);
      },
      { initialProps: { value: 1 } }
    );

    const firstCallback = result.current;

    // props가 변경되어도
    rerender({ value: 2 });
    const secondCallback = result.current;

    // 동일한 함수 참조를 유지
    expect(secondCallback).toBe(firstCallback);
  });

  it('항상 최신 함수가 실행된다', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        const callback = () => value;
        return UseMemoized(callback);
      },
      { initialProps: { value: 1 } }
    );

    // 초기값 확인
    expect(result.current()).toBe(1);

    // props 변경
    rerender({ value: 2 });

    // 변경된 값으로 실행됨
    expect(result.current()).toBe(2);
  });

  it('함수 인자가 올바르게 전달된다', () => {
    const { result } = renderHook(() => {
      const callback = (a: number, b: number) => a + b;
      return UseMemoized(callback);
    });

    expect(result.current(1, 2)).toBe(3);
    expect(result.current(10, 20)).toBe(30);
  });

  it('함수 반환값이 올바르다', () => {
    const { result } = renderHook(() => {
      const callback = (str: string) => str.toUpperCase();
      return UseMemoized(callback);
    });

    expect(result.current('hello')).toBe('HELLO');
    expect(result.current('world')).toBe('WORLD');
  });

  it('비동기 함수도 정상적으로 동작한다', async () => {
    const { result } = renderHook(() => {
      const callback = async (value: number) => {
        return value * 2;
      };
      return UseMemoized(callback);
    });

    await expect(result.current(5)).resolves.toBe(10);
    await expect(result.current(10)).resolves.toBe(20);
  });
});
