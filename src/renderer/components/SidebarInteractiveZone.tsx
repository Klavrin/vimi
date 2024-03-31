import { useDispatch } from 'react-redux';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import StyledSidebarInteractiveZone from './styles/interactive-zone.styled';

type InteractiveZoneProps = {
  interactiveZoneWasHovered: () => void;
};

function InteractiveZone({ interactiveZoneWasHovered }: InteractiveZoneProps) {
  const dispatch = useDispatch();

  const handleMouseOver = () => {
    interactiveZoneWasHovered();
    dispatch(setSidebarValue(true));
  };

  return (
    <StyledSidebarInteractiveZone
      onFocus={() => console.log('sidebar focused')}
      onMouseOver={handleMouseOver}
      // onMouseLeave={() => dispatch(setSidebarValue(false))}
    />
  );
}

export default InteractiveZone;
