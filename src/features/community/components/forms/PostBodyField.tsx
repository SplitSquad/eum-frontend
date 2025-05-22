import { SimpleEditor } from '@tiptap-editor/components/tiptap-templates/simple/simple-editor';
import { usePostFormStore } from '../../store/postFormStore';
import { useEditor, JSONContent } from '@tiptap/react';

import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Typography } from '@tiptap/extension-typography';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Link } from '@tiptap-editor/components/tiptap-extension/link-extension';
import { Selection } from '@tiptap-editor/components/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@tiptap-editor/components/tiptap-node/image-upload-node/image-upload-node-extension';
import { TrailingNode } from '@tiptap-editor/components/tiptap-extension/trailing-node-extension';
import { handleImageUpload, MAX_FILE_SIZE } from '@tiptap-editor/lib/tiptap-utils';

import { useEffect } from 'react';

const PostBodyField = () => {
  const { content, setContent } = usePostFormStore();

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
    },
    content: JSON.parse(content),
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
    onUpdate({ editor }) {
      const jsonString = JSON.stringify(editor.getJSON());
      setContent(jsonString);
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(JSON.parse(content));
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="content-wrapper p-4 bg-white rounded shadow-sm min-h-[300px]">
      <SimpleEditor editor={editor} />
    </div>
  );
};
export default PostBodyField;
