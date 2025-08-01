import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider, db} from '../../config/firebase';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { IconTitleSection, HeadTitleSection } from '../TitleSection';
import Button, { ButtonIcon } from '../Button';
import { IconAction } from '../Icon';
import { AlertCard } from '../Cards';
import { useNavigate } from 'react-router-dom';
import bgMain from '../../assets/bg-main.jpg';


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
    <div className='fixed inset-0 flex items-center bg-cover justify-center z-50 ' style={{ backgroundImage: `url(${bgMain})` }}>
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
          <SignInOptions handleSignInWithGoogle={handleSignInWithGoogle} handleSignInWithFacebook={handleSignInWithFacebook} />
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
    <div className='fixed inset-0 flex items-center bg-cover justify-center z-50 ' style={{ backgroundImage: `url(${bgMain})` }}>
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
          <SignInOptions handleSignInWithGoogle={handleSignInWithGoogle} handleSignInWithFacebook={handleSignInWithFacebook} />
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

function SignInOptions({handleSignInWithGoogle, handleSignInWithFacebook}) {
  return (
    <section className='flex gap-1 h-full w-full items-center justify-center'>
      <ButtonIcon dataFeather='mail' onClick={handleSignInWithGoogle} className='border  border-red-800' text='Google' />
      <ButtonIcon dataFeather='facebook' onClick={handleSignInWithFacebook} className='border border-blue-800' text='Facebook' />
    </section>
  )
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

function HandleSignOut() {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      const email = auth.currentUser?.email; 
      signOut(auth);
      alert('Logged Out: ' + email);
      navigate('/Sign-In')
    } catch (error) {
      alert("Error Signing out: " + error.message);
    }
  };

  return { handleSignOut }
}


export {SignIn, SignUp, CreateUsername, HandleSignOut};