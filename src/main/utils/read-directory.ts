import fs from 'fs-extra';
import path from 'path';
import { type V4Options, v4 as uuidv4 } from 'uuid';

type DirItems =
  | { _id: string; name: string; path: string; type: 'file' }
  | { _id: string; name: string; children: DirItems[]; type: 'directory' };

const readDirectory = (dirPath: string) => {
  const items: DirItems[] = [];

  fs.readdirSync(dirPath).forEach((item: string) => {
    const fullPath = `${dirPath}/${item}`;
    const stat = fs.statSync(fullPath);

    const basename = path.basename(fullPath);
    if (basename.startsWith('.')) return;

    if (stat.isFile()) {
      const extension = path.extname(fullPath);
      if (extension !== '.md') return;

      items.push({
        _id: uuidv4(),
        name: basename,
        path: fullPath,
        type: 'file',
      });
    } else if (stat.isDirectory()) {
      items.push({
        _id: uuidv4(),
        name: basename,
        children: readDirectory(fullPath),
        type: 'directory',
      });
    }
  });

  return items;
};

export default readDirectory;
