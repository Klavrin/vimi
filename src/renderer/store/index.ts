import { configureStore } from '@reduxjs/toolkit';
import sidebar from './reducers/sidebar-active';
import theme from './reducers/theme';

export default configureStore({
  reducer: {
    sidebar,
    theme,
  },
});
