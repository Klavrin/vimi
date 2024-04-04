import { useState } from 'react';

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

  // Render file
  if (item.type === 'file')
    return (
      <div key={item.path} className="note">
        FILE: {item.name}
      </div>
    );

  // Render directory
  return (
    <button
      type="button"
      key={item.name}
      className="note"
      onClick={() => setDirFilesVisible(!dirFilesVisible)}
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
