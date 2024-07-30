import { FileTree } from '../components/sidebar-item';

export const sortFileTree = (array: FileTree[]) => {
  return array.sort((a, b) => {
    // Prioritize directories
    if (a.type === 'directory' && b.type === 'file') return -1;
    else if (a.type === 'file' && b.type === 'directory') return 1;
    // If both are directories or both are files, maintain original order
    else return 0;
  });
};
