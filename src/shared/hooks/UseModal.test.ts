import { renderHook, act } from '@testing-library/react';
import UseModal from './UseModal';

describe('UseModal hook', () => {
  it('초기값이 제공되지 않으면 기본값으로 false를 사용한다', () => {
    const { result } = renderHook(() => UseModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('초기값이 제공되면 해당 값을 사용한다', () => {
    const { result } = renderHook(() => UseModal(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('openModal 함수가 모달을 연다', () => {
    const { result } = renderHook(() => UseModal(false));

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closeModal 함수가 모달을 닫는다', () => {
    const { result } = renderHook(() => UseModal(true));

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggleModal 함수가 모달 상태를 토글한다', () => {
    const { result } = renderHook(() => UseModal(false));

    // false -> true
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(true);

    // true -> false
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('여러 함수를 연속해서 호출할 때 정상적으로 동작한다', () => {
    const { result } = renderHook(() => UseModal(false));

    // 열기
    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    // 토글 (열린 상태에서 닫기)
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);

    // 다시 열기
    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    // 닫기
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('이미 열린 상태에서 openModal을 호출해도 열린 상태를 유지한다', () => {
    const { result } = renderHook(() => UseModal(true));

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('이미 닫힌 상태에서 closeModal을 호출해도 닫힌 상태를 유지한다', () => {
    const { result } = renderHook(() => UseModal(false));

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
