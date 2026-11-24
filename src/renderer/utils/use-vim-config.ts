import { useEffect } from 'react';
import { Vim } from '@replit/codemirror-vim';
import { useDispatch, useSelector } from 'react-redux';
import store from '../store';
import type { State } from '../types/state';
import type { SettingsState, VimActionName } from '../store/reducers/settings';
import { expandLeader } from './vim-keys';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import {
  decrementActiveTabIndex,
  incrementActiveTabIndex,
  moveTab,
  togglePreviewMode,
} from '../store/reducers/tab-bar';
import {
  getCurrentTab,
  requestCloseTab,
  saveAndCloseTab,
  saveCurrentTab,
} from './save-tab';

type AppliedMapping = { keys: string; context?: string };

// Everything mapped by the last run, so it can be removed before remapping
let appliedMappings: AppliedMapping[] = [];
// Whether the built-in <Space> mapping (move right) is currently removed
let spaceUnmapped = false;

// Vim action that each configurable app action triggers
const ACTION_NAMES: Record<VimActionName, string> = {
  toggleSidebar: 'toggleSidebar',
  togglePreview: 'togglePreviewMode',
  nextTab: 'moveToNextTab',
  prevTab: 'moveToPrevTab',
  moveTabRight: 'moveTabRight',
  moveTabLeft: 'moveTabLeft',
};

const isSpaceLeader = (leader: string) => leader.toLowerCase() === '<space>';

const removeAppliedMappings = () => {
  appliedMappings.forEach(({ keys, context }) => {
    try {
      Vim.unmap(keys, context as string);
    } catch (err) {
      // Mapping no longer exists
    }
  });
  appliedMappings = [];
};

const addMapping = (
  keys: string,
  context: string | undefined,
  map: () => void,
) => {
  try {
    map();
    appliedMappings.push({ keys, context });
  } catch (err) {
    // Invalid mapping (e.g. an ex mapping with a mode): ignore it
  }
};

/** Makes the vim keymap match the vim settings. */
export const applyVimSettings = (vimSettings: SettingsState['vim']) => {
  removeAppliedMappings();

  // <Space> moves right by default, which would swallow a <Space> leader
  const needsSpaceFree =
    vimSettings.enabled && isSpaceLeader(vimSettings.leader);
  if (needsSpaceFree && !spaceUnmapped) {
    Vim.unmap('<Space>', undefined as unknown as string);
    spaceUnmapped = true;
  } else if (!needsSpaceFree && spaceUnmapped) {
    Vim.map('<Space>', 'l', undefined as unknown as string);
    spaceUnmapped = false;
  }

  if (!vimSettings.enabled) return;

  if (needsSpaceFree) {
    addMapping('<Space><Space>', undefined, () =>
      Vim.map('<Space><Space>', 'l', undefined as unknown as string),
    );
  }

  (Object.keys(ACTION_NAMES) as VimActionName[]).forEach((name) => {
    const keys = expandLeader(
      vimSettings.actions[name] ?? '',
      vimSettings.leader,
    );
    if (!keys) return;
    addMapping(keys, undefined, () =>
      Vim.mapCommand(keys, 'action', ACTION_NAMES[name], undefined, {}),
    );
  });

  vimSettings.mappings.forEach(({ lhs, rhs, mode }) => {
    if (!lhs || !rhs) return;
    const keys = expandLeader(lhs, vimSettings.leader);
    addMapping(keys, mode, () => Vim.map(keys, rhs, mode));
  });
};

function useVimConfig() {
  const dispatch = useDispatch();
  const vimSettings = useSelector((state: State) => state.settings.vim);

  // Actions and ex commands don't depend on the settings
  useEffect(() => {
    Vim.defineAction('toggleSidebar', () => {
      dispatch(setSidebarValue(true));
      const sidebar: any = document.querySelector('.focusable');
      sidebar?.focus();
    });

    // Move through tabs
    Vim.defineAction('moveToNextTab', () => {
      dispatch(incrementActiveTabIndex());
    });
    Vim.defineAction('moveToPrevTab', () => {
      dispatch(decrementActiveTabIndex());
    });

    // Reorder tabs
    Vim.defineAction('moveTabRight', () => {
      const { activeTabIndex } = store.getState().tabBar;
      dispatch(moveTab({ from: activeTabIndex, to: activeTabIndex + 1 }));
    });
    Vim.defineAction('moveTabLeft', () => {
      const { activeTabIndex } = store.getState().tabBar;
      dispatch(moveTab({ from: activeTabIndex, to: activeTabIndex - 1 }));
    });

    // Toggle preview mode
    Vim.defineAction('togglePreviewMode', () => {
      dispatch(togglePreviewMode());
    });

    // :w saves the current file, :wq saves it and closes the tab
    Vim.defineEx('write', 'w', () => {
      saveCurrentTab();
    });
    Vim.defineEx('quit', 'q', () => {
      const tab = getCurrentTab();
      if (tab) requestCloseTab(tab._id);
    });
    const saveAndQuit = () => {
      const tab = getCurrentTab();
      if (tab) saveAndCloseTab(tab);
    };
    Vim.defineEx('wq', 'wq', saveAndQuit);
    Vim.defineEx('xit', 'x', saveAndQuit);
  }, [dispatch]);

  useEffect(() => {
    applyVimSettings(vimSettings);
  }, [vimSettings]);
}

export default useVimConfig;
