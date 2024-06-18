import { Suspense, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/main';
import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';
import Loading from './components/loading';

export default function App() {
  // window.electron.ipcRenderer.sendMessage('getInitFilePath');
  // window.electron.ipcRenderer.on('sendInitFilePath', (initFilePath: string) => {
  //   console.log(initFilePath);
  // });

  // useEffect(() => {
  //   window.electron.ipcRenderer.sendMessage('getInitFilePath');
  //   window.electron.ipcRenderer.on('sendInitFilePath', (initFilePath: any) => {
  //     console.log(initFilePath);
  //     const script = document.createElement('script');
  //     script.defer = true;
  //     script.src =
  //       '/Users/sergiugherasim/Library/Application%20Support/vimi/init.js';
  //     script.type = 'application/javascript';
  //     document.head.appendChild(script);
  //   });
  // }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Main>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </Main>
    </Suspense>
  );
}
