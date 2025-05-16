import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  disableAnimation?: boolean;
  enableClick?: boolean;
};

function PageWrapper({
  children,
  title = '',
  subtitle = '',
  className = '',
  disableAnimation = false,
  enableClick = false,
}: Props) {
  const navigate = useNavigate();

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  const customClassName = `min-h-[calc(100vh-4rem)] 
            px-4 py-6 
            bg-[radial-gradient(circle_at_center,white_0%,#f9f4eb_80%,#f2ede6_100%)] 
            ${className}`;

  const clickHandler = () => {
    if (enableClick) {
      navigate(-1);
    }
  };

  return (
    <>
      <motion.div
        initial={disableAnimation ? false : 'initial'}
        animate={disableAnimation ? false : 'animate'}
        exit={disableAnimation ? undefined : 'exit'}
        variants={variants}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={customClassName}
        onClick={clickHandler}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </>
  );
}

export default PageWrapper;
