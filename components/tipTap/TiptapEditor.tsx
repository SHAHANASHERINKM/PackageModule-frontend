import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CharacterCount from '@tiptap/extension-character-count'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

import "./tipTap.css";

const RichTextEditor = ({ content, onUpdate }: { content?: string; onUpdate?: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Highlight,
      TextStyle,
      Color,
      Link,
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount.configure({ limit: 10000 }),
    ],
    content: content || '<p>Write your description here...</p>',
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML())
      }
    },
  })

  if (!editor) return null

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</button>
        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
          }
          title="Text Color"
        />
      </div>
      <EditorContent editor={editor} className="editor-content" />
      <div className="char-count">
        Characters: {editor.storage.characterCount.characters()}
      </div>
    </div>
  )
}

export default RichTextEditor
