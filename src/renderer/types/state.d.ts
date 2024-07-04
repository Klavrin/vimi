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
    tabs: {
      _id: string;
      path: string;
      title: string;
      contents: string;
      previewMode: boolean;
      tags: string[];
      pinned: boolean;
    }[];
  };
};
