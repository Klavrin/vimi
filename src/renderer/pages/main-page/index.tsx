import { useSelector } from 'react-redux';

import Workspace from '../../components/workspace';
import Sidebar from '../../components/sidebar';
// import TabBar from '../../components/tab-bar';
import StyledMainPage from './main-page.styled';
import type { State } from '../../types/state';

function MainPage() {
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );

  return (
    <>
      <Sidebar />

      <StyledMainPage>
        {currentDirectoryPath === '' ? (
          'Drag a folder from you computer to get started.'
        ) : (
          <Workspace />
        )}
      </StyledMainPage>
    </>
  );
}

export default MainPage;
