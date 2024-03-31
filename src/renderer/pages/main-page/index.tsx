import { Button, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { State } from '../../types/state';
import { toggleSidebar } from '../../store/reducers/sidebar-active';
import Sidebar from '../../components/Sidebar';

function MainPage() {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  return (
    <>
      <Sidebar />

      <div style={{ paddingLeft: sidebarActive ? 240 : 0 }}>
        <Button
          onClick={() => dispatch(toggleSidebar())}
          size="small"
          type="primary"
        >
          Sidebar on/off
        </Button>
        <Switch size="small" />
      </div>
    </>
  );
}

export default MainPage;
