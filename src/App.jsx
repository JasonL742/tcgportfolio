
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from './Components/Navbar/navbar';
function App() {
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
   
    <Router>
      <div className="App">
        {user ? (
          <div>
            <h1>Welcome, {user.displayName}</h1>
            <button onClick={handleLogout}>Logout</button>
            <Routes>
              <Route path="/" element={<h2>Home</h2>} />
              <Route path="/profile" element={<h2>Your Profile</h2>} />
            </Routes>
          </div>
        ) : (
        
          <div>
            <div>
            <Navbar />
            </div>
            <h1>Please log in</h1>
            <button onClick={handleLogin}>Login with Google</button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
