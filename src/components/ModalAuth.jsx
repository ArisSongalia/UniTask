import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider} from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, signOut } from 'firebase/auth';
import { IconTitleSection } from './TitleSection';
import Button from './Button';
import { IconAction } from './Icon';
import 'react-phone-input-2/lib/style.css'


function SignUp({ closeModal, switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });


  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage({ text: 'User Successfully Registered', color: 'green' });
      setEmail('');
      setPassword('');
      closeModal();
      switchToSignIn();
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage({ text: 'User Successfully Registered', color: 'green' });
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      setMessage({text: 'User Succesfully Registered', color: 'green'});
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <IconTitleSection title='Register' dataFeather='x' iconOnClick={closeModal} />
        <form
          method="POST"
          className='flex flex-col gap-4'
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <label htmlFor="email" className='flex flex-col text-sm'>
            Email
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
            />
          </label>
          <label htmlFor="password" className='flex flex-col text-sm'>
            Password
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
            />
          </label>

          <p style={{ color: message.color }}>{message.text}</p>

          <Button text='Register' onClick={handleSignUp} />
          <p>
            Already have an account?&nbsp;       
            <span
              className='text-green-700 font-semibold hover:text-green-600 hover:cursor-pointer'
              onClick={switchToSignIn}>
              Login
            </span>
          </p>

        </form>
        <hr className='border mt-8 mb-6' />
        <section className="w-full flex flex-col gap-4 items-center">
          <p>Or sign up with</p>
          <section className='flex gap-2'>
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.5rem] w-[2.5rem]' text='Google'/>
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.5rem] w-[2.5rem]' text='Facebook'/>
          </section>
          <div id="recaptcha-container"></div>
        </section>
      </div>
    </div>
  );
}

function SignIn({ closeModal, switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (error) {
      setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage({ text: 'User Successfully Registered', color: 'green' });
    } catch (error) {
      setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
    }
  };

    const handleSignInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      setMessage({text: 'User Succesfully Registered', color: 'green'});
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };


  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <IconTitleSection title='Login' dataFeather='x' iconOnClick={closeModal} />
        <form
          method="POST"
          className='flex flex-col gap-4'
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <label htmlFor="email" className='flex flex-col text-sm'>
            Email
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
            />
          </label>
          <label htmlFor="password" className='flex flex-col text-sm'>
            Password
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
            />
          </label>
          <p style={{ color: message.color }}>{message.text}</p>
          <Button text='Login' onClick={handleSignIn} />
          
          <p>
            Already have an account?&nbsp;       
            <span
              className='text-green-700 font-semibold hover:text-green-600 hover:cursor-pointer'
              onClick={switchToSignUp}>
              Register
            </span>
          </p>
        </form>
        <hr className='border mt-8 mb-6' />
        <section className="w-full flex flex-col gap-4 items-center">
          <p>Or sign up with</p>
          <section className='flex gap-2'>
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.5rem] w-[2.5rem]' text='Google' />
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.5rem] w-[2.5rem]' text='Facebook' />
          </section>
          <div id="recaptcha-container"></div>
        </section>
      </div>
    </div>
  );
}


const handleSignOut = async () => {
try{
  await signOut(auth)
  alert('Logged Out')
}catch (error){
  alert(error);
};
};




export {SignIn, SignUp, handleSignOut};