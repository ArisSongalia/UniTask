import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider, db} from '../../config/firebase';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { IconTitleSection, HeadTitleSection } from '../TitleSection';
import Button from '../Button';
import { IconAction } from '../Icon';
import { AlertCard } from '../Cards';
import { useNavigate } from 'react-router-dom';


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const [showCreateUsername, setShowCreateUsername] = useState(false)
  const navigate = useNavigate();

  const handleShowCreateUsername = () => {
    setShowCreateUsername(!showCreateUsername);
  };

  const switchToSignIn = () => {
    navigate('/Sign-in');
  }

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
    const userCredintial = await signInWithPopup(auth, googleProvider);

    const user = userCredintial.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData?.username) {
      setShowCreateUsername(true);
    } else {
      setMessage({text: "User succesfully signed in", color: "green"})
      navigate('/Home');
    }
  } catch (error) {
    setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
  }
};

const handleSignInWithFacebook = async () => {
  try {
    const userCredintial = await signInWithPopup(auth, facebookProvider);

    const user = userCredintial.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData?.username) {
      setShowCreateUsername(true);
    } else {
      setMessage({text: "User succesfully signed in", color: "green"})
      navigate('/Home');
    }
  } catch (error) {
    setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
  }
};


  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-green-900'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <HeadTitleSection title='UniTask Register' className=''/>
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
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.25rem] px-4 text-white bg-red-600' text='Google'/>
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.25rem] px-4 text-white bg-blue-600' text='Facebook'/>
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

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const [showCreateUsername, setShowCreateUsername] = useState(false)
  const navigate = useNavigate();

  const handleShowCreateUsername = () => {
    setShowCreateUsername(!showCreateUsername);
  };

  const switchToSignUp = () => {
    navigate('/Sign-up')
  }


  const handleSignIn = async () => {
    try {
      const userCredintial = await signInWithEmailAndPassword(auth, email, password);  

      const user = userCredintial.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData?.username) {
        setShowCreateUsername(true);
      } else {
        setMessage({text: "User succesfully signed in", color: "green"});
        navigate('/Home');
      }
    } catch (error) {
      setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
    }
  };

const handleSignInWithGoogle = async () => {
  try {
    const userCredintial = await signInWithPopup(auth, googleProvider);

    const user = userCredintial.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData?.username) {
      setShowCreateUsername(true);
    } else {
      setMessage({text: "User succesfully signed in", color: "green"});
      navigate('/Home');
    }
  } catch (error) {
    setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
  }
};

const handleSignInWithFacebook = async () => {
  try {
    const userCredintial = await signInWithPopup(auth, facebookProvider);

    const user = userCredintial.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData?.username) {
      setShowCreateUsername(true);
    } else {
      setMessage({text: "User succesfully signed in", color: "green"})
      navigate('/Home');
    }
  } catch (error) {
    setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
  }
};

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-green-900'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <HeadTitleSection title='UniTask Login' />
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
            Dont have an account?&nbsp;       
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
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.25rem] px-4 text-white bg-red-600' text='Google' />
            <IconAction dataFeather='facebook' iconOnClick={handleSignInWithFacebook} className='h-[2.25rem] px-4 text-white bg-blue-600' text='Facebook' />
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

function CreateUsername({ email, additionalData, closeModal, user }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const Navigate = useNavigate();

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
        photoURL: user.photoURL,
        uid: user.uid,
        ...additionalData,
      });

      alert('Username saved successfully!');
      Navigate('/Home');
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, color: 'red' });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center">
          <HeadTitleSection
            title="Create Username"
            className="mb-0"
          />
        </span>

        <div className="flex flex-col gap-2">
          <AlertCard
            text="Welcome to UniTask! Please use identifiable username and avoiding inappropriate language."
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

function NoAccountPage({}) {
  return (
    <section className='flex-col max-w-screen-2xl h-[90vh] rounded-xl p-4 gap-4 bg-green-800 text-white'>
      <h1 className='text-4xl font-bold'>The Best Way to Complete Tasks With Everyone, UNITASK</h1>
      <p>Login/Signup to start collaborating</p>
    </section>
  )
}


export {SignIn, SignUp, CreateUsername, handleSignOut, NoAccountPage};