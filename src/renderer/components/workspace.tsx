import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addTab, setActiveTabIndex } from '../store/reducers/tab-bar';
import { setAllowFocusing } from '../store/reducers/workspace';
import useVimConfig from '../utils/use-vim-config';

import TextEditor from './text-editor';
import CommandMenu from './command-menu';

import StyledWorkspace from './styles/workspace.styled';
import { State } from '../types/state';

function Workspace() {
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const allowFocusing = useSelector(
    (state: State) => state.workspace.allowFocusing,
  );
  const markdownEditorRefs = useRef(Array(tabs.length).fill(null));
  const dispatch = useDispatch();
  useVimConfig();

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (file: any) => {
      dispatch(setAllowFocusing(false)); // Do not focus the current tab when a new file is opened
      dispatch(
        addTab({
          _id: uuidv4(),
          path: file.path,
          title: file.fileName, // temporary
          contents: file.contents,
          previewMode: false,
          tags: [],
          pinned: false,
        }),
      );
      setTimeout(() => {
        dispatch(setAllowFocusing(true)); // doesn't work without a timeout
      });
      console.log('!!!!!!!!!!');
    });
  }, []);

  useEffect(() => {
    if (markdownEditorRefs.current[activeTab] && allowFocusing) {
      markdownEditorRefs.current[activeTab].focus();
    }
  }, [activeTab, tabs]);

  return (
    <StyledWorkspace>
      <CommandMenu />
      {tabs.map((tab, index) => (
        <div
          key={tab._id}
          style={{ display: index === activeTab ? 'block' : 'none' }}
        >
          <TextEditor
            contents={tab.contents}
            index={index}
            markdownEditorRefs={markdownEditorRefs}
            previewMode={tab.previewMode}
          />
        </div>
      ))}
    </StyledWorkspace>
  );
}

export default Workspace;
