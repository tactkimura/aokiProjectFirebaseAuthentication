import { useEffect, FC, useState } from 'react'
import { useRouter } from 'next/router'
// import Head from 'next/head'
import firebase from 'firebase/app';

import { auth } from '../utils/firebase'
// import { route } from 'next/dist/next-server/server/router'

const Home: FC = () => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<null | object>(null);
  const [phoneNumber, setPhoneNumber] = useState< any >(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : router.push('/login')
    })
  }, [])

  const addPhoneNumber = async() => {
    (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptureID',{'size': 'invisible'});
    const appVerifier = (window as any).recaptchaVerifier
    const provider = new firebase.auth.PhoneAuthProvider();
    const verificationId: any = provider.verifyPhoneNumber(phoneNumber, appVerifier);
    try{
      const code: any = prompt("Plz input verify code.");
      const phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code)
      await auth.currentUser?.linkWithCredential(phoneCredential);
    }catch(err){
      alert(err.message);
    }

  }

  const logOut = async () => {
    try {
      await auth.signOut()
      router.push('/login')
    } catch(error){
      alert(error.message)
    }
  }
  return (
    <div>
      <pre>{currentUser && JSON.stringify(currentUser, null, 4)}</pre>
      <form onSubmit={addPhoneNumber}>
        <div>
          <label htmlFor="phone" className="auth-label">
            Phone:{' '}
          </label>
          <input
            id="phone"
            className="auth-input"
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div id="recaptureID"></div>
          <button>
            電話番号追加
          </button>
        </div>
      </form>
      <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default Home;