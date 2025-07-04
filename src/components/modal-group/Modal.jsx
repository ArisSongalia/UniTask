import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IconAction } from '../Icon';
import Button, { ButtonIcon } from '../Button';
import TitleSection, { IconTitleSection, MultiTitleSection } from '../TitleSection';
import { addDoc, collection, getDoc, updateDoc, doc,  } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import { NoteCard, ProjectCard, UserCard } from '../Cards';
import { AlertCard } from '../Cards';
import { useFetchUsers, useFetchActiveProjectData, useFetchProjectData } from '../../services/FetchData';
import { BarLoader } from 'react-spinners';
import { TaskCard } from '../Cards';
import { handleSignOut } from './ModalAuth';
import ModalOverlay from '../ModalOverlay';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import AssignedTasks from '../AssignedTasks';


function CreateProject({ closeModal, projectData }) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [message, setMessage] = useState({ text: "", color: "" });
  const dateRef = useRef('');

  const [form, setForm] = useState({
    title: projectData?.title || "",
    description: projectData?.description || "",
    date: projectData?.date || "",
    type: projectData?.type || "",
    team: projectData?.team || [],
  });

  useEffect(() => {
    if (auth.currentUser) {
      setForm((prev) => ({
        ...prev,
        team: [{
          uid: auth.currentUser.uid,
          username: auth.currentUser.displayName || 'You',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
        }],
        'team-uid': [auth.currentUser.uid],
      }));
    }
  }, [auth.currentUser]);

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
        status: "On-going",
        team: form.team,
      });

      await updateDoc(docRef, { id: docRef.id });
      reloadComponent();
      closeModal();
    } catch (error) {
      setMessage({ text: `Error Creating Project: ${error.message}`, color: "red" });
    }
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
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
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
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
          <Button type="submit" text={projectData? 'Update Project' : 'Create Project'} className="py-3" dataFeather='plus' onClick={handleCreateProject}/>
        </form>
      </section>
    </ModalOverlay>
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
        owner: user.displayName,
        ownerUid: user.uid,
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
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Note' dataFeather='x' iconOnClick={closeModal} />

        <form onSubmit={handleCreateUserNote} className="flex flex-col space-y-4">
          <label htmlFor="title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              value={form.title}
              onChange={handleChange}
              name="title"
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </label>

          <label htmlFor="message" className="flex flex-col text-gray-600">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none h-[10rem]"
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
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
              required
            />
          </label>

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text="Create Note" className="py-3" dataFeather='plus'/>
        </form>
      </section>
    </ModalOverlay>
  );
}


