/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { indexedDB } from "fake-indexeddb";

const replaceDotsWithUnderscores = (record: any): any => {
  const updatedRecord: any = {};
  for (const key in record) {
    updatedRecord[key.replace(/\./g, "_")] = record[key];
  }
  return updatedRecord;
};

const setupFakeIndexedDB = async () => {
  return await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("mockedIndexedDB", 1);

    request.onerror = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      reject(dbRequest.error);
    };

    request.onupgradeneeded = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      const db = dbRequest.result as IDBDatabase;

      const objectStore = db.createObjectStore("events", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex(
        "iam_id_iam_eventType_index",
        ["iam_id", "iam_eventType"],
        {
          unique: false,
        }
      );
      objectStore.createIndex("iam_eventType_index", "iam.eventType", {
        unique: false,
      });
      objectStore.createIndex(
        "ajo_id_ajo_eventType_index",
        ["ajo_id", "ajo_eventType"],
        {
          unique: false,
        }
      );
      objectStore.createIndex("ajo_eventType_index", "ajo.eventType", {
        unique: false,
      });

      resolve(db);
    };
  });
};

const addDataToFakeIndexDB = async (records: Array<Object>) => {
  return await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("mockedIndexedDB", 1);

    request.onerror = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      reject(dbRequest.error);
    };

    request.onsuccess = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      const db = dbRequest.result as IDBDatabase;

      const transaction = db.transaction("events", "readwrite");
      const objectStore = transaction.objectStore("events");

      for (const record of records) {
        const updatedRecord = replaceDotsWithUnderscores(record);
        objectStore.add(updatedRecord);
      }

      resolve(db);
    };
  });
};

const clearFakeIndexedDB = async (db: IDBDatabase) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const transaction = db.transaction("events", "readwrite");
      const objectStore = transaction.objectStore("events");
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve(true);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export { setupFakeIndexedDB, addDataToFakeIndexDB, clearFakeIndexedDB };
