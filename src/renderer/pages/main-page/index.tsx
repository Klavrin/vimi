import { useSelector } from 'react-redux';

import Editor from '../../components/editor';
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
          <Editor />
        )}
      </StyledMainPage>
    </>
  );
}

export default MainPage;
