import React from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

function Tooltip({ children, ...props }: MuiTooltipProps) {
  return (
    <MuiTooltip
      {...props}
      classes={{
        popper: 'z-50',
        tooltip:
          'bg-[#444] text-white text-sm px-3 py-1 rounded shadow-md border border-[#64b5f6]/30',
      }}
    >
      {children}
    </MuiTooltip>
  );
}

export default Tooltip;
