import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../types/themes';

type initialStateType = {
  currentTheme: Theme;
};

const initialState: initialStateType = {
  currentTheme: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;
