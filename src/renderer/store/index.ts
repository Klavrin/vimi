import { configureStore } from '@reduxjs/toolkit';
import sidebar from './reducers/sidebar-active';
import theme from './reducers/theme';
import currentDirectory from './reducers/current-directory';
import editor from './reducers/editor';

export default configureStore({
  reducer: {
    sidebar,
    theme,
    currentDirectory,
    editor,
  },
});
