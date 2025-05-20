import { jsx as _jsx } from "react/jsx-runtime";
const NotificationList = ({ items }) => {
    if (items.length === 0) {
        return _jsx("p", { className: "text-sm text-gray-500", children: "\uC0C8\uB85C\uC6B4 \uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." });
    }
    return (_jsx("ul", { className: "space-y-3", children: items.map(item => (_jsx("li", { className: "flex items-start gap-2 text-sm text-gray-700", children: _jsx("span", { children: item.content }) }, item.id))) }));
};
export default NotificationList;
