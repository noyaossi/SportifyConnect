import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'Sportify.db',
    location: 'default',
  },
  () => console.log('Database opened successfully'),
  error => console.log('Error opening database:', error)
);

export const initializeEventCache = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, eventName TEXT, sportType TEXT, location TEXT, date TEXT, time TEXT, participants INTEGER, description TEXT, eventImage TEXT)',
      [],
      () => console.log('Events table created successfully'),
      error => console.log('Error creating events table:', error)
    );
  });
};

export default db;