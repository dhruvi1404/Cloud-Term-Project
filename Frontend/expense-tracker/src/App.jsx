import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './Pages/RegistrationPage';
import LandingPage from './Pages/LandingPage';
import Navbar from './Pages/NavBar';
import VerificationPage from './Pages/VerificationPage';
import UploadBillPage from './Pages/UploadBillPage';
import LoginPage from './Pages/LoginPage';


const App = () => {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/upload-bill" element={<UploadBillPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
