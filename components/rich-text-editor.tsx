"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Minus,
  Code,
  Heading2,
  Link as LinkIcon,
  UnlinkIcon,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none whitespace-pre-wrap'
      }
    },
    parseOptions: {
      preserveWhitespace: true
    }
  });

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Add https if no protocol is specified
    const validUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;

    editor?.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex gap-1 p-1 rounded-lg border bg-background shadow-lg"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "bg-muted" : ""}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive("link") ? "bg-muted" : ""}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          {editor.isActive("link") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={removeLink}
              title="Remove Link"
            >
              <UnlinkIcon className="h-4 w-4" />
            </Button>
          )}
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className="min-h-[150px] text-sm border rounded-md p-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      />
    </div>
  );
}
