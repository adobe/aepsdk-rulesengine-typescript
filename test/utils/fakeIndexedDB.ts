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
import { IDBDatabase, IDBFactory, IDBRequest } from "fake-indexeddb";

declare global {
  interface Window {
    indexedDB: IDBFactory;
  }
}

window.indexedDB = new IDBFactory();

const matches = (
  source: Record<string, any>,
  obj: Record<string, any>
): boolean =>
  Object.keys(source).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === source[key]
  );

const namesDotToUnderscoreMap = new Map([
  ["iam.id", "iam_id"],
  ["iam.eventType", "iam_eventType"],
]);

const namesUnderscoreToDotMap = new Map([
  ["iam_id", "iam.id"],
  ["iam_eventType", "iam.eventType"],
]);

const setupFakeIndexedDBWithData = async (records: Record<string, any>) => {
  return await new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open("mockedIndexedDB", 1);

    request.onerror = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      reject(dbRequest.error);
    };

    request.onsuccess = (event: Event) => {
      const dbRequest = event.target as IDBRequest;
      const db = dbRequest.result as IDBDatabase;
      resolve(db);
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

      const parsedRecords = records.map((record) => {
        let parsedRecord = {};
        Object.keys(record).forEach((key) => {
          if (namesDotToUnderscoreMap.has(key)) {
            parsedRecord[namesDotToUnderscoreMap.get(key)] = record[key];
          } else {
            parsedRecord[key] = record[key];
          }
        });

        return parsedRecord;
      });

      parsedRecords.forEach((record) => objectStore.add(record));
    };
  });
};

const queryEventInIndexedDB = async (db: IDBDatabase, eventContext) => {
  return await new Promise<any>((resolve, reject) => {
    try {
      const transaction = db.transaction("events", "readonly");
      const objectStore = transaction.objectStore("events");
      objectStore
        .index("iam_id_iam_eventType_index")
        .getAll([
          eventContext["iam.id"],
          eventContext["iam.eventType"],
        ]).onsuccess = (eventObjStore) => {
        const data = eventObjStore.target.result.map((record) => {
          let parsedRecord = {};
          Object.keys(record).forEach((key) => {
            if (namesUnderscoreToDotMap.has(key)) {
              parsedRecord[namesUnderscoreToDotMap.get(key)] = record[key];
            } else {
              parsedRecord[key] = record[key];
            }
          });

          return parsedRecord;
        });

        resolve(data);
      };
    } catch (error) {
      console.error("Error verifying data:", error);
      reject(error);
    }
  });
};

export { setupFakeIndexedDBWithData, queryEventInIndexedDB };
