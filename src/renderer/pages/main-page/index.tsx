import { useSelector } from 'react-redux';

import Workspace from '../../components/workspace';
import WorkspaceTabHeader from '../../components/workspace-tab-header';
import Sidebar from '../../components/sidebar';

import StyledMainPage from './main-page.styled';

import type { State } from '../../types/state';

function MainPage() {
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );

  return (
    <>
      <Sidebar />
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <WorkspaceTabHeader />

        <StyledMainPage>
          {currentDirectoryPath === '' ? (
            'Drag a folder from your computer to get started.'
          ) : (
            <Workspace />
          )}
        </StyledMainPage>
      </div>
    </>
  );
}

export default MainPage;
