import { doc, deleteDoc, where, getDocs, collection, query } from 'firebase/firestore';
import { db } from '../config/firebase';


const deleteData = async ({id, collectionName, reloadComponent}) => {
  try {

    if (!id) {
      alert("Document not found!");
      console.error("Document not found!");
      return;
    }

    const docRef = doc(db, collectionName, id);
    if(docRef) {
      try {
        await deleteDoc(docRef);
      } catch(error) {
        alert(error);
        console.log(error);
      }
    } else {
      console.log('Cannot access doc or it doesnt exist')
    }

    const subTaskRef = collection(db, 'tasks');
    const subTaskQ = query(subTaskRef, where('project-id', '==', id));
    const subTaskSnap = await getDocs(subTaskQ);

    const subNoteRef = collection(db, 'notes')
    const subNotesQ = query(subNoteRef, where('project-id', '==', id));
    const subNoteSnap = await getDocs(subNotesQ);

    if(subNoteSnap, subTaskSnap) {
      const taskDelete = subTaskSnap.docs.map(task => deleteDoc(task.ref));
      const noteDelete = subNoteSnap.docs.map(notes => deleteData(note.ref));

      try {
        await Promise.all([...taskDelete, ...noteDelete])
      } catch(error) {
        alert(error);
        console.log(error);
      }
    } else {
      console.log('No sub tasks/notes or error accesing sub collections')
    }

    reloadComponent();
    alert("Successfully Deleted");

  } catch (error) {
    alert(`Error Deleting Data: ${error.message}`);
    console.error("Error Deleting Data:", error);
  }
};

export default deleteData;
