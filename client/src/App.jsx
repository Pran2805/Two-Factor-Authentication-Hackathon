import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import Logout from './Pages/Logout';
import Signup from './Pages/Signup';
import Otp from './Pages/Otp';

// Protected Route Component

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/verifyotp' element={<Otp />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/logout" element={<Logout />}/>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
