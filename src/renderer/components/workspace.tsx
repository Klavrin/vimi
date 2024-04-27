import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from '../store/reducers/tab-bar';

import TextEditor from './text-editor';

import useVimConfig from '../utils/vim-config';
import StyledWorkspace from './styles/workspace.styled';
import { State } from '../types/state';

function Workspace() {
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const dispatch = useDispatch();
  useVimConfig();

  useEffect(() => {
    window.electron.ipcRenderer.on('fileContents', (file: any) => {
      dispatch(
        addTab({
          path: file.path,
          basename: file.basename,
          contents: file.contents,
        }),
      );
    });
  }, [dispatch]);

  return (
    <StyledWorkspace>
      {tabs.map((tab, index) => (
        <div
          key={tab.basename}
          style={{ display: index === activeTab ? 'block' : 'none' }}
        >
          <TextEditor contents={tab.contents} />
        </div>
      ))}
    </StyledWorkspace>
  );
}

export default Workspace;
