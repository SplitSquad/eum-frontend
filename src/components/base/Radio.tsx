import React from 'react';
import MuiRadio, { RadioProps as MuiRadioProps } from '@mui/material/Radio';

function Radio(props: MuiRadioProps) {
  return (
    <MuiRadio color="primary" className="!text-[#64b5f6] disabled:!text-gray-400" {...props} />
  );
}

export default Radio;
