import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEditing: false,
  allowFocusing: true,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    toggleIsEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setAllowFocusing: (state, action: PayloadAction<boolean>) => {
      state.allowFocusing = action.payload;
    },
  },
});

export const { toggleIsEditing, setIsEditing, setAllowFocusing } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
