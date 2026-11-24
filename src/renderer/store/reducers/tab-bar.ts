import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTab as addTabToDB,
  deleteTab as deleteTabFromDB,
  updateTab as updateTabInDB,
  getAllTabs,
} from '../../utils/db';

export interface NoteType {
  _id: string;
  path: string;
  title: string;
  contents: string;
  previewMode: boolean;
  tags: string[];
  pinned: boolean;
  /** Contents of the file as last read from / written to disk. */
  savedContents: string;
  /** Position of the tab in the tab bar. */
  order: number;
}

export type NewTab = Omit<NoteType, 'savedContents' | 'order'> &
  Partial<Pick<NoteType, 'savedContents' | 'order'>>;

/** A tab is dirty when its contents differ from what is on disk. */
export const isTabDirty = (tab: Pick<NoteType, 'contents' | 'savedContents'>) =>
  tab.contents !== tab.savedContents;

/**
 * Fills in the fields that rows written by older versions of the app do not
 * have and sorts the tabs by their position.
 */
export const normalizeTabs = (rows: Partial<NoteType>[]): NoteType[] =>
  rows
    .map((row, index) => ({
      ...(row as NoteType),
      savedContents: row.savedContents ?? row.contents ?? '',
      order: row.order ?? index,
    }))
    .sort((a, b) => a.order - b.order);

export const fetchTabs = createAsyncThunk('tabBar/fetchTabs', async () => {
  const tabs = (await getAllTabs()) as Partial<NoteType>[];
  return normalizeTabs(tabs);
});

const PERSIST_DELAY = 300;
const pendingPersists = new Map<
  string,
  { timer: ReturnType<typeof setTimeout>; tab: NoteType }
>();

const cancelPendingPersist = (_id: string) => {
  const pending = pendingPersists.get(_id);
  if (pending) {
    clearTimeout(pending.timer);
    pendingPersists.delete(_id);
  }
};

/** Writes the tab to IndexedDB once the user stops typing for a moment. */
const schedulePersist = (tab: NoteType) => {
  cancelPendingPersist(tab._id);
  const snapshot = JSON.parse(JSON.stringify(tab)) as NoteType;
  const timer = setTimeout(() => {
    pendingPersists.delete(snapshot._id);
    updateTabInDB(snapshot);
  }, PERSIST_DELAY);
  pendingPersists.set(snapshot._id, { timer, tab: snapshot });
};

const persistNow = (tab: NoteType) => {
  cancelPendingPersist(tab._id);
  updateTabInDB(JSON.parse(JSON.stringify(tab)));
};

const initialState = {
  activeTabIndex: 0,
  tabs: [] as NoteType[],
  // tabs: localStorage.getItem('tabs')
  //   ? JSON.parse(localStorage.getItem('tabs') as string)
  //   : [],
};

const tabBarSlice = createSlice({
  name: 'tabBar',
  initialState,
  reducers: {
    setActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
    incrementActiveTabIndex: (state) => {
      if (state.activeTabIndex < state.tabs.length - 1)
        state.activeTabIndex += 1;
      else state.activeTabIndex = 0;
    },
    decrementActiveTabIndex: (state) => {
      if (state.activeTabIndex > 0) state.activeTabIndex -= 1;
      else state.activeTabIndex = state.tabs.length - 1;
    },
    addTab: (state, action: PayloadAction<NewTab>) => {
      const tab: NoteType = {
        ...action.payload,
        savedContents: action.payload.savedContents ?? action.payload.contents,
        order:
          action.payload.order ??
          state.tabs.reduce((max, t) => Math.max(max, t.order + 1), 0),
      };
      state.tabs.push(tab);
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      addTabToDB(JSON.parse(JSON.stringify(tab)));
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const index = state.tabs.findIndex((tab) => tab._id === action.payload);
      if (index === -1) return;

      state.tabs.splice(index, 1);
      // Keep pointing at the same tab, or the nearest one if the active tab was removed.
      if (index < state.activeTabIndex) state.activeTabIndex -= 1;
      state.activeTabIndex = Math.max(
        0,
        Math.min(state.activeTabIndex, state.tabs.length - 1),
      );
      cancelPendingPersist(action.payload);
      deleteTabFromDB(action.payload);
    },
    removeCurrentTab: (state) => {
      const tab = state.tabs[state.activeTabIndex];
      if (!tab) return;

      state.tabs.splice(state.activeTabIndex, 1);
      state.activeTabIndex = Math.max(
        0,
        Math.min(state.activeTabIndex, state.tabs.length - 1),
      );
      cancelPendingPersist(tab._id);
      deleteTabFromDB(tab._id);
    },
    updateTabContents: (
      state,
      action: PayloadAction<{ _id: string; contents: string }>,
    ) => {
      const tab = state.tabs.find((t) => t._id === action.payload._id);
      if (!tab || tab.contents === action.payload.contents) return;

      tab.contents = action.payload.contents;
      schedulePersist(tab);
    },
    markTabSaved: (
      state,
      action: PayloadAction<{ path: string; contents: string }>,
    ) => {
      state.tabs.forEach((tab) => {
        if (tab.path === action.payload.path) {
          tab.savedContents = action.payload.contents;
          persistNow(tab);
        }
      });
    },
    // TODO: Figure out how to move this to the workspace reducer
    togglePreviewMode: (state) => {
      state.tabs[state.activeTabIndex].previewMode =
        !state.tabs[state.activeTabIndex].previewMode;
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      persistNow(state.tabs[state.activeTabIndex]);
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.tabs[state.activeTabIndex].previewMode = action.payload;
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      persistNow(state.tabs[state.activeTabIndex]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTabs.fulfilled, (state, action) => {
      state.tabs = action.payload;
    });
  },
});

export const {
  setActiveTabIndex,
  incrementActiveTabIndex,
  decrementActiveTabIndex,
  addTab,
  removeTab,
  removeCurrentTab,
  updateTabContents,
  markTabSaved,
  togglePreviewMode,
  setPreviewMode,
} = tabBarSlice.actions;

export default tabBarSlice.reducer;
