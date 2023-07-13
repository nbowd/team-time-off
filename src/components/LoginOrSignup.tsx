import { useState, useRef } from "react"
import { auth } from "@/firebaseSetup";
import './LoginOrSignup.css'

function LoginOrSignup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);
  const [registeredUser, setRegisteredUser] = useState(true);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      await auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      )
    } catch (error) {
      console.log(error)
    }
  }

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current!.value !== repeatPasswordRef.current!.value) {
      console.log('ERROR: Password mismatch')
      return
    }

    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        registeredUser ?
            <div className="login">
              <h1 className="login-title">Login</h1>
              <form onSubmit={signIn}>
                <input type="text" placeholder="Email" name="email" ref={emailRef} required/>
                <input type="password" placeholder="Password" name="psw" ref={passwordRef} required/>
        
                <button type="submit">Login</button>
              </form>
            </div>
            : 
            <div className="signup">
              <h1 className="signup-title">Create an Account</h1>
              <form onSubmit={createAccount}>
                  <input type="text" placeholder="Enter Email" name="email" ref={emailRef} required/>
                  <input type="password" placeholder="Enter Password" name="psw" ref={passwordRef} required/>
                  <input type="password" placeholder="Repeat Password" name="psw-repeat" ref={repeatPasswordRef} required/>

                  <button type="submit">Create Account</button>
              </form>
            </div>
      }
      <button className="login-signup-switch" onClick={() => setRegisteredUser(!registeredUser)}>{registeredUser? "Create an Account": "Have Account? Login"}</button>
    </>
  )
}

export default LoginOrSignup