import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegFolderClosed, FaRegFolderOpen, FaRegFile } from 'react-icons/fa6';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import { State } from '../types/state';

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

function SidebarItem({ item }: SidebarItemProps) {
  const [dirFilesVisible, setDirFilesVisible] = useState(false);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const parentSidebarItem = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleDirectoryClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
  ) => {
    e.stopPropagation();
    setDirFilesVisible(!dirFilesVisible);
  };

  const handleFileClick = (
    filePath: string,
    e: React.MouseEvent | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();

    // Check if this file exists in the tabs array before reading
    const pathExists = tabs.some((tab, index) => {
      if (tab.path === filePath) {
        // If the file exists in the tabs array - set that tab as active
        dispatch(setActiveTabIndex(index));
        return true;
      }
      return false;
    });
    if (pathExists) return;

    window.electron.ipcRenderer.sendMessage('readFile', filePath);
  };

  // Render file
  if (item.type === 'file')
    return (
      <div
        role="button"
        tabIndex={0}
        key={item.path}
        className="focusable sidebar-item"
        onClick={(event) => handleFileClick(item.path, event)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleFileClick(item.path, e);
        }}
      >
        <div className="title">
          <FaRegFile style={{ minWidth: 15 }} />
          {item.name}
        </div>
      </div>
    );

  useEffect(() => {
    const focusableChildItems =
      parentSidebarItem.current?.querySelectorAll('.focusable');

    // Do not focus directory child items when the directory is closing
    if (!dirFilesVisible) {
      focusableChildItems?.forEach((item) => {
        item.classList.remove('focusable');
      });
    }
  }, [dirFilesVisible]);

  // Render directory
  return (
    <div
      role="button"
      tabIndex={0}
      key={item.name}
      ref={parentSidebarItem}
      className="focusable sidebar-item"
      onClick={handleDirectoryClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleDirectoryClick(e);
      }}
    >
      <div className="title">
        {dirFilesVisible ? (
          <FaRegFolderOpen style={{ minWidth: 15 }} />
        ) : (
          <FaRegFolderClosed style={{ minWidth: 15 }} />
        )}
        <p>{item.name}</p>
      </div>

      <AnimatePresence>
        {dirFilesVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'backInOut' }}
          >
            <div className="directory-container">
              {/* TODO: Write a type for the child prop */}
              {item.children.map((child: any) => (
                <SidebarItem key={child.name} item={child} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SidebarItem;
