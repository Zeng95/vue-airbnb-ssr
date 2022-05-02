export default class Database {
  private databaseName: string; // * 数据库名称
  private databaseVersion: number; // * 数据库版本
  private database!: IDBDatabase; // * 数据库对象

  constructor(databaseName: string, databaseVersion?: number) {
    this.databaseName = databaseName;
    this.databaseVersion = databaseVersion || 1;
  }

  // * Open a database
  public open(
    storeName: string,
    keyPath: string | string[],
    indexs?: string[]
  ) {
    if (!window.indexedDB) {
      console.log(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );
      return;
    }

    // * Open our database with the defined name and version
    // * It returns openRequest object
    const openRequest: IDBOpenDBRequest = window.indexedDB.open(
      this.databaseName,
      this.databaseVersion
    );

    // * Database is ready, but its version is outdated
    openRequest.onupgradeneeded = () => {
      console.log('数据库升级成功');

      this.database = openRequest.result;

      if (!this.database.objectStoreNames.contains(storeName)) {
        // * Create an object store in the database
        const objectStore = this.database.createObjectStore(storeName, {
          autoIncrement: true,
          keyPath
        });

        if (indexs && indexs.length > 0) {
          indexs.forEach((item: string) => {
            objectStore.createIndex(item, item, { unique: false });
          });
        }

        objectStore.transaction.oncomplete = () => {
          console.log('创建 object store 成功');
        };
      }
    };

    // * Database is ready, there’s the “database object” in openRequest.result, we should use it for further calls
    openRequest.onsuccess = () => {
      console.info('数据库打开成功');
      this.database = openRequest.result;
    };

    // * Opening a database failed
    openRequest.onerror = (event) => {
      console.error('数据库打开错误', openRequest.error);
      console.log(event);
    };
  }

  // * Add data to the object store
  addItem(storeName: string, data: any) {
    if (this.database) {
      const request = this.database
        .transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .add(data);

      request.onsuccess = () => {
        console.log('数据写入成功', request.result);
      };

      request.onerror = () => {
        console.error('数据写入失败', request.error);
      };
    }
  }

  // * Update data in the object store
  updateItem(storeName: string, data: any) {
    if (this.database) {
      const request = this.database
        .transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .put(data);

      request.onsuccess = () => {
        console.log('数据修改成功', request.result);
      };

      request.onerror = () => {
        console.error('数据修改失败', request.error);
      };
    }
  }

  // * Remove data from the object store
  removeItem(storeName: string, key: number | string) {
    const request = this.database
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .delete(key);

    request.onsuccess = () => {
      console.log('数据删除成功', request.result);
    };

    request.onerror = () => {
      console.error('数据删除失败', request.error);
    };
  }

  // * Get an object in an object store
  getItem(storeName: string, key: number | string) {
    const request = this.database
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .get(key);

    request.onsuccess = () => {
      console.log('查询数据成功', request.result);
    };

    request.onerror = () => {
      console.error('查询数据失败', request.error);
    };
  }

  // * Get an array of all the objects in an object store
  getList(storeName: string) {
    const request = this.database
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .getAll();

    request.onsuccess = () => {
      console.log('查询所有数据成功', request.result);
    };

    request.onerror = () => {
      console.error('查询所有数据失败', request.error);
    };
  }
}
