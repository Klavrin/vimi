import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { isTabDirty } from '../store/reducers/tab-bar';
import { saveTab } from '../utils/save-tab';
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
  const autosave = useSelector((state: State) => state.settings.autosave);
  const markdownEditorRefs = useRef<Record<string, any>>({});
  useVimConfig();

  // Autosave dirty tabs once the user stops typing for `delay` ms
  useEffect(() => {
    if (!autosave.enabled) return undefined;

    const timeout = setTimeout(() => {
      tabs.filter(isTabDirty).forEach(saveTab);
    }, autosave.delay);
    return () => clearTimeout(timeout);
  }, [tabs, autosave.enabled, autosave.delay]);

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
