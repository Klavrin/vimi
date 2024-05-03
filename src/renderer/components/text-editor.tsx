import { useState, useEffect } from 'react';
import MarkdownEditor, { MarkdownEditorRef } from '@uiw/react-markdown-editor';
import { useDispatch } from 'react-redux';
import { vim } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { togglePreviewMode, setPreviewMode } from '../store/reducers/tab-bar';

import { setIsEditing } from '../store/reducers/workspace';

import MarkdownPreview from './markdown-preview';

type TextEditorProps = {
  contents: string;
  handleTextEditorRef: (index: number, ref: MarkdownEditorRef) => void;
  index: number;
  textEditorRefs: any;
  previewMode: boolean;
};

function TextEditor({
  contents,
  handleTextEditorRef,
  index,
  textEditorRefs,
  previewMode,
}: TextEditorProps) {
  const [editorContent, setEditorContent] = useState(contents);
  const [spacePressed, setSpacePressed] = useState(false);
  const dispatch = useDispatch();

  // Use vim mappings in the preview mode
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (!previewMode) return;

      // Toggle preview
      if (e.code === 'Space') setSpacePressed(true);
      if (e.key === 'p' && spacePressed) {
        setSpacePressed(false);
        dispatch(setPreviewMode(false));
        setTimeout(() => {
          textEditorRefs.current[index].editor.current.view.focus();
        }, 0);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewMode, spacePressed]);

  const handlePreviewButton = () => {
    dispatch(togglePreviewMode());
    if (previewMode) {
      setTimeout(() => {
        textEditorRefs.current[index].editor.current.view.focus();
      }, 0);
    }
  };

  return (
    <>
      <MarkdownEditor
        // @ts-ignore
        ref={(ref) => handleTextEditorRef(index, ref)}
        className="editor"
        style={{ display: !previewMode ? 'block' : 'none' }}
        value={editorContent}
        onChange={(data: string) => setEditorContent(data)}
        hideToolbar={false}
        enablePreview={false}
        editable={!previewMode}
        extensions={[vim(), EditorView.lineWrapping]}
        onFocus={() => dispatch(setIsEditing(true))}
        onBlur={() => dispatch(setIsEditing(false))}
      />
      <MarkdownPreview previewMode={previewMode} innerText={editorContent} />

      <button
        type="button"
        onClick={handlePreviewButton}
        style={{ position: 'fixed', bottom: 10, right: 10 }}
      >
        preview/edit
      </button>
    </>
  );
}

export default TextEditor;
