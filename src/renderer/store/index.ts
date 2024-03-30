import { configureStore } from '@reduxjs/toolkit';
import sidebar from './reducers/sidebar-active';

export default configureStore({
  reducer: { sidebar },
});
