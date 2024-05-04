import { useDispatch } from 'react-redux';
import { PiSidebarFill } from 'react-icons/pi';
import { setSidebarValue } from '../store/reducers/sidebar-active';

import StyledSidebarTabHeader from './styles/sidebar-tab-header';

function SidebarTabHeader() {
  const dispatch = useDispatch();

  return (
    <StyledSidebarTabHeader>
      <button type="button" onClick={() => dispatch(setSidebarValue(false))}>
        <PiSidebarFill size={20} />
      </button>
    </StyledSidebarTabHeader>
  );
}

export default SidebarTabHeader;
