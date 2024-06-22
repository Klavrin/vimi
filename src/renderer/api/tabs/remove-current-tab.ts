import store from '../../store';
import { removeCurrentTab as _removeCurrentTab } from '../../store/reducers/tab-bar';

export const removeCurrentTab = () => {
  store.dispatch(_removeCurrentTab());
};
