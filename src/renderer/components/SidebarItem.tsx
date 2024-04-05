import React, { useState } from 'react';

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

  const handleDirectoryClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setDirFilesVisible(!dirFilesVisible);
  };

  const handleFileClick = (filePath: string, e: any) => {
    e.stopPropagation();
    window.electron.ipcRenderer.sendMessage('readFile', filePath);
  };

  // Render file
  if (item.type === 'file')
    return (
      <button
        onClick={(event) => handleFileClick(item.path, event)}
        type="button"
        key={item.path}
        className="note"
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
