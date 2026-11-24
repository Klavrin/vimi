import store from '../renderer/store';
import {
  addTab,
  removeTab,
  updateTabContents,
} from '../renderer/store/reducers/tab-bar';
import { setCurrentDirectoryPath } from '../renderer/store/reducers/current-directory';
import { setSidebarValue } from '../renderer/store/reducers/sidebar-active';
import { setFileTree } from '../renderer/store/reducers/workspace';
import closeFolder from '../renderer/utils/close-folder';
import {
  handleFileSaved,
  handleUnsavedCloseReply,
} from '../renderer/utils/save-tab';

jest.mock('../renderer/utils/db', () => ({
  addTab: jest.fn(),
  deleteTab: jest.fn(),
  updateTab: jest.fn(),
  updateTabs: jest.fn(),
  getAllTabs: jest.fn(),
}));

type Handler = (...args: any[]) => void;
let listeners: Record<string, Handler[]>;
let respondWith: 'save' | 'discard' | 'cancel';
let sendMessage: jest.Mock;

const emit = (channel: string, payload: unknown) =>
  (listeners[channel] ?? []).slice().forEach((fn) => fn(payload));

const makeTab = (id: string) => ({
  _id: id,
  path: `/notes/${id}.md`,
  title: id,
  contents: 'hello',
  previewMode: false,
  tags: [],
  pinned: false,
});

const tabIds = () => store.getState().tabBar.tabs.map((t) => t._id);

beforeEach(() => {
  listeners = {};
  respondWith = 'cancel';
  sendMessage = jest.fn((channel: string, arg: any) => {
    // Behave like the main process: answer asynchronously.
    if (channel === 'confirmUnsavedClose') {
      setTimeout(() => {
        const reply = { _id: arg._id, response: respondWith };
        // The app-wide handler (Main.tsx) and closeFolder's own listener
        handleUnsavedCloseReply(reply);
        emit('confirmUnsavedCloseReply', reply);
      });
    } else if (channel === 'writeFile') {
      setTimeout(() =>
        handleFileSaved({ path: arg.path, contents: arg.contents }),
      );
    }
  });
  (window as any).electron = {
    ipcRenderer: {
      sendMessage,
      on: (channel: string, fn: Handler) => {
        listeners[channel] = [...(listeners[channel] ?? []), fn];
        return () => {
          listeners[channel] = listeners[channel].filter((f) => f !== fn);
        };
      },
    },
  };

  // Reset: remove leftover tabs, then set up an open folder
  store
    .getState()
    .tabBar.tabs.map((t) => t._id)
    .forEach((id) => store.dispatch(removeTab(id)));
  store.dispatch(setCurrentDirectoryPath('/notes'));
  store.dispatch(setSidebarValue(true));
  store.dispatch(
    setFileTree([{ _id: 'f', name: 'a', path: '/notes/a', type: 'file' }]),
  );
});

const expectFolderClosed = () => {
  const state = store.getState();
  expect(state.currentDirectory.currentDirectoryPath).toBe('');
  expect(localStorage.getItem('currentDirectoryPath')).toBeNull();
  expect(state.workspace.fileTree).toEqual([]);
  expect(state.sidebar.isActive).toBe(false);
};

describe('closeFolder', () => {
  it('closes clean tabs without asking and clears the session', async () => {
    store.dispatch(addTab(makeTab('a')));
    store.dispatch(addTab(makeTab('b')));

    await expect(closeFolder()).resolves.toBe(true);

    expect(tabIds()).toEqual([]);
    expect(sendMessage).not.toHaveBeenCalledWith(
      'confirmUnsavedClose',
      expect.anything(),
    );
    expectFolderClosed();
  });

  it('works with no tabs at all', async () => {
    await expect(closeFolder()).resolves.toBe(true);
    expectFolderClosed();
  });

  it('keeps everything when the user cancels on a dirty tab', async () => {
    store.dispatch(addTab(makeTab('a')));
    store.dispatch(addTab(makeTab('b')));
    store.dispatch(updateTabContents({ _id: 'b', contents: 'changed' }));
    respondWith = 'cancel';

    await expect(closeFolder()).resolves.toBe(false);

    expect(tabIds()).toEqual(['b']); // clean tab 'a' was already closed
    expect(store.getState().currentDirectory.currentDirectoryPath).toBe(
      '/notes',
    );
    expect(store.getState().sidebar.isActive).toBe(true);
  });

  it("closes a dirty tab without saving on Don't Save", async () => {
    store.dispatch(addTab(makeTab('a')));
    store.dispatch(updateTabContents({ _id: 'a', contents: 'changed' }));
    respondWith = 'discard';

    await expect(closeFolder()).resolves.toBe(true);

    expect(sendMessage).not.toHaveBeenCalledWith(
      'writeFile',
      expect.anything(),
    );
    expect(tabIds()).toEqual([]);
    expectFolderClosed();
  });

  it('saves then closes a dirty tab on Save', async () => {
    store.dispatch(addTab(makeTab('a')));
    store.dispatch(updateTabContents({ _id: 'a', contents: 'changed' }));
    respondWith = 'save';

    await expect(closeFolder()).resolves.toBe(true);

    expect(sendMessage).toHaveBeenCalledWith('writeFile', {
      path: '/notes/a.md',
      contents: 'changed',
    });
    expect(tabIds()).toEqual([]);
    expectFolderClosed();
  });
});
