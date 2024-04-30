import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from '../store/reducers/tab-bar';

import TextEditor from './text-editor';

import StyledWorkspace from './styles/workspace.styled';
import { State } from '../types/state';

function Workspace() {
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const textEditorRefs = useRef(Array(tabs.length).fill(null));
  const dispatch = useDispatch();

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (file: any) => {
      dispatch(
        addTab({
          path: file.path,
          basename: file.basename,
          contents: file.contents,
          previewMode: false,
        }),
      );
    });
  }, [dispatch]);

  useEffect(() => {
    if (textEditorRefs.current[activeTab])
      if (textEditorRefs.current[activeTab].editor.current.view)
        textEditorRefs.current[activeTab].editor.current.view.focus();
  }, [activeTab]);

  const handleTextEditorRef = (index: any, ref: any) => {
    textEditorRefs.current[index] = ref;
  };

  return (
    <StyledWorkspace>
      {tabs.map((tab, index) => (
        <div
          key={tab.basename}
          style={{ display: index === activeTab ? 'block' : 'none' }}
        >
          <TextEditor
            contents={tab.contents}
            handleTextEditorRef={handleTextEditorRef}
            index={index}
            textEditorRefs={textEditorRefs}
            previewMode={tab.previewMode}
          />
        </div>
      ))}
    </StyledWorkspace>
  );
}

export default Workspace;
