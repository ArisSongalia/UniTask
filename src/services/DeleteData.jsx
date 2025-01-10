import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const deleteData = async (id, collectionName, reloadComponent) => {
  try {
    console.log(id);

    if (!id) {
      alert("Document not found!");
      console.error("Document not found!");
      return;
    }

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    reloadComponent();
    alert("Successfully Deleted");

  } catch (error) {
    alert(`Error Deleting Data: ${error.message}`);
    console.error("Error Deleting Data:", error);
  }
};

export default deleteData;