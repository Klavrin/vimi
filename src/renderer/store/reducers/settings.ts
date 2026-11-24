import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LineNumbersMode = 'off' | 'absolute' | 'relative';
export type VimMappingMode = 'normal' | 'insert' | 'visual';

export type VimActionName =
  | 'toggleSidebar'
  | 'togglePreview'
  | 'nextTab'
  | 'prevTab'
  | 'moveTabRight'
  | 'moveTabLeft';

export type VimMapping = {
  lhs: string;
  rhs: string;
  mode: VimMappingMode;
};

export type SettingsState = {
  editor: {
    fontSize: number;
    lineWrapping: boolean;
    lineNumbers: LineNumbersMode;
  };
  autosave: {
    enabled: boolean;
    delay: number;
  };
  vim: {
    enabled: boolean;
    leader: string;
    actions: Record<VimActionName, string>;
    mappings: VimMapping[];
  };
};

export const SETTINGS_STORAGE_KEY = 'settings';

export const defaultSettings: SettingsState = {
  editor: { fontSize: 16, lineWrapping: true, lineNumbers: 'off' },
  autosave: { enabled: false, delay: 1000 },
  vim: {
    enabled: true,
    leader: '<Space>',
    actions: {
      toggleSidebar: '<leader>e',
      togglePreview: '<leader>p',
      nextTab: 'L',
      prevTab: 'H',
      moveTabRight: '<leader>>',
      moveTabLeft: '<leader><',
    },
    mappings: [],
  },
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Merges (possibly partial or outdated) persisted settings over the defaults.
 * Values with the wrong type are ignored so a corrupted entry can't break the app.
 */
export const mergeSettings = (persisted: unknown): SettingsState => {
  const merged: SettingsState = JSON.parse(JSON.stringify(defaultSettings));
  if (!isObject(persisted)) return merged;

  const { editor, autosave, vim } = persisted;

  if (isObject(editor)) {
    if (typeof editor.fontSize === 'number' && Number.isFinite(editor.fontSize))
      merged.editor.fontSize = editor.fontSize;
    if (typeof editor.lineWrapping === 'boolean')
      merged.editor.lineWrapping = editor.lineWrapping;
    if (
      editor.lineNumbers === 'off' ||
      editor.lineNumbers === 'absolute' ||
      editor.lineNumbers === 'relative'
    )
      merged.editor.lineNumbers = editor.lineNumbers;
  }

  if (isObject(autosave)) {
    if (typeof autosave.enabled === 'boolean')
      merged.autosave.enabled = autosave.enabled;
    if (typeof autosave.delay === 'number' && Number.isFinite(autosave.delay))
      merged.autosave.delay = autosave.delay;
  }

  if (isObject(vim)) {
    if (typeof vim.enabled === 'boolean') merged.vim.enabled = vim.enabled;
    if (typeof vim.leader === 'string' && vim.leader !== '')
      merged.vim.leader = vim.leader;
    if (isObject(vim.actions)) {
      (Object.keys(defaultSettings.vim.actions) as VimActionName[]).forEach(
        (name) => {
          const key = (vim.actions as Record<string, unknown>)[name];
          if (typeof key === 'string') merged.vim.actions[name] = key;
        },
      );
    }
    if (Array.isArray(vim.mappings)) {
      merged.vim.mappings = vim.mappings
        .filter(
          (m): m is VimMapping =>
            isObject(m) &&
            typeof m.lhs === 'string' &&
            typeof m.rhs === 'string' &&
            (m.mode === 'normal' || m.mode === 'insert' || m.mode === 'visual'),
        )
        .map(({ lhs, rhs, mode }) => ({ lhs, rhs, mode }));
    }
  }

  return merged;
};

const loadSettings = (): SettingsState => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return mergeSettings(raw ? JSON.parse(raw) : null);
  } catch (err) {
    return mergeSettings(null);
  }
};

const persist = (state: SettingsState) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Settings still apply for this session if storage is unavailable
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettings(),
  reducers: {
    updateEditorSettings: (
      state,
      action: PayloadAction<Partial<SettingsState['editor']>>,
    ) => {
      state.editor = { ...state.editor, ...action.payload };
      persist(state);
    },
    updateAutosaveSettings: (
      state,
      action: PayloadAction<Partial<SettingsState['autosave']>>,
    ) => {
      state.autosave = { ...state.autosave, ...action.payload };
      persist(state);
    },
    setVimEnabled: (state, action: PayloadAction<boolean>) => {
      state.vim.enabled = action.payload;
      persist(state);
    },
    setVimLeader: (state, action: PayloadAction<string>) => {
      if (action.payload === '') return;
      state.vim.leader = action.payload;
      persist(state);
    },
    setVimAction: (
      state,
      action: PayloadAction<{ action: VimActionName; key: string }>,
    ) => {
      state.vim.actions[action.payload.action] = action.payload.key;
      persist(state);
    },
    addVimMapping: (state, action: PayloadAction<VimMapping | undefined>) => {
      state.vim.mappings.push(
        action.payload ?? { lhs: '', rhs: '', mode: 'normal' },
      );
      persist(state);
    },
    updateVimMapping: (
      state,
      action: PayloadAction<{ index: number; changes: Partial<VimMapping> }>,
    ) => {
      const mapping = state.vim.mappings[action.payload.index];
      if (!mapping) return;
      Object.assign(mapping, action.payload.changes);
      persist(state);
    },
    removeVimMapping: (state, action: PayloadAction<number>) => {
      state.vim.mappings.splice(action.payload, 1);
      persist(state);
    },
  },
});

export const {
  updateEditorSettings,
  updateAutosaveSettings,
  setVimEnabled,
  setVimLeader,
  setVimAction,
  addVimMapping,
  updateVimMapping,
  removeVimMapping,
} = settingsSlice.actions;

export default settingsSlice.reducer;
