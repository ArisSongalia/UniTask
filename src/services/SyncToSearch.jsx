import { db } from "../config/firebase";
import { doc, deleteDoc, setDoc } from "firebase/firestore";

const createSearchPath = (type, id, data) => {
  if (type === 'task') return `/project/${data['project-id']}`;
  if (type === 'project') return `/project/${id}`;
  if (type === 'note') return `/project/${data['project-id']}`; 
  return '/';
};  

const syncToSearch = async (type, id, data, isDelete = false) => {
  const searchRef = doc(db, 'search_index', id);

  if (isDelete) {
    await deleteDoc(searchRef);
    return;
  }


  const rawTitle = data.title || data.username || data.displayName || "Untitled";
  const title = String(rawTitle); 

  const searchRecord = {
    title: title,
    searchTitle: title.toLowerCase(), 
    description: data.description || "",
    category: type,
    path: createSearchPath(type, id, data),
    owner: data.owner || null, 
    updatedAt: new Date(),
  };

  try {
    await setDoc(searchRef, searchRecord, { merge: true });
  } catch (error) {
    console.error("Error syncing to search index:", error);
  }
};

export default syncToSearch;
export { createSearchPath };