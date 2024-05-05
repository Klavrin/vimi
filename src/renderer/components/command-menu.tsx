import { useState, useEffect } from 'react';
import { Command } from 'cmdk';

import StyledCommandMenu from './styles/command-menu.styled';

function CommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((openValue) => !openValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <StyledCommandMenu>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
      >
        <Command.Input />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Letters">
            <Command.Item>a</Command.Item>
            <Command.Item>b</Command.Item>
            <Command.Separator />
            <Command.Item>c</Command.Item>
          </Command.Group>

          <Command.Item>Apple</Command.Item>
        </Command.List>
      </Command.Dialog>
    </StyledCommandMenu>
  );
}

export default CommandMenu;
