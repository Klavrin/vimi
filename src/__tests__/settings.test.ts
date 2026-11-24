import type * as SettingsModule from '../renderer/store/reducers/settings';

type Settings = typeof SettingsModule;

// The slice reads localStorage when it is imported, so load a fresh copy per test
const loadSettingsModule = (stored?: unknown): Settings => {
  localStorage.clear();
  if (stored !== undefined) {
    localStorage.setItem(
      'settings',
      typeof stored === 'string' ? stored : JSON.stringify(stored),
    );
  }
  let mod!: Settings;
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    mod = require('../renderer/store/reducers/settings');
  });
  return mod;
};

describe('settings reducer', () => {
  describe('loading', () => {
    it('uses the defaults when nothing is persisted', () => {
      const { default: reducer, defaultSettings } = loadSettingsModule();
      expect(reducer(undefined, { type: 'init' })).toEqual(defaultSettings);
    });

    it('merges persisted settings over the defaults', () => {
      const { default: reducer, defaultSettings } = loadSettingsModule({
        editor: { fontSize: 20, lineNumbers: 'relative' },
        autosave: { enabled: true },
        vim: { leader: ',', actions: { nextTab: '<C-l>' } },
      });
      const state = reducer(undefined, { type: 'init' });

      expect(state.editor).toEqual({
        ...defaultSettings.editor,
        fontSize: 20,
        lineNumbers: 'relative',
      });
      expect(state.autosave).toEqual({ enabled: true, delay: 1000 });
      expect(state.vim.enabled).toBe(true);
      expect(state.vim.leader).toBe(',');
      expect(state.vim.actions).toEqual({
        ...defaultSettings.vim.actions,
        nextTab: '<C-l>',
      });
      expect(state.vim.mappings).toEqual([]);
    });

    it('ignores values of the wrong type and invalid mappings', () => {
      const { mergeSettings, defaultSettings } = loadSettingsModule();
      const merged = mergeSettings({
        editor: {
          fontSize: 'huge',
          lineWrapping: 'yes',
          lineNumbers: 'diagonal',
        },
        autosave: 5,
        vim: {
          enabled: 'no',
          leader: '',
          mappings: [
            { lhs: 'jk', rhs: '<Esc>', mode: 'insert' },
            { lhs: 'x', rhs: 'y', mode: 'bogus' },
            'nope',
          ],
        },
      });

      expect(merged.editor).toEqual(defaultSettings.editor);
      expect(merged.autosave).toEqual(defaultSettings.autosave);
      expect(merged.vim.enabled).toBe(true);
      expect(merged.vim.leader).toBe('<Space>');
      expect(merged.vim.mappings).toEqual([
        { lhs: 'jk', rhs: '<Esc>', mode: 'insert' },
      ]);
    });

    it('falls back to the defaults for corrupted JSON', () => {
      const { default: reducer, defaultSettings } =
        loadSettingsModule('{not json');
      expect(reducer(undefined, { type: 'init' })).toEqual(defaultSettings);
    });

    it('does not share mutable defaults between loads', () => {
      const { mergeSettings, defaultSettings } = loadSettingsModule();
      const merged = mergeSettings(null);
      merged.vim.mappings.push({ lhs: 'a', rhs: 'b', mode: 'normal' });
      expect(defaultSettings.vim.mappings).toEqual([]);
    });
  });

  describe('updates', () => {
    const persisted = () =>
      JSON.parse(localStorage.getItem('settings') ?? '{}');

    it('persists editor and autosave updates to localStorage', () => {
      const mod = loadSettingsModule();
      let state = mod.default(undefined, { type: 'init' });
      state = mod.default(state, mod.updateEditorSettings({ fontSize: 22 }));
      state = mod.default(
        state,
        mod.updateAutosaveSettings({ enabled: true, delay: 500 }),
      );

      expect(state.editor.fontSize).toBe(22);
      expect(state.editor.lineWrapping).toBe(true);
      expect(persisted().editor.fontSize).toBe(22);
      expect(persisted().autosave).toEqual({ enabled: true, delay: 500 });
    });

    it('updates vim enabled, leader and actions', () => {
      const mod = loadSettingsModule();
      let state = mod.default(undefined, { type: 'init' });
      state = mod.default(state, mod.setVimEnabled(false));
      state = mod.default(state, mod.setVimLeader(','));
      state = mod.default(
        state,
        mod.setVimAction({ action: 'nextTab', key: '<C-l>' }),
      );
      // an empty leader is rejected
      state = mod.default(state, mod.setVimLeader(''));

      expect(state.vim.enabled).toBe(false);
      expect(state.vim.leader).toBe(',');
      expect(state.vim.actions.nextTab).toBe('<C-l>');
      expect(persisted().vim.leader).toBe(',');
      expect(persisted().vim.actions.nextTab).toBe('<C-l>');
    });

    it('adds, edits and removes custom mappings', () => {
      const mod = loadSettingsModule();
      let state = mod.default(undefined, { type: 'init' });
      state = mod.default(
        state,
        mod.addVimMapping({ lhs: 'jk', rhs: '<Esc>', mode: 'insert' }),
      );
      state = mod.default(state, mod.addVimMapping(undefined));
      expect(state.vim.mappings).toEqual([
        { lhs: 'jk', rhs: '<Esc>', mode: 'insert' },
        { lhs: '', rhs: '', mode: 'normal' },
      ]);

      state = mod.default(
        state,
        mod.updateVimMapping({ index: 1, changes: { lhs: 'Y', rhs: 'y$' } }),
      );
      expect(state.vim.mappings[1]).toEqual({
        lhs: 'Y',
        rhs: 'y$',
        mode: 'normal',
      });
      expect(persisted().vim.mappings).toHaveLength(2);

      state = mod.default(state, mod.removeVimMapping(0));
      expect(state.vim.mappings).toEqual([
        { lhs: 'Y', rhs: 'y$', mode: 'normal' },
      ]);
      expect(persisted().vim.mappings).toEqual(state.vim.mappings);
    });

    it('survives a reload', () => {
      const mod = loadSettingsModule();
      const state = mod.default(
        mod.default(undefined, { type: 'init' }),
        mod.updateEditorSettings({ lineNumbers: 'relative' }),
      );
      expect(state.editor.lineNumbers).toBe('relative');

      let reloaded!: Settings;
      jest.isolateModules(() => {
        // eslint-disable-next-line global-require
        reloaded = require('../renderer/store/reducers/settings');
      });
      expect(
        reloaded.default(undefined, { type: 'init' }).editor.lineNumbers,
      ).toBe('relative');
    });
  });
});
