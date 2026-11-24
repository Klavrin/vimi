import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addTab } from '../store/reducers/tab-bar';
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
  // Editor views keyed by tab _id, so reordering tabs doesn't mix them up
  const markdownEditorRefs = useRef<Record<string, any>>({});
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
          savedContents: file.contents,
        }),
      );
      setTimeout(() => {
        dispatch(setAllowFocusing(true)); // doesn't work without a timeout
      });
      console.log('!!!!!!!!!!');
    });
  }, []);

  useEffect(() => {
    const activeTabId = tabs[activeTab]?._id;
    if (
      activeTabId &&
      markdownEditorRefs.current[activeTabId] &&
      allowFocusing
    ) {
      markdownEditorRefs.current[activeTabId].focus();
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
            tabId={tab._id}
            contents={tab.contents}
            markdownEditorRefs={markdownEditorRefs}
            previewMode={tab.previewMode}
          />
        </div>
      ))}
    </StyledWorkspace>
  );
}

export default Workspace;
