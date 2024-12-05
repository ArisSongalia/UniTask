import React, { useState } from 'react';
import { IconAction } from './Icon';
import Button from './Button';
import { IconTitleSection } from './TitleSection';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CreateProject({closeModal, onSave}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({
      title: "",
      description: "",
      date: "",
      type: null,
    });
    alert("Task Created");
    closeModal();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Project</h2>
          <IconAction dataFeather="x" iconOnClick={closeModal} />
        </span>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="task-title" className="flex flex-col text-gray-600">
            Title
            <input 
              type="text" 
              onChange={handleChange}
              value={form.title}
              name='title'
              id="task-title" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </label>

          <label htmlFor="project-description" className="flex flex-col text-gray-600">
            Description
            <input 
              onChange={handleChange}
              value={form.description}
              type="text" 
              name='description'
              id="project-description" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date
            <input 
              onChange={handleChange}
              value={form.date}
              type="datetime-local" 
              name='date'
              id="date" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Task Type
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2 hover:cursor-pointer">
                <input 
                  onChange={handleChange}
                  type="radio" 
                  id="solo" 
                  value="solo"
                  name='type'
                  checked={form.type === "solo"}
                  className=" hover:cursor-pointer" 
                />
                <span>Solo</span>
              </label>
              
              <label className="flex items-center space-x-2 hover:cursor-pointer">
                <input 
                  onChange={handleChange}
                  value="shared"
                  checked={form.type === "shared"}
                  type="radio" 
                  id="shared" 
                  name='type'
                  className=" hover:cursor-pointer" 
                />
                <span>Shared</span>
              </label>
            </div>
          </label>

          <Button type="submit" text="Create Project" className="py-3"/>
        </form>
      </section>
    </div>
  );
}

function CreateTask({ closeModal }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Task</h2>
          <IconAction dataFeather="x" iconOnClick={closeModal} />
        </span>

        <form action="" className="flex flex-col space-y-4">
          <label htmlFor="task-title" className="flex flex-col text-gray-600">
            Title
            <input 
              type="text" 
              id="task-title" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </label>

          <label htmlFor="note-message" className="flex flex-col text-gray-600">
            Description
            <input 
              type="text" 
              id="note-message" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date
            <input 
              type="datetime-local" 
              id="date" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Task Type
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2 hover:cursor-pointer">
                <input type="radio" id="solo" name="task-type" value="solo" className=" hover:cursor-pointer" />
                <span>Solo</span>
              </label>
              <label className="flex items-center space-x-2 hover:cursor-pointer">
                <input type="radio" id="shared" name="task-type" value="shared" className=" hover:cursor-pointer" />
                <span>Shared</span>
              </label>
            </div>
          </label>

          <Button type="submit" text="Create Task" className="py-3"/>
        </form>
      </section>
    </div>
  );
}

function NoteFocus({ closeModal, title = 'Title goes here...', main = 'Main message goes here...', user = 'User', date = '00/00/0000'}) {
  const [isClicked, setIsClicked] = useState(false);

  const toggleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex items-center justify-center">
        <section
          className={`flex flex-col bg-yellow-50 rounded-xl hover:outline-green-700
            h-[30rem] w-[40rem] p-4 justify-between overflow-hidden`}
        >
          <section>
            <span className="flex justify-between w-full gap-2">
              <span className="flex flex-col">
                <h2 id="note-card-main" className="font-bold text-lg mb-4 ">
                  {title}
                </h2>
                <p id="note-card-text" className="text-gray-800 font-normal my-2">
                  {main}
                </p>
              </span>
              <span className="flex flex-col gap-2">
                <IconAction dataFeather="x" iconOnClick={closeModal} />
                <IconAction
                  dataFeather='check'
                  iconOnClick={toggleClick}
                  className={`${isClicked ? 'bg-green-700 text-white': ''}`}
                />
              </span>
            </span>
          </section>
          <p className="text-xs text-gray-600 font-semibold">Note by: {user} - {date}</p>
        </section>
      </section>
    </div>
  );
}


