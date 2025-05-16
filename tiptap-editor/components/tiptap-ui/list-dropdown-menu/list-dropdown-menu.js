import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { isNodeSelection } from '@tiptap/react';
// --- Hooks ---
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { ChevronDownIcon } from '@tiptap-editor/components/tiptap-icons/chevron-down-icon';
import { ListIcon } from '@tiptap-editor/components/tiptap-icons/list-icon';
// --- Lib ---
import { isNodeInSchema } from '@tiptap-editor/lib/tiptap-utils';
// --- Tiptap UI ---
import { ListButton, canToggleList, isListActive, listOptions, } from '@tiptap-editor/components/tiptap-ui/list-button/list-button';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, } from '@tiptap-editor/components/tiptap-ui-primitive/dropdown-menu';
export function canToggleAnyList(editor, listTypes) {
    if (!editor)
        return false;
    return listTypes.some(type => canToggleList(editor, type));
}
export function isAnyListActive(editor, listTypes) {
    if (!editor)
        return false;
    return listTypes.some(type => isListActive(editor, type));
}
export function getFilteredListOptions(availableTypes) {
    return listOptions.filter(option => !option.type || availableTypes.includes(option.type));
}
export function shouldShowListDropdown(params) {
    const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;
    if (!listInSchema) {
        return false;
    }
    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) && !canToggleAny) {
            return false;
        }
    }
    return true;
}
export function useListDropdownState(editor, availableTypes) {
    const [isOpen, setIsOpen] = React.useState(false);
    const listInSchema = availableTypes.some(type => isNodeInSchema(type, editor));
    const filteredLists = React.useMemo(() => getFilteredListOptions(availableTypes), [availableTypes]);
    const canToggleAny = canToggleAnyList(editor, availableTypes);
    const isAnyActive = isAnyListActive(editor, availableTypes);
    const handleOpenChange = React.useCallback((open, callback) => {
        setIsOpen(open);
        callback?.(open);
    }, []);
    return {
        isOpen,
        setIsOpen,
        listInSchema,
        filteredLists,
        canToggleAny,
        isAnyActive,
        handleOpenChange,
    };
}
export function useActiveListIcon(editor, filteredLists) {
    return React.useCallback(() => {
        const activeOption = filteredLists.find(option => isListActive(editor, option.type));
        return activeOption ? (_jsx(activeOption.icon, { className: "tiptap-button-icon" })) : (_jsx(ListIcon, { className: "tiptap-button-icon" }));
    }, [editor, filteredLists]);
}
export function ListDropdownMenu({ editor: providedEditor, types = ['bulletList', 'orderedList', 'taskList'], hideWhenUnavailable = false, onOpenChange, ...props }) {
    const editor = useTiptapEditor(providedEditor);
    const { isOpen, listInSchema, filteredLists, canToggleAny, isAnyActive, handleOpenChange } = useListDropdownState(editor, types);
    const getActiveIcon = useActiveListIcon(editor, filteredLists);
    const show = React.useMemo(() => {
        return shouldShowListDropdown({
            editor,
            listTypes: types,
            hideWhenUnavailable,
            listInSchema,
            canToggleAny,
        });
    }, [editor, types, hideWhenUnavailable, listInSchema, canToggleAny]);
    const handleOnOpenChange = React.useCallback((open) => handleOpenChange(open, onOpenChange), [handleOpenChange, onOpenChange]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (_jsxs(DropdownMenu, { open: isOpen, onOpenChange: handleOnOpenChange, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { type: "button", "data-style": "ghost", "data-active-state": isAnyActive ? 'on' : 'off', role: "button", tabIndex: -1, "aria-label": "List options", tooltip: "List", ...props, children: [getActiveIcon(), _jsx(ChevronDownIcon, { className: "tiptap-button-dropdown-small" })] }) }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuGroup, { children: filteredLists.map(option => (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(ListButton, { editor: editor, type: option.type, text: option.label, hideWhenUnavailable: hideWhenUnavailable, tooltip: '' }) }, option.type))) }) })] }));
}
export default ListDropdownMenu;
