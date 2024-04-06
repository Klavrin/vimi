import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEditing: false,
};

const editorSlice = createSlice({
  name: 'editor',
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

export const { toggleIsEditing, setIsEditing } = editorSlice.actions;

export default editorSlice.reducer;
