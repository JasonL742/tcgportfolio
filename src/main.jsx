import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom'; 
import Navbar from './Components/Navbar/navbar.jsx'
import Hme from './Home.jsx'
createRoot(document.getElementById('root')).render(
<BrowserRouter basename="/">
 <StrictMode>
    <App />
    <Navbar/>

  </StrictMode>
  </BrowserRouter>
);
