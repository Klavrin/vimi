import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PiSidebarFill } from 'react-icons/pi';
import { setSidebarValue } from '../store/reducers/sidebar-active';

import Tooltip from './tooltip';

import StyledSidebarTabHeader from './styles/sidebar-tab-header';

function SidebarTabHeader() {
  const [iconHovered, setIconHovered] = useState(false);
  const dispatch = useDispatch();

  const handleMouseOver = () => {
    setIconHovered(true);
  };

  return (
    <StyledSidebarTabHeader>
      <Tooltip
        innerText="Collapse"
        visible={iconHovered}
        style={{ transform: 'translate(-35px)' }}
      />
      <button
        type="button"
        onClick={() => dispatch(setSidebarValue(false))}
        onMouseOver={handleMouseOver}
        onMouseLeave={() => setIconHovered(false)}
        onFocus={() => null}
      >
        <PiSidebarFill size={20} />
      </button>
    </StyledSidebarTabHeader>
  );
}

export default SidebarTabHeader;
