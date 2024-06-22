import store from '../../store';
import { decrementActiveTabIndex as _decrementActiveTabIndex } from '../../store/reducers/tab-bar';

export const decrementActiveTabIndex = () => {
  store.dispatch(_decrementActiveTabIndex());
};
