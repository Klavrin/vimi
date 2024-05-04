import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaX } from 'react-icons/fa6';
import { PiSidebarFill } from 'react-icons/pi';

import {
  setActiveTabIndex,
  removeTab,
  removeCurrentTab,
} from '../store/reducers/tab-bar';
import { setSidebarValue } from '../store/reducers/sidebar-active';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';
import darkTheme from '../styles/themes/dark';
import { State } from '../types/state';

function WorkspaceTabHeader() {
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  useEffect(() => {
    window.electron.ipcRenderer.on('closeCurrentTab', () => {
      dispatch(removeCurrentTab());
    });
  }, [dispatch]);

  const handleKeyDown = (e: any, index: number) => {
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
          <button type="button">
            <PiSidebarFill
              size={20}
              onClick={() => dispatch(setSidebarValue(true))}
            />
          </button>
        )}

        {tabs.map((tab, index) => (
          <div
            key={tab.basename}
            className="workspace-tab"
            onClick={() => dispatch(setActiveTabIndex(index))}
            role="button"
            tabIndex={index}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              background:
                index === activeTab
                  ? darkTheme.backgroundPrimary
                  : darkTheme.backgroundSecondary,
              border:
                index === activeTab
                  ? `1px solid ${darkTheme.borderColor}`
                  : '1px solid transparent',
              opacity: index === activeTab ? 1 : 0.6,
            }}
          >
            <p className="title">{tab.basename}</p>

            <div className="icon">
              <FaX
                style={{ display: index === activeTab ? 'block' : 'none' }}
                onClick={() => dispatch(removeTab(index))}
                role="button"
                size={14}
                tabIndex={index}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    dispatch(setActiveTabIndex(index));
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
