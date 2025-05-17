import React, { JSX } from 'react';

type Props = {
  children: React.ReactNode;
  cols?: string;
  gap?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

function Grid({
  children,
  cols = 'grid-cols-1',
  gap = 'gap-4',
  className = '',
  as = 'div',
}: Props) {
  const Element = as;

  return <Element className={`grid ${cols} ${gap} ${className}`}>{children}</Element>;
}

export default Grid;
