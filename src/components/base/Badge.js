import { jsx as _jsx } from "react/jsx-runtime";
import MuiBadge from '@mui/material/Badge';
function Badge(props) {
    return (_jsx(MuiBadge, { ...props, classes: {
            badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#64b5f6]/20 text-[#1976d2]',
        } }));
}
export default Badge;
