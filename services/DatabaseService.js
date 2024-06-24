import * as SQLite from 'expo-sqlite';

let db = null;

export const setupDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  await db.execAsync([{
    sql: `CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uri TEXT NOT NULL,
          );`,
    args: []
  }]);
};

export const insertPhoto = async (uri) => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  return db.execAsync([{
    sql: 'INSERT INTO profile (uri) VALUES (?);',
    args: [uri]
  }]);
};

export const getPhotos = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  const result = await db.execAsync([{
    sql: 'SELECT * FROM profile;',
    args: []
  }]);

  return result[0].rows._array;
};
