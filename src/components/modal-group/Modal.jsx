import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IconAction, IconText, IconUser } from '../Icon';
import Button, { ButtonIcon } from '../Button';
import TitleSection, { IconTitleSection, MultiTitleSection } from '../TitleSection';
import { addDoc, collection, getDoc, updateDoc, doc, setDoc,  } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import { NoteCard, ProjectCard, UserCard } from '../Cards';
import { AlertCard } from '../Cards';
import { useFetchUsers, useFetchActiveProjectData, useFetchProjectData } from '../../services/FetchData';
import { BarLoader } from 'react-spinners';
import { TaskCard } from '../Cards';
import { HandleSignOut } from './ModalAuth';
import ModalOverlay from '../ModalOverlay';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useProjectContext } from '../../context/ProjectContext';


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
    status: projectData?.status || "On-going"
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
      if(projectData) {
        const projectRef = doc(db, 'projects', projectData.id);
        await updateDoc(projectRef, {
          title: form.title,
          description: form.description,
          date: form.date,
          type: form.type,
          status: form.status,
        })
      } else {
        await addDoc(collection(db, 'projects'), {
          title: form.title,
          description: form.description,
          date: form.date,
          type: form.type,
          owner: user.uid,
          status: form.status,
          team: form.team,
        });
      }
    } catch (error) {
      setMessage({ text: `Error Creating Project: ${error.message}`, color: "red" });
    } finally {
      setMessage({ text: 'Succefully Created Task', color: 'green'});
      reloadComponent();
      closeModal();
    };
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-full m-0 max-w-[35rem] p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={!projectData ? ('Create Project') : ('Update Project')} iconOnClick={closeModal} dataFeather='x' />

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

          {!projectData ? (
            <label className="flex flex-col text-gray-600">
              Project Type
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
          ) : ( <AlertCard text='Changing project type is not allowed when editing'/> )}
          <p style={{ color: message.color }}>{message.text}</p>
          <Button type="submit" text={projectData? 'Update Project' : 'Create Project'} className="py-3" dataFeather='plus' onClick={handleCreateProject}/>
        </form>
      </section>
    </ModalOverlay>
  );
}

