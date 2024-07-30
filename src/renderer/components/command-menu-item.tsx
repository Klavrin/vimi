import { Command } from 'cmdk';
import { FaRegFolderClosed, FaRegFile } from 'react-icons/fa6';
import type { FileTree } from './sidebar-item';

type CommandMenuItemProps = {
  tab: FileTree;
  handleCommandItemSelect: any;
  index: number;
  dirName?: string;
};

function CommandMenuItem({
  tab,
  handleCommandItemSelect,
  index,
  dirName,
}: CommandMenuItemProps) {
  if (tab.type === 'file') {
    return (
      <Command.Item
        key={tab._id}
        className="command-item"
        onSelect={() => handleCommandItemSelect(tab, index)}
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
            handleCommandItemSelect={handleCommandItemSelect}
            index={index}
            dirName={tab.name}
          />
        ))}
      </>
    );
  }
}

export default CommandMenuItem;
