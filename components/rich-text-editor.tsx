"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  UnlinkIcon,
  Undo,
  Redo,
  ChevronDown,
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
  const [listStyle, setListStyle] = React.useState<'disc' | 'circle' | 'square'>('disc');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: `list-${listStyle} ml-4 space-y-1`,
          style: `list-style-type: ${listStyle}`,
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4 space-y-1',
        },
      }),
      ListItem,
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none whitespace-pre-wrap min-h-[150px] p-3'
      }
    },
    parseOptions: {
      preserveWhitespace: true
    }
  });

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const validUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
  };

  const setBulletStyle = (style: 'disc' | 'circle' | 'square') => {
    setListStyle(style);
    const isList = editor?.isActive('bulletList');
    
    if (isList) {
      // If already a list, toggle it off and back on to apply new style
      editor?.chain().focus().toggleBulletList().toggleBulletList().run();
    } else {
      // If not a list, just toggle it on
      editor?.chain().focus().toggleBulletList().run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <EditorContent editor={editor} />
      
      <div className="flex items-center gap-1 p-2 border-t bg-muted/50">
        <div className="flex items-center gap-1 mr-2 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            aria-label="Undo"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label="Redo"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${editor?.isActive("bulletList") ? "bg-muted" : ""}`}
              aria-label="Bullet List Style"
            >
              <List className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setBulletStyle('disc')}>
              <span className="w-4">•</span>
              <span className="ml-2">Disc</span>
              {listStyle === 'disc' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBulletStyle('circle')}>
              <span className="w-4">○</span>
              <span className="ml-2">Circle</span>
              {listStyle === 'circle' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBulletStyle('square')}>
              <span className="w-4">▪</span>
              <span className="ml-2">Square</span>
              {listStyle === 'square' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
          aria-label="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          aria-label="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
          aria-label="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {editor.isActive("link") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            aria-label="Remove Link"
          >
            <UnlinkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
