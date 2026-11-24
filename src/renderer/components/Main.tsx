import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentDirectoryPath } from '../store/reducers/current-directory';
import { fetchTabs } from '../store/reducers/tab-bar';

import {
  handleFileSaved,
  handleFileSaveError,
  handleUnsavedCloseReply,
} from '../utils/save-tab';

import Alert from './alert';

import StyledMain from './styles/main.styled';

type MainProps = {
  children: ReactNode;
};

function Main({ children }: MainProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({
    heading: 'Oops...',
    innerText: 'It seems like whatever you have dragged in is not a directory!',
  });
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
          setAlertContent({
            heading: 'Oops...',
            innerText:
              'It seems like whatever you have dragged in is not a directory!',
          });
          setShowAlert(true);
        }
      },
    );
  }, [dispatch]);

  useEffect(() => {
    const removeSavedListener = window.electron.ipcRenderer.on(
      'fileSaved',
      (file: any) => handleFileSaved(file),
    );
    const removeErrorListener = window.electron.ipcRenderer.on(
      'fileSaveError',
      (error: any) => {
        handleFileSaveError(error);
        setAlertContent({
          heading: 'Could not save file',
          innerText: `${error.path}: ${error.message}`,
        });
        setShowAlert(true);
      },
    );

    const removeCloseReplyListener = window.electron.ipcRenderer.on(
      'confirmUnsavedCloseReply',
      (reply: any) => handleUnsavedCloseReply(reply),
    );

    return () => {
      removeSavedListener?.();
      removeErrorListener?.();
      removeCloseReplyListener?.();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchTabs() as any);
  }, []);

  return (
    <StyledMain onDragOver={handleDragOver} onDrop={handleDrop}>
      <Alert
        heading={alertContent.heading}
        innerText={alertContent.innerText}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      {children}
    </StyledMain>
  );
}

export default Main;
