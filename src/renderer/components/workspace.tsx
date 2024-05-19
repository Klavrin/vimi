import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from '../store/reducers/tab-bar';
import useVimConfig from '../utils/use-vim-config';

import TextEditor from './text-editor';
import CommandMenu from './command-menu';

import StyledWorkspace from './styles/workspace.styled';
import { State } from '../types/state';

function Workspace() {
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const textEditorRefs = useRef(Array(tabs.length).fill(null));
  const markdownEditorRefs = useRef(Array(tabs.length).fill(null));
  const dispatch = useDispatch();
  useVimConfig();

  console.log(markdownEditorRefs);

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
    if (markdownEditorRefs.current[activeTab]) {
      markdownEditorRefs.current[activeTab].focus();
    }
  }, [activeTab]);

  return (
    <StyledWorkspace>
      <CommandMenu />
      {tabs.map((tab, index) => (
        <div
          key={tab.basename}
          style={{ display: index === activeTab ? 'block' : 'none' }}
        >
          <TextEditor
            contents={tab.contents}
            index={index}
            textEditorRefs={textEditorRefs}
            markdownEditorRefs={markdownEditorRefs}
            previewMode={tab.previewMode}
          />
        </div>
      ))}
    </StyledWorkspace>
  );
}

export default Workspace;
