import { useDispatch, useSelector } from 'react-redux';
import { setActiveTabIndex, removeTab } from '../store/reducers/tab-bar';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';
import { State } from '../types/state';

function WorkspaceTabHeader() {
  const activeTab = useSelector((state: State) => state.tabBar.activeTabIndex);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  return (
    <StyledWorkspaceTabHeader>
      <div
        className="workspace-tabs"
        style={{ paddingLeft: !sidebarActive ? '4.5rem' : 0 }}
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={tab.basename}
            style={{
              background:
                index === activeTab ? 'rgba(255, 255, 255, 0.2)' : 'none',
            }}
            className="workspace-tab"
            onClick={() => dispatch(setActiveTabIndex(index))}
          >
            {tab.basename}
            <button
              type="button"
              style={{ background: 'none' }}
              onClick={() => dispatch(removeTab(index))}
            >
              x
            </button>
          </button>
        ))}
      </div>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
