import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx';
import{Navigate, Route,Routes} from 'react-router-dom';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';
import { UseAuthStore } from './store/UseAuthStore.js';
import { Loader } from 'lucide-react';
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const{authUser,checkAuth,isCheckingAuth,onlineUsers}=UseAuthStore();
  const{theme}=useThemeStore();
console.log("Online Users:", onlineUsers);
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);
  console.log(authUser);
  if(isCheckingAuth &&  !authUser) return (
    <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin'/>
    </div>
  )
  return (
    <div data-theme ={theme}>
      <Navbar/>
    <Routes>
      <Route path='/' element={authUser?<HomePage/>:<Navigate to="/login"/>}></Route>
      <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to="/"/>}></Route>
      <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to="/"/>}></Route>
      <Route path='/settings' element={<SettingsPage/>}></Route>
      <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}></Route>
    </Routes>
    
    <Toaster/>
    </div>
  )
}

export default App