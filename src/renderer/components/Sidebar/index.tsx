import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarValue } from '../../store/reducers/sidebar-active';
import { State } from '../../store/state';
import InteractiveZone from './interactive-zone';
import './sidebar.css';

function Sidebar() {
  const [interactiveZoneWasHovered, setInteractiveZoneWasHovered] =
    useState(false);
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  /**
   * If the user hovered the interactive zone, a.k.a used their
   * cursor to open the sidebar, then when the cursor leaves the sidebar
   * the sidebar will close.
   *
   * However, if the sidebar was opened by other means, no effect will take place.
   */
  const handleMouseLeave = () => {
    if (interactiveZoneWasHovered) {
      dispatch(setSidebarValue(false));
      setInteractiveZoneWasHovered(false);
    }
  };

  return (
    <>
      <InteractiveZone
        interactiveZoneWasHovered={() => setInteractiveZoneWasHovered(true)}
      />

      {sidebarActive && (
        <div className="sidebar" onMouseLeave={handleMouseLeave}>
          <div className="sidebar-container">sidebar</div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
