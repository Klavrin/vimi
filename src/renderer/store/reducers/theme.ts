import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../types/themes';
import config from '../../../../config/config.json';

type initialStateType = {
  currentTheme: Theme;
};

const initialState: initialStateType = {
  currentTheme: config.theme as Theme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      window.electron.ipcRenderer.sendMessage('setConfigTheme', {
        theme: action.payload,
        config,
      });
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;
