import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, where, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


function FetchUserName() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          } else {
            console.log('User document not found');
          }
        } else {
          console.log('No logged-in user');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUsername(user);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <span>...</span>;
  }

  if (!username) {
    return <span>{auth.currentUser?.email}</span>;
  }

  return <span>{username}</span>;
}


const fetchProjectData = ( setProjectData, setLoading, refreshKey ) => { 
  useEffect(() => {
    const fetchProjectData = async (user) => {
      try {
        if (user) {
          const projectRef = collection(db, 'projects');
          const q = query(projectRef, where("owner", "==", user.uid))
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const projectData = [];
            querySnapshot.forEach((doc) => {
              projectData.push({
                title: doc.data().title,
                description: doc.data().description,
                date: doc.data().date, 
                type: doc.data().type,
                id: doc.data().id,
                status: doc.data().status,
              });
            });
            setProjectData(projectData);
          }  else {
            setProjectData([]);
          }
        } else {
          alert("No Logged-In User: Please Log-in");
        }
      } catch (error) {
        console.error("Error Fetching Project Data:", error);
        alert("Error Fetching Project Data");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        fetchProjectData(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setProjectData, setLoading, refreshKey]);

  return null;
}

const fetchNoteData = ( setNoteData, setLoading, refreshKey, customWhere ) => {
  useEffect(() => {
    const fetchNoteData = async (user) => {
      try {
        if (user) {
          const noteRef = collection(db, 'notes');
          const q = customWhere 
            ? query(noteRef, customWhere) 
            : query(noteRef, where("owner", "==", user.uid));

          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const NoteData = [];
            querySnapshot.forEach((doc) => {
              NoteData.push({
                title: doc.data().title,
                message: doc.data().message,
                file: doc.data().file,
                date: doc.data().date,
                id: doc.data().id,
              });
            });
            setNoteData(NoteData);
          } else {
            setNoteData([]);
          }
        } else {
          console.log("Error accessing notes")
        }
      } catch (error) {
        console.error("Error Fetching User Note Data: ", error);
        alert("Error Fetching User Note Data")
      } finally {
        setLoading(false)
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        fetchNoteData(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();

  }, [setNoteData, setLoading, refreshKey])
}

const useFetchActiveProjectData = (id, setProjectData, setLoading, refreshKey) => {
  useEffect(() => {
    if (!id) {
      console.warn('Waiting for valid document ID...');
      return;
    }
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectRef = doc(db, 'projects', id);
        const projectDoc = await getDoc(projectRef);
  
        if (projectDoc.exists()) {
          setProjectData(projectDoc.data());
        } else {
          throw new Error('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });
  
    if (auth.currentUser) {
      fetchData();
    }
  
    return () => unsubscribe();
  }, [id, setProjectData, setLoading, refreshKey]);
};

const useFetchTaskData = (customWhere, refreshKey) => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!customWhere) {
        setTaskData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const whereToArray = Array.isArray(customWhere) ? customWhere : [customWhere]
        const taskRef = collection(db, "tasks");
        const q = query(taskRef, ...whereToArray);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setTaskData(data);
        } else {
          console.log("No task data found");
          setTaskData([]);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [customWhere, refreshKey]);

  return { taskData, loading};
};



const useFetchUsers = (setUsers, setLoading, refreshKey) => {
  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const userRef = collection(db, 'users');
        const querySnapshot = await getDocs(userRef);

        if (!querySnapshot.empty) {
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsers(users);
        } else {
          console.log('No users found');
          setUsers([]);
        }

      } catch(error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        fetchUsers();
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };

  }, [setUsers, setLoading, refreshKey])
};



export { FetchUserName, useFetchUsers, fetchProjectData, fetchNoteData, useFetchActiveProjectData, useFetchTaskData};

