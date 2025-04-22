import React, { JSX } from 'react';

type Props = {
  children: React.ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string;
  wrap?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = '',
  wrap = false,
  className = '',
  as = 'div',
}: Props) {
  const Element = as;

  const base = `flex flex-${direction}`;
  const justifyClass = `justify-${justify}`;
  const alignClass = `items-${align}`;
  const wrapClass = wrap ? 'flex-wrap' : '';

  return (
    <Element className={`${base} ${justifyClass} ${alignClass} ${gap} ${wrapClass} ${className}`}>
      {children}
    </Element>
  );
}

export default Flex;
