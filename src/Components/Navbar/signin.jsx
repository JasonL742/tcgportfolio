import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../../firebase';  // Make sure to import your firebase config
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

function Signin() {
  const [user, setUser] = useState(null);

  // This effect will run when the component mounts and will listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the listener when the component unmounts
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
      setUser(null);  // Reset the user when logged out
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

export default Signin;
