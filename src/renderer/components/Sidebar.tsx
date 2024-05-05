import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from 'antd';
import { motion } from 'framer-motion';
import { setSidebarValue } from '../store/reducers/sidebar-active';

import InteractiveZone from './sidebar-interactive-zone';
import SidebarItem from './sidebar-item';
import SidebarTabHeader from './sidebar-tab-header';
import StyledSidebar from './styles/sidebar.styled';

import { State } from '../types/state';

// TODO: Poor TypeScript code, find a way to rewrite it!
type SidebarItemProps = {
  item:
    | {
        name: string;
        path: string;
        type: 'file';
      }
    | {
        name: string;
        children: SidebarItemProps[];
        type: 'directory';
      };
};

type File = {
  name: string;
  path: string;
  type: 'file';
};

type Directory = {
  name: string;
  children: SidebarItemProps[];
  type: 'directory';
};

function Sidebar() {
  const [interactiveZoneWasHovered, setInteractiveZoneWasHovered] =
    useState(false);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );
  const isEditing = useSelector((state: State) => state.workspace.isEditing);
  const containerRef = useRef<HTMLButtonElement>(null);
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
    const handleVimNavigation = (e: KeyboardEvent) => {
      if (isEditing) return;

      if (containerRef.current) {
        const interactiveElements: HTMLButtonElement[] = Array.from(
          containerRef.current.querySelectorAll('button'),
        );

        if (e.key === 'j') {
          e.preventDefault();
          const currentIndex = interactiveElements.indexOf(
            document.activeElement as HTMLButtonElement,
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
            document.activeElement as HTMLButtonElement,
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

      <motion.div
        key="sidebar"
        animate={{ width: sidebarActive ? 240 : 0 }}
        style={{ width: sidebarActive ? 240 : 0, maxWidth: 240 }}
        transition={{ duration: 0.2 }}
        className="sidebar-container"
        onMouseLeave={handleMouseLeave}
      >
        <StyledSidebar>
          <SidebarTabHeader />
          <Flex className="container" ref={containerRef}>
            {directoryFiles.map((dir: Directory | File) => (
              <SidebarItem key={dir.name} item={dir} />
            ))}
          </Flex>
        </StyledSidebar>
      </motion.div>
    </>
  );
}

export default Sidebar;
