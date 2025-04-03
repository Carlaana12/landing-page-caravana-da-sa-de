import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Table as TableIcon,
  CheckSquare, Palette, Highlighter, Trash2, Plus, Maximize2, Minimize2,
  Columns, LayoutTemplate, Eye
} from 'lucide-react';
import MediaManager from './MediaManager';

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
  onPreviewToggle?: () => void;
  isPreviewVisible?: boolean;
}

const PageEditor: React.FC<PageEditorProps> = ({ content, onChange, onPreviewToggle, isPreviewVisible }) => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-verde-cia hover:text-verde-cia-escuro underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Comece a escrever seu conteúdo aqui...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content || '<p>Comece a escrever seu conteúdo aqui...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    if (!editor) return;

    // Ctrl/Cmd + B = Bold
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      editor.chain().focus().toggleBold().run();
    }
    // Ctrl/Cmd + I = Italic
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      editor.chain().focus().toggleItalic().run();
    }
    // Ctrl/Cmd + U = Underline
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault();
      editor.chain().focus().toggleUnderline().run();
    }
    // Ctrl/Cmd + K = Link
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const url = window.prompt('Digite a URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
    // Ctrl/Cmd + Z = Undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      editor.chain().focus().undo().run();
    }
    // Ctrl/Cmd + Shift + Z = Redo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      editor.chain().focus().redo().run();
    }
    // Ctrl/Cmd + F = Fullscreen
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      setIsFullscreen(!isFullscreen);
    }
    // Ctrl/Cmd + P = Preview
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      onPreviewToggle?.();
    }
  }, [editor, isFullscreen, onPreviewToggle]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleImageSelect = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    setShowMediaManager(false);
  };

  if (!editor) return null;

  return (
    <>
      <div className={`border rounded-lg overflow-hidden bg-white transition-all ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="border-b border-gray-200 p-4 space-y-2">
          {/* Editor Controls */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isFullscreen ? 'Sair da tela cheia (Ctrl+F)' : 'Tela cheia (Ctrl+F)'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={onPreviewToggle}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isPreviewVisible ? 'bg-gray-100' : ''}`}
                title="Alternar preview (Ctrl+P)"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Pressione Ctrl+P para preview • Ctrl+F para tela cheia
            </div>
          </div>

          {/* Text Formatting */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
              title="Sublinhado (Ctrl+U)"
            >
              <UnderlineIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
              title="Lista não ordenada"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
              title="Lista ordenada"
            >
              <ListOrdered className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('taskList') ? 'bg-gray-100' : ''}`}
              title="Lista de tarefas"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          </div>

          {/* Headings and Alignment */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
              title="Título 1"
            >
              <Heading1 className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
              title="Título 2"
            >
              <Heading2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''}`}
              title="Título 3"
            >
              <Heading3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
              title="Alinhar à esquerda"
            >
              <AlignLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
              title="Centralizar"
            >
              <AlignCenter className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
              title="Alinhar à direita"
            >
              <AlignRight className="w-5 h-5" />
            </button>
          </div>

          {/* Links, Images, and Tables */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                const url = window.prompt('Digite a URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
              title="Inserir link (Ctrl+K)"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMediaManager(true)}
              className="p-2 rounded hover:bg-gray-100"
              title="Inserir imagem"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={addTable}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('table') ? 'bg-gray-100' : ''}`}
              title="Inserir tabela"
            >
              <TableIcon className="w-5 h-5" />
            </button>
            {editor.isActive('table') && (
              <>
                <button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Adicionar coluna antes"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Excluir tabela"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Colors and History */}
          <div className="flex flex-wrap gap-1">
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="w-8 h-8 p-0 rounded cursor-pointer"
              title="Cor do texto"
            />
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-gray-100' : ''}`}
              title="Destacar texto"
            >
              <Highlighter className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Refazer (Ctrl+Shift+Z)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>

        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 min-h-[400px] focus:outline-none"
        />
      </div>

      {showMediaManager && (
        <MediaManager
          onSelect={handleImageSelect}
          onClose={() => setShowMediaManager(false)}
        />
      )}
    </>
  );
};

export default PageEditor;