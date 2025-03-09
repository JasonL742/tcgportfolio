import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './Components/Navbar/signin.jsx';
import Market from './market.jsx';
import Home from './Home.jsx'
import Folderpage from './folderpage.jsx';

const App = () => {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/market" element={<Market />} />
      <Route path="/folderpage/:id" element={<Folderpage />} />
    </Routes>
  );
};

export default App;