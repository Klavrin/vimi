import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaX } from 'react-icons/fa6';
import { Reorder } from 'framer-motion';
import { PiSidebarFill } from 'react-icons/pi';

import {
  setActiveTabIndex,
  setTabOrder,
  isTabDirty,
} from '../store/reducers/tab-bar';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import store from '../store';
import { requestCloseTab, saveCurrentTab } from '../utils/save-tab';

import Tooltip from './tooltip';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';
import { State } from '../types/state';

function WorkspaceTabHeader() {
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const tabIds = useMemo(() => tabs.map((tab) => tab._id), [tabs]);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const [iconHovered, setIconHovered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleIpcCloseCurrentTab = () => {
      const { tabs: currentTabs, activeTabIndex } = store.getState().tabBar;
      const currentTab = currentTabs[activeTabIndex];
      if (currentTab) requestCloseTab(currentTab._id);
    };

    const removeCloseListener = window.electron.ipcRenderer.on(
      'closeCurrentTab',
      handleIpcCloseCurrentTab,
    );
    const removeSaveListener = window.electron.ipcRenderer.on(
      'saveCurrentFile',
      saveCurrentTab,
    );

    return () => {
      removeCloseListener?.();
      removeSaveListener?.();
    };
  }, []);

  const handleCloseTab = (e: React.MouseEvent, _id: string) => {
    e.stopPropagation();
    requestCloseTab(_id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      dispatch(setActiveTabIndex(index));
    }
  };

  return (
    <StyledWorkspaceTabHeader>
      <div
        className="workspace-tabs"
        style={{ paddingLeft: !sidebarActive ? '4.5rem' : 0 }}
      >
        {!sidebarActive && (
          <>
            <button
              type="button"
              className="collapse-icon"
              onMouseOver={() => setIconHovered(true)}
              onMouseLeave={() => setIconHovered(false)}
              onFocus={() => null}
              onClick={() => dispatch(setSidebarValue(true))}
            >
              <PiSidebarFill size={20} className="icon" />
            </button>{' '}
            <Tooltip
              innerText="Expand"
              visible={iconHovered}
              style={{ transform: 'translate(-12px, 30px)' }}
            />
          </>
        )}
        <Reorder.Group
          as="div"
          axis="x"
          className="workspace-tab-list"
          values={tabIds}
          onReorder={(newIds: string[]) => dispatch(setTabOrder(newIds))}
        >
          {tabs.map((tab, index) => (
            <Reorder.Item
              as="div"
              key={tab._id}
              value={tab._id}
              className={`workspace-tab ${
                index === activeTab ? 'active' : ''
              } ${isTabDirty(tab) ? 'dirty' : ''}`}
              onClick={() => dispatch(setActiveTabIndex(index))}
              role="button"
              tabIndex={index}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{ opacity: index === activeTab ? 1 : 0.6 }}
            >
              <p className="title">{tab.title}</p>
              <div
                className="icon dirty-dot"
                role="img"
                aria-label="Unsaved changes"
              >
                <span />
              </div>
              <div
                className="icon close-icon"
                onClick={(e) => handleCloseTab(e, tab._id)}
              >
                <FaX />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
