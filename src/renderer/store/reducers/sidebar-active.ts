import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
};

const sidebarSlice = createSlice({
  name: 'sidebarActive',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isActive = !state.isActive;
    },
    setSidebarValue: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarValue } = sidebarSlice.actions;

export default sidebarSlice.reducer;
