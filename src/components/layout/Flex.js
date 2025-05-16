import { jsx as _jsx } from "react/jsx-runtime";
const Flex = ({ children, direction = 'row', justify = 'start', align = 'start', gap = '', wrap = false, className = '', as = 'div', }) => {
    const Element = as;
    const baseClass = [
        'flex',
        `flex-${direction}`,
        `justify-${justify}`,
        `items-${align}`,
        wrap ? 'flex-wrap' : '',
        gap,
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return _jsx(Element, { className: baseClass, children: children });
};
export default Flex;
