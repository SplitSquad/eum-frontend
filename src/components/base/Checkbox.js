import { jsx as _jsx } from "react/jsx-runtime";
import MuiCheckbox from '@mui/material/Checkbox';
function Checkbox(props) {
    return (_jsx(MuiCheckbox, { color: "primary", className: "!text-[#64b5f6] disabled:!text-gray-400", ...props }));
}
export default Checkbox;
