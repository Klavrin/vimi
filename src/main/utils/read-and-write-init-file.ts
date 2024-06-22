import fs from 'fs-extra';
import path from 'path';

/**
 * Reads the init.js file from the `userData` directory and writes its contents to the `src/renderer/config/init.js` file.
 * @param {string} initFilePath
 */
export const readAndWriteInitFile = (initFilePath: string) => {
  fs.readFile(initFilePath, (err, contents) => {
    if (err) throw err;

    fs.writeFile(
      path.join(__dirname, '../../renderer/config/init.js'),
      contents,
      (err) => {
        if (err) throw err;
      },
    );
  });
};

/**
 * Empties the init.js file.
 */
export const emptyInitFile = () => {
  fs.writeFile(
    path.join(__dirname, '../../renderer/config/init.js'),
    ' ',
    (err) => {
      if (err) throw err;
    },
  );
};
