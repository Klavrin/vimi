import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main-page';
import Titlebar from './components/Titlebar';

// Themes (you can import multiple themes, but the last one will always take precedence)
import './styles/themes/dark.css';

export default function App() {
  return (
    <>
      <Titlebar />

      <main>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </Router>
      </main>
    </>
  );
}
