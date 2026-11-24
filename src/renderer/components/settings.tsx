import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FaX, FaPlus, FaTrash } from 'react-icons/fa6';

import { toggleSettings, setIsEditing } from '../store/reducers/workspace';
import { changeTheme } from '../store/reducers/theme';
import {
  updateEditorSettings,
  updateAutosaveSettings,
  setVimEnabled,
  setVimLeader,
  setVimAction,
  addVimMapping,
  updateVimMapping,
  removeVimMapping,
  defaultSettings,
} from '../store/reducers/settings';
import type {
  LineNumbersMode,
  VimActionName,
  VimMappingMode,
} from '../store/reducers/settings';
import getThemeObject from '../utils/get-theme-object';

import StyledSettings from './styles/settings.styled';
import SettingsOption from './settings-option';
import { KeyInput, NumberInput, Select } from './settings-controls';
import type { Theme } from '../types/themes';
import type { State } from '../types/state';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'gruvbox', label: 'Gruvbox' },
  { value: 'midnight-blue', label: 'Midnight blue' },
];

const LINE_NUMBER_OPTIONS: { value: LineNumbersMode; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'relative', label: 'Relative' },
];

const MAPPING_MODES: { value: VimMappingMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'insert', label: 'Insert' },
  { value: 'visual', label: 'Visual' },
];

const VIM_ACTION_LABELS: Record<VimActionName, string> = {
  toggleSidebar: 'Toggle sidebar',
  togglePreview: 'Toggle preview',
  nextTab: 'Next tab',
  prevTab: 'Previous tab',
  moveTabRight: 'Move tab right',
  moveTabLeft: 'Move tab left',
};

