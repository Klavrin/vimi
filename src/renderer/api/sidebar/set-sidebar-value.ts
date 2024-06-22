import store from '../../store';
import { setSidebarValue as _setSidebarValue } from '../../store/reducers/sidebar-active';

export const setSidebarValue = (value: boolean) => {
  store.dispatch(_setSidebarValue(value));
};
