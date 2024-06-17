import fs from 'fs-extra';
import path from 'path';

type DirItems =
  | { name: string; path: string; type: 'file' }
  | { name: string; children: DirItems[]; type: 'directory' };

/**
 * Reads a directory recursively, checking for files with the `.md` extension.
 * @param {string} dirPath
 * @returns {array}
 */
export const readDirectory = (dirPath: string) => {
  const items: DirItems[] = [];

  fs.readdirSync(dirPath).forEach((item: string) => {
    const fullPath = `${dirPath}/${item}`;
    const stat = fs.statSync(fullPath);

    const basename = path.basename(fullPath);
    if (basename.startsWith('.')) return;

    if (stat.isFile()) {
      const extension = path.extname(fullPath);
      if (extension !== '.md') return;

      items.push({ name: basename, path: fullPath, type: 'file' });
    } else if (stat.isDirectory()) {
      items.push({
        name: basename,
        children: readDirectory(fullPath),
        type: 'directory',
      });
    }
  });

  return items;
};
