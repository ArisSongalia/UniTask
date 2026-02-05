import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IconAction, IconText, IconUser } from '../Icon';
import Button, { ButtonIcon } from '../Button';
import TitleSection, { IconTitleSection, MultiTitleSection } from '../TitleSection';
import { addDoc, collection, getDoc, updateDoc, doc, getDocs, limit, query, where  } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import { UserCard } from '../Cards';
import { AlertCard } from '../Cards';
import { useFetchUsers, useFetchActiveProjectData, useFetchProjectData } from '../../services/FetchData';
import { BarLoader } from 'react-spinners';
import { TaskCard } from '../Cards';
import { HandleSignOut } from './ModalAuth';
import ModalOverlay from '../ModalOverlay';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useAsyncError, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useProjectContext } from '../../context/ProjectContext';
import syncToSearch from '../../services/SyncToSearch';
import { useFormState } from 'react-dom';


function CreateProject({ closeModal, projectData }) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [message, setMessage] = useState({ text: "", color: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    title: projectData?.title || "",
    description: projectData?.description || "",
    date: projectData?.date || "",
    type: projectData?.type || "",
    team: projectData?.team || [],
    status: projectData?.status || "On-going"
  });


  useEffect(() => {
    if (user && !projectData) {
      const initialMember = {
        uid: user.uid,
        username: user.displayName || 'You',
        email: user.email || '',
        photoURL: user.photoURL || '',
      };
      setForm(prev => ({
        ...prev,
        team: [initialMember],
        'team-uid': [user.uid]
      }));
    }
  }, [user, projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (isSaving) return;
    setIsSaving(true);
    setMessage({ text: "Saving...", color: "blue" });

    try {
      const payload = {
        ...form,
        owner: projectData ? projectData.owner : user.uid,
        updatedAt: new Date(),
      };

      let finalId = projectData?.id;

      if (projectData) {
        const projectRef = doc(db, 'projects', projectData.id);
        await updateDoc(projectRef, payload);
      } else {
        const docRef = await addDoc(collection(db, 'projects'), payload);
        finalId = docRef.id;
      }

      await syncToSearch('project', finalId, searchData);

      setMessage({ text: 'Project Successfully Saved!', color: 'green' });
      
      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setMessage({ text: `Error: ${error.message}`, color: "red" });
    }
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section 
        className="flex flex-col bg-white rounded-md w-full max-w-[35rem] p-4 shadow-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection 
          title={!projectData ? 'Create Project' : 'Update Project'} 
          iconOnClick={closeModal} 
          dataFeather='x' 
        />

        <form className="flex flex-col space-y-4" onSubmit={handleCreateProject}>
          {/* Title */}
          <label className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              name='title'
              value={form.title}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </label>

          {/* Description */}
          <label className="flex flex-col text-gray-600">
            Description
            <input
              type="text"
              name='description'
              value={form.description}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </label>

          {/* Date */}
          <label className="flex flex-col text-gray-600">
            Target Date
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]} // Directly setting min here
              value={form.date}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 hover:cursor-pointer"
              required
            />
          </label>

          {/* Project Type Selection */}
          {!projectData ? (
            <div className="flex flex-col text-gray-600">
              <span className="text-sm">Project Type</span>
              <div className="flex items-center space-x-4 mt-2">
                {['Solo', 'Shared'].map((mode) => (
                  <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name='type'
                      value={mode}
                      checked={form.type === mode}
                      onChange={handleChange}
                      required
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <AlertCard text='Project type cannot be changed after creation' />
          )}

          {message.text && (
            <p className="text-center font-medium" style={{ color: message.color }}>
              {message.text}
            </p>
          )}

          <Button 
            type="submit" 
            disabled={isSaving}
            text={projectData ? 'Update Project' : 'Create Project'} 
            className="py-3" 
          />
        </form>
      </section>
    </ModalOverlay>
  );
}

function CreateNote({ closeModal, noteData, projectData }) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [message, setMessage] = useState({ text: "", color: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    title: noteData?.title || "",
    message: noteData?.message || "",
    date: noteData?.date || "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    setMessage({ text: "Saving...", color: "blue" });

    try {
      const projId = projectData?.id || null;
      const projTitle = projectData?.title || 'Personal';

      const payload = {
        title: form.title,
        message: form.message,
        date: form.date,
        owner: user.displayName || "Anonymous",
        ownerUid: user.uid,
        status: noteData?.status || 'To-Review',
        'project-id': projId,
        'project-title': projTitle,
        searchTitle: form.title.toLowerCase(),
        updatedAt: new Date()
      };

      let finalId = noteData?.id;

      if (noteData?.id) {
        await updateDoc(doc(db, 'notes', noteData.id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'notes'), payload);
        finalId = docRef.id;
      }

      await syncToSearch('note', finalId, payload);

      setMessage({ text: 'Note Saved Successfully!', color: 'green' });
      
      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      console.error("Error saving note:", error);
      setMessage({ text: "Failed: " + error.message, color: "red" });
      setIsSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section 
        className="flex flex-col bg-white rounded-md w-full max-w-[35rem] p-4 shadow-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection 
          title={!noteData ? 'Create Note' : `Update: ${noteData.title}`} 
          dataFeather='x' 
          iconOnClick={closeModal} 
        />

        <form onSubmit={handleCreateNote} className="flex flex-col space-y-4">
          <label className="flex flex-col text-gray-600">
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none h-[10rem] resize-none"
              required
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Target Date
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 hover:cursor-pointer"
              required
            />
          </label>

          {message.text && (
            <p className="text-center text-sm font-medium" style={{ color: message.color }}>
              {message.text}
            </p>
          )}
          
          <Button 
            type="submit" 
            disabled={isSaving}
            text={noteData ? 'Update Note' : 'Create Note'} 
            className="py-3" 
          />
        </form>
      </section>
    </ModalOverlay>
  );
}


function CreateTask({ closeModal, taskData }) {
  const { key, reloadComponent } = useReloadContext();
  const [message, setMessage] = useState({ text: '', color: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { projectId } = useParams();
  const { projectData, loading } = useFetchActiveProjectData(projectId, key);

  const [form, setForm] = useState({
    title: taskData?.title || '',
    description: taskData?.description || '',
    deadline: taskData?.deadline || '',
    status: taskData?.status || 'To-do',
    team: taskData?.team || [],
    'team-uids': taskData?.['team-uids'] || [],
  });

  const minDateTime = useMemo(() => {
    const today = new Date();
    today.setHours(today.getHours() + 1);
    return today.toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
  }, []);


  useEffect(() => {
    if (auth.currentUser && projectData?.type === 'Solo' && form.team.length === 0) {
      const self = {
        uid: auth.currentUser.uid,
        username: auth.currentUser.displayName || 'You',
        email: auth.currentUser.email || '',
        photoURL: auth.currentUser.photoURL || '',
      };
      setForm((prev) => ({
        ...prev,
        team: [self],
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
    if (isSaving) return;

    if (projectData?.type === "Shared" && form.team.length === 0) {
      setMessage({ text: 'Please select task members', color: 'red' });
      return;
    }

    setIsSaving(true);
    setMessage({ text: 'Saving task...', color: 'blue' });

    try {
      const payload = {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        status: form.status,
        'project-id': projectId,
        'project-title': projectData?.title || 'Personal', 
        team: form.team,
        'team-uids': form['team-uids'],
        searchTitle: form.title.toLowerCase(),
        updatedAt: new Date(),
      };

      let savedId = taskData?.id;

      if (taskData?.id) {
        await updateDoc(doc(db, 'tasks', taskData.id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'tasks'), payload);
        savedId = docRef.id;
      }

      await syncToSearch('task', savedId, payload);

      setMessage({ text: 'Successfully Saved Task', color: 'green' });
      
      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      console.error(error);
      setMessage({ text: `Error: ${error.message}`, color: 'red' });
      setIsSaving(false);
    }
  };

  const handleStateChange = (data) => {
    setForm((prevForm) => {
      const updatedTeam = data.isActive 
        ? [...prevForm.team, { uid: data.uid, username: data.username, email: data.email, photoURL: data.photoURL }]
        : prevForm.team.filter((member) => member.uid !== data.uid);

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
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Description
            <textarea
              name="description"
              value={form.description}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={handleChange}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col text-gray-600">
              Status
              <select 
                name='status' 
                value={form.status} 
                onChange={handleChange}
                className="mt-1 border border-gray-300 rounded-md px-4 py-2 outline-none"
                required
              >
                <option value="To-do">To-do</option>
                <option value="In-progress">In-progress</option>
                <option value="To-review">To-review</option>
                <option value="Finished">Finished</option>
              </select>
            </label>

            <label className="flex flex-col text-gray-600">
              Deadline
              <input
                type="datetime-local"
                name="deadline"
                min={minDateTime}
                value={form.deadline}
                className="mt-1 border border-gray-300 rounded-md px-4 py-2 outline-none"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {projectData?.type === 'Shared' && (
            <div className="flex flex-col gap-2 text-gray-600">
              <p className="font-semibold">Assign Team Members</p>
              <section className="grid grid-cols-2 gap-2 p-4 rounded-md bg-slate-50 max-h-48 overflow-y-auto">
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
              <p className="text-xs italic text-gray-500">
                Selected: {form.team.map(m => m.username).join(', ') || "None"}
              </p>
            </div>
          )}

          {message.text && (
            <p className="text-center font-medium text-sm" style={{ color: message.color }}>
              {message.text}
            </p>
          )}
          
          <Button 
            type="submit" 
            disabled={isSaving}
            text={isSaving ? 'Saving...' : (taskData ? 'Update Task' : 'Create Task')} 
            className="py-3" 
          />
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
                <UserCard key={user.id} user={user} className='w-full' onStateChange={handleAddMembers} />
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

function UserProfile({ closeModal, user={}, overlay = true, forAdding = false}) {
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

  const profileContent = (
    <div id='main' className='flex flex-col bg-white rounded-md w-full max-w-[30rem] p-4 shadow-md font-medium' onClick={(e) => e.stopPropagation()}>
      <IconTitleSection title='User Profile' dataFeather={(overlay) ? 'x' : ''} iconOnClick={closeModal} className=''/>
        <div className='flex p-2 gap-4 items-center w-full'>
          <img 
            src={user.photoURL} 
            alt="" 
            className='h-14 w-14 rounded-full object-cover flex-shrink-0 border'
          />

          <span className='flex flex-col min-w-0 w-full'>
            <p className='font-bold truncate text-gray-800'>
              {user.displayName}
            </p>
            <p className='text-sm text-gray-600 truncate'>
              {user.email}
            </p>
            <p className='text-gray-500 text-[10px] mt-2 break-all leading-tight'>
              <b className="text-gray-700">UID:</b> {user.uid}
            </p>
          </span>
        </div>


      {forAdding ? (
        null
      ) : (
        <div id="connections" className='mt-2 bg-green-50 border border-green-300 rounded-md p-2'>
          <IconTitleSection dataFeather='user-plus' title='Teammates' className='border-b-2 border-green-700 border-opacity-50' iconOnClick={() => toggleVisbility('addTeamMates')} />
          {visibility.addTeamMates && <AddTeamMates closeModal={() =>toggleVisbility('addTeamMates')} /> }
        </div>
      )}

      <Button
        onClick={handleSignOut}
        className="text-green-900 text-sm font-bold hover:cursor-pointer border-gray-400 hover:text-green-700 mt-4"
        text={forAdding ? "Add Teammate" : "Sign-Out"}
        dataFeather='log-out'
      />
    </div>
  )

    if (overlay) {
      return (
          <ModalOverlay onClick={closeModal}>
            {profileContent}
          </ModalOverlay>
      );
    }

    return (
      profileContent
    )
}

function AddTeamMates({ closeModal }) {
  const currentUserUid = auth.currentUser?.uid;
  const [searchTerm, setSearchterm] = useState("");
  const [results, setResults] = useState([]);    
  const [isSearching, setIsSearching] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false); 
  const [isResultOpen, setIsResultOpen] = useState(false); 
  const [profilePopUp, setProfilePopUp] = useState(false);
  const teamName = "";


  const handleProfilePopUp = () => {
    setProfilePopUp(!profilePopUp);
  };

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsResultOpen(false);
      return;
    }

    const delayBouncingFn = setTimeout(async () => {
      setIsSearching(true);
      setIsResultOpen(true);

      try {
        const q = query(
          collection(db, "users"),
          where("username", ">=", searchTerm.toLowerCase()),
          where("username", "<=", searchTerm.toLowerCase() + "\uf8ff"),
          limit(10) 
        );

        const querySnapshot = await getDocs(q);
        
        const searchItems = querySnapshot.docs
          .map(doc => ({
            id: doc.id, 
            ...doc.data() 
          }))

          .filter(user => user.id !== currentUserUid);

        setResults(searchItems);
        setHasSearched(true);
      } catch (error) {
        console.error("Search Error: ", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayBouncingFn);

  }, [searchTerm, currentUserUid]); 

  return (
    <ModalOverlay>
      <div className='relative flex flex-col bg-white p-6  rounded-md max-w-md w-full'>
        <IconTitleSection title='Create Team' iconOnClick={closeModal} dataFeather='x'/>
        
        <div className="flex flex-col gap-2 text-sm relative w-full">
          <label htmlFor="team-name">
            Team Name 
            <input
              type="text" 
              placeholder='Input Team Name'
              className="border p-2 w-full"
            />
          </label>

          <div className="relative">
            <input
              value={searchTerm}
              onChange={(e) => setSearchterm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setIsResultOpen(true)}
              className="p-2 w-full active:"
              placeholder='Enter username'
            />
            <span className="absolute left-2 top-1">
              <Icon dataFeather="search" className="text-gray-500"/>
            </span>
          </div>

          {isResultOpen && searchTerm.length >= 2 && (
            <ul className='absolute z-50 w-full bg-white border shadow-lg'>
              {isSearching ? (
                <li className="p-4 text-gray-400">Searching...</li>
              ) : results.length > 0 ? (
                results.map((user) => (
                  <li key={user.id} className="p-2 text-black hover:bg-green-50 cursor-pointer" onClick={handleProfilePopUp}>
                    <p className='text-sm'>{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {profilePopUp && <UserProfile user={user} closeModal={handleProfilePopUp} forAdding={true} />}
                  </li>
                ))
              ) : hasSearched ? (
                <li className="p-4 text-gray-500">No results found</li>
              ) : null}
            </ul>
          )}

          <input 
            className='bg-green-50 min-h-8 w-full border border-green-300 rounded-sm p-2'
            placeholder='Selected members will appear here'
            disabled
          />

          <Button dataFeather='plus' text='Create Team' />
        </div>
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
 