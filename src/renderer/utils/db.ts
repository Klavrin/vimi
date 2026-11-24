const DB_NAME = 'active-tabs';
const STORE_NAME = 'active-tabs';

let dbPromise: Promise<IDBDatabase> | null = null;

export interface Tab {
  _id: string;
  path: string;
  title: string;
  contents: string;
  previewMode: boolean;
  tags: string[];
  pinned: boolean;
  savedContents: string;
  order: number;
}

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  const opened = new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME);

    openRequest.onupgradeneeded = () => {
      const upgradeDb = openRequest.result;
      if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
        upgradeDb.createObjectStore(STORE_NAME, { keyPath: '_id' });
      }
    };

    openRequest.onsuccess = () => {
      const database = openRequest.result;
      // Allow the connection to be replaced if another context upgrades it
      database.onversionchange = () => {
        database.close();
        dbPromise = null;
      };
      resolve(database);
    };

    openRequest.onerror = () => {
      reject(openRequest.error?.message ?? 'Failed to open database.');
    };
  });

  // Don't cache a failed open, so a later call can retry
  opened.catch(() => {
    if (dbPromise === opened) dbPromise = null;
  });
  dbPromise = opened;
  return opened;
};

/**
 * Runs `work` inside its own readwrite transaction and resolves with `result`
 * once the transaction has actually committed.
 */
const writeTransaction = async <T>(
  work: (store: IDBObjectStore) => void,
  result: T,
  failure: string,
): Promise<T> => {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error?.message ?? failure);
    transaction.onabort = () => reject(transaction.error?.message ?? failure);
    work(transaction.objectStore(STORE_NAME));
  });
};

export const initDB = async () => {
  await openDB();
  return true;
};

export const addTab = (tab: Tab) =>
  writeTransaction((store) => store.add(tab), tab, 'Failed to add new tab.');

export const updateTab = (tab: Tab) =>
  writeTransaction((store) => store.put(tab), tab, 'Failed to update tab.');

/** Updates several tabs atomically in a single transaction. */
export const updateTabs = (tabs: Tab[]) =>
  writeTransaction(
    (store) => tabs.forEach((tab) => store.put(tab)),
    tabs,
    'Failed to update tabs.',
  );

export const deleteTab = (_id: string) =>
  writeTransaction((store) => store.delete(_id), true, 'Failed to delete tab.');

export const getAllTabs = async () => {
  const db = await openDB();
  return new Promise<Tab[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const req = transaction.objectStore(STORE_NAME).getAll();
    transaction.oncomplete = () => resolve(req.result);
    transaction.onerror = () => reject(new Error('Failed to get all tabs.'));
    transaction.onabort = () => reject(new Error('Failed to get all tabs.'));
  });
};
