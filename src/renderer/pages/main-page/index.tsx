import { Button, Flex, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../store/state';
import { toggleSidebar } from '../../store/reducers/sidebar-active';
import Sidebar from '../../components/Sidebar';

function MainPage() {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  return (
    <>
      <Sidebar />

      <div style={{ paddingLeft: sidebarActive ? 240 : 0 }}>
        <h1>Hello</h1>
        <Button
          onClick={() => dispatch(toggleSidebar())}
          size="small"
          type="primary"
        >
          Sidebar on/off
        </Button>

        <Flex>
          <p>hello</p>
          <p>yo</p>
          <Switch size="small" />
        </Flex>
      </div>
    </>
  );
}

export default MainPage;
