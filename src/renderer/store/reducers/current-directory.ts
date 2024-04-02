import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDirectoryPath: '',
};

const currentDirectorySlice = createSlice({
  name: 'currentDirectory',
  initialState,
  reducers: {
    setCurrentDirectoryPath: (state, action) => {
      state.currentDirectoryPath = action.payload;
    },
  },
});

export const { setCurrentDirectoryPath } = currentDirectorySlice.actions;

export default currentDirectorySlice.reducer;
