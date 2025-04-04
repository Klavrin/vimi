import StyledSettings from './styles/settings.styled';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSettings } from '../store/reducers/workspace';

import { State } from '../types/state';

const Settings = () => {
  const settingsVisible = useSelector(
    (state: State) => state.workspace.settingsVisible,
  );
  const dispatch = useDispatch();

  return (
    settingsVisible && (
      <StyledSettings onClick={() => dispatch(toggleSettings())}>
        <div className="container" onClick={(e) => e.stopPropagation()}>
          settings view
        </div>
      </StyledSettings>
    )
  );
};

export default Settings;
