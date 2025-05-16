import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useFloating, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions, useMergeRefs, FloatingFocusManager, limitShift, FloatingPortal, } from '@floating-ui/react';
import '@tiptap-editor/components/tiptap-ui-primitive/popover/popover.scss';
const PopoverContext = React.createContext(null);
function usePopoverContext() {
    const context = React.useContext(PopoverContext);
    if (!context) {
        throw new Error('Popover components must be wrapped in <Popover />');
    }
    return context;
}
function usePopover({ initialOpen = false, modal, open: controlledOpen, onOpenChange: setControlledOpen, side = 'bottom', align = 'center', } = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const [labelId, setLabelId] = React.useState();
    const [descriptionId, setDescriptionId] = React.useState();
    const [currentPlacement, setCurrentPlacement] = React.useState(`${side}-${align}`);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;
    const middleware = React.useMemo(() => [
        offset(4),
        flip({
            fallbackAxisSideDirection: 'end',
            crossAxis: false,
        }),
        shift({
            limiter: limitShift({ offset: 4 }),
        }),
    ], []);
    const floating = useFloating({
        placement: currentPlacement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware,
    });
    const interactions = useInteractions([
        useClick(floating.context),
        useDismiss(floating.context),
        useRole(floating.context),
    ]);
    const updatePosition = React.useCallback((newSide, newAlign) => {
        setCurrentPlacement(`${newSide}-${newAlign}`);
    }, []);
    return React.useMemo(() => ({
        open,
        setOpen,
        ...interactions,
        ...floating,
        modal,
        labelId,
        descriptionId,
        setLabelId,
        setDescriptionId,
        updatePosition,
    }), [open, setOpen, interactions, floating, modal, labelId, descriptionId, updatePosition]);
}
function Popover({ children, modal = false, ...options }) {
    const popover = usePopover({ modal, ...options });
    return _jsx(PopoverContext.Provider, { value: popover, children: children });
}
const PopoverTrigger = React.forwardRef(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
    const context = usePopoverContext();
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
            'data-state': context.open ? 'open' : 'closed',
        }));
    }
    return (_jsx("button", { ref: ref, "data-state": context.open ? 'open' : 'closed', ...context.getReferenceProps(props), children: children }));
});
const PopoverContent = React.forwardRef(function PopoverContent({ className, side = 'bottom', align = 'center', style, portal = true, portalProps = {}, ...props }, propRef) {
    const context = usePopoverContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);
    React.useEffect(() => {
        context.updatePosition(side, align);
    }, [context, side, align]);
    if (!context.context.open)
        return null;
    const content = (_jsx(FloatingFocusManager, { context: context.context, modal: context.modal, children: _jsx("div", { ref: ref, style: {
                position: context.strategy,
                top: context.y ?? 0,
                left: context.x ?? 0,
                ...style,
            }, "aria-labelledby": context.labelId, "aria-describedby": context.descriptionId, className: `tiptap-popover ${className || ''}`, "data-side": side, "data-align": align, "data-state": context.context.open ? 'open' : 'closed', ...context.getFloatingProps(props), children: props.children }) }));
    if (portal) {
        return _jsx(FloatingPortal, { ...portalProps, children: content });
    }
    return content;
});
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';
export { Popover, PopoverTrigger, PopoverContent };
