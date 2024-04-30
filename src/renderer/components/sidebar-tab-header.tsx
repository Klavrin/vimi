import { useDispatch } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';

import StyledSidebarTabHeader from './styles/sidebar-tab-header';

function SidebarTabHeader() {
  const dispatch = useDispatch();

  return (
    <StyledSidebarTabHeader>
      <button type="button" onClick={() => dispatch(setSidebarValue(false))}>
        close
      </button>
    </StyledSidebarTabHeader>
  );
}

export default SidebarTabHeader;
