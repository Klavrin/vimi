import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaX } from 'react-icons/fa6';
import { PiSidebarFill } from 'react-icons/pi';

import {
  setActiveTabIndex,
  removeCurrentTab,
  decrementActiveTabIndex,
} from '../store/reducers/tab-bar';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import store from '../store';

import Tooltip from './tooltip';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';
import { State } from '../types/state';

function WorkspaceTabHeader() {
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const [iconHovered, setIconHovered] = useState(false);
  const dispatch = useDispatch();

  console.log('activeTab', activeTab);

  useEffect(() => {
    const handleIpcCloseCurrentTab = () => {
      const state = store.getState();
      const currentActiveTab = state.tabBar.activeTabIndex;
      const currentTabs = state.tabBar.tabs;

      dispatch(removeCurrentTab());
      if (currentActiveTab === currentTabs.length - 1) {
        dispatch(decrementActiveTabIndex());
      }
    };

    window.electron.ipcRenderer.on('closeCurrentTab', handleIpcCloseCurrentTab);
  }, []);

  const handleCloseTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeCurrentTab());
    if (activeTab === tabs.length - 1) {
      dispatch(decrementActiveTabIndex());
    }
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
            </button>
            <Tooltip
              innerText="Expand"
              visible={iconHovered}
              style={{ transform: 'translate(-12px, 30px)' }}
            />
          </>
        )}

        {tabs.map((tab, index) => (
          <div
            key={tab.title}
            className={`workspace-tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTabIndex(index))}
            role="button"
            tabIndex={index}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{ opacity: index === activeTab ? 1 : 0.6 }}
          >
            <p className="title">{tab.title}</p>
            <div
              className="icon"
              style={{ display: index === activeTab ? 'block' : 'none' }}
              onClick={handleCloseTab}
            >
              <FaX />
            </div>
          </div>
        ))}
      </div>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
