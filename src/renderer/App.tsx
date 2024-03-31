import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main-page';
import Titlebar from './components/Titlebar';

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
