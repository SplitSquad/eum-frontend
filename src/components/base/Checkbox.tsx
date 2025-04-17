import React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

function Checkbox(props: MuiCheckboxProps) {
  return (
    <MuiCheckbox color="primary" className="!text-[#64b5f6] disabled:!text-gray-400" {...props} />
  );
}

export default Checkbox;
