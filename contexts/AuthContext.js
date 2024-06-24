import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from '../firebase/firebaseConfig';

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const value = {
    currentUser,
    logout,
  };

  

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
