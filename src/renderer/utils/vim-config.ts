import { useEffect } from 'react';
import { Vim } from '@replit/codemirror-vim';
import { useDispatch } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';

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
  }, [dispatch]);
}

export default useVimConfig;
