import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { isNodeSelection } from '@tiptap/react';
// --- Hooks ---
import { useTiptapEditor } from '@tiptap-editor/hooks/use-tiptap-editor';
// --- Icons ---
import { CornerDownLeftIcon } from '@tiptap-editor/components/tiptap-icons/corner-down-left-icon';
import { ExternalLinkIcon } from '@tiptap-editor/components/tiptap-icons/external-link-icon';
import { LinkIcon } from '@tiptap-editor/components/tiptap-icons/link-icon';
import { TrashIcon } from '@tiptap-editor/components/tiptap-icons/trash-icon';
// --- Lib ---
import { isMarkInSchema } from '@tiptap-editor/lib/tiptap-utils';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
import { Popover, PopoverContent, PopoverTrigger, } from '@tiptap-editor/components/tiptap-ui-primitive/popover';
import { Separator } from '@tiptap-editor/components/tiptap-ui-primitive/separator';
// --- Styles ---
import '@tiptap-editor/components/tiptap-ui/link-popover/link-popover.scss';
export const useLinkHandler = (props) => {
    const { editor, onSetLink, onLinkActive } = props;
    const [url, setUrl] = React.useState('');
    React.useEffect(() => {
        if (!editor)
            return;
        // Get URL immediately on mount
        const { href } = editor.getAttributes('link');
        if (editor.isActive('link') && !url) {
            setUrl(href || '');
            onLinkActive?.();
        }
    }, [editor, onLinkActive, url]);
    React.useEffect(() => {
        if (!editor)
            return;
        const updateLinkState = () => {
            const { href } = editor.getAttributes('link');
            setUrl(href || '');
            if (editor.isActive('link') && !url) {
                onLinkActive?.();
            }
        };
        editor.on('selectionUpdate', updateLinkState);
        return () => {
            editor.off('selectionUpdate', updateLinkState);
        };
    }, [editor, onLinkActive, url]);
    const setLink = React.useCallback(() => {
        if (!url || !editor)
            return;
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .insertContent({
            type: 'text',
            text: text || url,
            marks: [{ type: 'link', attrs: { href: url } }],
        })
            .run();
        onSetLink?.();
    }, [editor, onSetLink, url]);
    const removeLink = React.useCallback(() => {
        if (!editor)
            return;
        editor
            .chain()
            .focus()
            .unsetMark('link', { extendEmptyMarkRange: true })
            .setMeta('preventAutolink', true)
            .run();
        setUrl('');
    }, [editor]);
    return {
        url,
        setUrl,
        setLink,
        removeLink,
        isActive: editor?.isActive('link') || false,
    };
};
export const LinkButton = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx(Button, { type: "button", className: className, "data-style": "ghost", role: "button", tabIndex: -1, "aria-label": "Link", tooltip: "Link", ref: ref, ...props, children: children || _jsx(LinkIcon, { className: "tiptap-button-icon" }) }));
});
export const LinkContent = ({ editor: providedEditor }) => {
    const editor = useTiptapEditor(providedEditor);
    const linkHandler = useLinkHandler({
        editor: editor,
    });
    return _jsx(LinkMain, { ...linkHandler });
};
const LinkMain = ({ url, setUrl, setLink, removeLink, isActive }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setLink();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("input", { type: "url", placeholder: "Paste a link...", value: url, onChange: e => setUrl(e.target.value), onKeyDown: handleKeyDown, autoComplete: "off", autoCorrect: "off", autoCapitalize: "off", className: "tiptap-input tiptap-input-clamp" }), _jsx("div", { className: "tiptap-button-group", "data-orientation": "horizontal", children: _jsx(Button, { type: "button", onClick: setLink, title: "Apply link", disabled: !url && !isActive, "data-style": "ghost", children: _jsx(CornerDownLeftIcon, { className: "tiptap-button-icon" }) }) }), _jsx(Separator, {}), _jsxs("div", { className: "tiptap-button-group", "data-orientation": "horizontal", children: [_jsx(Button, { type: "button", onClick: () => window.open(url, '_blank'), title: "Open in new window", disabled: !url && !isActive, "data-style": "ghost", children: _jsx(ExternalLinkIcon, { className: "tiptap-button-icon" }) }), _jsx(Button, { type: "button", onClick: removeLink, title: "Remove link", disabled: !url && !isActive, "data-style": "ghost", children: _jsx(TrashIcon, { className: "tiptap-button-icon" }) })] })] }));
};
export function LinkPopover({ editor: providedEditor, hideWhenUnavailable = false, onOpenChange, autoOpenOnLinkActive = true, ...props }) {
    const editor = useTiptapEditor(providedEditor);
    const linkInSchema = isMarkInSchema('link', editor);
    const [isOpen, setIsOpen] = React.useState(false);
    const onSetLink = () => {
        setIsOpen(false);
    };
    const onLinkActive = () => setIsOpen(autoOpenOnLinkActive);
    const linkHandler = useLinkHandler({
        editor: editor,
        onSetLink,
        onLinkActive,
    });
    const isDisabled = React.useMemo(() => {
        if (!editor)
            return true;
        if (editor.isActive('codeBlock'))
            return true;
        return !editor.can().setLink?.({ href: '' });
    }, [editor]);
    const canSetLink = React.useMemo(() => {
        if (!editor)
            return false;
        try {
            return editor.can().setMark('link');
        }
        catch {
            return false;
        }
    }, [editor]);
    const isActive = editor?.isActive('link') ?? false;
    const handleOnOpenChange = React.useCallback((nextIsOpen) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
    }, [onOpenChange]);
    const show = React.useMemo(() => {
        if (!linkInSchema) {
            return false;
        }
        if (hideWhenUnavailable) {
            if (isNodeSelection(editor?.state.selection) || !canSetLink) {
                return false;
            }
        }
        return true;
    }, [linkInSchema, hideWhenUnavailable, editor, canSetLink]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (_jsxs(Popover, { open: isOpen, onOpenChange: handleOnOpenChange, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(LinkButton, { disabled: isDisabled, "data-active-state": isActive ? 'on' : 'off', "data-disabled": isDisabled, ...props }) }), _jsx(PopoverContent, { children: _jsx(LinkMain, { ...linkHandler }) })] }));
}
LinkButton.displayName = 'LinkButton';
