import { useSelector } from 'react-redux';

import Editor from '../../components/editor';
import Sidebar from '../../components/sidebar';
import TabBar from '../../components/tab-bar';
import StyledMainPage from './main-page';
import type { State } from '../../types/state';

function MainPage() {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );

  return (
    <>
      <TabBar />
      <Sidebar />

      <StyledMainPage style={{ paddingLeft: sidebarActive ? 240 : 0 }}>
        {currentDirectoryPath === '' ? (
          'Drag a folder from you computer to get started.'
        ) : (
          <Editor />
        )}
      </StyledMainPage>
    </>
  );
}

export default MainPage;