function CreateNote({ closeModal, noteData, projectData}) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [message, setMessage] = useState({ text: "", color: "" });
  const dateRef = useRef('');

  const [form, setForm] = useState({
    title: noteData?.title ?? "",
    message: noteData?.message ?? "",
    file: "",
    date: noteData?.date ?? "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if(type === 'file') {
      const uploadedFile = files[0];
      setForm((prev) => ({ ...prev, [name]: uploadedFile }));
    } else {
      setForm({ ...form, [name]: value });
    }

    const today = new Date().toISOString().split('T')[0];
    if(dateRef.current) {
      dateRef.current.setAttribute('min', today);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {
      if (!noteData) {
        const noteRef = doc(collection(db, "notes"));
        const noteRefId = noteRef.id;
        let uploadedFileId = null;

        if(form.file) {
          try{
            const formData = new FormData();
            formData.append('file', form.file);

            const response = await fetch('http://localhost:5000/api/upload', {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            uploadedFileId = result.fileId;
          } catch (error) {
            console.error(error.message);
          }
        }

        await setDoc(noteRef, {
          title: form.title,
          id: noteRefId,
          message: form.message,
          date: form.date,
          owner: user.displayName,
          ownerUid: user.uid,
          status: noteData?.status ?? 'To-Review',
          'project-id': projectData?.[0]?.id ?? null,
          'project-title': projectData?.[0]?.title ?? 'Personal',
          fileId: uploadedFileId ?? null,
        }); 
        
      } else {
        const docRef = doc(db, 'notes', noteData.id);
        await updateDoc(docRef, {
          title: form.title,
          message: form.message,
          date: form.date,
          owner: user.displayName,
          ownerUid: user.uid,
          status: noteData?.status ?? 'To-Review',
          'project-id': projectData?.[0]?.id ?? null,
          'project-title': projectData?.[0]?.title ?? 'Personal',
        });
      };
      reloadComponent();
      closeModal();
    } catch (error) {
      console.error("Error creating note:", error);
      setMessage({ text: "Failed to create note: " + error.message, color: "red" });
    }
  };


  return (
    <ModalOverlay onClick={closeModal}>
      <section className="flex flex-col bg-white rounded-md w-[35rem] p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={(!noteData) ? ('Create Note') : ('Update: ' + noteData.title)} dataFeather='x' iconOnClick={closeModal} />

        <form onSubmit={handleCreateNote} className="flex flex-col space-y-4">
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

          <label htmlFor="file" className='flex flex-col text-gray-600'>
            Attach File
            <input 
              type="file" 
              id='file' 
              name='file'
              accept=".jpg, .jpeg, .png, .pdf, .gif"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onChange={handleChange}
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
          <Button type="submit" text={(!noteData) ? ('Create Note') : ('Update Note')} className="py-3" dataFeather='plus'/>
        </form>
      </section>
    </ModalOverlay>
  );
}


function CreateTask({ closeModal, taskData }) {
  const { key, reloadComponent } = useReloadContext();
  const [message, setMessage] = useState({ text: '', color: '' });
  const { projectId } = useParams();
  const { projectData, loading } = useFetchActiveProjectData(key);

  const [form, setForm] = useState({
    title: taskData?.title || '',
    description: taskData?.description || '',
    deadline: taskData?.deadline || '',
    status: taskData?.status || 'To-do',
    file: taskData?.file || '',
    team: taskData?.team || [],
    'team-uids': taskData?.['team-uids'] || [],
  });

  const minDateTime = useMemo(() => {
    const today = new Date();
    today.setHours(today.getHours() + 1);
    return today.toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (projectData?.type === "Shared" && (!form.team || form.team.length === 0)) {
      setMessage({ text: 'Please select task members', color: 'red' });
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        status: form.status,
        file: form.file,
        'project-id': projectId,
        'project-title': projectData?.title || '', 
        team: form.team,
        'team-uids': form['team-uids'], 
      };

      if (taskData?.id) {
        const taskRef = doc(db, 'tasks', taskData.id);
        await updateDoc(taskRef, payload);
      } else {
        await addDoc(collection(db, 'tasks'), payload);
      }

      setMessage({ text: 'Successfully Saved Task', color: 'green' });
      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      console.error(error);
      setMessage({ text: `Error: ${error.message}`, color: 'red' });
    }
  };

  const handleStateChange = (data) => {
    setForm((prevForm) => {
      let updatedTeam;
      if (data.isActive) {
        updatedTeam = [...prevForm.team, {
          uid: data.uid, username: data.username, email: data.email, photoURL: data.photoURL
        }];
      } else {
        updatedTeam = prevForm.team.filter((member) => member.uid !== data.uid);
      }

      return {
        ...prevForm,
        team: updatedTeam,
        'team-uids': updatedTeam.map(member => member.uid)
      };
    });
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section 
        className="flex flex-col bg-white rounded-md w-full max-w-[35rem] max-h-[90vh] p-4 shadow-lg overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection 
          title={taskData ? 'Update Task' : 'Create Task'} 
          dataFeather='x' 
          iconOnClick={closeModal} 
        />

        <form className="flex flex-col space-y-4" onSubmit={handleCreateTask}>
          <AlertCard 
            text='Note: Deadline should at least be 1 hour from now.' 
            className='rounded-md bg-yellow-50 border-yellow-300 text-yellow-700'
          />
          
          <label className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Description
            <textarea
              name="description"
              value={form.description}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Status
            <select 
              name='status' 
              value={form.status} 
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="To-do">To-do</option>
              <option value="In-progress">In-progress</option>
              <option value="To-review">To-review</option>
              <option value="Finished">Finished</option>
            </select>
          </label>

          <label className="flex flex-col text-gray-600">
            Date-time
            <input
              type="datetime-local"
              name="deadline"
              min={minDateTime} // Using the memoized min date
              value={form.deadline}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2"
              onChange={handleChange}
              required
            />
          </label>

          {projectData?.type === 'Shared' && (
            <div className="flex flex-col gap-2 text-gray-600">
              <p className="font-semibold">Select Team Members</p>
              <section className="grid grid-cols-2 gap-2 p-4 rounded-md bg-slate-50">
                {loading ? (
                  <BarLoader color='green' />
                ) : (
                  projectData.team?.map((member) => (
                    <UserCard
                      key={member.uid}
                      user={member}
                      onStateChange={handleStateChange}
                      isActive={form.team.some(t => t.uid === member.uid)}
                    />
                  ))
                )}
              </section>
              <input
                className="mt-1 border border-gray-300 rounded-md px-4 py-2 bg-gray-100 italic"
                readOnly
                value={form.team.map(m => m.username).join(', ') || "No members selected"}
              />
            </div>
          )}

          {message.text && (
            <p className="text-center font-medium" style={{ color: message.color }}>
              {message.text}
            </p>
          )}
          
          <Button type="submit" text={taskData ? 'Update Task' : 'Create Task'} className="py-3" />
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
  const { key, reloadComponent } = useReloadContext();
  const navigate = useNavigate();
  const { setProjectID } = useProjectContext();
  const location = useLocation();

  const handleDelete = async () => {
    await deleteData({ id: noteData.id, collectionName: 'notes', reloadComponent: reloadComponent });
  }

  const headerToProject = () => {
    navigate('/Home/Project');
    setProjectID(noteData?.['project-id'])
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <ModalOverlay onClick={closeModal}>
      <section
        className="flex flex-col bg-white rounded-md overflow-auto hover:outline-green-700 w-[40rem] max-w-[full] h-[30rem] p-4 justify-between"
        onClick={(e) => e.stopPropagation}
      >
        <section>
          <span className="flex flex-col justify-between w-full gap-2">
            <IconTitleSection title={noteData.title} iconOnClick={closeModal} dataFeather='x'/>
  
            <p id="note-card-text" className="text-slate-800 font-semibold my-2 hover:cursor-pointer w-full break-words">
              {noteData.message}
              {noteData.file && (
                <span className="block mt-2 text-gray-500 text-xs">
                  Attached File: <img src={`http://localhost:5000/api/files/image/${noteData.fileId}`} />
                </span>
              )}
              { (noteData['project-id' && location.pathname == '/Home/Project']) ? (
                <ButtonIcon text={`Go to ${noteData['project-title']}`} dataFeather='arrow-right' onClick={headerToProject} className='mt-2'/>
              ) : (
                null
              )}
            </p>
          </span>
        </section>
        <section className="flex justify-between">
          <span className="w-full flex overflow-hidden text-xs text-gray-600 gap-1 font-semibold pt-2">
            <IconText text={noteData.owner} />
            <IconText text={noteData['project-title']} />
            <IconText text={noteData.status} />
          </span>
          <span className="flex gap-2">
            {showPopUp && <CreateNote closeModal={closeModal} noteData={noteData}/>}
            <IconAction dataFeather="trash-2" iconOnClick={handleDelete} />
            <IconAction dataFeather="edit" iconOnClick={togglePopUp} />
          </span>
        </section>
      </section>
    </ModalOverlay>
  );
  
}

function UserProfile({ closeModal, user={} }) {
  const [visibility, setVisbility] = useState({
    addTeamMates: false,
  });

  const toggleVisbility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  };

  const { handleSignOut } = HandleSignOut();

  return (
    <ModalOverlay onClick={closeModal}>
      <div id='main' className='flex flex-col bg-white rounded-md w-full max-w-[30rem] p-4 shadow-lg font-medium' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title='User Profile' dataFeather='x' iconOnClick={closeModal} className=''/>
        <span className='flex p-2 gap-4 items-center'>
          <img src={user.photoURL} alt="" className='h-full w-auto rounded-full'/>
          <span className='flex flex-col h-'>
            <p className='font-bold'>{user.displayName}</p>
            <p className=''>{user.email}</p>
            <p className='text-gray-600 text-xs mt-2'>UID: {user.uid}</p>
          </span>
        </span>
    

        <div id="connections" className='mt-2'>
          <IconTitleSection dataFeather='user-plus' title='Teammates' iconOnClick={() => toggleVisbility('addTeamMates')} />
          {visibility.addTeamMates && <AddTeamMates closeModal={() =>toggleVisbility('addTeamMates')} /> }

          <section>

          </section>

        </div>


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

function AddTeamMates({closeModal}) {
  return(
    <ModalOverlay>
      <div className='flex z-20 max-w-[30rem] w-full h-auto min-h-[20rem] p-4 flex-col bg-white rounded-md justify-between'>
        <IconTitleSection title='Add Team Mates' dataFeather='x' iconOnClick={closeModal} />
          <label htmlFor="search" className='flex h-10 w-full border-2 border-green-700 border-opacity-25 rounded-md self-end items-center'>
            <input
              className="border border-gray-300 rounded-sm p-1 w-full h-full focus:ring-1 focus:ring-green-600 focus:ring-opacity-50 focus:outline-none hover:cursor-pointer text-sm z-10"
              placeholder='Enter username or user ID'
            />
            <IconAction
              dataFeather="search"
              text='Search'
              className='rounded-sm h-full'
            />
          </label>

          <div id='search-result' className='h-full w-full bg-slate-50 flex-grow my-2'>

          </div>

          <Button text='Confirm Add Users' className=''/>
      </div>
    </ModalOverlay>
  )
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
    await moveStatus({ name: collectionName, id: taskData?.id, team: taskData?.team });
    closeModal();
  };

  const handleDelete = async () => {
    await deleteData({ id: taskData?.id, collectionName: collectionName, reloadComponent: reloadComponent });
  }
  
  const handleShowCreateTask = () => {
    setShowCreateTask(!showCreateTask);
  };


  return (
    <ModalOverlay onClick={closeModal}>
      <div className='flex flex-col h-[30rem] w-[40rem] max-h-full max-w-full bg-white p-4 rounded-md' onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={loading ? '...' : taskData.title} iconOnClick={closeModal} dataFeather='x' underTitle={taskData.deadline}/>
        <div className='flex flex-col justify-between h-full w-full'>
          <p className='font-semibold text-slate-800'>{taskData.description}</p>

          <div className='flex w-full justify-between border-t-2 pt-2'>
            <section id="user" className='flex gap-1 w-fit h-fit items-center'>
              {!taskData.team || taskData.team.length > 0 ?(
                taskData.team.map((member) => (
                  <div className='flex p-1 rounded-full bg-slate-100'>
                    <IconUser key={member.uid} user={member} className='h-6 w-6'/>
                  </div>
                ))
              ) : (
                <span className='bg-red-50 text-red-800 px-1 text-xs'>No members assigned</span>
              )}
              <IconText text={taskData.status} />
            </section>
              
            <section className='flex gap-1 items-center'>
              <IconAction dataFeather='trash' iconOnClick={handleDelete}/>
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

function Summary({ closeModal, taskData, projectData, noteData }) {
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
      label: 'Pinned Notes',
      onClick: () => setActiveSection('Action Notes'),
      isActive: activeSection === 'Action Notes',
      dataFeather: 'file-text',
      key: 'title',
    }
  ]

  const columns = useMemo(() => [

    {
      header: 'Title',
      accessorFn: row => row.title || row['project-title'] || 'N/A'
    },
    {
      header: 'Description',
        accessorFn: row => {
          const { title, team, file, ...rest } = row;
          const { ['team-uids']: _, ...filteredRest } = rest;
          return Object.entries(filteredRest)
            .map(([key, value]) => `${key}: ${value ?? 'N/A'}`)
            .join('\n');
        },
    }
  ], []);

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
      <div
        className='flex flex-col max-w-[60rem] w-full h-[75vh] bg-white p-4 rounded-md overflow-x-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title='Task Summary' dataFeather='x' iconOnClick={closeModal} />
        <MultiTitleSection titles={titles} />

        <table className='w-full bg-white text-slate-800'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className={`border px-2 py-1 text-xs font-semibold text-left w-[5rem]`}
                  >
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
                  <td key={cell.id} className='border px-2 py-1 text-sm whitespace-pre-wrap'>
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

export { CreateTask, CreateProject, NoteFocus, CreateNote, UserProfile, AddMembers, CreateCanvas, CompletedTab, TaskFocus, Summary, AddTeamMates}
 