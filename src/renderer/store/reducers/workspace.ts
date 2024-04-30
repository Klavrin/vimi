import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEditing: false,
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
  },
});

export const { toggleIsEditing, setIsEditing } = workspaceSlice.actions;

export default workspaceSlice.reducer;
