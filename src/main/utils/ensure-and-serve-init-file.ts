import fs from 'fs';
import { ipcMain } from 'electron';

/**
 * Ensures init.js exists, or creates it if it doesn't, then serves it to the renderer process.
 * @param {string} initFilePath
 */
export const ensureAndServeInitFile = (initFilePath: string) => {
  try {
    if (!fs.existsSync(initFilePath)) {
      fs.writeFile(
        initFilePath,
        '// This is your init.js file. It runs every time Vimi fully loads.',
        (err) => {
          if (err) throw err;
        },
      );
    }

    // Serve to renderer process
    ipcMain.on('getInitFilePath', (event) => {
      event.reply('sendInitFilePath', initFilePath);
    });
    console.log('init.js loaded successfully.');
  } catch (err) {
    console.error('Failed to load init.js', err);
  }
};
