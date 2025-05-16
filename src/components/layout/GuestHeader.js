import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
/*notification 호출 여기서 추후 api 추가*/
function GuestHeader() {
    const navigate = useNavigate();
    const loginHandler = () => {
        alert('구글 소셜 로그인 호출 했다 칩시다.');
    };
    const registerHandler = () => {
        navigate('/onboarding');
    };
    return (_jsx(_Fragment, { children: _jsxs("header", { className: "w-full h-16 bg-white shadow-sm border-b border-gray-100 z-50", children: ["\uB85C\uADF8\uC778 \uC548\uD568", _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: loginHandler, className: "text-sm text-blue-600 hover:underline transition", children: "\uB85C\uADF8\uC778" }), _jsx("button", { onClick: registerHandler, className: "text-sm text-gray-500 hover:underline transition", children: "\uD68C\uC6D0\uAC00\uC785" })] })] }) }));
}
export default GuestHeader;
