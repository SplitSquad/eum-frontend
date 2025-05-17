import React, { JSX } from 'react';

type Props = {
  children: React.ReactNode;
  direction?: string;
  justify?: string;
  align?: string;
  gap?: string; // ex: 'gap-4', 'gap-x-6'
  wrap?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const Flex = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = '',
  wrap = false,
  className = '',
  as = 'div',
}: Props) => {
  const Element = as;

  const baseClass = [
    'flex',
    `flex-${direction}`,
    `justify-${justify}`,
    `items-${align}`,
    wrap ? 'flex-wrap' : '',
    gap,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Element className={baseClass}>{children}</Element>;
};

export default Flex;
