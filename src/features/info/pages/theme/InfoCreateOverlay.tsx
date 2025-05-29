import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pageTurnIn = keyframes`
  from {
    transform: perspective(1200px) rotateY(-80deg) scale(0.95);
    opacity: 0.2;
  }
  to {
    transform: perspective(1200px) rotateY(0deg) scale(1);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 1200;
  animation: ${overlayFadeIn} 0.3s;
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 50vw;
  max-width: 640px;
  height: auto;
  background: rgba(0, 0, 0, 0.18);
  z-index: 1201;
  display: flex;
  align-items: stretch;
  animation: ${pageTurnIn} 0.55s cubic-bezier(0.7, 0, 0.3, 1);
  transform-origin: right center;
  will-change: transform, opacity;
`;

export default function InfoCreateOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  return (
    <>
      <Overlay onClick={onClose} />
      <Panel onClick={e => e.stopPropagation()}>{children}</Panel>
    </>
  );
}
