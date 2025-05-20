import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/shared/store/UserStore';
import useAuthStore from '@/features/auth/store/authStore';
import './Footer.css';
function Footer() {
    const navigate = useNavigate();
    const setRegion = useUserStore(state => state.setUserProfile);
    const { isAuthenticated, handleLogout } = useAuthStore();
    const handleAuthClick = () => {
        if (isAuthenticated) {
            handleLogout();
        }
        else {
            navigate('/google-login');
        }
    };
    return (_jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer-container", children: [_jsx("p", { className: "footer-copyright", children: "\u00A9 EUM" }), _jsx("div", { className: "footer-buttons" })] }) }));
}
export default Footer;
