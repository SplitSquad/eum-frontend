import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, } from '@tiptap-editor/components/tiptap-ui-primitive/tooltip';
import '@tiptap-editor/components/tiptap-ui-primitive/button/button-colors.scss';
import '@tiptap-editor/components/tiptap-ui-primitive/button/button-group.scss';
import '@tiptap-editor/components/tiptap-ui-primitive/button/button.scss';
export const MAC_SYMBOLS = {
    ctrl: '⌘',
    alt: '⌥',
    shift: '⇧',
};
export const formatShortcutKey = (key, isMac) => {
    if (isMac) {
        const lowerKey = key.toLowerCase();
        return MAC_SYMBOLS[lowerKey] || key.toUpperCase();
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
};
export const parseShortcutKeys = (shortcutKeys, isMac) => {
    if (!shortcutKeys)
        return [];
    return shortcutKeys
        .split('-')
        .map(key => key.trim())
        .map(key => formatShortcutKey(key, isMac));
};
export const ShortcutDisplay = ({ shortcuts }) => {
    if (shortcuts.length === 0)
        return null;
    return (_jsx("div", { children: shortcuts.map((key, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx("kbd", { children: "+" }), _jsx("kbd", { children: key })] }, index))) }));
};
export const Button = React.forwardRef(({ className = '', children, tooltip, showTooltip = true, shortcutKeys, 'aria-label': ariaLabel, ...props }, ref) => {
    const isMac = React.useMemo(() => typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac'), []);
    const shortcuts = React.useMemo(() => parseShortcutKeys(shortcutKeys, isMac), [shortcutKeys, isMac]);
    if (!tooltip || !showTooltip) {
        return (_jsx("button", { className: `tiptap-button ${className}`.trim(), ref: ref, "aria-label": ariaLabel, ...props, children: children }));
    }
    return (_jsxs(Tooltip, { delay: 200, children: [_jsx(TooltipTrigger, { className: `tiptap-button ${className}`.trim(), ref: ref, "aria-label": ariaLabel, ...props, children: children }), _jsxs(TooltipContent, { children: [_jsx("span", { children: tooltip }), _jsx(ShortcutDisplay, { shortcuts: shortcuts })] })] }));
});
Button.displayName = 'Button';
export default Button;
