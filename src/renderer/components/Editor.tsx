import { useEffect, useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { vim } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { useDispatch } from 'react-redux';
import { setIsEditing } from '../store/reducers/editor';
import useVimConfig from '../utils/vim-config';
import StyledEditor from './styles/editor.styled';

function Editor() {
  const [editorContent, setEditorContent] = useState('');
  const dispatch = useDispatch();
  useVimConfig();

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (data: any) => {
      setEditorContent(data);
    });
  }, []);

  return (
    <StyledEditor>
      <MarkdownEditor
        className="editor"
        value={editorContent}
        onChange={(data: string) => setEditorContent(data)}
        hideToolbar={false}
        enablePreview={false}
        extensions={[vim(), EditorView.lineWrapping]}
        onFocus={() => dispatch(setIsEditing(true))}
        onBlur={() => dispatch(setIsEditing(false))}
      />
    </StyledEditor>
  );
}

export default Editor;
