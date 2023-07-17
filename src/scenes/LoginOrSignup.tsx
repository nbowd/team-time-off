import { useState, useRef } from "react"
import { auth, db } from "@/firebaseSetup";
import { collection, addDoc } from "firebase/firestore"; 
import '@/scenes/LoginOrSignup.css';

const TOTAL_PTO = 25;

function LoginOrSignup() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
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
      const response = await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      )
      const newUser = response.user;
        
      await addDoc(collection(db, "Employees"), {
        id: newUser!.uid,
        first_name: firstNameRef.current!.value,
        last_name: lastNameRef.current!.value,
        email: newUser!.email,
        manager_privileges: true,
        remaining_pto: TOTAL_PTO,
        used_pto: 0,
        profile_picture: null,
        national_holidays: 'US'

      });

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
                  <input type="text" placeholder="First Name" name="firstName" ref={firstNameRef} required/>
                  <input type="text" placeholder="Last Name" name="lastName" ref={lastNameRef} required/>
                  <input type="text" placeholder="Email" name="email" ref={emailRef} required/>
                  <input type="password" placeholder="Password" name="psw" ref={passwordRef} required/>
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