import React from 'react';

type Props = {
  page: number;
  isActive: boolean;
  onClick: (page: number) => void;
};

const PaginationButton = ({ page, isActive, onClick }: Props) => {
  const baseStyle =
    'flex items-center justify-center rounded-full border transition-all duration-150 ease-in-out';
  const sizeStyle = 'w-8 h-8 md:w-10 md:h-10';
  const activeStyle =
    'bg-primary text-black font-bold text-base scale-110 border-primary shadow-md';
  const inactiveStyle = 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 text-sm';

  const buttonClass = `${baseStyle} ${sizeStyle} ${isActive ? activeStyle : inactiveStyle}`;

  return (
    <button onClick={() => onClick(page)} className={buttonClass}>
      {page}
    </button>
  );
};

export default PaginationButton;
