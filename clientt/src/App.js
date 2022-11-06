import {React} from 'react';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import TodolistPage from './components/TodolistPage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { useCookies,CookiesProvider } from "react-cookie";

function App() {

  const [userTokenCookie, setuserTokenCookie,removeuserTokenCookie] = useCookies(["token"])
 
  return (
    <>
    <CookiesProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setuserCookie={setuserTokenCookie} userCookie={userTokenCookie} removeuserCookie={removeuserTokenCookie}/>}></Route>
        <Route path='/register' element={<Register setuserCookie={setuserTokenCookie} userCookie={userTokenCookie} removeuserCookie={removeuserTokenCookie}/>}></Route>
        <Route path='/user/todolist' element={<TodolistPage setuserCookie={setuserTokenCookie} userCookie={userTokenCookie} removeuserCookie={removeuserTokenCookie}/>}></Route>
      </Routes>
      </BrowserRouter>
    </CookiesProvider>
    </>
  );
}

export default App;
