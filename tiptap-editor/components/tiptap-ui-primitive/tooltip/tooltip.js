import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useFloating, autoUpdate, offset, flip, shift, useHover, useFocus, useDismiss, useRole, useInteractions, useMergeRefs, FloatingPortal, FloatingDelayGroup, } from '@floating-ui/react';
import '@tiptap-editor/components/tiptap-ui-primitive/tooltip/tooltip.scss';
function useTooltip({ initialOpen = false, placement = 'top', open: controlledOpen, onOpenChange: setControlledOpen, delay = 600, closeDelay = 0, } = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;
    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({
                crossAxis: placement.includes('-'),
                fallbackAxisSideDirection: 'start',
                padding: 4,
            }),
            shift({ padding: 4 }),
        ],
    });
    const context = data.context;
    const hover = useHover(context, {
        mouseOnly: true,
        move: false,
        restMs: delay,
        enabled: controlledOpen == null,
        delay: {
            close: closeDelay,
        },
    });
    const focus = useFocus(context, {
        enabled: controlledOpen == null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });
    const interactions = useInteractions([hover, focus, dismiss, role]);
    return React.useMemo(() => ({
        open,
        setOpen,
        ...interactions,
        ...data,
    }), [open, setOpen, interactions, data]);
}
const TooltipContext = React.createContext(null);
function useTooltipContext() {
    const context = React.useContext(TooltipContext);
    if (context == null) {
        throw new Error('Tooltip components must be wrapped in <TooltipProvider />');
    }
    return context;
}
export function Tooltip({ children, ...props }) {
    const tooltip = useTooltip(props);
    if (!props.useDelayGroup) {
        return _jsx(TooltipContext.Provider, { value: tooltip, children: children });
    }
    return (_jsx(FloatingDelayGroup, { delay: { open: props.delay ?? 0, close: props.closeDelay ?? 0 }, timeoutMs: props.timeout, children: _jsx(TooltipContext.Provider, { value: tooltip, children: children }) }));
}
export const TooltipTrigger = React.forwardRef(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
    const context = useTooltipContext();
    const childrenRef = React.isValidElement(children)
        ? parseInt(React.version, 10) >= 19
            ? children.props.ref
            : children.ref
        : undefined;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, context.getReferenceProps({
            ref,
            ...props,
            ...children.props,
            'data-tooltip-state': context.open ? 'open' : 'closed',
        }));
    }
    return (_jsx("button", { ref: ref, "data-tooltip-state": context.open ? 'open' : 'closed', ...context.getReferenceProps(props), children: children }));
});
export const TooltipContent = React.forwardRef(function TooltipContent({ style, children, portal = true, portalProps = {}, ...props }, propRef) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);
    if (!context.open)
        return null;
    const content = (_jsx("div", { ref: ref, style: {
            ...context.floatingStyles,
            ...style,
        }, ...context.getFloatingProps(props), className: "tiptap-tooltip", children: children }));
    if (portal) {
        return _jsx(FloatingPortal, { ...portalProps, children: content });
    }
    return content;
});
Tooltip.displayName = 'Tooltip';
TooltipTrigger.displayName = 'TooltipTrigger';
TooltipContent.displayName = 'TooltipContent';
