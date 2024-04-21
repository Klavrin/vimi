import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab, TabList } from 'react-tabs';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import StyledTabBar from './styles/tab-bar.styled';
import { State } from '../types/state';

function TabBar() {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  return (
    <StyledTabBar style={{ paddingLeft: sidebarActive ? 198 : '2rem' }}>
      <Tabs className="tabs-container">
        <TabList className="tab-list">
          <Tab className="tab" onClick={() => dispatch(setActiveTabIndex(0))}>
            tab 1
          </Tab>
          <Tab className="tab" onClick={() => dispatch(setActiveTabIndex(1))}>
            tab 2
          </Tab>
        </TabList>
      </Tabs>
    </StyledTabBar>
  );
}

export default TabBar;
