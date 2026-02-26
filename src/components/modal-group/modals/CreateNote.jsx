import { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { useReloadContext } from '../../../context/ReloadContext';
import syncToSearch from '../../../services/SyncToSearch';
import ModalOverlay from '../../ModalOverlay';
import { IconTitleSection } from '../../TitleSection';
import Button from '../../Button';
import { logAnalytics } from '../../../services/logAnalytics';


export default function CreateNote({ closeModal, noteData, projectData }) {
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setMessage({ text: "Saving...", color: "blue" });

    try {
      const projId = projectData?.id || null;
      const projTitle = projectData?.title || "Personal";

      const payload = {
        title: form.title,
        message: form.message,
        date: form.date,
        owner: user.displayName || "Anonymous",
        ownerUid: user.uid,
        status: noteData?.status || "To-Review",
        'project-id': projId,
        'project-title': projTitle,
        searchTitle: form.title.toLowerCase(),
        updatedAt: new Date(),
      };

      let finalId = noteData?.id;

      if (noteData?.id) {
        await updateDoc(doc(db, 'notes', noteData.id), payload);
        logAnalytics({finalId, event: 'Updated a Note', noteData});
      } else {
        const docRef = await addDoc(collection(db, 'notes'), payload);
        finalId = docRef.id;
        logAnalytics({finalId, event: 'Created a Note', noteData: {...payload, id: docRef.id}});
      }

      await syncToSearch('note', finalId, payload);


      setMessage({ text: "Note Saved Successfully!", color: "green" });

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
        className="bg-white rounded-md w-full max-w-[35rem] p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection
          title={!noteData ? "Create Note" : `Update: ${noteData.title}`}
          iconOnClick={closeModal}
          dataFeather="x"
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
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={handleChange}
              className="mt-1 border border-gray-300 rounded-md px-4 py-2 hover:cursor-pointer"
              required
            />
          </label>

          {message.text && (
            <p
              className="text-center text-sm font-medium"
              style={{ color: message.color }}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSaving}
            text={noteData ? "Update Note" : "Create Note"}
            className="py-3"
          />
        </form>
      </section>
    </ModalOverlay>
  );
}