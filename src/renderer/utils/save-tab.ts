import store from '../store';
import { removeTab, markTabSaved } from '../store/reducers/tab-bar';

/** Asks the main process to write the tab's contents to its file. */
export const saveTab = (tab: { path: string; contents: string }) => {
  window.electron.ipcRenderer.sendMessage('writeFile', {
    path: tab.path,
    contents: tab.contents,
  });
};

export const getCurrentTab = () => {
  const { tabs, activeTabIndex } = store.getState().tabBar;
  return tabs[activeTabIndex];
};

export const saveCurrentTab = () => {
  const tab = getCurrentTab();
  if (tab) saveTab(tab);
};

/** Closes a tab without asking anything. Every close path goes through here. */
export const closeTab = (_id: string) => {
  store.dispatch(removeTab(_id));
};

// Paths of tabs that should be closed as soon as their pending save succeeds.
const closeAfterSave = new Set<string>();

export const saveAndCloseTab = (tab: {
  _id: string;
  path: string;
  contents: string;
}) => {
  closeAfterSave.add(tab.path);
  saveTab(tab);
};

/** Called when the main process reports that a file was written. */
export const handleFileSaved = (file: { path: string; contents: string }) => {
  store.dispatch(markTabSaved(file));
  if (closeAfterSave.delete(file.path)) {
    store
      .getState()
      .tabBar.tabs.filter((tab) => tab.path === file.path)
      .forEach((tab) => closeTab(tab._id));
  }
};

/** Called when the main process failed to write a file. */
export const handleFileSaveError = (error: { path: string }) => {
  closeAfterSave.delete(error.path);
};
