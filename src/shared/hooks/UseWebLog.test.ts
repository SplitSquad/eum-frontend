import { renderHook } from '@testing-library/react';
import UseWeblog from './UseWebLog';
import { SendLog } from '../../services/tracking/SendLog';

// SendLog 모듈 모킹
jest.mock('../../services/tracking/SendLog', () => ({
  SendLog: jest.fn(),
}));

describe('UseWeblog hook', () => {
  const mockPathname = '/test-path';
  const mockSendLog = SendLog as jest.Mock;

  beforeEach(() => {
    // window.location.pathname 모킹
    Object.defineProperty(window, 'location', {
      value: { pathname: mockPathname },
      writable: true,
    });
    // SendLog 호출 기록 초기화
    mockSendLog.mockClear();
  });

  it('기본값(true)으로 호출하면 페이지 뷰 로그를 전송한다', () => {
    renderHook(() => UseWeblog());

    expect(mockSendLog).toHaveBeenCalledTimes(1);
    expect(mockSendLog).toHaveBeenCalledWith({
      event: 'page_view',
      path: mockPathname,
      timestamp: expect.any(String),
    });
  });

  it('logPageView가 false이면 로그를 전송하지 않는다', () => {
    renderHook(() => UseWeblog(false));

    expect(mockSendLog).not.toHaveBeenCalled();
  });

  it('SendLog 함수가 올바른 파라미터로 호출된다', () => {
    renderHook(() => UseWeblog());

    const call = mockSendLog.mock.calls[0][0];
    expect(call).toMatchObject({
      event: 'page_view',
      path: mockPathname,
    });
    // timestamp가 ISO 형식인지 확인
    expect(new Date(call.timestamp).toISOString()).toBe(call.timestamp);
  });

  it('컴포넌트 리렌더링 시에는 로그가 다시 전송되지 않는다', () => {
    const { rerender } = renderHook(() => UseWeblog());

    // 초기 호출 확인
    expect(mockSendLog).toHaveBeenCalledTimes(1);

    // 리렌더링
    rerender();

    // 추가 호출이 없어야 함
    expect(mockSendLog).toHaveBeenCalledTimes(1);
  });

  it('logPageView가 변경될 때만 로그가 다시 전송된다', () => {
    const { rerender } = renderHook(({ logPageView }) => UseWeblog(logPageView), {
      initialProps: { logPageView: false },
    });

    // 초기에는 호출되지 않음
    expect(mockSendLog).not.toHaveBeenCalled();

    // true로 변경
    rerender({ logPageView: true });

    // 로그 전송됨
    expect(mockSendLog).toHaveBeenCalledTimes(1);

    // 다시 false로 변경
    rerender({ logPageView: false });

    // 추가 호출 없음
    expect(mockSendLog).toHaveBeenCalledTimes(1);
  });
});
