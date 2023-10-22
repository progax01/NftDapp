// Import necessary components from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskSignIn from './MetaMaskSignIn';
import Dashboard from './section/Dashboard';
import "./index.css";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Upload from './section/Upload';
import Market from './section/Market';
import MyNft from './section/MyNft';
 

function App() {
  return (
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<MetaMaskSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path='/market-place' element= {<Market/>} />
        <Route path = '/my-nft' element={<MyNft/>} />
      </Routes>
    </Router>
  );
}

export default App;