function Settings() {
  const settingsVisible = useSelector(
    (state: State) => state.workspace.settingsVisible,
  );
  const currentTheme = useSelector((state: State) => state.theme.currentTheme);
  const { editor, autosave, vim } = useSelector(
    (state: State) => state.settings,
  );
  const dispatch = useDispatch();

  // Keep keys typed in the settings away from the sidebar's vim navigation
  useEffect(() => {
    if (!settingsVisible) return undefined;

    dispatch(setIsEditing(true));
    return () => {
      dispatch(setIsEditing(false));
    };
  }, [settingsVisible, dispatch]);

  return (
    <AnimatePresence>
      {settingsVisible && (
        <StyledSettings
          onClick={() => dispatch(toggleSettings())}
          onFocusCapture={() => dispatch(setIsEditing(true))}
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            role="presentation"
            className="container"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') dispatch(toggleSettings());
            }}
          >
            <div className="top-bar">
              <h2>Settings</h2>
              <button
                type="button"
                aria-label="Close settings"
                onClick={() => dispatch(toggleSettings())}
              >
                <FaX className="icon" />
              </button>
            </div>

            <div className="settings-box">
              <section>
                <h3>Appearance</h3>
                <div className="theme-swatches">
                  {THEMES.map(({ value, label }) => {
                    const theme = getThemeObject(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`theme-swatch ${
                          currentTheme === value ? 'active' : ''
                        }`}
                        aria-pressed={currentTheme === value}
                        onClick={() => dispatch(changeTheme(value))}
                        style={{
                          background: theme.background.primary,
                          color: theme.text.primary,
                          borderColor: theme.border.primary,
                        }}
                      >
                        <span
                          className="swatch-bar"
                          style={{ background: theme.background.secondary }}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3>Editor</h3>
                <SettingsOption label="Font size">
                  <NumberInput
                    ariaLabel="Font size"
                    value={editor.fontSize}
                    min={10}
                    max={32}
                    onChange={(fontSize) =>
                      dispatch(updateEditorSettings({ fontSize }))
                    }
                  />
                </SettingsOption>
                <SettingsOption
                  label="Line wrapping"
                  checked={editor.lineWrapping}
                  onToggle={(lineWrapping) =>
                    dispatch(updateEditorSettings({ lineWrapping }))
                  }
                />
                <SettingsOption label="Line numbers">
                  <Select
                    ariaLabel="Line numbers"
                    value={editor.lineNumbers}
                    options={LINE_NUMBER_OPTIONS}
                    onChange={(lineNumbers) =>
                      dispatch(updateEditorSettings({ lineNumbers }))
                    }
                  />
                </SettingsOption>
              </section>

              <section>
                <h3>Files</h3>
                <SettingsOption
                  label="Autosave"
                  description="Save changed files after you stop typing"
                  checked={autosave.enabled}
                  onToggle={(enabled) =>
                    dispatch(updateAutosaveSettings({ enabled }))
                  }
                />
                <SettingsOption
                  label="Autosave delay (ms)"
                  disabled={!autosave.enabled}
                >
                  <NumberInput
                    ariaLabel="Autosave delay in milliseconds"
                    value={autosave.delay}
                    min={200}
                    max={60000}
                    step={100}
                    disabled={!autosave.enabled}
                    onChange={(delay) =>
                      dispatch(updateAutosaveSettings({ delay }))
                    }
                  />
                </SettingsOption>
              </section>

              <section>
                <h3>Vim</h3>
                <SettingsOption
                  label="Enable vim mode"
                  checked={vim.enabled}
                  onToggle={(enabled) => dispatch(setVimEnabled(enabled))}
                />
                <SettingsOption
                  label="Leader key"
                  description="Written as vim notation, e.g. <Space> or ,"
                  disabled={!vim.enabled}
                >
                  <KeyInput
                    ariaLabel="Leader key"
                    value={vim.leader}
                    placeholder={defaultSettings.vim.leader}
                    onCommit={(leader) => dispatch(setVimLeader(leader))}
                  />
                </SettingsOption>

                <h4>Shortcuts</h4>
                {(Object.keys(VIM_ACTION_LABELS) as VimActionName[]).map(
                  (name) => (
                    <SettingsOption
                      key={name}
                      label={VIM_ACTION_LABELS[name]}
                      disabled={!vim.enabled}
                    >
                      <KeyInput
                        ariaLabel={VIM_ACTION_LABELS[name]}
                        value={vim.actions[name]}
                        placeholder={defaultSettings.vim.actions[name]}
                        onCommit={(key) =>
                          dispatch(setVimAction({ action: name, key }))
                        }
                      />
                    </SettingsOption>
                  ),
                )}

                <h4>Custom mappings</h4>
                {vim.mappings.length === 0 && (
                  <p className="empty">No custom mappings yet.</p>
                )}
                {vim.mappings.map((mapping, index) => (
                  // Rows have no stable id and are only edited in place
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="mapping-row" key={index}>
                    <KeyInput
                      ariaLabel="Mapping keys"
                      placeholder="keys, e.g. jk"
                      value={mapping.lhs}
                      onCommit={(lhs) =>
                        dispatch(updateVimMapping({ index, changes: { lhs } }))
                      }
                    />
                    <span className="arrow">→</span>
                    <KeyInput
                      ariaLabel="Mapping result"
                      placeholder="result, e.g. <Esc>"
                      value={mapping.rhs}
                      onCommit={(rhs) =>
                        dispatch(updateVimMapping({ index, changes: { rhs } }))
                      }
                    />
                    <Select
                      ariaLabel="Mapping mode"
                      value={mapping.mode}
                      options={MAPPING_MODES}
                      onChange={(mode) =>
                        dispatch(updateVimMapping({ index, changes: { mode } }))
                      }
                    />
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Remove mapping"
                      onClick={() => dispatch(removeVimMapping(index))}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-mapping"
                  disabled={!vim.enabled}
                  onClick={() => dispatch(addVimMapping(undefined))}
                >
                  <FaPlus /> Add mapping
                </button>
              </section>
            </div>
          </div>
        </StyledSettings>
      )}
    </AnimatePresence>
  );
}

export default Settings;
