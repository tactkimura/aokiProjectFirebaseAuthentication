import React, { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import firebase from 'firebase/app';
import { Button } from '@material-ui/core';

const Phone: FC = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push('/')
    })
  }, [])

  const phoneLogIn = async (e: any) => {
    e.preventDefault()
    auth.settings.appVerificationDisabledForTesting = true;
    const code: any = prompt('Plz input your varify code.');
    try {
      (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recapture-container');
      const appVerifier = (window as any).recaptchaVerifier;
      auth.signInWithPhoneNumber(`+81${phoneNumber}`, appVerifier)
        .then((confirmationResult) => {
          // (window as any).confirmationResult = confirmationResult;
          confirmationResult.confirm(code).then(() => {
            router.push('/');
          }).catch((error) => {
            alert(error.message);
          })
        }).catch((error) => {
          (window as any).grecaptcha.reset((window as any).recaptchaWidgetId);
          alert(error.message)
        });
    } catch(err){
      alert(err.message);
    }
  }
  return(
    <div className="wrapper">
      <form className="auth">
        <div>
          <label htmlFor="phone" className="auth-label">
            Phone: { ' '}
          </label>
          <input 
            id="email"
            className="auth-input"
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value) } 
          />
          <br/>
          <div id="recapture-container"></div>
          <Button id="login-btn" variant="contained" color="primary" className="login-btn" onClick={phoneLogIn}>
            電話番号でログインする
          </Button> 
          <br/>
          <Link href="/login">
            back
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Phone