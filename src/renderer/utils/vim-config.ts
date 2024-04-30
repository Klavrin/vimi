import { useEffect } from 'react';
import { Vim } from '@replit/codemirror-vim';
import { useDispatch } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import {
  decrementActiveTabIndex,
  incrementActiveTabIndex,
} from '../store/reducers/tab-bar';

function useVimConfig() {
  const dispatch = useDispatch();

  useEffect(() => {
    Vim.unmap('<Space>');
    Vim.map('<Space><Space>', 'l');
    Vim.defineAction('toggleSidebar', () => {
      dispatch(setSidebarValue(true));
      const sidebar: any = document.querySelector('.note');
      sidebar?.focus();
    });
    Vim.mapCommand('<Space>e', 'action', 'toggleSidebar');

    Vim.defineAction('moveToNextTab', () => {
      dispatch(incrementActiveTabIndex());
    });
    Vim.defineAction('moveToPrevTab', () => {
      dispatch(decrementActiveTabIndex());
    });
    Vim.mapCommand('L', 'action', 'moveToNextTab');
    Vim.mapCommand('H', 'action', 'moveToPrevTab');
  }, [dispatch]);
}

export default useVimConfig;
