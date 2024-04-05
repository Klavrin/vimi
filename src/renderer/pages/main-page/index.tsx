import { Button, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { State } from '../../types/state';
import { toggleSidebar } from '../../store/reducers/sidebar-active';
import { changeTheme } from '../../store/reducers/theme';
import Sidebar from '../../components/Sidebar';
import Editor from '../../components/Editor';
import StyledMainPage from './main-page';

function MainPage() {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );
  const dispatch = useDispatch();

  return (
    <>
      <Sidebar />

      <StyledMainPage style={{ paddingLeft: sidebarActive ? 240 : 0 }}>
        {currentDirectoryPath === '' ? (
          'Drag a folder from you computer to get started.'
        ) : (
          <>
            <Editor />

            <Button
              onClick={() => dispatch(toggleSidebar())}
              size="small"
              type="primary"
            >
              Sidebar on/off
            </Button>

            {/* <Select
              style={{ width: 300 }}
              onChange={(value) => dispatch(changeTheme(value))}
            >
              <Select.Option value="dark">Dark</Select.Option>
              <Select.Option value="light">Light</Select.Option>
              <Select.Option value="gruvbox">Gruvbox</Select.Option>
              <Select.Option value="midnight-blue">Midnight-Blue</Select.Option>
            </Select> */}
          </>
        )}
      </StyledMainPage>
    </>
  );
}

export default MainPage;
