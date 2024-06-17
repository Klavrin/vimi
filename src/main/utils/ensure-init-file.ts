import fs from 'fs';

/**
 * Ensures init.js exists, or creates it if it doesn't, and executes it.
 * @param initFilePath
 */
export const ensureAndRunInitFile = (initFilePath: string) => {
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

    require(initFilePath);
    console.log('init.js loaded and executed successfully.');
  } catch (err) {
    console.error('Failed to load init.js', err);
  }
};
