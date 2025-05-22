import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import '@tiptap-editor/components/tiptap-ui-primitive/separator/separator.scss';
export const Separator = React.forwardRef(({ decorative, orientation = 'vertical', className = '', ...divProps }, ref) => {
    const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
    const semanticProps = decorative
        ? { role: 'none' }
        : { 'aria-orientation': ariaOrientation, role: 'separator' };
    return (_jsx("div", { className: `tiptap-separator ${className}`.trim(), "data-orientation": orientation, ...semanticProps, ...divProps, ref: ref }));
});
Separator.displayName = 'Separator';
