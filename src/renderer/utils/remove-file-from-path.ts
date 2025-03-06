export const removeFileFromPath = (path: string) => {
  const lastSlashIndex = path.lastIndexOf('/');
  if (lastSlashIndex === -1) return '.';
  if (lastSlashIndex === 0) return '/';
  return path.substring(0, lastSlashIndex);
};
