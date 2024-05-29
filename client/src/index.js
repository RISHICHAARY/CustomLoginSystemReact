import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';

import SignIn from './Pages/signInPage';
import Dashboard from './Pages/dashboardPage';
import PasswordResetEmail from './Pages/passwordResetEmailPage';
import PasswordReset from './Pages/passwordResetPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path='/' element={ <SignIn/> }/>
      <Route path='/Dashboard' element={ <Dashboard/> }/>
      <Route path='/EmailVerification' element={ <PasswordResetEmail/> }/>
      <Route path='/UpdatePassword' element={ <PasswordReset/> }/>
    </Routes>
  </Router>
);
