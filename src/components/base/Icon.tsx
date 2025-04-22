import React from 'react';

interface IconProps {
  children: React.ReactNode;
}

function Icon({ children }: IconProps) {
  return <span className="w-5 h-5 text-[#64b5f6]">{children}</span>;
}
export default Icon;
