import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { isNodeSelection } from '@tiptap/react';
// --- Hooks ---
import { useMenuNavigation } from '@tiptap-editor/hooks/use-menu-navigation';
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { BanIcon } from '@tiptap-editor/components/tiptap-icons/ban-icon';
import { HighlighterIcon } from '@tiptap-editor/components/tiptap-icons/highlighter-icon';
// --- Lib ---
import { isMarkInSchema } from '@tiptap-editor/lib/tiptap-utils';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
import { Popover, PopoverTrigger, PopoverContent, } from '@tiptap-editor/components/tiptap-ui-primitive/popover';
import { Separator } from '@tiptap-editor/components/tiptap-ui-primitive/separator';
// --- Styles ---
import '@tiptap-editor/components/tiptap-ui/highlight-popover/highlight-popover.scss';
export const DEFAULT_HIGHLIGHT_COLORS = [
    {
        label: 'Green',
        value: 'var(--tt-highlight-green)',
        border: 'var(--tt-highlight-green-contrast)',
    },
    {
        label: 'Blue',
        value: 'var(--tt-highlight-blue)',
        border: 'var(--tt-highlight-blue-contrast)',
    },
    {
        label: 'Red',
        value: 'var(--tt-highlight-red)',
        border: 'var(--tt-highlight-red-contrast)',
    },
    {
        label: 'Purple',
        value: 'var(--tt-highlight-purple)',
        border: 'var(--tt-highlight-purple-contrast)',
    },
    {
        label: 'Yellow',
        value: 'var(--tt-highlight-yellow)',
        border: 'var(--tt-highlight-yellow-contrast)',
    },
];
export const useHighlighter = (editor) => {
    const markAvailable = isMarkInSchema('highlight', editor);
    const getActiveColor = React.useCallback(() => {
        if (!editor)
            return null;
        if (!editor.isActive('highlight'))
            return null;
        const attrs = editor.getAttributes('highlight');
        return attrs.color || null;
    }, [editor]);
    const toggleHighlight = React.useCallback((color) => {
        if (!markAvailable || !editor)
            return;
        if (color === 'none') {
            editor.chain().focus().unsetMark('highlight').run();
        }
        else {
            editor.chain().focus().toggleMark('highlight', { color }).run();
        }
    }, [markAvailable, editor]);
    return {
        markAvailable,
        getActiveColor,
        toggleHighlight,
    };
};
export const HighlighterButton = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx(Button, { type: "button", className: className, "data-style": "ghost", "data-appearance": "default", role: "button", tabIndex: -1, "aria-label": "Highlight text", tooltip: "Highlight", ref: ref, ...props, children: children || _jsx(HighlighterIcon, { className: "tiptap-button-icon" }) }));
});
export function HighlightContent({ editor: providedEditor, colors = DEFAULT_HIGHLIGHT_COLORS, onClose, }) {
    const editor = useTiptapEditor(providedEditor);
    const containerRef = React.useRef(null);
    const { getActiveColor, toggleHighlight } = useHighlighter(editor);
    const activeColor = getActiveColor();
    const menuItems = React.useMemo(() => [...colors, { label: 'Remove highlight', value: 'none' }], [colors]);
    const { selectedIndex } = useMenuNavigation({
        containerRef,
        items: menuItems,
        orientation: 'both',
        onSelect: item => {
            toggleHighlight(item.value);
            onClose?.();
        },
        onClose,
        autoSelectFirstItem: false,
    });
    return (_jsxs("div", { ref: containerRef, className: "tiptap-highlight-content", tabIndex: 0, children: [_jsx("div", { className: "tiptap-button-group", "data-orientation": "horizontal", children: colors.map((color, index) => (_jsx(Button, { type: "button", role: "menuitem", "data-active-state": activeColor === color.value ? 'on' : 'off', "aria-label": `${color.label} highlight color`, tabIndex: index === selectedIndex ? 0 : -1, "data-style": "ghost", onClick: () => toggleHighlight(color.value), "data-highlighted": selectedIndex === index, children: _jsx("span", { className: "tiptap-button-highlight", style: { '--highlight-color': color.value } }) }, color.value))) }), _jsx(Separator, {}), _jsx("div", { className: "tiptap-button-group", children: _jsx(Button, { onClick: () => toggleHighlight('none'), "aria-label": "Remove highlight", tabIndex: selectedIndex === colors.length ? 0 : -1, type: "button", role: "menuitem", "data-style": "ghost", "data-highlighted": selectedIndex === colors.length, children: _jsx(BanIcon, { className: "tiptap-button-icon" }) }) })] }));
}
export function HighlightPopover({ editor: providedEditor, colors = DEFAULT_HIGHLIGHT_COLORS, hideWhenUnavailable = false, ...props }) {
    const editor = useTiptapEditor(providedEditor);
    const { markAvailable } = useHighlighter(editor);
    const [isOpen, setIsOpen] = React.useState(false);
    const isDisabled = React.useMemo(() => {
        if (!markAvailable || !editor) {
            return true;
        }
        return (editor.isActive('code') || editor.isActive('codeBlock') || editor.isActive('imageUpload'));
    }, [markAvailable, editor]);
    const canSetMark = React.useMemo(() => {
        if (!editor || !markAvailable)
            return false;
        try {
            return editor.can().setMark('highlight');
        }
        catch {
            return false;
        }
    }, [editor, markAvailable]);
    const isActive = editor?.isActive('highlight') ?? false;
    const show = React.useMemo(() => {
        if (hideWhenUnavailable) {
            if (isNodeSelection(editor?.state.selection) || !canSetMark) {
                return false;
            }
        }
        return true;
    }, [hideWhenUnavailable, editor, canSetMark]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(HighlighterButton, { disabled: isDisabled, "data-active-state": isActive ? 'on' : 'off', "data-disabled": isDisabled, "aria-pressed": isActive, ...props }) }), _jsx(PopoverContent, { "aria-label": "Highlight colors", children: _jsx(HighlightContent, { editor: editor, colors: colors, onClose: () => setIsOpen(false) }) })] }));
}
HighlighterButton.displayName = 'HighlighterButton';
export default HighlightPopover;