function CreateTask({ closeModal, taskData}) {
  const { reloadComponent } = useReloadContext()
  const [message, setMessage] = useState({ text: '', color: '' });
  const dateRef = useRef();
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const adjustedDateTimeRef = useRef('');
  const projectId = localStorage.getItem('activeProjectId');
  

  const [form, setForm] = useState({
    'title': taskData?.title || '',
    'description': taskData?.description || '',
    'deadline': taskData?.deadline || '',
    'status': taskData?.status || 'To-do',
    'file': taskData?.file || '',
    'team': taskData?.team || [...new Set([])],
    'team-uids': taskData?.['team-uids'] || [],
  });

  useEffect(() => {
    if (auth.currentUser && projectData?.type === 'Solo') {
      setForm((prev) => ({
        ...prev,
        team: [{
          uid: auth.currentUser.uid,
          username: auth.currentUser.displayName || 'You',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
        }],
        'team-uids': [auth.currentUser.uid],
      }));
    }
  }, [auth.currentUser, projectData?.type]);


  useFetchActiveProjectData(projectId, setProjectData, setLoading);
  

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const today = new Date();
    today.setHours(today.getHours() + 1)
    const adjustedDateTime = today.toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
    adjustedDateTimeRef.current = [adjustedDateTime];

    if (dateRef.current) {
      dateRef.current.setAttribute('min', adjustedDateTime);
      console.log(adjustedDateTime)
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if(projectData.type === "Shared"){
      if (!form['team'] || form['team'].length === 0) {
        setMessage({ text: 'Please select task members', color: 'red' });
        return;
      }
    } 

    try {
      await addDoc(collection(db, 'tasks'), {
        'title': form['title'],
        'description': form['description'],
        'deadline': adjustedDateTimeRef.current,
        'status': form['status'],
        'file': form['file'],
        'project-id': projectId,
        'team': form['team'],
        'team-uids': form['team-uid'],
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
        updatedTeam = [...prevForm['team'], {
          uid: data.uid, username: data.username, email: data.email, photoURL: data.photoURL
        }];
      } else {
        updatedTeam = prevForm['team'].filter((member) => member.uid !== data.uid)
      };

      return {
        ...prevForm,
        'team': updatedTeam,
        'team-uid': updatedTeam.map(member => member.uid)
      };
    });
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] max-h-[40rem] h-auto p-6 shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Task' dataFeather='x' iconOnClick={closeModal} />

        <form action="" className="flex flex-col space-y-4" onSubmit={handleCreateTask}>
          <AlertCard text='Note: Deadline should atleast be 1 hour.' title='' className='rounded-md bg-yellow-50 border-yellow-300 text-yellow-700'/>
          <label htmlFor="title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              id="title"
              name="title"
              value={form['title']}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="description" className="flex flex-col text-gray-600">
            Description
            <input
              type="text"
              id="description"
              name="description"
              value={form['description']}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              name="deadline"
              value={form['deadline']}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
              onChange={handleChange}
            />
          </label>

          {projectData.type === 'Shared' ? (
            <label className="flex flex-col gap-2 text-gray-600">
              Select Team Members
              <section className='flex flex-col gap-2 p-4 rounded-md bg-slate-50'>
                <p className=' font-semibold text-sm'>Available Members</p>

                <section className="grid grid-cols-2 gap-1">
                  {loading ? (
                    <BarLoader color='green' />
                  ) : projectData['team'] && (
                    projectData['team'].map((member) => (
                      <UserCard
                      key={member.uid}
                      user={member}
                      onStateChange={handleStateChange}
                      isActive={form.team.some(t => t.uid === member.uid)}
                    />
                  )))}
                </section>
              </section>

              <div className='flex flex-col'>
                <p className=''>Selected team members will appear here</p>
                <input
                  className="mt-1 border border-gray-300 rounded-md px-4 py-2 pointer-events-none focus:outline-none focus:ring-0 user-select-none"
                  placeholder='Please select atleast one task contributor'
                  readOnly
                  value={
                    form['team'].length > 0
                      ? form['team'].map((member) => member.username).join(', ')
                      : ""
                  }
                />
              </div>


            </label>
          ) : (null)}

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text={taskData ? 'Update Task' : 'Createa Task'} className="py-3">
          </Button>
        </form>
      </section>
    </ModalOverlay>
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
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Create Canvas' iconOnClick={closeModal} dataFeather='x' />

        <form action="" className="flex flex-col space-y-4">
          <label htmlFor="title" className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              id="title"
              name="title"
              value={form['title']}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </label>

          <label htmlFor="date" className="flex flex-col text-gray-600">
            Date-time
            <input
              type="datetime-local"
              id="date"
              name="deadline"
              value={form['deadline']}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none hover:cursor-pointer"
            />
          </label>

          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text="Create Canvas" className="py-3" />
        </form>
      </section>
    </ModalOverlay>
  );
}


function AddMembers({ closeModal }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", color: ""})
  const { key, reloadComponent } = useReloadContext();
  const [members, setMembers] = useState([...new Set([])]);
  const activeProjectId = localStorage.getItem('activeProjectId');
  const [activeProjectData, setActiveProjectData] = useState([]);


  useFetchUsers(setUsers, setLoading, key);
  useFetchActiveProjectData(activeProjectId, setActiveProjectData, setLoading, key)

  console.log(activeProjectData.team)
  
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
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
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
    </ModalOverlay>
  );
}


