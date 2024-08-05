import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useDispatch, useSelector } from 'react-redux';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

import { setActiveTabIndex } from '../store/reducers/tab-bar';
import { setIsEditing } from '../store/reducers/workspace';

import CommandMenuItem from './command-menu-item';

import StyledCommandMenu from './styles/command-menu.styled';
import type { State } from '../types/state';
import type { File } from './sidebar';

function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [escapeKeyPressedTimes, setEscapeKeyPressedTimes] = useState(0);
  const tabs = useSelector((state: State) => state.tabBar.tabs);
  const fileTree = useSelector((state: State) => state.workspace.fileTree);
  const itemRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  /**
   * Open command menu
   */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault();
        setTimeout(() => {
          dispatch(setIsEditing(true)); // prevent vim sidebar mappings from interfering
        });
        setOpen((openValue) => !openValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  /**
   * Handle vim navigation in the command menu.
   *
   * By default cmdk has vim bindings. These work by holding `ctrl` and pressing `j` or `k` to navigate
   * up and down respectively. I do not like how the library handles vim navigation, therefore I decided
   * to come up with my own implementation. Since there is no way to set or access the index of the
   * active cmdk item, we have to walk around these limitations by accessing the DOM and locating a
   * Command.Item with the attributes `data-selected` and `aria-selected` both set to true. Using this
   * approach, we can identify the index of the active Command.Item, allowing us to define our custom
   * behavior.
   */
  useEffect(() => {
    if (!itemRef.current || !open || escapeKeyPressedTimes !== 1) return;

    const commandMenuItems = itemRef.current.querySelectorAll('[cmdk-item]');
    const menuItems = Array.from(commandMenuItems);

    const keyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === 'j' || e.key === 'k') {
        handleCommandMenuSelection(commandMenuItems, menuItems, e.key);
      }
    };

    document.addEventListener('keydown', keyDown);
    return () => document.removeEventListener('keydown', keyDown);
  }, [open, escapeKeyPressedTimes, itemRef]);

  /**
   * Reads the selected file and opens a new tab with that file.
   * @param tab
   * @param index
   */
  const handleCommandItemClick = (tab: File, index: number) => {
    const tabExists = tabs.some((t) => t._id === tab._id);

    if (!tabExists) {
      window.electron.ipcRenderer.sendMessage('readFile', tab.path);
      dispatch(setActiveTabIndex(tabs.length));
      setEscapeKeyPressedTimes(0);
    } else {
      dispatch(setActiveTabIndex(index));
    }

    dispatch(setIsEditing(false));
    setOpen(false);
  };

  /**
   * Selects the next or the previous `Command.Item` index.
   * @param commandMenuItems
   * @param menuItems
   * @param key
   */
  const handleCommandMenuSelection = (
    commandMenuItems: NodeListOf<Element>,
    menuItems: Element[],
    key: string,
  ) => {
    const index = menuItems.findIndex(
      (item: any) =>
        item.getAttribute('data-selected') === 'true' &&
        item.getAttribute('aria-selected') === 'true',
    );

    if (index === -1) return;

    const direction = key === 'j' || key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + direction + menuItems.length) % menuItems.length; // use the modulus operator to loop through the menu

    ['data-selected', 'aria-selected'].forEach((attr) => {
      commandMenuItems[index].setAttribute(attr, 'false');
      commandMenuItems[nextIndex].setAttribute(attr, 'true');
    });
  };

  /**
   * Counts how many times the escape key was pressed and enables the custom vim navigation.
   * Includes ArrowDown` and `ArrowUp` because, by default cmdk, has keydown event listeners
   * for both of the keys. This conflicts with our custom vim navigation. This is why we
   * are not letting cmdk "see" that we are pressing both of these keys in the
   * `handleCommandMenuKeyDown` handler -- because we do not want cmdk's implementation
   * to conflict with ours.
   * @param e
   */
  const handleCommandMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!itemRef.current || !open) return;

      const commandMenuItems = itemRef.current.querySelectorAll('[cmdk-item]');
      const menuItems = Array.from(commandMenuItems);

      handleCommandMenuSelection(commandMenuItems, menuItems, e.key);
      return;
    }

    if (e.key === 'Escape') {
      if (escapeKeyPressedTimes === 1) {
        setEscapeKeyPressedTimes(0);
        dispatch(setIsEditing(false));
        return;
      }

      e.preventDefault();
      setEscapeKeyPressedTimes(escapeKeyPressedTimes + 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Command Menu"
          onKeyDown={handleCommandMenuKeyDown}
          vimBindings={false}
          loop
        >
          <StyledCommandMenu
            onClick={() => {
              dispatch(setIsEditing(false));
              setOpen(false);
            }}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="container" ref={itemRef}>
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
                    handleCommandItemClick={handleCommandItemClick}
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
