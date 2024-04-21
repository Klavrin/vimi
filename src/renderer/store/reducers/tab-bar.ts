import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTabIndex: 0,
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
  },
});

export const {
  setActiveTabIndex,
  incrementActiveTabIndex,
  decrementActiveTabIndex,
} = tabBarSlice.actions;

export default tabBarSlice.reducer;
