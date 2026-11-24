import path from 'path';
import { BrowserWindow, dialog, WebContents } from 'electron';

export async function showOpenFolderDialog(
  window: BrowserWindow | null | undefined,
  target: WebContents,
) {
  try {
    const options = { properties: ['openDirectory' as const] };
    const res = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options);
    if (res.canceled || res.filePaths.length === 0) return;
    target.send('folderOpened', { path: res.filePaths[0] });
  } catch (err) {
    target.send('openDialogError', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function showOpenFileDialog(
  window: BrowserWindow | null | undefined,
  target: WebContents,
) {
  try {
    const options = {
      properties: ['openFile' as const],
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    };
    const res = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options);
    if (res.canceled || res.filePaths.length === 0) return;
    const filePath = res.filePaths[0];
    target.send('fileOpenedFromDialog', {
      path: filePath,
      dirPath: path.dirname(filePath),
    });
  } catch (err) {
    target.send('openDialogError', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
