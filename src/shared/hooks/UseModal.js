import { useState } from 'react';
/**
 * useModal 커스텀 훅
 * - 모달의 열림/닫힘 상태를 관리
 * - 초기 상태를 설정할 수 있음
 *
 * @param {boolean} initialValue - 모달의 초기 상태 (기본 false)
 * @returns { isOpen, openModal, closeModal, toggleModal }
 */
const UseModal = (initialValue = false) => {
    // 1. useState를 사용해서 모달의 현재 상태를 관리
    // setIsOpen: 상태를 변경하기 위한 함수
    const [isOpen, setIsOpen] = useState(initialValue);
    // 2. openModal 함수: 모달을 열기 위해 isOpen을 true로 설정
    const openModal = () => setIsOpen(true);
    // 3. closeModal 함수: 모달을 닫기 위해 isOpen을 false로 설정
    const closeModal = () => setIsOpen(false);
    // 4. toggleModal 함수 (선택 사항): 현재 상태에 따라 모달을 열거나 닫음
    const toggleModal = () => setIsOpen(prev => !prev);
    // 5. 현재 상태(isOpen)와 상태를 변경할 수 있는 함수들을 반환
    return { isOpen, openModal, closeModal, toggleModal };
};
export default UseModal;
