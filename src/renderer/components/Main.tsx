import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentDirectoryPath } from '../store/reducers/current-directory';

import StyledMain from './styles/main.styled';

type MainProps = {
  children: ReactNode;
};

function Main({ children }: MainProps) {
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
      window.electron.ipcRenderer.on('isDirectoryReply', (isDir) => {
        if (isDir) {
          // Use Redux to save the directory path
          dispatch(setCurrentDirectoryPath(dir.path));
        } else {
          // Show a message that warns the user that whatever they dragged and dropped might
          // not be a direcory.
        }
      });
    });
  };

  return (
    <StyledMain onDragOver={handleDragOver} onDrop={handleDrop}>
      {children}
    </StyledMain>
  );
}

export default Main;
