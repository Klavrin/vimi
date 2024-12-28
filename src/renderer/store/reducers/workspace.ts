import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { FileTree } from '../../components/sidebar-item';

const initialState = {
  fileTree: [] as FileTree[],
  isEditing: false,
  allowFocusing: true,
  editorRefs: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setFileTree: (state, action: PayloadAction<FileTree[]>) => {
      state.fileTree = action.payload;
    },
    toggleIsEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setAllowFocusing: (state, action: PayloadAction<boolean>) => {
      state.allowFocusing = action.payload;
    },
    setEditorRefs: (state, action) => {
      state.editorRefs = action.payload;
    },
  },
});

export const {
  setFileTree,
  toggleIsEditing,
  setIsEditing,
  setAllowFocusing,
  setEditorRefs,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
