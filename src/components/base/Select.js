import { jsx as _jsx } from "react/jsx-runtime";
import MuiSelect from '@mui/material/Select';
function Select(props) {
    return (_jsx(MuiSelect, { variant: "outlined", className: "\n        rounded-md bg-white !border-gray-300\n        focus:!border-[#64b5f6] focus:!ring-[#64b5f6]/30\n        px-4 py-2 text-gray-800\n        disabled:!bg-gray-100 disabled:!text-gray-400\n        transition-all\n      ", ...props }));
}
export default Select;
