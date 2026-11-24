import { useEffect } from 'react';
import { Vim } from '@replit/codemirror-vim';
import { useDispatch } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import {
  decrementActiveTabIndex,
  incrementActiveTabIndex,
  togglePreviewMode,
} from '../store/reducers/tab-bar';
import { getCurrentTab, saveAndCloseTab, saveCurrentTab } from './save-tab';

function useVimConfig() {
  const dispatch = useDispatch();

  useEffect(() => {
    Vim.unmap('<Space>');
    Vim.map('<Space><Space>', 'l');

    // Toggle sidebar
    Vim.defineAction('toggleSidebar', () => {
      dispatch(setSidebarValue(true));
      const sidebar: any = document.querySelector('.focusable');
      sidebar?.focus();
    });
    Vim.mapCommand('<Space>e', 'action', 'toggleSidebar');

    // Move through tabs
    Vim.defineAction('moveToNextTab', () => {
      dispatch(incrementActiveTabIndex());
    });
    Vim.defineAction('moveToPrevTab', () => {
      dispatch(decrementActiveTabIndex());
    });
    Vim.mapCommand('L', 'action', 'moveToNextTab');
    Vim.mapCommand('H', 'action', 'moveToPrevTab');

    // Toggle preview mode
    Vim.defineAction('togglePreviewMode', () => {
      dispatch(togglePreviewMode());
    });
    Vim.mapCommand('<Space>p', 'action', 'togglePreviewMode');

    // :w saves the current file, :wq saves it and closes the tab
    Vim.defineEx('write', 'w', () => {
      saveCurrentTab();
    });
    const saveAndQuit = () => {
      const tab = getCurrentTab();
      if (tab) saveAndCloseTab(tab);
    };
    Vim.defineEx('wq', 'wq', saveAndQuit);
    Vim.defineEx('xit', 'x', saveAndQuit);
  }, [dispatch]);
}

export default useVimConfig;
