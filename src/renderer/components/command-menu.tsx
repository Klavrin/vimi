import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useDispatch, useSelector } from 'react-redux';
import { FaMagnifyingGlass, FaRegFile } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

import { setActiveTabIndex } from '../store/reducers/tab-bar';

import StyledCommandMenu from './styles/command-menu.styled';
import { State } from '../types/state';

function CommandMenu() {
  const [open, setOpen] = useState(false);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const dispatch = useDispatch();

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

  const handleCommandItemSelect = (index: number) => {
    dispatch(setActiveTabIndex(index));
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
            onClick={() => setOpen(false)}
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

                {tabs.map((tab, index) => (
                  <Command.Item
                    key={tab._id}
                    className="command-item"
                    onSelect={() => handleCommandItemSelect(index)}
                  >
                    <FaRegFile />
                    {tab.title}
                  </Command.Item>
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
