// contexts/RefreshContext.js
import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = () => {
    setRefreshing(!refreshing);
  };

  return (
    <RefreshContext.Provider value={{ refreshing, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
