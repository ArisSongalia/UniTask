import { db } from "../config/firebase";
import { doc, deleteDoc, setDoc } from "firebase/firestore";


const createSearchPath = (type, id, data) => {
  if (type == 'task') return `/project/${data['project-id']}/tasks/${id}`;
  if (type == 'project') return `/project/${id}`;
  if (type == 'user') return `/profile/${id}`;

  return '/';
};  

const syncToSearch = async (type, id, data, isDelete = false) => {
  const seachRef = doc(db, 'search_index', id);

  if (isDelete) {
    await deleteDoc(seachRef);
    return;
  };

  const searchRecord = {
    title: data.title || data.username || data.displayName,
    description: data.description,
    category: type,
    path: createSearchPath(type, id, data),
    owner: data.owner,
    updatedAt: new Date(),
  };

  await setDoc(seachRef, searchRecord, {merge: true});
};



export default syncToSearch;
export { createSearchPath };