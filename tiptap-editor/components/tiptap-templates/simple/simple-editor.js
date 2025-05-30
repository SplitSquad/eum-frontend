import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Underline } from '@tiptap/extension-underline';
// --- Custom Extensions ---
import { Link } from '@tiptap-editor/components/tiptap-extension/link-extension';
import { Selection } from '@tiptap-editor/components/tiptap-extension/selection-extension';
import { TrailingNode } from '@tiptap-editor/components/tiptap-extension/trailing-node-extension';
// --- UI Primitives ---
import { Button } from '@tiptap-editor/components/tiptap-ui-primitive/button';
import { Spacer } from '@tiptap-editor/components/tiptap-ui-primitive/spacer';
import { Toolbar, ToolbarGroup, ToolbarSeparator, } from '@tiptap-editor/components/tiptap-ui-primitive/toolbar';
// --- Tiptap Node ---
import { ImageUploadNode } from '@tiptap-editor/components/tiptap-node/image-upload-node/image-upload-node-extension';
import '@tiptap-editor/components/tiptap-node/list-node/list-node.scss';
import '@tiptap-editor/components/tiptap-node/image-node/image-node.scss';
import '@tiptap-editor/components/tiptap-node/paragraph-node/paragraph-node.scss';
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@tiptap-editor/components/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@tiptap-editor/components/tiptap-ui/image-upload-button';
import { ListDropdownMenu } from '@tiptap-editor/components/tiptap-ui/list-dropdown-menu';
import { NodeButton } from '@tiptap-editor/components/tiptap-ui/node-button';
import { HighlightPopover, HighlightContent, HighlighterButton, } from '@tiptap-editor/components/tiptap-ui/highlight-popover';
import { LinkPopover, LinkContent, LinkButton, } from '@tiptap-editor/components/tiptap-ui/link-popover';
import { MarkButton } from '@tiptap-editor/components/tiptap-ui/mark-button';
import { TextAlignButton } from '@tiptap-editor/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@tiptap-editor/components/tiptap-ui/undo-redo-button';
// --- Icons ---
import { ArrowLeftIcon } from '@tiptap-editor/components/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@tiptap-editor/components/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@tiptap-editor/components/tiptap-icons/link-icon';
// --- Hooks ---
import { useMobile } from '@tiptap-editor/hooks/use-mobile';
import { useWindowSize } from '@tiptap-editor/hooks/use-window-size';
// --- Components ---
import { ThemeToggle } from '@tiptap-editor/components/tiptap-templates/simple/theme-toggle';
// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@tiptap-editor/lib/tiptap-utils';
// --- Styles ---
import '@tiptap-editor/components/tiptap-templates/simple/simple-editor.scss';
import content from '@tiptap-editor/components/tiptap-templates/simple/data/content.json';
const MainToolbarContent = ({ onHighlighterClick, onLinkClick, isMobile, }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Spacer, {}), _jsxs(ToolbarGroup, { children: [_jsx(UndoRedoButton, { action: "undo" }), _jsx(UndoRedoButton, { action: "redo" })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(HeadingDropdownMenu, { levels: [1, 2, 3, 4] }), _jsx(ListDropdownMenu, { types: ['bulletList', 'orderedList', 'taskList'] }), _jsx(NodeButton, { type: "blockquote" })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(MarkButton, { type: "bold" }), _jsx(MarkButton, { type: "italic" }), _jsx(MarkButton, { type: "strike" }), _jsx(MarkButton, { type: "underline" }), !isMobile ? _jsx(HighlightPopover, {}) : _jsx(HighlighterButton, { onClick: onHighlighterClick }), !isMobile ? _jsx(LinkPopover, {}) : _jsx(LinkButton, { onClick: onLinkClick })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(MarkButton, { type: "superscript" }), _jsx(MarkButton, { type: "subscript" })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(TextAlignButton, { align: "left" }), _jsx(TextAlignButton, { align: "center" }), _jsx(TextAlignButton, { align: "right" }), _jsx(TextAlignButton, { align: "justify" })] }), _jsx(ToolbarSeparator, {}), _jsx(ToolbarGroup, { children: _jsx(ImageUploadButton, { text: "Add" }) }), _jsx(Spacer, {}), isMobile && _jsx(ToolbarSeparator, {}), _jsx(ToolbarGroup, { children: _jsx(ThemeToggle, {}) })] }));
};
const MobileToolbarContent = ({ type, onBack, }) => (_jsxs(_Fragment, { children: [_jsx(ToolbarGroup, { children: _jsxs(Button, { "data-style": "ghost", onClick: onBack, children: [_jsx(ArrowLeftIcon, { className: "tiptap-button-icon" }), type === 'highlighter' ? (_jsx(HighlighterIcon, { className: "tiptap-button-icon" })) : (_jsx(LinkIcon, { className: "tiptap-button-icon" }))] }) }), _jsx(ToolbarSeparator, {}), type === 'highlighter' ? _jsx(HighlightContent, {}) : _jsx(LinkContent, {})] }));
export function SimpleEditor({ editor: externalEditor }) {
    const isMobile = useMobile();
    const windowSize = useWindowSize();
    const [mobileView, setMobileView] = React.useState('main');
    const [rect, setRect] = React.useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const toolbarRef = React.useRef(null);
    React.useEffect(() => {
        const updateRect = () => {
            setRect(document.body.getBoundingClientRect());
        };
        updateRect();
        const resizeObserver = new ResizeObserver(updateRect);
        resizeObserver.observe(document.body);
        window.addEventListener('scroll', updateRect);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('scroll', updateRect);
        };
    }, []);
    const internalEditor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                'aria-label': 'Main content area, start typing to enter text.',
            },
        },
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: error => console.error('Upload failed:', error),
            }),
            TrailingNode,
            Link.configure({ openOnClick: false }),
        ],
        content: content,
    });
    const editor = externalEditor ? externalEditor : internalEditor;
    if (!editor) {
        return null;
    }
    React.useEffect(() => {
        const checkCursorVisibility = () => {
            if (!editor || !toolbarRef.current)
                return;
            const { state, view } = editor;
            if (!view.hasFocus())
                return;
            const { from } = state.selection;
            const cursorCoords = view.coordsAtPos(from);
            if (windowSize.height < rect.height) {
                if (cursorCoords && toolbarRef.current) {
                    const toolbarHeight = toolbarRef.current.getBoundingClientRect().height;
                    const isEnoughSpace = windowSize.height - cursorCoords.top - toolbarHeight > 0;
                    // If not enough space, scroll until the cursor is the middle of the screen
                    if (!isEnoughSpace) {
                        const scrollY = cursorCoords.top - windowSize.height / 2 + toolbarHeight;
                        window.scrollTo({
                            top: scrollY,
                            behavior: 'smooth',
                        });
                    }
                }
            }
        };
        checkCursorVisibility();
    }, [editor, rect.height, windowSize.height]);
    React.useEffect(() => {
        if (!isMobile && mobileView !== 'main') {
            setMobileView('main');
        }
    }, [isMobile, mobileView]);
    return (_jsxs(EditorContext.Provider, { value: { editor }, children: [_jsx(Toolbar, { ref: toolbarRef, style: isMobile
                    ? {
                        bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                    }
                    : {}, children: mobileView === 'main' ? (_jsx(MainToolbarContent, { onHighlighterClick: () => setMobileView('highlighter'), onLinkClick: () => setMobileView('link'), isMobile: isMobile })) : (_jsx(MobileToolbarContent, { type: mobileView === 'highlighter' ? 'highlighter' : 'link', onBack: () => setMobileView('main') })) }), _jsx(EditorContent, { editor: editor, role: "presentation", className: "simple-editor-content" })] }));
}
