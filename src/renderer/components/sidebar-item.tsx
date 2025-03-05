import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegFolderClosed, FaRegFolderOpen, FaRegFile } from 'react-icons/fa6';
import { removeTab, setActiveTabIndex } from '../store/reducers/tab-bar';

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
      path: string;
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
        path: string;
        type: 'directory';
      };
};

function SidebarItem({ item }: SidebarItemProps) {
  const [dirFilesVisible, setDirFilesVisible] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingDir, setIsCreatingDir] = useState(false);
  const [renamedFileValue, setRenamedFileValue] = useState(item.name);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const currentDirectoryPath = useSelector(
    (state: State) => state.currentDirectory.currentDirectoryPath,
  );
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

  const handleFileCreation = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirFilesVisible(true);
    setRenamedFileValue('');
    setIsCreatingFile(true);
  };

  const handleFileCreationInputKeydown = (
    e: React.KeyboardEvent,
    path: string,
    fileName: string,
  ) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      console.log(path);
      window.electron.ipcRenderer.sendMessage('createFile', {
        filePath: path,
        fileName,
      });
      setTimeout(() => {
        window.electron.ipcRenderer.sendMessage(
          'readDirectory',
          currentDirectoryPath,
        );
      });
      setIsCreatingFile(false);
    } else if (e.key === 'Escape') {
      setIsCreatingFile(false);
    }
  };

  const handleFileDeletion = (
    filePath: string,
    fileId: string,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    window.electron.ipcRenderer.sendMessage('showConfirmDialog');
    window.electron.ipcRenderer.on('showConfirmDialogReply', (isConfirmed) => {
      if (isConfirmed) {
        window.electron.ipcRenderer.sendMessage('deleteFile', filePath);
        window.electron.ipcRenderer.on('fileSuccessfullyDeleted', () => {
          setTimeout(() => {
            window.electron.ipcRenderer.sendMessage(
              'readDirectory',
              currentDirectoryPath,
            );
          });

          // Remove the deleted file from the tabs array
          tabs.some((tab) => {
            if (tab.path === filePath) {
              dispatch(removeTab(tab._id));
            }
          });
        });
      }
    });
  };

  const handleDirRenaming = (e: React.KeyboardEvent) => {
    e.preventDefault();
    setIsRenaming(true);
  };

  const handleDirInputKeydown = (e: React.KeyboardEvent, path: string) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      window.electron.ipcRenderer.sendMessage('renameDirectory', {
        dirPath: path,
        newDirectoryName: renamedFileValue,
      });
      window.electron.ipcRenderer.sendMessage(
        'readDirectory',
        currentDirectoryPath,
      );
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const handleDirCreation = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirFilesVisible(true);
    setRenamedFileValue('');
    setIsCreatingDir(true);
  };

  const handleDirCreationInputKeydown = (
    e: React.KeyboardEvent,
    path: string,
    dirName: string,
  ) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      console.log(path);
      window.electron.ipcRenderer.sendMessage('createDirectory', {
        dirPath: path,
        dirName,
      });
      setTimeout(() => {
        window.electron.ipcRenderer.sendMessage(
          'readDirectory',
          currentDirectoryPath,
        );
      });
      setIsCreatingDir(false);
    } else if (e.key === 'Escape') {
      setIsCreatingDir(false);
    }
  };

  const handleDirDeletion = (
    dirPath: string,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    window.electron.ipcRenderer.sendMessage('showConfirmDialog');
    window.electron.ipcRenderer.on('showConfirmDialogReply', (isConfirmed) => {
      if (isConfirmed) {
        window.electron.ipcRenderer.sendMessage('deleteFile', dirPath);
        window.electron.ipcRenderer.on('fileSuccessfullyDeleted', () => {
          setTimeout(() => {
            window.electron.ipcRenderer.sendMessage(
              'readDirectory',
              currentDirectoryPath,
            );
          });
        });
      }
    });
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
          else if (e.key === 'd') handleFileDeletion(item.path, item._id, e);
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
        if (isRenaming) return;
        if (e.key === 'Enter' || e.key === ' ') handleDirectoryClick(e);
        else if (e.key === 'a') handleFileCreation(e);
        else if (e.key === 'r') handleDirRenaming(e);
        else if (e.key === 'D') handleDirCreation(e);
        else if (e.key === 'd') handleDirDeletion(item.path, e);
      }}
    >
      <div className="title">
        {dirFilesVisible ? (
          <FaRegFolderOpen style={{ minWidth: 15 }} />
        ) : (
          <FaRegFolderClosed style={{ minWidth: 15 }} />
        )}
        {isRenaming ? (
          <input
            type="text"
            className="file-input-renaming"
            value={renamedFileValue}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setRenamedFileValue(e.target.value)}
            onKeyDown={(e) => handleDirInputKeydown(e, item.path)}
            autoFocus
          />
        ) : (
          <p>{item.name}</p>
        )}
      </div>

      <AnimatePresence>
        {dirFilesVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '77%' }}
            exit={{ height: 0 }}
            // transition={{ duration: 0.25, ease: 'backInOut' }}
            transition={{ duration: 5, ease: 'backInOut' }}
          >
            <div className="directory-container">
              {/* TODO: Write a type for the child prop */}
              {item.children.map((child: any) => (
                <SidebarItem key={child.name} item={child} />
              ))}
              {(isCreatingFile || isCreatingDir) && (
                <div className="sidebar-item focusable">
                  <div className="title">
                    {isCreatingFile ? (
                      <FaRegFile style={{ minWidth: 15 }} />
                    ) : (
                      <FaRegFolderClosed style={{ minWidth: 15 }} />
                    )}
                    <input
                      type="text"
                      className="file-input-renaming"
                      value={renamedFileValue}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setRenamedFileValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (!isCreatingDir) {
                          console.log(item.path);
                          handleFileCreationInputKeydown(
                            e,
                            item.path,
                            renamedFileValue,
                          );
                        } else {
                          handleDirCreationInputKeydown(
                            e,
                            item.path,
                            renamedFileValue,
                          );
                        }
                      }}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SidebarItem;
