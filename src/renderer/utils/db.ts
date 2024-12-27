let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export interface Tab {
  _id: string;
  path: string;
  title: string;
  contents: string;
  previewMode: boolean;
  tags: string[];
  pinned: boolean;
}

export const initDB = () => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open('active-tabs');

    request.onupgradeneeded = () => {
      db = request.result;

      // if the object store doesn't exist, create it
      if (!db.objectStoreNames.contains('active-tabs')) {
        db.createObjectStore('active-tabs', { keyPath: '_id' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(true);
    };

    request.onerror = () => {
      reject(false);
    };
  });
};

export const addTab = (tab: Tab) => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open('active-tabs', version);

    request.onsuccess = () => {
      db = request.result;

      const transaction = db.transaction('active-tabs', 'readwrite');
      const store = transaction.objectStore('active-tabs');

      store.add(tab);
      resolve(tab);
    };

    request.onerror = () => {
      const error = request.error?.message;

      if (error) {
        reject(error);
      } else {
        reject('Failed to add new tab.');
      }
    };
  });
};

export const updateTab = (tab: Tab) => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open('active-tabs', version);

    request.onsuccess = () => {
      db = request.result;

      const transaction = db.transaction('active-tabs', 'readwrite');
      const store = transaction.objectStore('active-tabs');

      // store.put(tab, key);
      store.put(tab);
      resolve(tab);
    };

    request.onerror = () => {
      const error = request.error?.message;

      if (error) {
        reject(error);
      } else {
        reject('Failed to update tab.');
      }
    };
  });
};

export const deleteTab = (_id: string) => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open('active-tabs');

    request.onsuccess = () => {
      db = request.result;

      const transaction = db.transaction('active-tabs', 'readwrite');
      const store = transaction.objectStore('active-tabs');
      const res = store.delete(_id);

      res.onsuccess = () => {
        resolve(true);
      };

      res.onerror = () => {
        reject(false);
      };
    };
  });
};

export const getAllTabs = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('active-tabs', version);

    req.onsuccess = () => {
      db = req.result;

      const transaction = db.transaction('active-tabs', 'readwrite');
      const store = transaction.objectStore('active-tabs');
      const res = store.getAll();

      res.onsuccess = () => {
        resolve(res.result);
      };

      res.onerror = () => {
        reject('Failed to get all tabs.');
      };
    };
  });
};
