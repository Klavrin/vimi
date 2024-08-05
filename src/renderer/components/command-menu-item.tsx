import { Command } from 'cmdk';
import { FaRegFolderClosed, FaRegFile } from 'react-icons/fa6';
import type { FileTree } from './sidebar-item';

type CommandMenuItemProps = {
  tab: FileTree;
  handleCommandItemClick: any;
  index: number;
  dirName?: string;
};

function CommandMenuItem({
  tab,
  handleCommandItemClick,
  index,
  dirName,
}: CommandMenuItemProps) {
  if (tab.type === 'file') {
    return (
      <Command.Item
        key={tab._id}
        className="command-item"
        onSelect={() => handleCommandItemClick(tab, index)}
      >
        <div className="command-item-title">
          <FaRegFile style={{ minWidth: 15 }} />
          {tab.name}
        </div>
        <div className="command-item-tag">
          <FaRegFolderClosed style={{ minWidth: 15 }} />
          <p>{dirName ?? '/'}</p>
        </div>
      </Command.Item>
    );
  }

  if (tab.type === 'directory') {
    return (
      <>
        {tab.children.map((child) => (
          <CommandMenuItem
            key={child.name}
            tab={child}
            handleCommandItemClick={handleCommandItemClick}
            index={index}
            dirName={tab.name}
          />
        ))}
      </>
    );
  }
}

export default CommandMenuItem;
