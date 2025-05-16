import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { isNodeSelection } from '@tiptap/react';
// --- Hooks ---
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { ChevronDownIcon } from '@tiptap-editor/components/tiptap-icons/chevron-down-icon';
import { HeadingIcon } from '@tiptap-editor/components/tiptap-icons/heading-icon';
// --- Lib ---
import { isNodeInSchema } from '@tiptap-editor/lib/tiptap-utils';
// --- Tiptap UI ---
import { HeadingButton, headingIcons, getFormattedHeadingName, } from '@tiptap-editor/components/tiptap-ui/heading-button/heading-button';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, } from '@tiptap-editor/components/tiptap-ui-primitive/dropdown-menu';
export function HeadingDropdownMenu({ editor: providedEditor, levels = [1, 2, 3, 4, 5, 6], hideWhenUnavailable = false, onOpenChange, ...props }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const editor = useTiptapEditor(providedEditor);
    const headingInSchema = isNodeInSchema('heading', editor);
    const handleOnOpenChange = React.useCallback((open) => {
        setIsOpen(open);
        onOpenChange?.(open);
    }, [onOpenChange]);
    const getActiveIcon = React.useCallback(() => {
        if (!editor)
            return _jsx(HeadingIcon, { className: "tiptap-button-icon" });
        const activeLevel = levels.find(level => editor.isActive('heading', { level }));
        if (!activeLevel)
            return _jsx(HeadingIcon, { className: "tiptap-button-icon" });
        const ActiveIcon = headingIcons[activeLevel];
        return _jsx(ActiveIcon, { className: "tiptap-button-icon" });
    }, [editor, levels]);
    const canToggleAnyHeading = React.useCallback(() => {
        if (!editor)
            return false;
        return levels.some(level => editor.can().toggleNode('heading', 'paragraph', { level }));
    }, [editor, levels]);
    const isDisabled = !canToggleAnyHeading();
    const isAnyHeadingActive = editor?.isActive('heading') ?? false;
    const show = React.useMemo(() => {
        if (!headingInSchema) {
            return false;
        }
        if (hideWhenUnavailable) {
            if (isNodeSelection(editor?.state.selection)) {
                return false;
            }
        }
        return true;
    }, [headingInSchema, hideWhenUnavailable, editor]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (_jsxs(DropdownMenu, { open: isOpen, onOpenChange: handleOnOpenChange, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { type: "button", disabled: isDisabled, "data-style": "ghost", "data-active-state": isAnyHeadingActive ? 'on' : 'off', "data-disabled": isDisabled, role: "button", tabIndex: -1, "aria-label": "Format text as heading", "aria-pressed": isAnyHeadingActive, tooltip: "Heading", ...props, children: [getActiveIcon(), _jsx(ChevronDownIcon, { className: "tiptap-button-dropdown-small" })] }) }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuGroup, { children: levels.map(level => (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(HeadingButton, { editor: editor, level: level, text: getFormattedHeadingName(level), tooltip: '' }) }, `heading-${level}`))) }) })] }));
}
export default HeadingDropdownMenu;
