import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgMain from '../../assets/images/bg-main.jpg';
import { auth, db, googleProvider } from '../../config/firebase';
import Button, { ButtonIcon } from '../Button';
import { AlertCard } from '../Cards';
import { HeadTitleSection } from '../TitleSection';


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const navigate = useNavigate();

  const switchToSignIn = () => {
    navigate('/Sign-in');
  }

  const ensureUserDoc = async (user) => {
    if (!user?.uid) return;
    const payload = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    };
    await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(userCredential.user);
      setEmail('');
      setPassword('');
      setMessage({ text: 'Account created successfully.', color: 'green' });
      navigate('/Home');
    } catch (error) {
      setMessage({ text: 'Error during sign-up: ' + error.message, color: 'red' });
    }
  };

const handleSignInWithGoogle = async () => {
  try {
    const userCredintial = await signInWithPopup(auth, googleProvider);
    await ensureUserDoc(userCredintial.user);
    setMessage({text: "User succesfully signed in", color: "green"})
    navigate('/Home');
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

          {/* Google sign in */}
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

        

        <SignInOptions handleSignInWithGoogle={handleSignInWithGoogle} />

      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: '' });
  const navigate = useNavigate();

  const switchToSignUp = () => {
    navigate('/Sign-up')
  }


  const handleSignIn = async () => {
    try {
      const userCredintial = await signInWithEmailAndPassword(auth, email, password);  
      const userDoc = await getDoc(doc(db, 'users', userCredintial.user.uid));
      if (!userDoc.exists()) {
        await setDoc(
          doc(db, 'users', userCredintial.user.uid),
          {
            uid: userCredintial.user.uid,
            email: userCredintial.user.email || '',
            displayName: userCredintial.user.displayName || '',
            photoURL: userCredintial.user.photoURL || '',
          },
          { merge: true }
        );
      }
      setMessage({text: "User succesfully signed in", color: "green"});
      navigate('/Home');
    } catch (error) {
      setMessage({ text: 'Error during login: ' + error.message, color: 'red' });
    }
  };

const handleSignInWithGoogle = async () => {
  try {
    const userCredintial = await signInWithPopup(auth, googleProvider);
    await setDoc(
      doc(db, 'users', userCredintial.user.uid),
      {
        uid: userCredintial.user.uid,
        email: userCredintial.user.email || '',
        displayName: userCredintial.user.displayName || '',
        photoURL: userCredintial.user.photoURL || '',
      },
      { merge: true }
    );
    setMessage({text: "User succesfully signed in", color: "green"});
    navigate('/Home');
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

        {/* Google Sign IN */}
        <SignInOptions handleSignInWithGoogle={handleSignInWithGoogle}/>

      </div>
    </div>
  );
}

function SignInOptions({handleSignInWithGoogle, handleSignInWithFacebook}) {
  return (
    <section className='flex flex-col gap-4 h-full w-full items-center justify-center border-t-2 mt-4'>
      <p className='mt-2'>Or sign in with</p>

      <ButtonIcon
        dataFeather='mail' 
        onClick={handleSignInWithGoogle} 
        className='border border-red-800 w-full justify-center hover:bg-red-700 bg-red-50 text-red-900 py-4 rounded-md gap-1' 
        iconClassName='text-red-700' 
        text='Google' 
      />
    </section>
  )
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


export { HandleSignOut, SignIn, SignUp };
