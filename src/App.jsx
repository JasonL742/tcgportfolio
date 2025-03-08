import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './Components/Navbar/signin.jsx';
import Home from './Home.jsx'
import folderpage from './folderpage.jsx';
const App = () => {
  return (
    <Routes>
       <Route path="/Home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/folderpage" element={<folderpage />} />
    </Routes>
  );
};

export default App;