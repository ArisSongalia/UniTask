import React, { useState, useRef } from 'react';
import { IconAction } from '../Icon';
import Button from '../Button';
import { IconTitleSection } from '../TitleSection';
import { addDoc, collection, getDoc, updateDoc, doc,  } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import { UserCard } from '../Cards';
import { AlertCard } from '../Cards';
import { useFetchUsers, useFetchActiveProjectData } from '../../services/FetchData';
import { BarLoader } from 'react-spinners';
import { TaskCard } from '../Cards';


function CreateProject({ closeModal }) {
  const { reloadComponent } = useReloadContext();
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
      reloadComponent();
      closeModal();
    } catch (error) {
      setMessage({ text: `Error Creating Project: ${error.message}`, color: "red" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Project' iconOnClick={closeModal} dataFeather='x' />

        <form className="flex flex-col space-y-4">
          <label htmlFor="project-title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              onChange={handleChange}
              value={form.title}
              name='title'
              id="project-title"
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
          <Button type="submit" text="Create Project" className="py-3" dataFeather='plus' onClick={handleCreateProject}/>
        </form>
      </section>
    </div>
  );
}

function CreateNote({ closeModal, projectId }) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [message, setMessage] = useState({ message: "", color: "" });
  const dateRef = useRef('');

  const [form, setForm] = useState({
    title: "",
    message: "",
    file: "",
    date: "",
    projectId: projectId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const today = new Date().toISOString().split('T')[0];
    if(dateRef.current) {
      dateRef.current.setAttribute('min', today);
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
        ['project-id']: projectId || null,
      }); 

      await updateDoc(docRef, { id: docRef.id });
      reloadComponent();
      closeModal();
    } catch (error) {
      console.error("Error creating note:", error);
      setMessage({ text: "Failed to create note: " + error.message, color: "red" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Note' dataFeather='x' iconOnClick={closeModal} />

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
          <Button type="submit" text="Create Note" className="py-3" dataFeather='plus'/>
        </form>
      </section>
    </div>
  );
}


function CreateTask({ closeModal }) {
  const { reloadComponent } = useReloadContext()
  const [message, setMessage] = useState({ text: '', color: '' });
  const projectId = localStorage.getItem('activeProjectId')
  const dateRef = useRef();
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    'task-title': '',
    'task-description': '',
    'task-deadline': '',
    'task-status': 'To-do',
    'task-file': '',
    'task-team': [...new Set([])],
    'task-project-id': projectId,
    'task-team-uid': [],
  });

  useFetchActiveProjectData(projectId, setProjectData, setLoading);
  

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const today = new Date();
    today.setHours(today.getHours() + 1)
    const adjustedDateTime = today.toLocaleString('sv-SE', { hour12: false }).slice(0, 16);

    if (dateRef.current) {
      dateRef.current.setAttribute('min', adjustedDateTime);
      console.log(adjustedDateTime)
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!form['task-team'] || form['task-team'].length === 0) {
      setMessage({ text: 'Please select task members', color: 'red' });
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        'task-title': form['task-title'],
        'task-description': form['task-description'],
        'task-deadline': form['task-deadline'],
        'task-status': form['task-status'],
        'task-file': form['task-file'],
        'task-project-id': form['task-project-id'],
        'task-team': form['task-team'],
        'task-team-uids': form['task-team-uid'],
      });

    } catch (error) {
      console.error('Error creating task: ', error);
      setMessage({ text: `Error Creating Task: ${error.message}`, color: 'red' });
    } finally {
      setMessage({ text: 'Succefully Created Task', color: 'green'});
      reloadComponent();
      closeModal();
    }
  };

  const handleStateChange = (data) => {
    setForm((prevForm) => {
      let updatedTeam;

      if (data.isActive) {
        updatedTeam = [...prevForm['task-team'], {
          uid: data.uid, username: data.username, email: data.email, photoURL: data.photoURL
        }];
      } else {
        updatedTeam = prevForm['task-team'].filter((member) => member.uid !== data.uid)
      };

      return {
        ...prevForm,
        'task-team': updatedTeam,
        'task-team-uid': updatedTeam.map(member => member.uid)
      };
    });
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-xl w-[35rem] h-[40rem] p-6 shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Task' dataFeather='x' iconOnClick={closeModal} />

        <form action="" className="flex flex-col space-y-4" onSubmit={handleCreateTask}>
          <AlertCard text='Note: Deadline should atleast be 1 hour.' title='' className='rounded-md bg-yellow-50 border-yellow-300 text-yellow-700'/>
          <label htmlFor="task-title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              id="task-title"
              name="task-title"
              value={form['task-title']}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="task-description" className="flex flex-col text-gray-600">
            Description
            <input
              type="text"
              id="task-description"
              name="task-description"
              value={form['task-description']}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date-time
            <input
              type="datetime-local"
              id="date"
              ref={dateRef}
              name="task-deadline"
              value={form['task-deadline']}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-2 text-gray-600">
            Select Team Members
            <section className='flex flex-col gap-2 p-4 rounded-lg bg-green-50'>
              <p className='text-green-700'>Available Members</p>

              <section className="grid grid-cols-2 gap-2">
                {loading ? (
                  <BarLoader color='green'/>
                ) : projectData['team'] && (
                  projectData['team'].map((member) => (
                  <UserCard key={member.uid} user={member} onStateChange={handleStateChange} />
                )))}
              </section>
            </section>

            <div className='flex flex-col'>
              <p className=''>Selected team members will appear here</p>
              <input
                className="mt-1 border border-gray-300 rounded-lg px-4 py-2 pointer-events-none focus:outline-none focus:ring-0 user-select-none"
                placeholder='Please select atleast one task contributor'
                readOnly
                value={
                  form['task-team'].length > 0
                    ? form['task-team'].map((member) => member.username).join(', ')
                    : ""
                }
              />
            </div>
          </label>

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text="Create Task" className="py-3" />
        </form>
      </section>
    </div>
  );
}

