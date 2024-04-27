import { useDispatch, useSelector } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import StyledSidebarInteractiveZone from './styles/interactive-zone.styled';
import { State } from '../types/state';

type InteractiveZoneProps = {
  interactiveZoneWasHovered: () => void;
};

function InteractiveZone({ interactiveZoneWasHovered }: InteractiveZoneProps) {
  const sidebarActive = useSelector((state: State) => state.sidebar.isActive);
  const dispatch = useDispatch();

  const handleMouseOver = () => {
    if (sidebarActive) return;

    interactiveZoneWasHovered();
    dispatch(setSidebarValue(true));
  };

  return <StyledSidebarInteractiveZone onMouseOver={handleMouseOver} />;
}

export default InteractiveZone;
