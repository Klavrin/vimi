import store from '../store';
import { isTabDirty } from '../store/reducers/tab-bar';
import { clearCurrentDirectoryPath } from '../store/reducers/current-directory';
import { setSidebarValue } from '../store/reducers/sidebar-active';
import { setFileTree, toggleSettings } from '../store/reducers/workspace';
import { closeTab } from './save-tab';

type Response = 'save' | 'discard' | 'cancel';

let closing = false;

const tabExists = (_id: string) =>
  store.getState().tabBar.tabs.some((tab) => tab._id === _id);

/**
 * Asks the main process what to do with a dirty tab. The global
 * `confirmUnsavedCloseReply` handler (save-tab.ts) performs the save/discard
 * itself; this only reports the user's answer so we know whether to go on.
 */
const askAboutTab = (tab: { _id: string; title: string }) =>
  new Promise<Response>((resolve) => {
    const { ipcRenderer } = window.electron;
    const remove = ipcRenderer.on('confirmUnsavedCloseReply', (reply: any) => {
      if (reply?._id !== tab._id) return;
      remove?.();
      resolve(reply.response);
    });
    ipcRenderer.sendMessage('confirmUnsavedClose', {
      _id: tab._id,
      title: tab.title,
    });
  });

/** Resolves true once the tab is gone, false if saving it failed. */
const waitForTabClosed = (tab: { _id: string; path: string }) =>
  new Promise<boolean>((resolve) => {
    if (!tabExists(tab._id)) {
      resolve(true);
      return;
    }
    let removeError: (() => void) | undefined;
    const unsubscribe = store.subscribe(() => {
      if (tabExists(tab._id)) return;
      unsubscribe();
      removeError?.();
      resolve(true);
    });
    removeError = window.electron.ipcRenderer.on(
      'fileSaveError',
      (error: any) => {
        if (error?.path !== tab.path) return;
        unsubscribe();
        removeError?.();
        resolve(false);
      },
    );
  });

/**
 * Closes every tab (asking about unsaved ones one at a time), then clears the
 * session directory so the intro page shows again.
 * Resolves false, leaving the folder open, if the user cancels or a save fails.
 */
export default async function closeFolder(): Promise<boolean> {
  if (closing) return false;
  closing = true;

  try {
    const tabs = [...store.getState().tabBar.tabs];

    for (let i = 0; i < tabs.length; i += 1) {
      const snapshot = tabs[i];
      const tab = store
        .getState()
        .tabBar.tabs.find((t) => t._id === snapshot._id);

      if (tab) {
        if (!isTabDirty(tab)) {
          closeTab(tab._id);
        } else {
          // eslint-disable-next-line no-await-in-loop
          const response = await askAboutTab(tab);
          if (response === 'cancel') return false;
          if (response === 'save') {
            // eslint-disable-next-line no-await-in-loop
            const saved = await waitForTabClosed(tab);
            if (!saved) return false;
          } else {
            closeTab(tab._id);
          }
        }
      }
    }

    const { dispatch, getState } = store;
    dispatch(clearCurrentDirectoryPath());
    dispatch(setFileTree([]));
    dispatch(setSidebarValue(false));
    if (getState().workspace.settingsVisible) dispatch(toggleSettings());
    return true;
  } finally {
    closing = false;
  }
}
