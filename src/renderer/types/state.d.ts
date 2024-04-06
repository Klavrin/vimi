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
  editor: {
    isEditing: boolean;
  };
};
