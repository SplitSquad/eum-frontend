import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CountryStats = ({ countries, totalParticipants, className = '' }) => {
    // 참여자 총인원 계산
    const total = totalParticipants || countries.reduce((sum, country) => sum + country.count, 0);
    // 데이터가 없는 경우 렌더링하지 않음
    if (countries.length === 0) {
        return null;
    }
    // 색상 배열 (차트용)
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-gray-500'
    ];
    return (_jsxs("div", { className: `w-full ${className}`, children: [_jsx("h3", { className: "text-lg font-medium mb-3", children: "\uAD6D\uAC00\uBCC4 \uCC38\uC5EC \uD604\uD669" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("div", { className: "space-y-2", children: countries.map((country, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "w-20 text-sm", children: country.countryName }), _jsx("div", { className: "flex-1 h-5 bg-gray-100 rounded overflow-hidden", children: _jsx("div", { className: `h-full ${colors[index % colors.length]}`, style: { width: `${country.percentage}%` } }) }), _jsxs("span", { className: "ml-2 text-sm w-16 text-right", children: [country.percentage, "% (", country.count, ")"] })] }, country.countryCode))) }) }), _jsxs("div", { className: "w-40 h-40 relative mx-auto md:mx-0", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold", children: total }), _jsx("div", { className: "text-sm text-gray-500", children: "\uCD1D \uCC38\uC5EC\uC790" })] }) }), _jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: [_jsx("circle", { cx: "50", cy: "50", r: "40", fill: "transparent", stroke: "#eee", strokeWidth: "20" }), _jsx("circle", { cx: "50", cy: "50", r: "40", fill: "transparent", stroke: "#3b82f6", strokeWidth: "20", strokeDasharray: `${Math.PI * 80 * 0.7} ${Math.PI * 80 * 0.3}`, strokeDashoffset: "0", transform: "rotate(-90 50 50)" })] })] })] })] }));
};
export default CountryStats;
