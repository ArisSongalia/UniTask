import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { addDoc, collection, doc, getDoc, limit, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { auth, db } from '../../config/firebase';
import { useReloadContext } from '../../context/ReloadContext';
import deleteData from '../../services/DeleteData';
import { useFetchActiveProjectData, useFetchNoteData, useFetchProjectData, useFetchTaskData, useFetchTeams, useFetchUsers } from '../../services/FetchData';
import { useMoveStatus } from '../../services/useMoveStatus';
import Button from '../Button';
import { UserCard } from '../Cards';
import Icon, { IconAction, IconText, IconUser } from '../Icon';
import ModalOverlay from '../ModalOverlay';
import { IconTitleSection, MultiTitleSection } from '../TitleSection';
import { HandleSignOut } from './ModalAuth';
import axios from "axios";



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
};


function NoteFocus({ closeModal, noteData}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }
  const { key, reloadComponent } = useReloadContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async () => {
    await deleteData({ id: noteData.id, collectionName: 'notes', reloadComponent: reloadComponent });
  }

  const headerToProject = () => {
    navigate(`/Project/${noteData['project-id']}`)
  }

  return (
    <ModalOverlay onClick={closeModal}>
      <section
        className="flex flex-col bg-white rounded-md overflow-auto hover:outline-green-700 w-[40rem] max-w-[full] h-[30rem] p-4 justify-between"
        onClick={(e) => e.stopPropagation}
      >
        <section>
          <span className="flex flex-col justify-between w-full gap-2">
            <IconTitleSection title={noteData.title} underTitle={noteData.date} iconOnClick={closeModal} dataFeather='x'/>
  
            <p id="note-card-text" className="text-slate-800 font-semibold my-2 hover:cursor-pointer w-full break-words">
              {noteData.message}
            </p>
          </span>
        </section>
        <section className="flex justify-between">
          <span className="w-full flex overflow-hidden text-xs text-gray-600 gap-1 font-semibold pt-2">
            <IconText text={noteData.owner} />
            <IconText text={noteData['project-title']} />
            <IconText text={noteData.status} />
          </span>
          <span className="flex gap-2 items-center justify-end w-full">
            {showPopUp && <CreateNote closeModal={togglePopUp} noteData={noteData}/>}
            <IconAction dataFeather="trash-2" iconOnClick={handleDelete} />
            <IconAction dataFeather="edit" iconOnClick={togglePopUp} />
            {(noteData['project-id'] && location.pathname == '/Home') ? (
              <IconAction text={`Open in Project`} dataFeather='arrow-right' onClick={headerToProject} className=''/>
            ) : (
              null
            )}
          </span>
        </section>
      </section>
    </ModalOverlay>
  );
  
};

