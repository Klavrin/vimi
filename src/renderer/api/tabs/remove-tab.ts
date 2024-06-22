import store from '../../store';
import { removeTab as _removeTab } from '../../store/reducers/tab-bar';

export const removeTab = (index: number) => {
  store.dispatch(_removeTab(index));
};
