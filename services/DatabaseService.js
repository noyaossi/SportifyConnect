import * as SQLite from 'expo-sqlite';

let db = null;

export const setupDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  await db.execAsync([{
    sql: `CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uri TEXT NOT NULL,
            description TEXT
          );`,
    args: []
  }]);
};

export const insertPhoto = async (uri, description) => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  return db.execAsync([{
    sql: 'INSERT INTO photos (uri, description) VALUES (?, ?);',
    args: [uri, description]
  }]);
};

export const getPhotos = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Cache.db');
  }

  const result = await db.execAsync([{
    sql: 'SELECT * FROM photos;',
    args: []
  }]);

  return result[0].rows._array;
};
