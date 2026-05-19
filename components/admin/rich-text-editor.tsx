'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useState } from 'react';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, ImagePlus,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  allowImages?: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  allowImages = false,
  onUploadImage,
  minHeight = 320,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const md = (editor.storage as { markdown?: { getMarkdown(): string } })
        .markdown?.getMarkdown() ?? '';
      onChange(md);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-stone max-w-none focus:outline-none px-4 py-3',
          'prose-headings:font-serif prose-headings:tracking-tight',
          'prose-h2:text-2xl prose-h2:mt-6 prose-h3:text-xl prose-h3:mt-5',
          'prose-p:my-3 prose-li:my-1',
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = (editor.storage as { markdown?: { getMarkdown(): string } })
      .markdown?.getMarkdown() ?? '';
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      className="rounded-lg border-2 border-stone-300 bg-white focus-within:border-stone-900 transition-colors"
      style={{ minHeight }}
    >
      <Toolbar
        editor={editor}
        allowImages={allowImages}
        onUploadImage={onUploadImage}
      />
      <EditorContent editor={editor} />
      {placeholder && editor.isEmpty && (
        <div className="px-4 -mt-[1px] pointer-events-none text-stone-400 text-base">
          {placeholder}
        </div>
      )}
    </div>
  );
}

function Toolbar({
  editor,
  allowImages,
  onUploadImage,
}: {
  editor: ReturnType<typeof useEditor>;
  allowImages: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
}) {
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const Btn = ({
    onClick, active, label, children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded hover:bg-stone-100',
        active && 'bg-stone-900 text-stone-50 hover:bg-stone-700',
      )}
    >
      {children}
    </button>
  );

  async function handleImagePick() {
    if (!onUploadImage) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const url = await onUploadImage(file);
      setUploading(false);
      if (url) {
        const alt = file.name.replace(/\.[^.]+$/, '');
        editor.chain().focus().insertContent(`![${alt}](${url})`).run();
      }
    };
    input.click();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-stone-200 bg-stone-50">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()}
           active={editor.isActive('bold')} label="Bold">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()}
           active={editor.isActive('italic')} label="Italic">
        <Italic className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
           active={editor.isActive('heading', { level: 2 })} label="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
           active={editor.isActive('heading', { level: 3 })} label="Heading 3">
        <Heading3 className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}
           active={editor.isActive('bulletList')} label="Bullet list">
        <List className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()}
           active={editor.isActive('orderedList')} label="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}
           active={editor.isActive('blockquote')} label="Blockquote">
        <Quote className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn
        onClick={() => {
          const prev = editor.getAttributes('link').href ?? '';
          const url = window.prompt('URL', prev);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().unsetMark('link').run();
          } else {
            editor.chain().focus().setMark('link', { href: url }).run();
          }
        }}
        active={editor.isActive('link')}
        label="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>
      {allowImages && onUploadImage && (
        <Btn
          onClick={handleImagePick}
          label={uploading ? 'Uploading…' : 'Insert image'}
        >
          <ImagePlus className={cn('h-4 w-4', uploading && 'animate-pulse')} />
        </Btn>
      )}
    </div>
  );
}
