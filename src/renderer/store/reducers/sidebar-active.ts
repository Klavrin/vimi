import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
};

const sidebarSlice = createSlice({
  // name: 'sidebarActive',
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isActive = !state.isActive;
    },
    setSidebarValue: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarValue } = sidebarSlice.actions;

export default sidebarSlice.reducer;
