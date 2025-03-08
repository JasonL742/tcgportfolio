import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, provider } from '../../../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
function signin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Error during login: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  return (
   
    <div>
    <h1>Signin Page</h1>
    {user ? (
      <div>
        <h2>Welcome, {user.displayName}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    ) : (
      <div>
        <p>Please log in to continue.</p>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    )}
  </div>
  );
}

export default signin;
