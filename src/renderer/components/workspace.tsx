import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MarkdownEditor from '@uiw/react-markdown-editor';
import { vim } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { setIsEditing } from '../store/reducers/workspace';

import useVimConfig from '../utils/vim-config';
import StyledWorkspace from './styles/workspace.styled';

function Workspace() {
  const [editorContent, setEditorContent] = useState('');
  const dispatch = useDispatch();
  useVimConfig();

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (data: any) => {
      setEditorContent(data);
    });
  }, []);

  return (
    <StyledWorkspace>
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
    </StyledWorkspace>
  );
}

export default Workspace;
