import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../../../config/firebase';
import { useReloadContext } from '../../../context/ReloadContext';
import syncToSearch from '../../../services/SyncToSearch';
import Button from '../../Button';
import ModalOverlay from '../../ModalOverlay';
import { IconTitleSection } from '../../TitleSection';


export default function CreateProject({ closeModal, projectData }) {
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
        createdAt: projectData ? projectData.createdAt : new Date(),
        updatedAt: new Date(),
        targetDate: new Date(form.date)
      };

      let projectId = projectData?.id;

      if (projectData) {
        await updateDoc(doc(db, 'projects', projectData.id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'projects'), payload);
        projectId = docRef.id;
      }

      await syncToSearch('project', projectId, payload);

      await setDoc(doc(db, "projects", projectId, "metrics", `${projectId}_metrics`), {
        projectActivity: 0,
        urgentTasks: 0,
        tasksCompleted: 0,
        totalCompletionTime: 0
      });

      setMessage({ text: 'Project Successfully Saved!', color: 'green' });

      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      setIsSaving(false);
      setMessage({ text: `Error: ${error.message}`, color: "red" });
    }
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <section className="bg-white rounded-md p-4 max-w-[35rem] w-full" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={!projectData ? 'Create Project' : 'Update Project'} dataFeather='x' iconOnClick={closeModal} />
        <form onSubmit={handleCreateProject} className="flex flex-col space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
          {message.text && <p style={{ color: message.color }}>{message.text}</p>}
          <Button type="submit" disabled={isSaving} text={projectData ? 'Update Project' : 'Create Project'} />
        </form>
      </section>
    </ModalOverlay>
  );
}