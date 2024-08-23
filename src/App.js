import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<LoginForm />}></Route>
          <Route path='register' element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