function UserProfile({ closeModal, user={}, overlay = true}) {
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey(prev => prev + 1);

  const self = user.uid === auth.currentUser.uid;
  
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
  const { teamsData, loading} = useFetchTeams(user.uid, reloadKey);

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
              {user.username}
            </p>
            <p className='text-sm text-gray-600 truncate'>
              {user.email}
            </p>
            <p className='text-gray-500 text-[10px] mt-2 break-all leading-tight'>
              <b className="text-gray-700">UID:</b> {user.uid}
            </p>
          </span>
        </div>



      <div id="connections" className='mt-2 border shadow-md rounded-md p-2'>
        <IconTitleSection dataFeather={self ? 'user-plus' : ''} title='Teams' className='border-b-2 border-green-700 border-opacity-50' iconOnClick={self ? () => toggleVisbility('addTeamMates') : null} />
        {visibility.addTeamMates && <AddTeamMates closeModal={() => toggleVisbility('addTeamMates')} reload={reload}/> }

        {loading ? (
        <BarLoader />
        ) : teamsData.length === 0 ? (
          null
        ) : (
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
          {teamsData.map((team) => (
            <div 
              key={team.id} 
              className="relative flex flex-col gap-2 p-3 rounded-lg border border-green-600 bg-white shadow-sm"
            >
              {/* Header: Name and Role Tag */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 truncate">
                    {team.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {team.description || "No description provided."}
                  </p>
                </div>
                
                {team.creator === user.uid && (
                  <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Owner
                  </span>
                )}
              </div>

              {/* Footer: Member Avatars */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  {team.members?.map((member, idx) => (
                    <div 
                      key={member.id || idx} 
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-gray-50 overflow-hidden"
                      title={member.username}
                    >
                      <IconUser user={member} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {self ? (
        <Button
          onClick={handleSignOut}
          className="text-green-900 text-sm font-bold hover:cursor-pointer border-gray-400 hover:text-green-700 mt-4"
          text="Sign-Out"
          dataFeather='log-out'
        />
      ) : (
        null
      )}
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
};

function AddTeamMates({ closeModal, reload }) {
  const currentUserUid = auth.currentUser?.uid;
  const [searchTerm, setSearchterm] = useState("");
  const [results, setResults] = useState([]);    
  const [isSearching, setIsSearching] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false); 
  const [isResultOpen, setIsResultOpen] = useState(false); 

  const [profilePopUp, setProfilePopUp] = useState(false);
  const [message, setMessage] = useState({text: '', color: ''})

  const [form, setForm] = useState({
    name: "",
    description: "",
    members: [],
    memberUids: []
  });

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

  const handleAddMembers = (user) => {
    setForm(prevForm => {
      if (prevForm.members.some(m => m.id === user.id)) {
        setMessage({ text: `${user.username} already addeed`, color: 'orange'});
        setSearchterm('');
        setResults([]);
        setIsResultOpen(false);
        return prevForm;
      };

      return {
        ...prevForm,
        members: [...prevForm.members, user],
        memberUids: [...prevForm.memberUids, user.uid]
      }
    });
    setSearchterm('')
    setResults([]);
    setIsResultOpen(false);
    setMessage({ text: `Added: ${user.username}`, color: 'green'});
  };

  const handleChange = (e) => {
    const {name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "teams"), {
        ...form,
        date: new Date(),
        creator: currentUserUid,
      })
      setMessage({ text: 'Succesfully Created Team', color: 'green'});
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, color: 'red'});
      console.error("Error Creating Team: ", error);
    };

    setTimeout(() => {
      closeModal();
      reload();
    }, 800)
  }

  return (
    <ModalOverlay>
      <div className='relative flex flex-col bg-white p-6  rounded-md max-w-md w-full'>
        <IconTitleSection title='Create Team' iconOnClick={closeModal} dataFeather='x'/>
        
        <div className="flex flex-col gap-2 text-sm relative w-full">
          <label htmlFor="team-name">
            Team Name 
            <input
              type="text" 
              name='name'
              placeholder='Input Team Name'
              className="border p-2 w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="team-description">
            Team Description
            <textarea
              type='text' 
              name='description'
              placeholder='Enter team description'
              className="border p-2 w-full"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="relative">
            <input
              value={searchTerm}
              onChange={(e) => setSearchterm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setIsResultOpen(true)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none bg-green-50 text-sm"
              placeholder='Search members to add'
            />
            <span className="absolute left-2 top-1">
              <Icon dataFeather="search" className="text-gray-500"/>
            </span>
            {isSearching ? (
              <div className="absolute right-1.5 top-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              </div>
            ) : (searchTerm.length > 0 && (
              <div className="absolute right-1.5 top-1.5">
                <IconAction dataFeather="x" iconOnClick={() => {
                  setSearchterm("");
                  setHasSearched(false);
                  setResults(false);
                  setIsResultOpen(false);
                }}/>
              </div>
            ))}
          </div>

          <div className="relative">
            <p className="text-xs italic text-gray-500">
              Selected: {form.members.map(m => m.username).join(', ') || "None"}
            </p>

            {isResultOpen && searchTerm.length >= 2 && (
              <ul className='absolute z-50 w-full bg-white border shadow-lg'>
                {isSearching ? (
                  <li className="p-4 text-gray-400">Searching...</li>
                ) : results.length > 0 ? (
                  results.map((user) => (
                    <li key={user.id} className="flex items-center gap-2 p-2 w-full divide-gray-300">
                      <UserCard
                        onClick={handleProfilePopUp}
                        key={user.id}
                        user={user}
                        className='hover:bg-green-50 max-w-full w-full'
                      />
                      {profilePopUp && <UserProfile user={user} closeModal={handleProfilePopUp} forAdding={true} />}
                      <IconAction 
                        dataFeather='user-plus' text='Add' 
                        className='border border-green-300' 
                        iconOnClick={() => handleAddMembers(user)}
                      />
                    </li>
                  ))
                ) : hasSearched ? (
                  <li className="p-4 text-gray-500">No results found</li>
                ) : null}
              </ul>
            )}
          </div>

          {message.text && (
            <p className="text-center font-medium text-sm" style={{ color: message.color }}>
              {message.text}
            </p>
          )}
          <Button dataFeather='plus' text='Create Team' onClick={handleSubmit}/>
        </div>
      </div>
    </ModalOverlay>
  );
};

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
        <IconTitleSection title={loading ? '...' : taskData.title} iconOnClick={closeModal} dataFeather='x' underTitle={taskData.deadline.toDate().toLocaleString()}/>
        <div className='flex flex-col justify-between h-full w-full'>
          <p className='font-semibold text-slate-800'>{taskData.description}</p>

          <div className='flex w-full justify-between border-t-2 pt-2'>
            <section id="user" className='flex gap-1 w-fit h-fit items-center'>
              {taskData.team || taskData.team.length > 0 ?(
                taskData.team.map((member) => (
                  <div key={member.uid} className='flex p-1 rounded-full bg-slate-100'>
                    <IconUser user={member} className='h-6 w-6'/>
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
};

function Summary({ closeModal }) {
  const [activeSection, setActiveSection] = useState('Assigned Tasks');
  const [customWhere, setCustomWhere] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      setCustomWhere([
        where("team-uids", "array-contains", user.uid),
      ]);
    }
  }, [user]);

  // 🔹 Fetch data internally
  const { taskData = [] } = useFetchTaskData(customWhere);
  const { projectData = [] } = useFetchProjectData();
  const { noteData = [] } = useFetchNoteData();

  const titles = [
    {
      label: 'Assigned Tasks',
      onClick: () => setActiveSection('Assigned Tasks'),
      isActive: activeSection === 'Assigned Tasks',
      dataFeather: 'check-square',
    },
    {
      label: 'Pending Projects',
      onClick: () => setActiveSection('Pending Projects'),
      isActive: activeSection === 'Pending Projects',
      dataFeather: 'briefcase',
    },
    {
      label: 'Pinned Notes',
      onClick: () => setActiveSection('Pinned Notes'),
      isActive: activeSection === 'Pinned Notes',
      dataFeather: 'file-text',
    }
  ];

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

  const data =
    activeSection === 'Assigned Tasks'
      ? taskData
      : activeSection === 'Pending Projects'
      ? projectData
      : noteData;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ModalOverlay>
      <div
        className="flex flex-col max-w-[60rem] w-full h-[75vh] bg-white p-4 rounded-md overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title="Task Summary" dataFeather="x" iconOnClick={closeModal} />
        <MultiTitleSection titles={titles} />

        <table className="w-full bg-white text-slate-800">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border px-2 py-1 text-xs font-semibold text-left w-[5rem]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="border px-2 py-1 text-sm whitespace-pre-wrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalOverlay>
  );
};

function UnlockPro({ closeModal }) {
  const [showGetCardDetails, setGetShowCardDetails] = useState(false);
  const [planType, setPlanType] = useState("monthly");

  const prices = {
    monthly: 5000,
    yearly: 50000,
  };

  return (
    <ModalOverlay>
      <div className="absolute bg-white h-fit max-w-screen-md w-full p-4 rounded-md">
        <IconTitleSection title="Pro Plan" dataFeather="x" iconOnClick={closeModal} />

        <div className="flex justify-center mb-4">
          <span className="bg-violet-700 text-white text-xs px-3 py-1 rounded-full tracking-wide">
            🚀 PRO PLAN
          </span>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">
          Unlock Uni Pro
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Supercharge your workflow with AI-powered features and unlimited creativity.
        </p>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                planType === "monthly"
                  ? "bg-violet-700 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setPlanType("monthly")}
            >
              Monthly
            </button>

            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                planType === "yearly"
                  ? "bg-violet-700 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setPlanType("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Dynamic Price */}
        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold">
            ${prices[planType]}
          </span>
          <span className="text-gray-500">
            {planType === "monthly" ? "/month" : "/year"}
          </span>

          {planType === "yearly" && (
            <p className="text-sm text-green-600 mt-2">
              Save 28% with yearly billing 🎉
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            AI-powered tools
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Create unlimited projects
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Faster processing & priority access
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✔</span>
            Early access to new features
          </li>
        </ul>

        <SubscriptionForm
          text={`Upgrade to ${planType === "monthly" ? "Monthly" : "Yearly"} Pro`}
          planType={planType}
          className='w-full py-3 rounded-xl bg-violet-700 text-white font-semibold hover:shadow-lg border border-violet-700 hover:shadow-blue-500/50"'
        />

        <p className="text-sm text-gray-400 text-center mt-4">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </ModalOverlay>
  );
}

function SubscriptionForm({planType, text, className=""}) {

  const handleCheckout = async () => {
    const response = await axios.post(
      "https://untroublesome-vaulted-vennie.ngrok-free.dev/api/create-checkout",
      { planType: planType }
    );

    window.location.href = response.data.checkout_url;
  };

  return (
    <button onClick={handleCheckout} className={className}>
      {text}
    </button>
  );
}

export { AddMembers, AddTeamMates, NoteFocus, Summary, TaskFocus, UserProfile, UnlockPro };
 