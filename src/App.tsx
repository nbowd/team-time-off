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


/*
TO DO:
  - Try realtime database updates
  - Daily database function to update PTO values?
  - Refactor and extract reused functions/components
  - Either assign a request color to profile on creation or find a way to allow color selection
  - Request filtering to not grab every request, but only the ones within the current viewable timeframe
  - Security rules to not allow authorized users to create or update requests
  - Adjust CSS in 'handle request' dropdown?
  - Adjust CSS for input consistency on create/edit requests forms
  - Loading icon
  - Error Handling for request creation/edit
  - Add database rules to delete all requests associated with a User when they delete their account?
  - Add default table text when no requests are found
*/ 