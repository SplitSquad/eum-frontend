'use client';

import React, { useRef } from 'react';
import { useModalStore } from '@/shared/store/ModalStore';

/**
 * PageModalTrigger 컴포넌트
 * - 버튼 클릭 시 ModalStore를 통해 모달을 열고,
 *   버튼 위치에 맞춰 모달 위치를 계산하여 전달
 */
export default function Modal() {
  // 버튼 DOM 레퍼런스 (모달 위치 계산용)
  const btnRef = useRef<HTMLButtonElement>(null);
  // Zustand ModalStore에서 모달 열기/닫기 함수와 상태 가져오기
  const { openModal, closeModal, isModalOpen } = useModalStore();

  /**
   * handleOpen
   * - 버튼 기준으로 모달 위치(x, y)를 계산
   * - 화면 오른쪽을 벗어나면 왼쪽으로 위치 조정
   * - 화면 스크롤 오프셋을 고려하여 y 좌표 계산
   * - openModal에 콘텐츠와 위치 전달
   */

  const handleOpen = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const offset = 8; // 버튼과 모달 사이 패딩
    const MODAL_WIDTH = 200; // 모달 예상 너비 (px)
    const scrollY = window.scrollY; // 현재 수직 스크롤 위치

    // 기본 위치: 버튼 오른쪽에 offset만큼 띄움
    let x = rect.right + offset + window.scrollX;
    // 오른쪽 화면 범위를 벗어나면 버튼 왼쪽으로 위치 조정
    if (x + MODAL_WIDTH > document.documentElement.clientWidth) {
      x = rect.left - offset - MODAL_WIDTH + window.scrollX;
    }
    // y 위치: 버튼 상단 기준
    const y = rect.top + scrollY;

    // Zustand openModal 호출: JSX 콘텐츠와 위치 객체 전달
    openModal(
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-bold mb-2">페이지 모달</h3>
        <p>이 모달은 HomePage에서 넘긴 콘텐츠입니다.</p>
        <button onClick={closeModal} className="mt-3 px-3 py-1 bg-red-500 text-white rounded">
          닫기
        </button>
      </div>,
      { x, y }
    );
  };

  return (
    <div className="p-8">
      {/* 모달 열기 버튼: 클릭 시 handleOpen 실행 */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        페이지 모달 열기
      </button>
    </div>
  );
}
