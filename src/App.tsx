import { useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebaseSetup";
import '@/App.css'
import LoginOrSignup from "./components/LoginOrSignup";

function App() {


  const user = useContext(AuthContext);

  const signOut = async () => {
    await auth.signOut();
  }
  return (
    <div className="app">
      <div className="sidebar">
        {user? 
          <>
          <h1>logged in</h1>
          <button className="logout-btn" onClick={signOut}>Log out</button>
          </>: 
          <LoginOrSignup/>}
      </div>
    </div>
  );
}

export default App;
