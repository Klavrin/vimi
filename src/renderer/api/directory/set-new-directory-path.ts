import store from '../../store';
import { setCurrentDirectoryPath as _setCurrentDirectoryPath } from '../../store/reducers/current-directory';

export const setNewDirectoryPath = (path: string) => {
  store.dispatch(_setCurrentDirectoryPath(path));
};
