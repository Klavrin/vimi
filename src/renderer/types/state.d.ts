import type { Theme } from './themes';

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
    isEditing: boolean;
  };
  tabBar: {
    activeTabIndex: number;
    tabs: { path: string; basename: string; contents: string }[];
  };
};
