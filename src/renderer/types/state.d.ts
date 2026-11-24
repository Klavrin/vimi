import type { Theme } from './themes';
import type { FileTree } from '../components/sidebar-item';
import type { SettingsState } from '../store/reducers/settings';

export type State = {
  sidebar: {
    isActive: boolean;
  };
  theme: {
    currentTheme: Theme;
  };
  currentDirectory: {
    currentDirectoryPath: string;
  };
  workspace: {
    fileTree: FileTree[];
    isEditing: boolean;
    allowFocusing: boolean;
    editorRefs: Record<string, any> | null;
    settingsVisible: boolean;
  };
  settings: SettingsState;
  tabBar: {
    activeTabIndex: number;
    tabs: {
      _id: string;
      path: string;
      title: string;
      contents: string;
      previewMode: boolean;
      tags: string[];
      pinned: boolean;
      savedContents: string;
      order: number;
    }[];
  };
};