function NoteFocus({ closeModal, noteData}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }
  const { reloadComponent } = useReloadContext();

  const handleDelete = async () => {
    await deleteData( noteData.id, 'notes', reloadComponent );
  }

  return (
    <ModalOverlay onClick={closeModal}>
      <section
        className="flex flex-col bg-white rounded-md overflow-auto hover:outline-green-700 w-[40rem] max-w-[full] h-[30rem] p-4 justify-between"
        onClick={(e) => e.stopPropagation}
      >
        <section>
          <span className="flex flex-col justify-between w-full gap-2">
            <span className="flex justify-between items-center">
              <h2 id="note-card-main" className="font-bold text-lg mb-2 hover:cursor-pointer">
                {noteData.title}
              </h2>
              <span className="flex gap-2">
                {showPopUp && <CreateNote closeModal={closeModal} title={title} message={main} />}
                <IconAction dataFeather="trash-2" iconOnClick={handleDelete} />
                <IconAction dataFeather="edit" iconOnClick={togglePopUp} />
                <IconAction dataFeather="x" iconOnClick={closeModal} />
              </span>
            </span>
  
            <p id="note-card-text" className="text-gray-800 font-normal my-2 hover:cursor-pointer w-full break-words">
              {noteData.message}
              {noteData.file && (
                <span className="block mt-2 text-gray-500 text-xs">
                  Attached File: {noteData.file}
                </span>
              )}
            </p>
          </span>
        </section>
        <span className="w-full flex overflow-hidden text-xs text-gray-600 gap-1 font-semibold pt-2">
          <p className='p-1 bg-green-50 w-fit text-green-800'>By {noteData.owner}</p>
          <p className='p-1 bg-yellow-50 w-fit  text-yellow-800'>{noteData.date}</p>
        </span>
      </section>
    </ModalOverlay>
  );
  
}

function UserProfile({ closeModal, user={} }) {
  return (
    <ModalOverlay onClick={closeModal}>
      <div id='main' className='flex flex-col bg-white rounded-md w-[35rem] p-6 shadow-lg font-medium' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='User Profile' dataFeather='x' iconOnClick={closeModal} className='font-semibold'/>
        <span className='flex p-2 gap-4 items-center'>
          <img src={user.photoURL} alt="" className='h-12 w-12 rounded-full'/>
          <span className='flex flex-col'>
            <p className='font-bold'>{user.username}</p>
            <p className=''>{user.email}</p>
          </span>
        </span>
        <p className='text-gray-500 text-sm mt-2'>UID: {user.uid}</p>

        <Button
          onClick={handleSignOut}
          className="text-green-900 text-sm font-bold hover:cursor-pointer border-gray-400 hover:text-green-700 mt-4"
          text="Sign-Out"
          dataFeather='log-out'
        />
      </div>
    </ModalOverlay>
  );
}

function CompletedTab({ closeModal, taskData={}, loading}) {

  return (
    <ModalOverlay onClick={closeModal}>
      <div className='flex flex-col p-4 justify-between bg-white rounded-md h-[40rem] w-[30rem]' onClick={(e) => e.stopPropagation()}>
        <section className='h-full'>
          <IconTitleSection title='Finished Tasks' dataFeather='x' iconOnClick={closeModal} />
          <section className='flex flex-col gap-1 overflow-y-scroll pr-2'>
            {loading ? (
              <BarLoader color='#228B22' size={20}/>
            ) : (
              taskData.length > 0 && (
                taskData.map((taskData) => (
                  <TaskCard 
                    key={taskData.id}
                    taskData={taskData}
                    className='h-fit hover:cursor-pointer shadow-sm'
                  />
                ))
              )
            )}
          </section>
        </section>
        <span className='flex w-full p-2 text-sm justify-center bg-green-50 text-green-800 rounded-md self-end'>
          <p>Completed {taskData.length} tasks</p>
        </span>
      </div>
    </ModalOverlay>
  )
}

