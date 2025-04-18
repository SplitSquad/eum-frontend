import React from 'react';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';

function Select(props: MuiSelectProps) {
  return (
    <MuiSelect
      variant="outlined"
      className="
        rounded-md bg-white !border-gray-300
        focus:!border-[#64b5f6] focus:!ring-[#64b5f6]/30
        px-4 py-2 text-gray-800
        disabled:!bg-gray-100 disabled:!text-gray-400
        transition-all
      "
      {...props}
    />
  );
}

export default Select;
