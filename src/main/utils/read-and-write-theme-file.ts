import fs from 'fs-extra';
import path from 'path';

/**
 * Reads the theme.css file from the `userData` directory and writes its contents to the `src/renderer/config/theme.css` file.
 * @param {string} themeFilePath
 */
export const readAndWriteThemeFile = (themeFilePath: string) => {
  fs.readFile(themeFilePath, (err, contents) => {
    if (err) throw err;

    fs.writeFile(
      path.join(__dirname, '../../renderer/config/theme.css'),
      contents,
      (err) => {
        if (err) throw err;
      },
    );
  });
};

/**
 * Empties the theme.css file.
 */
export const emptyThemeFile = () => {
  fs.writeFile(
    path.join(__dirname, '../../renderer/config/theme.css'),
    ' ',
    (err) => {
      if (err) throw err;
    },
  );
};
