import { useDispatch, useSelector } from 'react-redux';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';
import { State } from '../types/state';

function WorkspaceTabHeader() {
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const dispatch = useDispatch();

  return (
    <StyledWorkspaceTabHeader>
      <div className="workspace-tabs">
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={tab.basename}
            className="workspace-tab"
            onClick={() => dispatch(setActiveTabIndex(index))}
          >
            {tab.basename}
            {/* <button type="button" style={{ background: 'none' }}>
              x
            </button> */}
          </button>
        ))}
      </div>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
