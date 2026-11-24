import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDirectoryPath: localStorage.getItem('currentDirectoryPath')
    ? localStorage.getItem('currentDirectoryPath')
    : '',
};

const currentDirectorySlice = createSlice({
  name: 'currentDirectory',
  initialState,
  reducers: {
    setCurrentDirectoryPath: (state, action) => {
      state.currentDirectoryPath = action.payload;
      localStorage.setItem('currentDirectoryPath', action.payload);
    },
    clearCurrentDirectoryPath: (state) => {
      state.currentDirectoryPath = '';
      localStorage.removeItem('currentDirectoryPath');
    },
  },
});

export const { setCurrentDirectoryPath, clearCurrentDirectoryPath } =
  currentDirectorySlice.actions;

export default currentDirectorySlice.reducer;
