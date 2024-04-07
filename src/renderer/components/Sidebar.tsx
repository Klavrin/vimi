import { useEffect, useState, useRef } from 'react';
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
  const isEditing = useSelector((state: State) => state.editor.isEditing);
  const containerRef = useRef<any>(null);
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

  useEffect(() => {
    const handleVimNavigation = (e: any) => {
      if (isEditing) return;

      if (containerRef.current) {
        const interactiveElements: any = Array.from(
          containerRef.current.querySelectorAll('button'),
        );

        if (e.key === 'j') {
          e.preventDefault();
          const currentIndex = interactiveElements.indexOf(
            document.activeElement,
          );
          const nextIndex =
            currentIndex === interactiveElements.length - 1
              ? 0
              : currentIndex + 1;
          if (interactiveElements[nextIndex])
            interactiveElements[nextIndex].focus();
        } else if (e.key === 'k') {
          e.preventDefault();
          const currentIndex = interactiveElements.indexOf(
            document.activeElement,
          );
          const prevIndex =
            currentIndex === 0
              ? interactiveElements.length - 1
              : currentIndex - 1;
          if (interactiveElements[prevIndex])
            interactiveElements[prevIndex].focus();
        }
      }
    };

    document.addEventListener('keydown', handleVimNavigation);
    return () => document.removeEventListener('keydown', handleVimNavigation);
  }, [isEditing, dispatch]);

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

      <StyledSidebar
        style={{
          transform: sidebarActive ? `translateX(0)` : `translateX(-240px)`,
        }}
        onMouseLeave={handleMouseLeave}
      >
        <Flex className="container" ref={containerRef}>
          {directoryFiles.map((dir: any) => (
            <SidebarItem key={dir.name} item={dir} />
          ))}
        </Flex>
      </StyledSidebar>
    </>
  );
}

export default Sidebar;
