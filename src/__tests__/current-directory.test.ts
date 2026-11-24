import reducer, {
  setCurrentDirectoryPath,
  clearCurrentDirectoryPath,
} from '../renderer/store/reducers/current-directory';

describe('current-directory reducer', () => {
  beforeEach(() => localStorage.clear());

  it('stores the directory path in state and localStorage', () => {
    const state = reducer(undefined, setCurrentDirectoryPath('/notes'));
    expect(state.currentDirectoryPath).toBe('/notes');
    expect(localStorage.getItem('currentDirectoryPath')).toBe('/notes');
  });

  it('clearCurrentDirectoryPath empties the state and localStorage', () => {
    const opened = reducer(undefined, setCurrentDirectoryPath('/notes'));
    const state = reducer(opened, clearCurrentDirectoryPath());
    expect(state.currentDirectoryPath).toBe('');
    expect(localStorage.getItem('currentDirectoryPath')).toBeNull();
  });
});
