import React from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes,Route} from 'react-router-dom'
import About from "./pages/About"
import Logout from "./pages/Logout"
import "./App.css"
import Register from "./pages/Register/Register";
import Login from "./pages/login/Login";
import Forgot_password from "./pages/forgot_password";
import Home from "./pages/home/Home";
import Report from "./pages/report/Report";


function App() {
  return (
    <div className="App">    
    <Header/>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about/" element={<About/>}/>
      <Route path="/report/" element={<Report/>}/>
      <Route path="/logout/" element={<Logout/>}/>
      <Route path="/register/" element={<Register/>}/>
      <Route path="/login/" element={<Login/>}/>
      <Route path="/forgot_password/" element={<Forgot_password/>}/>
    </Routes>
    </div>
  )
}

export default App;
