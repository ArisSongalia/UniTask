import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider, db} from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { IconTitleSection } from '../TitleSection';
import Button from '../Button';
import { IconAction } from '../Icon';
import { AlertBox } from '../AlertCard';


function SignUp({ closeModal, switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const [showCreateUsername, setShowCreateUsername] = useState(false)

  const handleShowCreateUsername = () => {
    setShowCreateUsername(!showCreateUsername);
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setShowCreateUsername(true)
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowCreateUsername(true);
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
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

          <Button text='Register' type='submit' />
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
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.5rem] w-[2.5rem] px-4 text-yellow-800' text='Google'/>
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.5rem] w-[2.5rem] px-4 text-blue-800' text='Facebook'/>
          </section>
        </section>
      </div>
      {showCreateUsername && (
        <CreateUsername 
          email={auth.currentUser?.email} 
          user={auth.currentUser}
          closeModal={handleShowCreateUsername} 
        />
      )}
    </div>
  );
}

function SignIn({ closeModal, switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const [showCreateUsername, setShowCreateUsername] = useState(false)

  const handleShowCreateUsername = () => {
    setShowCreateUsername(!showCreateUsername);
  };


  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);  
      setShowCreateUsername(true);
    } catch (error) {
      setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
    }
  };

const handleSignInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    setShowCreateUsername(true);
  } catch (error) {
    setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
  }
};

const handleSignInWithFacebook = async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
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
          <Button text='Login' type='submit' />
          
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
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.5rem] w-[2.5rem] px-4 text-yellow-800' text='Google' />
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.5rem] w-[2.5rem] px-4 text-blue-800' text='Facebook' />
          </section>
          <div id="recaptcha-container"></div>
        </section>
      </div>
      {showCreateUsername && (
        <CreateUsername 
          email={auth.currentUser?.email} 
          user={auth.currentUser}
          closeModal={handleShowCreateUsername} 
        />
      )}
    </div>
  );
}

function CreateUsername({ email, additionalData, closeModal, user }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });

  const handleSetUsername = (e) => {
    const username = e.target.value.trim(); 
    if (username === '') {
      setMessage({ text: 'Username cannot be empty', color: 'red' });
    } else {
      setMessage({ text: '', color: '' });
    }
    setUsername(username);
  };

  const handleConfirm = async () => {
    if (username.trim() === '') {
      setMessage({ text: 'Please enter a valid username', color: 'red' });
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: auth.currentUser?.email || email, 
        username: username,
        ...additionalData,
      });

      alert('Username saved successfully!');
      closeModal();
      window.location.reload();
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, color: 'red' });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center">
          <IconTitleSection
            title="Create Username"
            iconOnClick={closeModal}
            dataFeather="x"
            className="mb-0"
          />
        </span>

        <div className="flex flex-col gap-2">
          <AlertBox
            text="We recommend using an identifiable username and avoiding inappropriate language"
            email={email}
            className="mb-4"
          />

          <label htmlFor="username" className="flex flex-col gap-2">
            <span>Please Enter Your Username</span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleSetUsername}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </label>
          <p style={{ color: message.color }}>{message.text}</p>

          <Button text="Confirm" onClick={handleConfirm} />
        </div>
      </section>
    </div>
  );
}


const handleSignOut = async () => {
  try {
    const email = auth.currentUser?.email; 
    signOut(auth);
    alert('Logged Out: ' + email);
    window.location.reload();
  } catch (error) {
    alert("Error Signing out: " + error.message);
  }
};




export {SignIn, SignUp, CreateUsername, handleSignOut};