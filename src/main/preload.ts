// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'dirItems'
  | 'isDirectory'
  | 'isDirectoryReply'
  | 'readDirectory'
  | 'dirPathContents'
  | 'readFile'
  | 'fileContents'
  | 'closeCurrentTab'
  | 'renameFile'
  | 'createFile'
  | 'deleteFile'
  | 'fileSuccessfullyDeleted'
  | 'showConfirmDialog'
  | 'showConfirmDialogReply'
  | 'renameDirectory'
  | 'createDirectory';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },

    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },

    invoke(channel: Channels, ...args: unknown[]) {
      ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
