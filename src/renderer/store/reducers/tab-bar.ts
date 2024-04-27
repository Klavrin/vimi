import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  activeTabIndex: 0,
  tabs: localStorage.getItem('tabs')
    ? JSON.parse(localStorage.getItem('tabs') as string)
    : [],
};

const tabBarSlice = createSlice({
  name: 'tabBar',
  initialState,
  reducers: {
    setActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
    incrementActiveTabIndex: (state) => {
      state.activeTabIndex += state.activeTabIndex;
    },
    decrementActiveTabIndex: (state) => {
      state.activeTabIndex -= state.activeTabIndex;
    },
    addTab: (
      state,
      action: PayloadAction<{
        path: string;
        basename: string;
        contents: string;
      }>,
    ) => {
      state.tabs.push(action.payload);
      localStorage.setItem('tabs', JSON.stringify(state.tabs));
    },
    removeTab: (state, action: PayloadAction<number>) => {
      state.tabs.splice(action.payload, 1);
      localStorage.setItem('tabs', state.tabs);
    },
  },
});

export const {
  setActiveTabIndex,
  incrementActiveTabIndex,
  decrementActiveTabIndex,
  addTab,
  removeTab,
} = tabBarSlice.actions;

export default tabBarSlice.reducer;
