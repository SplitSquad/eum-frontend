import React from 'react';
import Button from '@/components/base/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ✕ 닫기 버튼 */}
        <Button
          variant="exit"
          size="lg"
          onClick={onClose}
          className="absolute top-2 right-2"
          aria-label="모달 닫기"
        >
          x
        </Button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
