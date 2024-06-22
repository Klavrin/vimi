import store from '../../store';
import { incrementActiveTabIndex as _incrementActiveTabIndex } from '../../store/reducers/tab-bar';

export const incrementActiveTabIndex = () => {
  store.dispatch(_incrementActiveTabIndex());
};
