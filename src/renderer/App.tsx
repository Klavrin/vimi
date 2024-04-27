import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/main';
import MainPage from './pages/main-page';

export default function App() {
  return (
    <Main>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </Main>
  );
}
