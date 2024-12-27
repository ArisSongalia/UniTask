import React, { useState, useRef } from 'react';
import { IconAction } from '../Icon';
import Button from '../Button';
import { IconTitleSection } from '../TitleSection';
import { FetchUserName } from '../FetchData';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../config/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import deleteData from '../DeleteData';

function CreateProject({ closeModal, setRefreshKey }) {
  const user = auth.currentUser;
  const [message, setMessage] = useState({ text: "", color: "" });
  const dateRef = useRef('');

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const today = new Date().toISOString().split('T')[0];
    if(dateRef.current) {
      dateRef.current.setAttribute('min', today);
    };
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        title: form.title,
        description: form.description,
        date: form.date,
        type: form.type,
        owner: user.uid,
      });

      await updateDoc(docRef, { id: docRef.id });

      setRefreshKey(prevKey => prevKey + 1);
      closeModal();
    } catch (error) {
      setMessage({ text: `Error Creating Project: ${error.message}`, color: "red" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Project</h2>
          <IconAction dataFeather="x" iconOnClick={closeModal} />
        </span>

        <form className="flex flex-col space-y-4" onSubmit={handleCreateProject}>
          <label htmlFor="task-title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              onChange={handleChange}
              value={form.title}
              name='title'
              id="task-title"
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
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
              required
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Target Date
            <input
              ref={dateRef}
              onChange={handleChange}
              value={form.date}
              type="date"
              name="date"
              id="date"
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
              required
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
                  value="Solo"
                  name='type'
                  checked={form.type === "Solo"}
                  className="hover:cursor-pointer"
                  required
                />
                <span>Solo</span>
              </label>

              <label className="flex items-center space-x-2 hover:cursor-pointer">
                <input
                  onChange={handleChange}
                  value="Shared"
                  checked={form.type === "Shared"}
                  type="radio"
                  id="shared"
                  name='type'
                  className=" hover:cursor-pointer"
                  required
                />
                <span>Shared</span>
              </label>
            </div>
          </label>
          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text="Create Project" className="py-3" />
        </form>
      </section>
    </div>
  );
}

function CreateNote({ closeModal, setRefreshKey }) {
  const user = auth.currentUser;
  const [message, setMessage] = useState({ message: "", color: "" });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const dateRef = useRef('');

  const [form, setForm] = useState({
    title: "",
    message: "",
    file: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const today = new Date().toISOString().split('T')[0];
    if(dateRef.current) {
      dateRef.current.setAttribute('min', today);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsUploading(true);
      setProgress(0); 
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadFile = uploadBytesResumable(storageRef, file);

  uploadFile.on(
    "state_changed",
    (snapshot) => {
      const progressValue = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log("Progress: ", progressValue, snapshot.bytesTransferred, snapshot.totalBytes); 
      setProgress(progressValue);
    },
    (error) => {
      console.error("File Upload Failed: ", error);
      setMessage({ text: "File upload failed: " + error.message, color: "red" });
      setIsUploading(false);
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadFile.snapshot.ref);
        setForm((prevForm) => ({ ...prevForm, file: downloadURL }));
        setMessage({ text: "File uploaded successfully!", color: "green" });
      } catch (error) {
        console.error("Error fetching file URL: ", error);
        setMessage({ text: "Failed to retrieve file URL.", color: "red" });
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    }
  );

    }
  };

  const handleCreateUserNote = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: form.title,
        message: form.message,
        date: form.date,
        owner: user.uid,
        file: form.file,
      }); 

      await updateDoc(docRef, { id: docRef.id });

      setRefreshKey((prevKey) => prevKey + 1);
      closeModal();
    } catch (error) {
      console.error("Error creating note:", error);
      setMessage({ text: "Failed to create note: " + error.message, color: "red" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg">
        <span className="flex w-full justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Note</h2>
          <IconAction dataFeather="x" iconOnClick={closeModal} />
        </span>

        <form onSubmit={handleCreateUserNote} className="flex flex-col space-y-4">
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
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none h-[10rem]"
              required
            />
          </label>

          <label htmlFor="file" className="flex flex-col text-gray-600">
            Attach File
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
            <progress value={progress} max={100} className="w-full h-1 mt-2" />
            <span className="text-gray-600 text-sm">{progress > 0 && `Uploading: ${progress}%`}</span>
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Target Date
            <input
              ref={dateRef}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text={isUploading ? "Uploading..." : "Create Note"} className="py-3" />
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


function NoteEdit({ closeModal, title = 'Title goes here...', message = 'Main message goes here...', file, owner = "owner", date = '00/00/0000', id}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }

  const handleDelete = async () => {
    await deleteData( id, 'notes' )
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
                <IconAction dataFeather="trash-2" iconOnClick={handleDelete}/>
              </span>
            </span>
          </section>
          <p className="text-xs text-gray-600 font-semibold hover:cursor-pointer">Note by: {owner} - {date}</p>
        </section>
      </section>
    </div>
  );
}

function UserProfile({ closeModal }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]'>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg'>
        <IconTitleSection title='User Profile' dataFeather='x' iconOnClick={closeModal} className=''/>
        <p><FetchUserName /></p>
      </div>
    </div>
  );
}

export { CreateTask, CreateProject, NoteFocus, NoteEdit, CreateNote, UserProfile}
