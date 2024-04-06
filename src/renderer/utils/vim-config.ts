import { useEffect } from 'react';
import { Vim } from '@replit/codemirror-vim';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/reducers/sidebar-active';

function useVimConfig() {
  const dispatch = useDispatch();

  useEffect(() => {
    Vim.unmap('<Space>');
    Vim.map('<Space><Space>', 'l');
    Vim.defineAction('toggleSidebar', () => {
      dispatch(toggleSidebar());
    });
    Vim.mapCommand('<Space>e', 'action', 'toggleSidebar');

    return () => Vim.unmapAll();
  }, []);
}

export default useVimConfig;
