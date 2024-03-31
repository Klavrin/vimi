import { Theme } from '../types/themes';
import darkTheme from '../styles/themes/dark';
import lightTheme from '../styles/themes/light';
import gruvboxTheme from '../styles/themes/gruvbox';
import midnightBlueTheme from '../styles/themes/midnight-blue';
// import config from '../../../config/config.json';

function getThemeObject(theme: Theme) {
  // window.electron.ipcRenderer.sendMessage('setConfigTheme', { theme, config });

  switch (theme) {
    case 'light':
      return lightTheme;
    case 'gruvbox':
      return gruvboxTheme;
    case 'midnight-blue':
      return midnightBlueTheme;
    default:
      return darkTheme;
  }
}

export default getThemeObject;
