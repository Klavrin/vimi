import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegFolderClosed, FaRegFolderOpen, FaRegFile } from 'react-icons/fa6';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import { State } from '../types/state';

export type FileTree =
  | {
      _id: string;
      name: string;
      path: string;
      type: 'file';
    }
  | {
      _id: string;
      name: string;
      children: FileTree[];
      type: 'directory';
    };

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
        children: FileTree[];
        type: 'directory';
      };
};

function SidebarItem({ item }: SidebarItemProps) {
  const [dirFilesVisible, setDirFilesVisible] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamedFileValue, setRenamedFileValue] = useState(item.name);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const parentSidebarItem = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );

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

  const handleFileRenaming = (e: React.KeyboardEvent) => {
    e.preventDefault();
    setIsRenaming(true);
  };

  const handleInputKeydown = (e: React.KeyboardEvent, path: string) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      window.electron.ipcRenderer.sendMessage('renameFile', {
        filePath: path,
        newFileName: renamedFileValue,
      });
      window.electron.ipcRenderer.sendMessage(
        'readDirectory',
        currentDirectoryPath,
      );
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
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
          if (isRenaming) return;
          if (e.key === 'Enter' || e.key === ' ') handleFileClick(item.path, e);
          else if (e.key === 'r') handleFileRenaming(e);
          else if (e.key === 'd') console.log('delete file');
          else if (e.key === 'a') console.log('create new file');
        }}
      >
        <div className="title">
          <FaRegFile style={{ minWidth: 15 }} />
          {isRenaming ? (
            <input
              type="text"
              className="file-input-renaming"
              value={renamedFileValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setRenamedFileValue(e.target.value)}
              onKeyDown={(e) => handleInputKeydown(e, item.path)}
              autoFocus
            />
          ) : (
            <p>{item.name}</p>
          )}
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
