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
import Ad_dashboard from "./pages/admin-panel/admin-dashboard/ad_dashboard";
import Ad_notification from "./pages/admin-panel/admin-notification/ad_notification";
import Station_login from "./pages/login/Station_login";
import Detailed_report from "./pages/report/inner/Detailed_report";
import Citizens_profile from "./pages/users/Citizens_profile";

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
      <Route path="/dashboard/" element={<Ad_dashboard/>} />
      <Route path="/ad_notification" element={<Ad_notification/>} />
      <Route path="/Member_login" element={<Station_login/>} />
      <Route path="/report/:id" element={<Detailed_report/>} />
      <Route path="/Citizens_profile" element={<Citizens_profile/>} />
    </Routes>
    </div>
  )
}

export default App;
