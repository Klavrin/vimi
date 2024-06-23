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

const themeFileContents = `
.cm-heading1 {
  font-size: 1.8rem;
}
.cm-heading2 {
  font-size: 1.6rem;
}
.cm-heading3 {
  font-size: 1.4rem;
}
.cm-heading4 {
  font-size: 1.2rem;
}
.cm-heading5 {
  font-size: 1rem;
}
.cm-heading6 {
  font-size: 0.8rem;
}
`;

/**
 * Ensures theme.css exists, or creates it if it doesn't.
 * @param {string} themeFilePath
 */
export const ensureThemeFile = (themeFilePath: string) => {
  try {
    if (!fs.existsSync(themeFilePath)) {
      fs.writeFile(themeFilePath, themeFileContents, (err) => {
        if (err) throw err;
      });
    }
  } catch (err) {
    console.error('Failed to load init.js', err);
  }
};
