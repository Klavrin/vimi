import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

function MainPage() {
  const [sidebarActive, setSidebarActive] = useState(true);

  return (
    <>
      {sidebarActive && <Sidebar />}

      <div style={{ paddingLeft: sidebarActive ? 240 : 0 }}>
        <h1>Hello</h1>
        <button type="button" onClick={() => setSidebarActive(!sidebarActive)}>
          Sidebar on/off
        </button>
      </div>
    </>
  );
}

export default MainPage;
