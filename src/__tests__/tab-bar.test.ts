import reducer, {
  addTab,
  removeTab,
  updateTabContents,
  markTabSaved,
  isTabDirty,
  normalizeTabs,
  fetchTabs,
  setActiveTabIndex,
} from '../renderer/store/reducers/tab-bar';
import * as db from '../renderer/utils/db';

jest.mock('../renderer/utils/db', () => ({
  addTab: jest.fn(),
  deleteTab: jest.fn(),
  updateTab: jest.fn(),
  getAllTabs: jest.fn(),
}));

const makeTab = (id: string, contents = 'hello') => ({
  _id: id,
  path: `/notes/${id}.md`,
  title: id,
  contents,
  previewMode: false,
  tags: [],
  pinned: false,
});

const stateWith = (ids: string[], activeTabIndex = 0) => {
  let state = reducer(undefined, { type: 'init' });
  ids.forEach((id) => {
    state = reducer(state, addTab(makeTab(id)));
  });
  return { ...state, activeTabIndex };
};

describe('tab-bar reducer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds tabs as clean, in order', () => {
    const state = stateWith(['a', 'b']);
    expect(state.tabs.map((t) => t.order)).toEqual([0, 1]);
    expect(state.tabs.every((t) => t.savedContents === t.contents)).toBe(true);
    expect(state.tabs.some(isTabDirty)).toBe(false);
  });

  it('derives dirty state from contents vs savedContents', () => {
    let state = stateWith(['a']);
    state = reducer(state, updateTabContents({ _id: 'a', contents: 'edited' }));
    expect(isTabDirty(state.tabs[0])).toBe(true);

    state = reducer(state, updateTabContents({ _id: 'a', contents: 'hello' }));
    expect(isTabDirty(state.tabs[0])).toBe(false);
  });

  it('debounces writes of edited tabs to the db', () => {
    const state = stateWith(['a']);
    const next = reducer(state, updateTabContents({ _id: 'a', contents: 'e' }));
    reducer(next, updateTabContents({ _id: 'a', contents: 'ed' }));
    expect(db.updateTab).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(db.updateTab).toHaveBeenCalledTimes(1);
    expect(db.updateTab).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'a', contents: 'ed' }),
    );
  });

  it('markTabSaved clears the dirty state and persists immediately', () => {
    let state = stateWith(['a', 'b']);
    state = reducer(state, updateTabContents({ _id: 'a', contents: 'edited' }));
    state = reducer(
      state,
      markTabSaved({ path: '/notes/a.md', contents: 'edited' }),
    );

    expect(state.tabs[0].savedContents).toBe('edited');
    expect(isTabDirty(state.tabs[0])).toBe(false);
    expect(db.updateTab).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'a', savedContents: 'edited' }),
    );

    // The debounced write for the edit was superseded.
    jest.advanceTimersByTime(300);
    expect(db.updateTab).toHaveBeenCalledTimes(1);
  });

  it('keeps a tab dirty when it was edited again while saving', () => {
    let state = stateWith(['a']);
    state = reducer(state, updateTabContents({ _id: 'a', contents: 'v1' }));
    state = reducer(state, updateTabContents({ _id: 'a', contents: 'v2' }));
    state = reducer(
      state,
      markTabSaved({ path: '/notes/a.md', contents: 'v1' }),
    );
    expect(isTabDirty(state.tabs[0])).toBe(true);
  });

  describe('closing tabs', () => {
    it('keeps the active tab when a tab before it is closed', () => {
      let state = stateWith(['a', 'b', 'c'], 2);
      state = reducer(state, removeTab('a'));
      expect(state.tabs.map((t) => t._id)).toEqual(['b', 'c']);
      expect(state.tabs[state.activeTabIndex]._id).toBe('c');
    });

    it('selects the previous tab when the last active tab is closed', () => {
      let state = stateWith(['a', 'b', 'c'], 2);
      state = reducer(state, removeTab('c'));
      expect(state.activeTabIndex).toBe(1);
    });

    it('selects the next tab when a middle active tab is closed', () => {
      let state = stateWith(['a', 'b', 'c'], 1);
      state = reducer(state, removeTab('b'));
      expect(state.tabs[state.activeTabIndex]._id).toBe('c');
    });

    it('closing the last remaining tab leaves a valid index', () => {
      let state = stateWith(['a'], 0);
      state = reducer(state, removeTab('a'));
      expect(state.tabs).toEqual([]);
      expect(state.activeTabIndex).toBe(0);

      // A tab opened afterwards is the active one.
      state = reducer(state, addTab(makeTab('b')));
      expect(state.tabs[state.activeTabIndex]._id).toBe('b');
    });

    it('ignores unknown ids and removes the tab from the db', () => {
      let state = stateWith(['a', 'b'], 1);
      state = reducer(state, removeTab('nope'));
      expect(state.tabs).toHaveLength(2);
      state = reducer(state, removeTab('a'));
      expect(db.deleteTab).toHaveBeenCalledWith('a');
    });
  });

  describe('loading tabs', () => {
    it('defaults the fields missing from old rows and sorts by order', () => {
      const tabs = normalizeTabs([
        makeTab('a', 'one'),
        { ...makeTab('b', 'two'), savedContents: 'old', order: 0 },
      ] as any);
      // 'a' has no order so it falls back to its index (0), ties keep insertion order
      expect(tabs.map((t) => t._id)).toEqual(['a', 'b']);
      expect(tabs[0]).toMatchObject({ savedContents: 'one', order: 0 });
      expect(tabs[1]).toMatchObject({ savedContents: 'old', order: 0 });
    });

    it('sorts persisted rows by their order', () => {
      const tabs = normalizeTabs([
        { ...makeTab('a'), savedContents: 'hello', order: 2 },
        { ...makeTab('b'), savedContents: 'hello', order: 0 },
        { ...makeTab('c'), savedContents: 'hello', order: 1 },
      ]);
      expect(tabs.map((t) => t._id)).toEqual(['b', 'c', 'a']);
    });

    it('stores the fetched tabs', async () => {
      (db.getAllTabs as jest.Mock).mockResolvedValue([makeTab('a')]);
      const dispatch = jest.fn();
      const action = await fetchTabs()(dispatch, () => ({}), undefined);
      const state = reducer(undefined, action);
      expect(state.tabs).toHaveLength(1);
      expect(state.tabs[0]).toMatchObject({ savedContents: 'hello', order: 0 });
    });
  });

  it('setActiveTabIndex changes the active tab', () => {
    const state = reducer(stateWith(['a', 'b']), setActiveTabIndex(1));
    expect(state.activeTabIndex).toBe(1);
  });
});
