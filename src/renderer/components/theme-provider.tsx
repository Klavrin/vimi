import { ReactNode } from 'react';
import { ThemeProvider as Provider } from 'styled-components';
import { useSelector } from 'react-redux';
import GlobalStyles from '../styles/globals.styled';
import { State } from '../types/state';
import getThemeObject from '../utils/get-theme-object';

type ThemeProviderProps = {
  children: ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSelector((state: State) => state.theme.currentTheme);
  const themeObject = getThemeObject(theme);

  return (
    <Provider theme={themeObject}>
      <GlobalStyles theme={themeObject} />
      {children}
    </Provider>
  );
}

export default ThemeProvider;
