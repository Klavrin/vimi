import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTriangleExclamation } from 'react-icons/fa6';

import StyledAlert from './styles/alert.styled';

type AlertProps = {
  heading: string;
  innerText: string;
  showAlert: boolean;
  setShowAlert: (value: boolean) => void;
};

function Alert({ heading, innerText, showAlert, setShowAlert }: AlertProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledAlert
          as={motion.div}
          transition={{ duration: 0.6, type: 'spring' }}
          initial={{ transform: 'translate(-50%, -300px)' }}
          animate={{ transform: 'translate(-50%, 10px)' }}
          exit={{ transform: 'translate(-50%, -300px)' }}
        >
          <div className="icon-container">
            <FaTriangleExclamation className="icon" size={20} />
          </div>

          <div className="content-container">
            <h3>{heading}</h3>
            <p>{innerText}</p>
          </div>
        </StyledAlert>
      )}
    </AnimatePresence>
  );
}

export default Alert;
