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

      {/* <div style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
        {[
          1, 2, 3, 4, 5, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 33, 3,
        ].map(() => (
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            reiciendis facilis inventore placeat eius ullam, iure magni maiores.
            Officia quasi eaque natus mollitia optio velit ad aspernatur quos
            nostrum dolorum?
          </p>
        ))}
      </div> */}

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
