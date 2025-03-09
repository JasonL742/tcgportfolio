import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './Components/Navbar/signin.jsx';
import Market from './market.jsx';
import Home from './Home.jsx'
import Folderpage from './folderpage.jsx';
//import Gpt from './gpt.jsx'; <Route path="/gpt" element={<Gpt />} />
const App = () => {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/market/:id" element={<Market />} />
      <Route path="/folderpage/:id" element={<Folderpage />} />
      <Route path="/market" element={<Market />} />
     
    </Routes>
  );
};

export default App;