function CreateCanvas({ closeModal }) {
  const { reloadComponent } = useReloadContext()
  const [message, setMessage] = useState({ text: '', color: '' });
  const [canvasData, setCanvasData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    'canvas-title': "",
    'canvas-description': "",
    'canvas-date:': "",
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Canvas' iconOnClick={closeModal} dataFeather='x' />

        <form action="" className="flex flex-col space-y-4">
          <label htmlFor="task-title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              id="task-title"
              name="task-title"
              value={form['task-title']}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date-time
            <input
              type="datetime-local"
              id="date"
              name="task-deadline"
              value={form['task-deadline']}
              className="mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text="Create Canvas" className="py-3" />
        </form>
      </section>
    </div>
  );
}


function AddMembers({ closeModal }) {5
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", color: ""})
  const { key, reloadComponent } = useReloadContext();
  const [members, setMembers] = useState([...new Set([])]);
  const activeProjectId = localStorage.getItem('activeProjectId');

  useFetchUsers(setUsers, setLoading, key);
  
  const handleAddMembers = (user) => {
    setMembers((prevMembers) => {
      if(user.isActive) {
        return [...prevMembers, { username: user.username, uid: user.uid, email: user.email, photoURL: user.photoURL}]
      } else {
        return prevMembers.filter((member) => member.uid !== user.uid);
      }
    });
  };

  const addMembersToProject = async () => {
    if (!Array.isArray(members) || members.length === 0) {
      setMessage({ text: "No members to add. Please select at least one member.", color: "red" });
      return;
    }

    try {
      const projectDocRef = doc(db, 'projects', activeProjectId);
      const projectDoc = await getDoc(projectDocRef);

      if(projectDoc.exists()) {
        await updateDoc(projectDocRef, { team: members });
        closeModal();
        reloadComponent();
      } else {
        setMessage({ text: "Project not found", color: "red"});
      }
    } catch (error) {
      setMessage({ text: `Error adding member/s: ${error}`, color: "red"});
      console.error(error)
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Select Users to Contribute' iconOnClick={closeModal} dataFeather='x'/>
        <input 
          className='w-full p-2 flex gap-2 bg-gray-50 mb-2 focus:outline-none focus:ring-0 rounded-md'
          placeholder='Selected project contributors will appear here'
          readOnly
          value={
            members.length > 0
              ? members.map((member) => member.username).join(', ')
              : ''
          }
        />
        <span id='contributors' className='flex flex-col bg-gray-50 h-[25rem] gap-4'>

          <span id='users' className='grid grid-cols-2 p-4   rounded-md h-fit overflow-y-scroll'>

            { loading ? (
              <BarLoader />
            ) : users.length > 0 && (
              users.map((user) => (
                <UserCard key={user.id} user={user} className='w-full' onStateChange={handleAddMembers}/>
              ))
            )}
          </span>
        </span>
        <p style={{color: message.color}}>{message.text}</p>
        <Button text='Add Members' className='w-full' onClick={addMembersToProject}/>
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
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
  const { reloadComponent } = useReloadContext();

  const handleDelete = async () => {
    await deleteData( id, 'notes', reloadComponent );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <section className="flex items-center justify-center" onClick={(e) => e.stopPropagation}>
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

function UserProfile({ closeModal, user={} }) {
  console.log(user)
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 text-gray-700 flex justify-center items-center w-[100vw] h-[100vh]' onClick={closeModal}>
      <div id='main' className='flex flex-col bg-white rounded-xl w-[35rem] p-6 shadow-lg font-medium' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='User Profile' dataFeather='x' iconOnClick={closeModal} className='font-semibold'/>
        <span className='flex p-2 gap-4 items-center'>
          <img src={user.photoURL} alt="" className='h-12 w-12 rounded-full'/>
          <span className='flex flex-col'>
            <p className='font-bold'>{user.username}</p>
            <p className=''>{user.email}</p>
          </span>
        </span>
        <p className='text-gray-500 text-sm mt-2'>UID: {user.uid}</p>
      </div>
    </div>
  );
}

function CompletedTab({ closeModal, taskData={}, loading}) {

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 text-gray-700 flex justify-center items-center w-[100vw] h-[100vh]' onClick={closeModal}>
      <div className='flex flex-col p-4 bg-white rounded-md h-[40rem] w-[30rem]' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Finished Tasks' dataFeather='x' iconOnClick={closeModal} />
        <section className='flex flex-col gap-1 overflow-y-scroll pr-2'>
          {loading ? (
            <span><BarLoader color='#228B22' size={20} /></span>
          ) : (
            taskData.length > 0 && (
              taskData.map((taskData) => (
                <TaskCard 
                  key={taskData['task-id']}
                  title={taskData['task-title']}
                  description={taskData['task-description']}
                  deadline={taskData['task-deadline']}
                  team={taskData['task-team']}
                  status={taskData['task-status']}
                  id={taskData['task-id']}
                  className='h-fit hover:cursor-pointer'
                />
              ))
            )
          )}
        </section>
      </div>
    </div>
  )
}

export { CreateTask, CreateProject, NoteFocus, NoteEdit, CreateNote, UserProfile, AddMembers, CreateCanvas, CompletedTab}