function NoteEdit({ closeModal, title = 'Title goes here...', message = 'Main message goes here...', file, user = 'User', date = '00/00/0000'}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex items-center justify-center">
        <section
          className={`flex flex-col bg-yellow-50 rounded-xl hover:outline-green-700
            h-[30rem] w-[40rem] p-4 justify-between overflow-hidden`}
        >
          <section>
            <span className="flex justify-between w-full gap-2">
              <span className="flex flex-col">
                <h2 id="note-card-main" className="font-bold text-lg mb-4 hover:cursor-pointer">
                  {title}
                </h2>
                <p id="note-card-text" className="text-gray-800 font-normal my-2 hover:cursor-pointer">
                  {message}
                  {file && (
                    <span className="block mt-2 text-gray-500 text-xs">
                      Attached File: {file}
                    </span>
                  )}
                </p>
              </span>
              <span className="flex flex-col gap-2">
                <IconAction dataFeather="x" iconOnClick={closeModal} />
                <IconAction dataFeather="edit" iconOnClick={togglePopUp}/>
                {showPopUp && <CreateNote  closeModal={closeModal} title={title} message={main}/>}
              </span>
            </span>
          </section>
          <p className="text-xs text-gray-600 font-semibold hover:cursor-pointer">Note by: {user} - {date}</p>
        </section>
      </section>
    </div>
  );
}

function CreateNote({closeModal, onSave}) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    file: null,
    date: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({ ...form, [name]: value});
  };

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      file: form.file ? form.file.name : null,
    });
    setForm({
      title: "",
      message: "",
      file: null,
      date: "",
    });
    alert("Note Created");
    closeModal();
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Note</h2>
          <IconAction dataFeather="x" iconOnClick={closeModal} />
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="title" className="flex flex-col text-gray-600">
            Title
            <input 
              type="text" 
              value={form.title}
              onChange={handleChange}
              name="title" 
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </label>

          <label htmlFor="message" className="flex flex-col text-gray-600">
           Message
            <textarea
              name="message" 
              value={form.message}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 
              focus:outline-none h-[10rem]"
              required
            />
          </label>

          <label htmlFor="file" className="flex flex-col text-gray-600">
            Attach File
            <input 
              type="file" 
              name="file" 
              onChange={handleFileChange}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 
              focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date
            <input 
              type="datetime-local" 
              name="date" 
              value={form.date}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 
              focus:ring-green-500 focus:outline-none hover:cursor-pointer"
              required
            />
          </label>

          <Button type="submit" text="Create Note" className="py-3"/>
        </form>
      </section>
    </div>
  );
}

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

  const handleSignUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage({ text: 'User Successfully Registered', color: 'green' });
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
        </form>
        <hr className='border mt-8 mb-6' />
        <section className="w-full flex flex-col gap-4 items-center">
          <p>Or sign up with</p>
          <section className='flex gap-2'>
            <IconAction dataFeather='mail' iconOnClick={handleSignUpWithGoogle} className='h-[2.5rem] w-[2.5rem]' />
            <IconAction dataFeather='facebook' className='h-[2.5rem] w-[2.5rem]' />
            <IconAction dataFeather='twitter' className='h-[2.5rem] w-[2.5rem]' />
          </section>
        </section>
      </div>
    </div>
  );
}

function SignIn({ closeModal }) {
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
        </form>
        <hr className='border mt-8 mb-6' />
        <section className="w-full flex flex-col gap-4 items-center">
          <p>Or sign up with</p>
          <section className='flex gap-2'>
            <IconAction dataFeather='mail' iconOnClick={handleSignInWithGoogle} className='h-[2.5rem] w-[2.5rem]' />
            <IconAction dataFeather='facebook' className='h-[2.5rem] w-[2.5rem]' />
            <IconAction dataFeather='twitter' className='h-[2.5rem] w-[2.5rem]' />
          </section>
        </section>
      </div>
    </div>
  );
}


function UserProfile({ closeModal, userName }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <IconTitleSection title='User Profile' dataFeather='x' iconOnClick={closeModal} className=''/>
        <p>{userName}</p>
      </div>
    </div>
  );
}



export { CreateTask, CreateProject, NoteFocus, NoteEdit, CreateNote, SignUp, SignIn, UserProfile}