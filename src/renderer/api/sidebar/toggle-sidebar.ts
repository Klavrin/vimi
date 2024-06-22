import store from '../../store';
import { toggleSidebar as _toggleSidebar } from '../../store/reducers/sidebar-active';

export const toggleSidebar = () => {
  store.dispatch(_toggleSidebar());
};
