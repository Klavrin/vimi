import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/main';
import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';

export default function App() {
  return (
    <Main>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </Main>
  );
}
