import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import '@/App.css'
import LoginOrSignup from "@/scenes/LoginOrSignup";
import Profile from "@/scenes/Profile";
import Calendar from "@/scenes/Calendar";
import MyRequests from "./scenes/MyRequests";
import HandleRequests from "./scenes/HandleRequests";
import Users from "./scenes/Users";
import { Route, Routes } from 'react-router-dom';


function App() {


  const user = useContext(AuthContext);

  return (
    <div className="app">
      <div className="sidebar">
        {user? 
          <Profile user={user} />
          : 
          <LoginOrSignup/>}
      </div>
      
      <Routes>
        <Route path="/" element={<Calendar user={user} />} />
        <Route path="/requests" element={<HandleRequests user={user} />} />
        <Route path="/requests/:id" element={<MyRequests user={user} />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      
    </div>
  );
}

export default App;
