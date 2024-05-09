import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentDirectoryPath } from '../store/reducers/current-directory';

import Alert from './alert';

import StyledMain from './styles/main.styled';

type MainProps = {
  children: ReactNode;
};

function Main({ children }: MainProps) {
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  const handleDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    // eslint-disable-next-line prefer-destructuring
    const files = e.dataTransfer.files;

    Array.from(files).forEach(async (dir: any) => {
      // Check if the dragged item is a directory
      window.electron.ipcRenderer.sendMessage('isDirectory', dir.path);
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'isDirectoryReply',
      ({ isDir, path }: any) => {
        if (isDir) {
          // Use Redux to save the directory path
          dispatch(setCurrentDirectoryPath(path));
        } else {
          // Show a message that warns the user that whatever they dragged and dropped might not be a direcory.
          setShowAlert(true);
        }
      },
    );
  }, [dispatch]);

  return (
    <StyledMain onDragOver={handleDragOver} onDrop={handleDrop}>
      <Alert
        heading="Oops..."
        innerText="It seems like whatever you have dragged in is not a directory!"
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      {children}
    </StyledMain>
  );
}

export default Main;
