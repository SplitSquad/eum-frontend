import { renderHook } from '@testing-library/react';
import UseFocusManagement from './UseFocusManagement';

describe('UseFocusManagement hook', () => {
  let containerRef: React.RefObject<HTMLDivElement>;
  let container: HTMLDivElement;

  beforeEach(() => {
    containerRef = { current: document.createElement('div') };
    container = containerRef.current;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('포커스 가능한 요소가 없을 때 Tab 키를 막는다', () => {
    renderHook(() => UseFocusManagement(containerRef));

    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    container.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('Tab 키를 누르면 첫 번째 요소에서 마지막 요소로 포커스가 이동한다', () => {
    // 포커스 가능한 요소들 추가
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.appendChild(button1);
    container.appendChild(button2);

    renderHook(() => UseFocusManagement(containerRef));

    // 첫 번째 버튼에 포커스
    button1.focus();
    expect(document.activeElement).toStrictEqual(button1);

    // Tab 키 이벤트 발생
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    container.dispatchEvent(event);

    // 포커스가 두 번째 버튼으로 이동
    expect(document.activeElement).toStrictEqual(button2);
  });

  it('Shift+Tab 키를 누르면 마지막 요소에서 첫 번째 요소로 포커스가 이동한다', () => {
    // 포커스 가능한 요소들 추가
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.appendChild(button1);
    container.appendChild(button2);

    renderHook(() => UseFocusManagement(containerRef));

    // 마지막 버튼에 포커스
    button2.focus();
    expect(document.activeElement).toStrictEqual(button2);

    // Shift+Tab 키 이벤트 발생
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    container.dispatchEvent(event);

    // 포커스가 첫 번째 버튼으로 이동
    expect(document.activeElement).toStrictEqual(button1);
  });

  it('컨테이너가 없을 때는 이벤트 리스너를 추가하지 않는다', () => {
    const emptyRef = { current: document.createElement('div') };
    emptyRef.current.remove();
    renderHook(() => UseFocusManagement(emptyRef));

    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    container.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
