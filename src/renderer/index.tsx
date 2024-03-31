import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import App from './App';
import ThemeProvider from './components/ThemeProver';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ReduxProvider>,
);
