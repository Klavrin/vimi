import StyledSettings from './styles/settings.styled';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSettings } from '../store/reducers/workspace';
import { AnimatePresence, motion } from 'framer-motion';

import { FaX } from 'react-icons/fa6';

import { State } from '../types/state';

const Settings = () => {
  const settingsVisible = useSelector(
    (state: State) => state.workspace.settingsVisible,
  );
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {settingsVisible && (
        <StyledSettings
          onClick={() => dispatch(toggleSettings())}
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <div className="top-bar">
              <button onClick={() => dispatch(toggleSettings())}>
                <FaX className="icon" />
              </button>
            </div>

            <div className="settings-box">settings</div>
          </div>
        </StyledSettings>
      )}
    </AnimatePresence>
  );
};

export default Settings;