function TaskFocus({ closeModal, taskData, loading, collectionName = 'tasks' }) {
  const { reloadComponent } = useReloadContext();
  const moveStatus = useMoveStatus();
  const [showCreateTask, setShowCreateTask] = useState(false);


  const handleMoveStatus = async () => {
    await moveStatus({ name: collectionName, id: taskData.id, team: taskData.team })
  };

  const handleDeleteData = async () => {
    await deleteData(taskData.id, collectionName, reloadComponent)
  };

  const handleShowCreateTask = () => {
    setShowCreateTask(!showCreateTask);
  };


  return (
    <ModalOverlay onClick={closeModal}>
      <div className='flex flex-col h-[30rem] w-[40rem] max-h-full max-w-full bg-white p-4 rounded-md' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={loading ? '...' : taskData.title} iconOnClick={closeModal} dataFeather='x'/>
        <div className='flex flex-col justify-between h-full w-full'>
          <div className="flex flex-col">
            <TitleSection title='Description' buttonText='Move Status' buttonVisible={false}/>
            <p
              id='description'
              className='text-sm'>
              {taskData.description}
            </p>
          </div>

          <div className='flex w-full justify-between border-t-2 pt-2'>
            <section id="user" className='flex p-1 gap-1 bg-slate-100 rounded-full w-fit h-fit'>
              {!taskData.team || taskData.team.length > 0 ?(
                taskData.team.map((member) => (
                  <IconUser key={member.uid} user={member} className='h-6 w-6'/>
                ))
              ) : (
                <span className='bg-red-50 text-red-800 px-1 text-xs'>No members assigned</span>
              )}
            </section>
              
            <section className='flex gap-1 items-center'>
              <IconAction dataFeather='trash' iconOnClick={handleDeleteData}/>
              <IconAction dataFeather='edit' iconOnClick={handleShowCreateTask}/>
              {showCreateTask && <CreateTask taskData={taskData} closeModal={handleShowCreateTask}/>}
              <Button text='Move Status' onClick={handleMoveStatus} />
            </section>
          </div>
        </div>

      </div>
    </ModalOverlay>
  )
}

function PendingTasks({ closeModal, taskData, projectData, noteData }) {
  const [activeSection, setActiveSection] = useState('Assigned Tasks')
  const titles = [
    {
      label: 'Assigned Tasks',
      onClick: () => setActiveSection('Assigned Tasks'),
      isActive: activeSection === 'Assigned Tasks',
      dataFeather: 'check-square',
      key: 'title',
    },
    {
      label: 'Pending Projects',
      onClick: () => setActiveSection('Pending Projects'),
      isActive: activeSection === 'Pending Projects',
      dataFeather: 'briefcase',
      key: 'title',
    },
    {
      label: 'Action Notes',
      onClick: () => setActiveSection('Action Notes'),
      isActive: activeSection === 'Action Notes',
      dataFeather: 'paperclip',
      key: 'title',
    }
  ]

  const columns = useMemo(() => 
    titles.map((item) => ({
      header: item.label,
      key: item.key
    })),
  [titles]);


  const table = useReactTable({
    data: activeSection === 'Assigned Tasks'
      ? taskData
      : activeSection === 'Pending Projects' 
      ? projectData 
      : activeSection === 'Action Notes'
      ? noteData
      : null ,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ModalOverlay>
      <div className='flex flex-col max-h-full max-w-full h-[40rem] w-[50rem] bg-white p-4 rounded-md' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='Pending Tasks' dataFeather='x' iconOnClick={closeModal} />
        <MultiTitleSection titles={titles} />

        <table className='w-full h-full bg-white'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className='border px-2 py-1 text-xs font-semibold bg-green-50 text-left'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext()
                      )
                    }
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='border px-2 py-1'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </ModalOverlay>
  )
}

export { CreateTask, CreateProject, NoteFocus, CreateNote, UserProfile, AddMembers, CreateCanvas, CompletedTab, TaskFocus, PendingTasks}
