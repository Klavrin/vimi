import { Tabs, Tab } from 'react-tabs';
import { useDispatch } from 'react-redux';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import StyledWorkspaceTabHeader from './styles/workspace-tab-header';

function WorkspaceTabHeader() {
  const dispatch = useDispatch();

  return (
    <StyledWorkspaceTabHeader>
      <Tabs className="workspace-tabs">
        <Tab
          className="workspace-tab"
          onClick={() => dispatch(setActiveTabIndex(0))}
        >
          Tab 1
        </Tab>
        <Tab
          className="workspace-tab"
          onClick={() => dispatch(setActiveTabIndex(1))}
        >
          Tab 2
        </Tab>
      </Tabs>
    </StyledWorkspaceTabHeader>
  );
}

export default WorkspaceTabHeader;
