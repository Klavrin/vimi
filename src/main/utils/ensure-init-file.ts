import fs from 'fs';

/**
 * Ensures init.js exists, or creates it if it doesn't.
 * @param {string} initFilePath
 */
export const ensureInitFile = (initFilePath: string) => {
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
  } catch (err) {
    console.error('Failed to load init.js', err);
  }
};
