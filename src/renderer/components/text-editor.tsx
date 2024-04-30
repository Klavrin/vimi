import { useState } from 'react';
import MarkdownEditor, { MarkdownEditorRef } from '@uiw/react-markdown-editor';
import { useDispatch } from 'react-redux';
import { vim } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';

import { setIsEditing } from '../store/reducers/workspace';

type TextEditorProps = {
  contents: string;
  handleTextEditorRef: (index: number, ref: MarkdownEditorRef) => void;
  index: number;
  textEditorRefs: any;
};

function TextEditor({
  contents,
  handleTextEditorRef,
  index,
  textEditorRefs,
}: TextEditorProps) {
  const [editorContent, setEditorContent] = useState(contents);
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();

  const handlePreviewButton = () => {
    setPreview(!preview);
    if (preview) {
      setTimeout(() => {
        textEditorRefs.current[index].editor.current.view.focus();
      }, 0);
    }
  };

  return (
    <>
      <MarkdownEditor
        ref={(ref: any) => handleTextEditorRef(index, ref)}
        className="editor"
        value={editorContent}
        onChange={(data: string) => setEditorContent(data)}
        hideToolbar={false}
        enablePreview={preview}
        editable={!preview}
        extensions={[vim(), EditorView.lineWrapping]}
        onFocus={() => dispatch(setIsEditing(true))}
        onBlur={() => dispatch(setIsEditing(false))}
      />

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
