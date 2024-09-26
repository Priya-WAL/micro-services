import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm'
import Dashboard from './Components/Dashboard/dashboard';
import React, {useEffect} from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<LoginForm />}></Route>
          <Route path='register' element={<RegisterForm />} />
          <Route path='dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
