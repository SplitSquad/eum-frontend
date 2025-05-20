import { jsx as _jsx } from "react/jsx-runtime";
function Container({ children, className = '', as = 'div' }) {
    const Element = as;
    const CustomClassName = `
        max-w-7xl 
        w-full 
        mx-auto 
        px-4 sm:px-6 md:px-8 
        py-6
        bg-white/80 
        backdrop-blur-sm 
        shadow-md 
        rounded-xl 
        transition-all 
        ${className}
      `;
    return _jsx(Element, { className: CustomClassName, children: children });
}
export default Container;
