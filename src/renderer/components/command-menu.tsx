import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useDispatch, useSelector } from 'react-redux';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

import { setActiveTabIndex } from '../store/reducers/tab-bar';

import CommandMenuItem from './command-menu-item';

import StyledCommandMenu from './styles/command-menu.styled';
import type { State } from '../types/state';
import type { File } from './sidebar';

function CommandMenu() {
  const [open, setOpen] = useState(false);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const fileTree = useSelector((state: State) => state.workspace.fileTree);
  const dispatch = useDispatch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((openValue) => !openValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCommandItemSelect = (tab: File, index: number) => {
    const tabExists = tabs.some((t) => t._id === tab._id);

    console.log(tabExists);
    if (!tabExists) {
      window.electron.ipcRenderer.sendMessage('readFile', tab.path);
      dispatch(setActiveTabIndex(tabs.length));
    } else {
      dispatch(setActiveTabIndex(index));
    }

    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Command Menu"
          loop
        >
          <StyledCommandMenu
            // onClick={() => setOpen(false)}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="container">
              <div className="input-field">
                <FaMagnifyingGlass className="magnifying-glass" />
                <Command.Input placeholder="Search files" />
              </div>

              <Command.List>
                <Command.Empty className="command-item">
                  No results found.
                </Command.Empty>

                {fileTree.map((tab, index) => (
                  <CommandMenuItem
                    key={tab._id}
                    tab={tab}
                    handleCommandItemSelect={handleCommandItemSelect}
                    index={index}
                  />
                ))}
              </Command.List>
            </div>
          </StyledCommandMenu>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}

export default CommandMenu;
