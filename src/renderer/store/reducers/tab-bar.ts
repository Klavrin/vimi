import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTab as addTabToDB,
  deleteTab as deleteTabFromDB,
  updateTab as updateTabInDB,
  getAllTabs,
} from '../../utils/db';

interface NoteType {
  _id: string;
  path: string;
  title: string;
  contents: string;
  previewMode: boolean;
  tags: string[];
  pinned: boolean;
}

export const fetchTabs = createAsyncThunk('tabBar/fetchTabs', async () => {
  const tabs = await getAllTabs();
  console.log(tabs);
  return tabs;
});

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
    addTab: (
      state,
      action: PayloadAction<{
        _id: string;
        path: string;
        title: string;
        contents: string;
        previewMode: boolean;
        tags: string[];
        pinned: boolean;
      }>,
    ) => {
      state.tabs.push(action.payload);
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      addTabToDB(action.payload);
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const newTabsArray = state.tabs.filter(
        (tab: NoteType) => tab._id !== action.payload,
      );
      state.tabs = newTabsArray;
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      deleteTabFromDB(action.payload);
    },
    removeCurrentTab: (state) => {
      deleteTabFromDB(state.tabs[state.activeTabIndex]._id);
      state.tabs.splice(state.activeTabIndex, 1);
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
    },
    // TODO: Figure out how to move this to the workspace reducer
    togglePreviewMode: (state) => {
      state.tabs[state.activeTabIndex].previewMode =
        !state.tabs[state.activeTabIndex].previewMode;
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      updateTabInDB(
        JSON.parse(JSON.stringify(state.tabs[state.activeTabIndex])),
      );
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.tabs[state.activeTabIndex].previewMode = action.payload;
      // localStorage.setItem('tabs', JSON.stringify(state.tabs));
      updateTabInDB(
        JSON.parse(JSON.stringify(state.tabs[state.activeTabIndex])),
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTabs.fulfilled, (state, action) => {
      state.tabs = action.payload as NoteType[];
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
  togglePreviewMode,
  setPreviewMode,
} = tabBarSlice.actions;

export default tabBarSlice.reducer;
