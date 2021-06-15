import React, { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import firebase from 'firebase/app';
import { Button } from '@material-ui/core';

const Login: FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push('/')
    })
  }, [])
  
  const logIn = async (e: any) => {
    e.preventDefault()
    try{
      await auth.signInWithEmailAndPassword(email, password)
      router.push('/')
    } catch(err) {
      alert(err.message)
    }
  }

  const googleLogIn = async (e: any) => {
    e.preventDefault()
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithRedirect(provider);
      router.push('/');
    } catch(err){
      alert(err.message);
    }
  }
    return(
      <div className="wrapper">
        Hello World
      <form className="auth">
        <div>
          <label htmlFor="email" className="auth-label">
            Email:{' '}
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="mt-2">
          <label htmlFor="password" className="auth-label">
            Password:{' '}
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <Button variant="contained" color='primary' className="auth-btn" onClick={logIn}>
          Login
        </Button>
        <Button variant="contained" color='secondary' className="googleLogin-btn" onClick={googleLogIn}>
          Googleでログインする
        </Button>
      </form>
      <Link href="/signup">
        <a className="auth-link">signup</a>
      </Link>
    </div>
    )
}
export default Login