import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { isNodeSelection } from '@tiptap/react';
// --- Hooks ---
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { BlockQuoteIcon } from '@tiptap-editor/components/tiptap-icons/block-quote-icon';
import { CodeBlockIcon } from '@tiptap-editor/components/tiptap-icons/code-block-icon';
// --- Lib ---
import { isNodeInSchema } from '@tiptap-editor/lib/tiptap-utils';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
export const nodeIcons = {
    codeBlock: CodeBlockIcon,
    blockquote: BlockQuoteIcon,
};
export const nodeShortcutKeys = {
    codeBlock: 'Ctrl-Alt-c',
    blockquote: 'Ctrl-Shift-b',
};
export const nodeLabels = {
    codeBlock: 'Code Block',
    blockquote: 'Blockquote',
};
export function canToggleNode(editor, type) {
    if (!editor)
        return false;
    try {
        return type === 'codeBlock'
            ? editor.can().toggleNode('codeBlock', 'paragraph')
            : editor.can().toggleWrap('blockquote');
    }
    catch {
        return false;
    }
}
export function isNodeActive(editor, type) {
    if (!editor)
        return false;
    return editor.isActive(type);
}
export function toggleNode(editor, type) {
    if (!editor)
        return false;
    if (type === 'codeBlock') {
        return editor.chain().focus().toggleNode('codeBlock', 'paragraph').run();
    }
    else {
        return editor.chain().focus().toggleWrap('blockquote').run();
    }
}
export function isNodeButtonDisabled(editor, canToggle, userDisabled = false) {
    if (!editor)
        return true;
    if (userDisabled)
        return true;
    if (!canToggle)
        return true;
    return false;
}
export function shouldShowNodeButton(params) {
    const { editor, hideWhenUnavailable, nodeInSchema, canToggle } = params;
    if (!nodeInSchema) {
        return false;
    }
    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) || !canToggle) {
            return false;
        }
    }
    return Boolean(editor?.isEditable);
}
export function formatNodeName(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
export function useNodeState(editor, type, disabled = false, hideWhenUnavailable = false) {
    const nodeInSchema = isNodeInSchema(type, editor);
    const canToggle = canToggleNode(editor, type);
    const isDisabled = isNodeButtonDisabled(editor, canToggle, disabled);
    const isActive = isNodeActive(editor, type);
    const shouldShow = React.useMemo(() => shouldShowNodeButton({
        editor,
        type,
        hideWhenUnavailable,
        nodeInSchema,
        canToggle,
    }), [editor, type, hideWhenUnavailable, nodeInSchema, canToggle]);
    const handleToggle = React.useCallback(() => {
        if (!isDisabled && editor) {
            return toggleNode(editor, type);
        }
        return false;
    }, [editor, type, isDisabled]);
    const Icon = nodeIcons[type];
    const shortcutKey = nodeShortcutKeys[type];
    const label = nodeLabels[type];
    return {
        nodeInSchema,
        canToggle,
        isDisabled,
        isActive,
        shouldShow,
        handleToggle,
        Icon,
        shortcutKey,
        label,
    };
}
export const NodeButton = React.forwardRef(({ editor: providedEditor, type, text, hideWhenUnavailable = false, className = '', disabled, onClick, children, ...buttonProps }, ref) => {
    const editor = useTiptapEditor(providedEditor);
    const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } = useNodeState(editor, type, disabled, hideWhenUnavailable);
    const handleClick = React.useCallback((e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !isDisabled) {
            handleToggle();
        }
    }, [onClick, isDisabled, handleToggle]);
    if (!shouldShow || !editor || !editor.isEditable) {
        return null;
    }
    return (_jsx(Button, { type: "button", className: className.trim(), disabled: isDisabled, "data-style": "ghost", "data-active-state": isActive ? 'on' : 'off', "data-disabled": isDisabled, role: "button", tabIndex: -1, "aria-label": type, "aria-pressed": isActive, tooltip: label, shortcutKeys: shortcutKey, onClick: handleClick, ...buttonProps, ref: ref, children: children || (_jsxs(_Fragment, { children: [_jsx(Icon, { className: "tiptap-button-icon" }), text && _jsx("span", { className: "tiptap-button-text", children: text })] })) }));
});
NodeButton.displayName = 'NodeButton';
export default NodeButton;
