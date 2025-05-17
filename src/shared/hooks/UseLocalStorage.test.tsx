import { renderHook, act } from '@testing-library/react';
import { UseLocalStorage } from './UseLocalStorage';

describe('UseLocalStorage hook', () => {
  const mockKey = 'test-key';
  const mockInitialValue = { name: 'test' };
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockStorage[key]),
        setItem: jest.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        clear: jest.fn(() => {
          mockStorage = {};
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('초기값이 정상적으로 설정된다', () => {
    const { result } = renderHook(() => UseLocalStorage(mockKey, mockInitialValue));
    expect(result.current[0]).toEqual(mockInitialValue);
  });

  it('로컬 스토리지에 값이 저장된다', () => {
    const { result } = renderHook(() => UseLocalStorage(mockKey, mockInitialValue));
    const newValue = { name: 'new-test' };

    act(() => {
      result.current[1](newValue);
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(mockKey, JSON.stringify(newValue));
    expect(result.current[0]).toEqual(newValue);
  });

  it('로컬 스토리지에서 값을 불러온다', () => {
    const storedValue = { name: 'stored-test' };
    window.localStorage.setItem(mockKey, JSON.stringify(storedValue));

    const { result } = renderHook(() => UseLocalStorage(mockKey, mockInitialValue));
    expect(result.current[0]).toEqual(storedValue);
  });

  it('JSON 파싱 에러가 발생하면 초기값을 반환한다', () => {
    window.localStorage.setItem(mockKey, 'invalid-json');

    const { result } = renderHook(() => UseLocalStorage(mockKey, mockInitialValue));
    expect(result.current[0]).toEqual(mockInitialValue);
  });

  it('로컬 스토리지 저장 실패 시 에러 처리가 된다', () => {
    const mockSetItem = jest.fn().mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        ...window.localStorage,
        setItem: mockSetItem,
      },
      writable: true,
    });

    const { result } = renderHook(() => UseLocalStorage(mockKey, mockInitialValue));
    const newValue = { name: 'new-test' };

    expect(() => {
      act(() => {
        result.current[1](newValue);
      });
    }).not.toThrow();

    expect(result.current[0]).toEqual(newValue);
  });
});
