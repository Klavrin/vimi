import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from 'antd';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import { State } from '../types/state';
import InteractiveZone from './SidebarInteractiveZone';
import SidebarItem from './SidebarItem';
import StyledSidebar from './styles/sidebar.styled';

function Sidebar() {
  const [interactiveZoneWasHovered, setInteractiveZoneWasHovered] =
    useState(false);
  const [directoryFiles, setDirectoryFiles] = useState(['no files']);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentDirectoryPath) {
      window.electron.ipcRenderer.sendMessage(
        'readDirectory',
        currentDirectoryPath,
      );
      window.electron.ipcRenderer.on('dirPathContents', (dirItems: any) => {
        setDirectoryFiles(dirItems);
      });
    }
  }, [currentDirectoryPath]);

  /**
   * If the user hovered the interactive zone, a.k.a used their
   * cursor to open the sidebar, then when the cursor leaves the sidebar
   * the sidebar will close.
   *
   * However, if the sidebar was opened by other means, no effect will take place.
   */
  const handleMouseLeave = () => {
    if (interactiveZoneWasHovered) {
      dispatch(setSidebarValue(false));
      setInteractiveZoneWasHovered(false);
    }
  };

  return (
    <>
      <InteractiveZone
        interactiveZoneWasHovered={() => setInteractiveZoneWasHovered(true)}
      />

      {sidebarActive && (
        <StyledSidebar onMouseLeave={handleMouseLeave}>
          <Flex className="container">
            {directoryFiles.map((dir: any) => (
              <SidebarItem key={dir.name} item={dir} />
            ))}
          </Flex>
        </StyledSidebar>
      )}
    </>
  );
}

export default Sidebar;
