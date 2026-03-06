import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../../../config/firebase';
import { useReloadContext } from '../../../context/ReloadContext';
import { useFetchActiveProjectData } from '../../../services/FetchData';
import syncToSearch from '../../../services/SyncToSearch';
import { logAnalytics } from '../../../services/logAnalytics';
import Button from '../../Button';
import { UserCard } from '../../Cards';
import ModalOverlay from '../../ModalOverlay';
import { IconTitleSection } from '../../TitleSection';
import { ToggleAnalyzeTaskWithAI } from '../ProSubscriptionModal';


export default function CreateTask({ closeModal, taskData }) {
  const { key, reloadComponent } = useReloadContext();
  const [message, setMessage] = useState({ text: '', color: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { projectId } = useParams();
  const { projectData, loading } = useFetchActiveProjectData(projectId, key);
  const user = auth.currentUser;

  const [form, setForm] = useState({
    title: taskData?.title || '',
    description: taskData?.description || '',
    deadline: taskData?.deadline || '',
    status: taskData?.status || 'To-do',
    team: taskData?.team || [],
    'team-uids': taskData?.['team-uids'] || [],
    priority: taskData?.priority || 'Low',
    category: taskData?.category || '',
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
  }, [user, projectData?.type]);

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
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        status: form.status,
        'project-id': projectId,
        'project-title': projectData?.title || 'Personal', 
        team: form.team,
        'team-uids': form['team-uids'],
        searchTitle: form.title.toLowerCase(),
        updatedAt: new Date(),
        priority: form.priority,
        category: form.category.toLowerCase(),
        completedAt: null,
        createdAt: new Date(),
      };

      let taskId;

      if (taskData?.id) {
        await updateDoc(doc(db, 'tasks', taskData.id), payload);
        taskId = taskData.id;
        logAnalytics({projectId, event: 'updated a task', taskData});
      } else {
        const docRef = await addDoc(collection(db, 'tasks'), payload);
        taskId = docRef.id;
        logAnalytics({projectId, event: 'created a task', taskData: {...payload, id: docRef.id}});
      }

      await syncToSearch('task', taskId, payload);

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
        className=" absoluteflex flex-col bg-white rounded-md w-full max-w-[35rem] max-h-[90vh] p-4 shadow-lg overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection 
          title={form.id ? 'Update Task' : 'Create Task'} 
          dataFeather='x' 
          iconOnClick={closeModal} 
            extraIcon={
              <ToggleAnalyzeTaskWithAI
                taskTitle={form.title}
                onAIResult={(aiData) => {
                  setForm((prev) => ({
                    ...prev,
                    ...aiData
                  }));
                }}
              />
            }
        />

        <form className="flex flex-col space-y-4" onSubmit={handleCreateTask}>
          
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

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col text-gray-600">
              Priority
              <select 
                name='priority' 
                value={form.priority} 
                onChange={handleChange}
                className="mt-1 border border-gray-300 rounded-md px-4 py-2 outline-none"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </label>

            <label className="flex flex-col text-gray-600">
              Category
              <input
                name='category'
                type='text'
                value={form.category}
                className="mt-1 border border-gray-300 rounded-md px-4 py-2 outline-none"
                onChange={handleChange}
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
          
          <div className="flex flex-col gap-1">
            <Button
              type="submit"
              disabled={isSaving}
              text={isSaving ? 'Saving...' : (taskData ? 'Update Task' : 'Create Task')}
              className="py-3 bg-green-800 text-white"
            />

            {(taskData) ? (
              <Button text='Mark as Finshed' className='p-3 border-none'
                onClick={async () => {
                const curDate = new Date();
                await updateDoc(doc(db, 'tasks', taskData.id), {status: 'Finished', completedAt: curDate});
                await logAnalytics({
                  projectId,
                  event: 'completed a task',
                  taskData: { ...taskData, status: 'Finished', completedAt: curDate }
                });
                setMessage({ text: 'Successfully Updated Status', color: 'green' });
                setTimeout(() => {
                  reloadComponent();
                  closeModal();
                }, 800);
              }}/>
            ) : (
              null
            )}

          </div>
        </form>
      </section>
    </ModalOverlay>
  );
}