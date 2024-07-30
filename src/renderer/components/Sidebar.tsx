import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import { setFileTree } from '../store/reducers/workspace';
import { sortFileTree } from '../utils/sort-file-tree';

import InteractiveZone from './sidebar-interactive-zone';
import SidebarItem from './sidebar-item';
import SidebarTabHeader from './sidebar-tab-header';
import SidebarDraggableZone from './sidebar-resizable-zone';

import StyledSidebar from './styles/sidebar.styled';
import { State } from '../types/state';

// TODO: Poor TypeScript code, find a way to rewrite it!
type SidebarItemProps = {
  item:
    | {
        _id: string;
        name: string;
        path: string;
        type: 'file';
      }
    | {
        _id: string;
        name: string;
        children: SidebarItemProps[];
        type: 'directory';
      };
};

export type File = {
  _id: string;
  name: string;
  path: string;
  type: 'file';
};

export type Directory = {
  _id: string;
  name: string;
  children: SidebarItemProps[];
  type: 'directory';
};

function Sidebar() {
  const [interactiveZoneWasHovered, setInteractiveZoneWasHovered] =
    useState(false);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(
    localStorage.getItem('sidebar-width')
      ? Number(localStorage.getItem('sidebar-width'))
      : 220,
  );
  const [isDragging, setIsDragging] = useState(false);

  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );
  const isEditing = useSelector((state: State) => state.workspace.isEditing);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentDirectoryPath) {
      window.electron.ipcRenderer.sendMessage(
        'readDirectory',
        currentDirectoryPath,
      );
      window.electron.ipcRenderer.on('dirPathContents', (dirItems: any) => {
        setDirectoryFiles(dirItems);
        dispatch(setFileTree(sortFileTree(dirItems)));
      });
    }
  }, [currentDirectoryPath]);

  useEffect(() => {
    const handleVimNavigation = (e: KeyboardEvent) => {
      if (isEditing) return;

      if (containerRef.current) {
        const interactiveElements: HTMLButtonElement[] = Array.from(
          containerRef.current.querySelectorAll('.focusable'),
        );

        if (e.key === 'j' || e.key === 'ArrowDown') {
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
          else if (interactiveElements[nextIndex].tabIndex !== 0)
            interactiveElements[nextIndex + 1].focus();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
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

      <div onMouseLeave={handleMouseLeave}>
        <StyledSidebar
          as={motion.div}
          style={{ width: sidebarActive ? sidebarWidth : 0 }}
          animate={{ width: sidebarActive ? sidebarWidth : 0 }}
          transition={{ duration: !isDragging ? 0.2 : 0, ease: 'circInOut' }}
        >
          <SidebarTabHeader />
          <div className="container">
            <div className="sidebar-content" ref={containerRef}>
              {directoryFiles.map((dir: Directory | File) => (
                <SidebarItem key={dir.name} item={dir} />
              ))}
            </div>
          </div>
        </StyledSidebar>
      </div>

      {sidebarActive && (
        <SidebarDraggableZone
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      )}
    </>
  );
}

export default Sidebar;
