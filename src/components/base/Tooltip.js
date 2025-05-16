import { jsx as _jsx } from "react/jsx-runtime";
import MuiTooltip from '@mui/material/Tooltip';
function Tooltip({ children, ...props }) {
    return (_jsx(MuiTooltip, { ...props, classes: {
            popper: 'z-50',
            tooltip: 'bg-[#444] text-white text-sm px-3 py-1 rounded shadow-md border border-[#64b5f6]/30',
        }, children: children }));
}
export default Tooltip;
