import { useEffect, useState } from 'react';
import StyledEditor from './styles/editor.styled';

function Editor() {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (data: any) => {
      setEditorContent(data);
    });
  }, []);

  return <StyledEditor>{editorContent}</StyledEditor>;
}

export default Editor;
