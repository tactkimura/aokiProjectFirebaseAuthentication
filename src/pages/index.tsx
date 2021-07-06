import { useEffect, FC, useState } from 'react'
import { useRouter } from 'next/router'
// import Head from 'next/head'

import { auth } from '../utils/firebase'
import firebase from 'firebase/app';
// import { route } from 'next/dist/next-server/server/router'

const Home: FC = () => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<null | object>(null)
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : router.push('/login')
    })
  }, [])

  const addPhoneNumber = async (e: any) => {
    e.preventDefault()
    auth.settings.appVerificationDisabledForTesting = true;
    const phoneNumber = prompt('Your Phone Number ?');
    const code: any = prompt('Plz input your varify code.');
    try {
      (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recapture-container');
      const appVerifier = (window as any).recaptchaVerifier;
      auth.signInWithPhoneNumber(`+81${phoneNumber}`, appVerifier)
        .then((confirmationResult) => {
          const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
          console.log(credential);
          auth.currentUser?.linkWithCredential(credential);
        }).catch((error) => {
          (window as any).grecaptcha.reset((window as any).recaptchaWidgetId);
          alert(error.message)
        });
    } catch(err){
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
      <div id="recapture-container"></div>
      <button onClick={addPhoneNumber}>Add Phone Number</button>
      <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default Home;