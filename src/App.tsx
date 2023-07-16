import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import '@/App.css'
import LoginOrSignup from "./components/LoginOrSignup";
import Profile from "./components/Profile";
import Calendar from "./components/Calendar";
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
        <Route path="/" element={<Calendar />} />
        <Route path="/requests" element={<h1>All Requests</h1>} />
        <Route path="/requests/:id" element={<h1>My Requests</h1>} />
        <Route path="/users" element={<h1>Users</h1>} />
      </Routes>
      
    </div>
  );
}

export default App;
