import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import GlobalStyles from './styles/globals.styled';

const theme = {
  colors: {},
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </ReduxProvider>,
);
