import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
// --- Hooks ---
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { ImagePlusIcon } from '@tiptap-editor/components/tiptap-icons/image-plus-icon';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
export function isImageActive(editor, extensionName) {
    if (!editor)
        return false;
    return editor.isActive(extensionName);
}
export function insertImage(editor, extensionName) {
    if (!editor)
        return false;
    return editor
        .chain()
        .focus()
        .insertContent({
        type: extensionName,
    })
        .run();
}
export function useImageUploadButton(editor, extensionName = 'imageUpload', disabled = false) {
    const isActive = isImageActive(editor, extensionName);
    const handleInsertImage = React.useCallback(() => {
        if (disabled)
            return false;
        return insertImage(editor, extensionName);
    }, [editor, extensionName, disabled]);
    return {
        isActive,
        handleInsertImage,
    };
}
export const ImageUploadButton = React.forwardRef(({ editor: providedEditor, extensionName = 'imageUpload', text, className = '', disabled, onClick, children, ...buttonProps }, ref) => {
    const editor = useTiptapEditor(providedEditor);
    const { isActive, handleInsertImage } = useImageUploadButton(editor, extensionName, disabled);
    const handleClick = React.useCallback((e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) {
            handleInsertImage();
        }
    }, [onClick, disabled, handleInsertImage]);
    if (!editor || !editor.isEditable) {
        return null;
    }
    return (_jsx(Button, { ref: ref, type: "button", className: className.trim(), "data-style": "ghost", "data-active-state": isActive ? 'on' : 'off', role: "button", tabIndex: -1, "aria-label": "Add image", "aria-pressed": isActive, tooltip: "Add image", onClick: handleClick, ...buttonProps, children: children || (_jsxs(_Fragment, { children: [_jsx(ImagePlusIcon, { className: "tiptap-button-icon" }), text && _jsx("span", { className: "tiptap-button-text", children: text })] })) }));
});
ImageUploadButton.displayName = 'ImageUploadButton';
export default ImageUploadButton;
