import React, { useEffect, useRef } from 'react';
import Button from '@/components/base/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorEl?: HTMLElement | null;
};

const Modal = ({ isOpen, onClose, children, anchorEl }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPosition = () => {
    if (!anchorEl) return {};
    const rect = anchorEl.getBoundingClientRect();
    return {
      position: 'absolute' as const,
      top: `${rect.bottom + 10}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end px-4">
      <div
        ref={modalRef}
        className="bg-white/40 backdrop-blur-sm rounded-lg shadow-lg w-[250px] max-w-md max-h-[300px] overflow-y-auto p-6 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={getPosition()}
      >
        <div className="absolute top-4 right-4">
          <Button
            variant="exit"
            size="lg"
            onClick={onClose}
            className="!bg-white !text-gray-600 !border-gray-300 hover:!bg-gray-100 hover:!text-gray-800 hover:!border-gray-400 !p-2 !min-w-0 !w-8 !h-8"
            aria-label="모달 닫기"
          >
            x
          </Button>
        </div>

        <div className="truncate">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
