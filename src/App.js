import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm'
import Dashboard from './Components/Dashboard/dashboard';
import React, {useEffect} from 'react';

function App() {
  /* const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  }; */

  // Step 2: Clear token on page refresh
  useEffect(() => {
    // Clear the token when the page is refreshed
    window.onbeforeunload = () => {
      localStorage.removeItem("authToken");
    };
    
    // If you want to remove token specifically on reload
    window.onload = () => {
      localStorage.removeItem("authToken");
    };
  }, []);

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
