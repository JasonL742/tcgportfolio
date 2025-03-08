import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './Components/Navbar/signin.jsx';


const App = () => {
  return (
    <Routes>

      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
};

export default App;