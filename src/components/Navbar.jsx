import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import unitask from '../assets/unitask.svg';
import { SignIn, SignUp, handleSignOut } from './modal-group/ModalAuth';
import Button from './Button';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { IconUser } from './Icon';


function Navbar() {
  const [activeAuth, setActiveAuth] = useState(null);
  const [user, setUser] = useState(null);
  const closeModal = () => setActiveAuth(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (location.pathname === '/Project') {
    return null;
  }


  return (
    <section className="bg-white flex z-50 items-center justify-center w-full h-fit sticky top-0 shadow-sm">
      <div className="flex items-center justify-between w-full py-2 px-4 max-w-screen-2xl">
          <Link to="/" className="flex items-center gap-2 text-green-900 text-lg font-bold">
          <img src={unitask} alt="UniTask" className="w-8 h-8" />
          
            UniTask
          </Link>

        <span className="flex w-fit gap-2 items-center">
          {user ? (
            <>
              <Button
                onClick={handleSignOut}
                className="text-green-900 text-sm font-bold hover:cursor-pointer border-gray-400 hover:text-green-700"
                text="Sign-Out"
                dataFeather='plus'
              />
              <IconUser user={user}/>       
            </>
          ) : (
            <>
              <Button
                onClick={() => setActiveAuth('SignIn')}
                className="text-green-900 text-sm font-bold hover:cursor-pointer hover:text-green-700"
                text="Login"
                dataFeather='log-in'
              />

              <Button
                onClick={() => setActiveAuth('SignUp')}
                className="text-green-900 text-sm font-bold hover:cursor-pointer hover:text-green-700"
                text="Register"
                dataFeather=''
              />
            </>
          )}
        </span>
        {activeAuth === 'SignUp' && (
          <SignUp closeModal={closeModal} switchToSignIn={() => setActiveAuth('SignIn')} />
        )}
        {activeAuth === 'SignIn' && (
          <SignIn closeModal={closeModal} switchToSignUp={() => setActiveAuth('SignUp')} />
        )}
      </div>
      
    </section>
  );
}

export default Navbar;
