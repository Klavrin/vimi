import store from '../../store';
import { setActiveTabIndex as _setActiveTabIndex } from '../../store/reducers/tab-bar';

export const setActiveTabIndex = (index: number) => {
  store.dispatch(_setActiveTabIndex(index));
};
