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
  },
});

export const { setCurrentDirectoryPath } = currentDirectorySlice.actions;

export default currentDirectorySlice.reducer;
