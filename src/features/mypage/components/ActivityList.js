import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 활동 목록을 표시하는 공통 컴포넌트
 * 로딩 상태, 에러 상태, 빈 상태를 처리합니다.
 */
const ActivityList = ({ title, emptyMessage, isLoading, error, isEmpty, children }) => {
    return (_jsxs("div", { className: "border rounded-lg overflow-hidden mb-8", children: [_jsx("div", { className: "bg-gray-50 border-b px-4 py-3", children: _jsx("h3", { className: "font-medium text-gray-800", children: title }) }), _jsxs("div", { className: "p-4", children: [isLoading && (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }) })), error && !isLoading && (_jsxs("div", { className: "text-center py-8 text-red-500", children: [_jsx("p", { children: error }), _jsx("button", { className: "mt-2 text-primary-500 hover:underline", children: "\uB2E4\uC2DC \uC2DC\uB3C4" })] })), isEmpty && !isLoading && !error && (_jsx("div", { className: "text-center py-12 text-gray-500", children: _jsx("p", { children: emptyMessage }) })), !isEmpty && !isLoading && !error && children] })] }));
};
export default ActivityList;
