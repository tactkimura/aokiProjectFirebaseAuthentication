import { FC, useEffect, useContext } from 'react';
import Router from 'next/router';
import firebase from '../utils/firebase';
import { AuthContext } from '../auth/AuthProvider';

const SignIn: FC = () => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    currentUser && Router.push('/')
  }, [currentUser]);

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider);
    firebase.auth().signInWithRedirect(provider);
  }
  return (
    <div className="container">
      <button onClick={login}>googleでログインする</button>
    </div>
  )
}

export default SignIn;