// src/components/RichEditor.jsx
import { useRef, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'

// Tiptap v3 (imports nommés)
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Mention } from '@tiptap/extension-mention'
import { Suggestion } from '@tiptap/suggestion'
import { Underline } from '@tiptap/extension-underline'

// Tables (granulaire)
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

// --- Mock mentions ---
const mockUsers = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Charlie' },
]

// --- Suggestion @mentions ---
const mentionSuggestion = {
  char: '@',
  items: ({ query }) =>
    mockUsers.filter(u => u.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
  render: () => {
    let el
    return {
      onStart: props => {
        el = document.createElement('div')
        el.className = 'border rounded shadow p-1'
        update(el, props)
        document.body.appendChild(el)
        position(el, props.clientRect)
      },
      onUpdate: props => {
        update(el, props)
        position(el, props.clientRect)
      },
      onKeyDown: ({ event }) => event.key === 'Escape',
      onExit: () => el?.remove(),
    }

    function update(container, props) {
      container.innerHTML = ''
      props.items.forEach(item => {
        const b = document.createElement('button')
        b.className = 'block w-full text-left px-2 py-1 hover:bg-base-200'
        b.textContent = item.label
        b.onclick = () => props.command(item)
        container.appendChild(b)
      })
      if (!props.items.length) {
        const d = document.createElement('div')
        d.className = 'px-2 py-1 opacity-70'
        d.textContent = 'Aucun résultat'
        container.appendChild(d)
      }
    }

    function position(container, rect) {
      if (!rect) return
      container.style.position = 'fixed'
      container.style.left = rect.left + 'px'
      container.style.top = rect.bottom + 'px'
      container.style.zIndex = 9999
      container.style.minWidth = Math.max(160, rect.width) + 'px'
    }
  },
}

// --- Helper upload vers ton backend (remplace / adapte si besoin) ---
async function uploadImageToServer(file) {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: form,
    credentials: 'include', // si besoin de cookie/session
  })
  if (!res.ok) throw new Error('Upload échoué')
  const data = await res.json() // { url: '/uploads/abc.png', name: '...' }
  return data.url
}

export default function RichEditor({ value = '', onChange }) {
  const fileInputRef = useRef(null)

  // Coller / déposer -> upload -> insérer URL permanente
  const handleImageDropPaste = useCallback(async (event, editor) => {
    const files = event.clipboardData?.files || event.dataTransfer?.files
    if (!files?.length) return false
    const img = Array.from(files).find(f => f.type.startsWith('image/'))
    if (!img) return false
    event.preventDefault()
    try {
      const url = await uploadImageToServer(img)
      editor.chain().focus().setImage({ src: url, alt: img.name }).run()
    } catch (e) {
      console.error(e)
    }
    return true
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Écrivez ici…' }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Mention.configure({
        suggestion: Suggestion(mentionSuggestion),
        HTMLAttributes: { class: 'mention' },
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  })

  // Brancher les handlers une fois l’editor prêt (évite setOptions à chaque render)
  useEffect(() => {
    if (!editor) return
    const opts = {
      handlePaste: (view, event) => { handleImageDropPaste(event, editor); return false },
      handleDrop:  (view, event) => { handleImageDropPaste(event, editor); return false },
    }
    editor.setOptions({ editorProps: opts })
  }, [editor, handleImageDropPaste])

  // Sync quand value externe change (mode édition)
  useEffect(() => {
    if (!editor) return
    const incoming = value || '<p></p>'
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming)
    }
  }, [value, editor])

  if (!editor) return null

  const btn = (active, label, onClick) => (
    <button
      type="button"
      className={`px-2 py-1 text-sm border-r ${active ? 'bg-info font-semibold' : ''}`}
      onClick={onClick}
      title={label}
    >
      {label}
    </button>
  )

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center border-b">
        {btn(editor.isActive('bold'), 'B', () => editor.chain().focus().toggleBold().run())}
        {btn(editor.isActive('italic'), 'I', () => editor.chain().focus().toggleItalic().run())}
        {btn(editor.isActive('underline'), 'U', () => editor.chain().focus().toggleUnderline().run())}
        {btn(editor.isActive('strike'), 'S', () => editor.chain().focus().toggleStrike().run())}
        {btn(editor.isActive('bulletList'), '• List', () => editor.chain().focus().toggleBulletList().run())}
        {btn(editor.isActive('orderedList'), '1. List', () => editor.chain().focus().toggleOrderedList().run())}
        {btn(false, 'Lien', () => {
          const url = prompt('URL du lien :')
          if (url === null) return
          if (url === '') editor.chain().focus().unsetLink().run()
          else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        })}
        <div className="w-px h-6 mx-1" />
        {btn(editor.isActive('table'), 'Table', () =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        )}
        {btn(false, '+ Ligne', () => editor.chain().focus().addRowAfter().run())}
        {btn(false, '+ Col', () => editor.chain().focus().addColumnAfter().run())}
        {btn(false, '– Ligne', () => editor.chain().focus().deleteRow().run())}
        {btn(false, '– Col', () => editor.chain().focus().deleteColumn().run())}
        {btn(false, 'Suppr table', () => editor.chain().focus().deleteTable().run())}
        <div className="w-px h-6 mx-1" />
        {btn(false, 'Img (URL)', () => {
          const url = prompt('URL de l’image :')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        })}
        <button
          type="button"
          className="px-2 py-1 text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Img (fichier)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            try {
              const url = await uploadImageToServer(f)
              editor.chain().focus().setImage({ src: url, alt: f.name }).run()
            } catch (err) {
              console.error(err)
            } finally {
              e.target.value = '' // reset input
            }
          }}
        />
      </div>

      {/* Zone éditable */}
      <EditorContent
        editor={editor}
        className="max-w-none cursor-text focus:outline-none"
        style={{ minHeight: 20, padding: 12, }}
      />
    </div>
  )
}