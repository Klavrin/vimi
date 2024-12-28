import { configureStore } from '@reduxjs/toolkit';
import sidebar from './reducers/sidebar-active';
import theme from './reducers/theme';
import currentDirectory from './reducers/current-directory';
import workspace from './reducers/workspace';
import tabBar from './reducers/tab-bar';

export default configureStore({
  reducer: {
    sidebar,
    theme,
    currentDirectory,
    workspace,
    tabBar,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});
