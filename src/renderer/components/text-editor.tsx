import { useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useDispatch } from 'react-redux';
import { vim } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { setIsEditing } from '../store/reducers/workspace';

type TextEditorProps = {
  contents: string;
  handleTextEditorRef: (index: number, ref: any) => void;
  index: number;
};

function TextEditor({ contents, handleTextEditorRef, index }: TextEditorProps) {
  const [editorContent, setEditorContent] = useState(contents);
  const dispatch = useDispatch();

  return (
    <MarkdownEditor
      ref={(ref: any) => handleTextEditorRef(index, ref)}
      className="editor"
      value={editorContent}
      onChange={(data: string) => setEditorContent(data)}
      hideToolbar={false}
      enablePreview={false}
      extensions={[vim(), EditorView.lineWrapping]}
      onFocus={() => dispatch(setIsEditing(true))}
      onBlur={() => dispatch(setIsEditing(false))}
    />
  );
}

export default TextEditor;
