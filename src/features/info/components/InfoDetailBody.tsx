import React from 'react';
import { Container } from '@mui/material';
import { useInfoFormStore } from '../store/InfoFormStore';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import { Selection } from '@tiptap-editor/components/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@tiptap-editor/components/tiptap-node/image-upload-node/image-upload-node-extension';
import { TrailingNode } from '@tiptap-editor/components/tiptap-extension/trailing-node-extension';
import { handleImageUpload, MAX_FILE_SIZE } from '@tiptap-editor/lib/tiptap-utils';
import './InfoDetailBody.css';

const InfoDetailBody: React.FC = () => {
  const { content } = useInfoFormStore();
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem,
      Highlight.configure({ multicolor: true }),
      Image,
      ImageUploadNode.configure({
        accept: '*/*',
        maxSize: MAX_FILE_SIZE,
        limit: 10,
        upload: handleImageUpload,
      }),
      TrailingNode,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Link.configure({ openOnClick: false }),
    ],
    content: '',
  });

  React.useEffect(() => {
    if (editor && content) {
      const doc = JSON.parse(content) as JSONContent;
      queueMicrotask(() => {
        editor.commands.setContent(doc);
      });
    }
  }, [editor, content]);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        p: 0,
        boxShadow:
          '0 2px 8px -2px rgba(0,0,0,0.04), 2px 0 8px -2px rgba(0,0,0,0.04), -2px 0 8px -2px rgba(0,0,0,0.04)',
        background: 'transparent',
      }}
    >
      <div className="info-detail-prose">
        <EditorContent editor={editor} />
      </div>
    </Container>
  );
};

export default InfoDetailBody;
