import React from 'react';
import MuiBadge, { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';

function Badge(props: MuiBadgeProps) {
  return (
    <MuiBadge
      {...props}
      classes={{
        badge:
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#64b5f6]/20 text-[#1976d2]',
      }}
    />
  );
}

export default Badge;
