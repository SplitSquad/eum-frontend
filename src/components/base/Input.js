import { jsx as _jsx } from "react/jsx-runtime";
import TextField from '@mui/material/TextField';
function Input(props) {
    return (_jsx(TextField, { variant: "outlined", fullWidth: true, InputProps: {
            className: `
          rounded-md bg-white
          !border-gray-300
          focus:!border-[#64b5f6] focus:!ring-[#64b5f6]/30
          px-4 py-2 text-gray-800 placeholder:text-gray-400
          disabled:!bg-gray-100 disabled:!text-gray-400
          transition-all
        `,
        }, ...props }));
}
export default Input;
