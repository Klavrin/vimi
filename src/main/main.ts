/* eslint global-require: off, no-console: off, promise/always-return: off */
import fs from 'fs-extra';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import readDirectory from './utils/read-directory';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 328,
    minHeight: 228,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 15 },
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line
  new AppUpdater();
};

// Event listeners
ipcMain.on('isDirectory', async (event, dirPath) => {
  try {
    const stats = await fs.stat(dirPath);
    event.reply('isDirectoryReply', {
      isDir: stats.isDirectory(),
      path: dirPath,
    });
  } catch (err) {
    // TODO: let the user know something wrong happened
  }
});

// Expects that dirPath is always a directory path.
ipcMain.on('readDirectory', (event, dirPath) => {
  try {
    const dirPathContents = readDirectory(dirPath);
    event.reply('dirPathContents', dirPathContents);
  } catch (err) {
    // TODO: let the user know something wrong happened
  }
});

ipcMain.on('readFile', (event, filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    event.reply('fileContents', {
      path: filePath,
      fileName: path.parse(path.basename(filePath)).name,
      contents: data,
    });
  });
});

ipcMain.on('renameFile', (_event, { filePath, newFileName }) => {
  fs.rename(filePath, `${path.dirname(filePath)}/${newFileName}.md`, (err) => {
    if (err) throw err;
  });
});

ipcMain.on('renameDirectory', (_event, { dirPath, newDirectoryName }) => {
  fs.rename(dirPath, `${path.dirname(dirPath)}/${newDirectoryName}`, (err) => {
    if (err) throw err;
  });
});

ipcMain.on('createFile', (_event, { filePath, fileName }) => {
  // TODO: check if filePath comes from a file or a directory

  fs.createFile(`${filePath}/${fileName}.md`, (err) => {
    if (err) throw err;
  });
});

ipcMain.on('createDirectory', (_event, { dirPath, dirName }) => {
  fs.mkdir(`${dirPath}/${dirName}`, (err) => {
    if (err) throw err;
  });
});

ipcMain.on('deleteFile', async (event, filePath) => {
  try {
    await shell.trashItem(filePath);
    event.reply('fileSuccessfullyDeleted');
  } catch (err) {
    if (err) throw err;
  }
});

ipcMain.on('showConfirmDialog', async (event) => {
  const res = await dialog.showMessageBox(mainWindow as BrowserWindow, {
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 0,
    cancelId: 1,
    message: 'Are you sure you want to delete this file?',
  });
  event.reply('showConfirmDialogReply', res.response === 0);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
