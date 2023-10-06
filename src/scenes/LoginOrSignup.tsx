import { useState, useRef } from "react"
import { auth, db } from "@/firebaseSetup";
import { collection, setDoc, doc } from "firebase/firestore"; 
import { handleError, settings } from "@/utils/helpers";
import '@/scenes/LoginOrSignup.css';

function LoginOrSignup() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [registeredUser, setRegisteredUser] = useState<boolean>(true);
  const errorRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(
        email,
        password
      )
    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message, setErrorMsg, errorRef)
      }
    }
  }

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      handleError('Password mismatch', setErrorMsg, errorRef)
      return
    }

    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      )
      const newUser = response.user;
        
      const newDocRef = doc(collection(db, "Employees"));
      await setDoc(
        newDocRef, {
          id: newDocRef.id,
          employee_id: newUser!.uid,
          first_name: firstName,
          last_name: lastName,
          email: newUser!.email,
          manager_privileges: false,
          remaining_pto: settings.totalPTO,
          used_pto: 0,
          profile_picture: null,
          national_holidays: 'US',
          color: settings.nameColors[Math.floor(Math.random() * settings.nameColors.length)]
        }
      )

    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message, setErrorMsg, errorRef)
      }
    }
  }

  const clearAllFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRepeatPassword('');
  }

  const handleSwitch = () => {
    clearAllFields();
    setRegisteredUser(!registeredUser);
  }

  return (
    <>
      {
        registeredUser ?
            <div className="login" onSelect={()=>setErrorMsg('')} >
              <h1 className="login-title">Login</h1>
              <form onSubmit={signIn}>
                <input type="text" placeholder="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" name="psw" value={password} onChange={e => setPassword(e.target.value)} required/>
        
                <button type="submit" onSelect={(e:React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation()}}>Login</button>
              </form>
            </div>
            : 
            <div className="signup" onSelect={()=>setErrorMsg('')}>
              <h1 className="signup-title">Create an Account</h1>
              <form onSubmit={createAccount}>
                  <input type="text" placeholder="First Name" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                  <input type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                  <input type="text" placeholder="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                  <input type="password" placeholder="Password" name="psw" value={password} onChange={e => setPassword(e.target.value)} required/>
                  <input type="password" placeholder="Repeat Password" name="psw-repeat" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required/>

                  <button type="submit" onSelect={(e:React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation()}}>Create Account</button>
              </form>
            </div>
      }
      <button className="login-signup-switch" onClick={handleSwitch}>{registeredUser? "Create an Account": "Have Account? Login"}</button>
      <div className="login-signup-error" style={errorMsg.length === 0? {display: 'none'}:{display: 'flex', justifyContent: 'center'}} ref={errorRef}>
        {errorMsg}
      </div>
    </>
  )
}

export default LoginOrSignup