import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTabIndex } from '../store/reducers/tab-bar';

import { State } from '../types/state';

type SidebarItemProps = {
  item:
    | { name: string; path: string; type: 'file' }
    | {
        name: string;
        children: SidebarItemProps[];
        type: 'directory';
      };
};

function SidebarItem({ item }: SidebarItemProps) {
  const [dirFilesVisible, setDirFilesVisible] = useState(false);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const dispatch = useDispatch();

  const handleDirectoryClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setDirFilesVisible(!dirFilesVisible);
  };

  const handleFileClick = (filePath: string, e: any) => {
    e.stopPropagation();

    // Check if this file exists before reading
    const pathExists = tabs.some((tab, index) => {
      if (tab.path === filePath) {
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
      <button
        type="button"
        key={item.path}
        className="note"
        onClick={(event) => handleFileClick(item.path, event)}
      >
        FILE: {item.name}
      </button>
    );

  // Render directory
  return (
    <button
      type="button"
      key={item.name}
      className="note"
      onClick={handleDirectoryClick}
    >
      DIR: {item.name}
      {dirFilesVisible && (
        <div className="directory-container">
          {/* TODO: Write a type for the child prop */}
          {item.children.map((child: any) => (
            <SidebarItem key={child.name} item={child} />
          ))}
        </div>
      )}
    </button>
  );
}

export default SidebarItem;
