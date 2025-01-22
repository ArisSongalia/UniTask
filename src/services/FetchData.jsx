import React, { useState, useEffect } from 'react';
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

const useFetchActiveProjectData = (id, setProjectData, setLoading) => {
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

    return () => unsubscribe();
  }, [id, setProjectData, setLoading]);
};

const useFetchTaskData = ( setTaskData, setLoading, refreshKey, customWhere) => {
  const activeProjectId = localStorage.getItem('activeProjectId');

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const taskRef = collection(db, 'tasks');
        let q;
        if (customWhere) {
          q = query(taskRef, customWhere, where("task-project-id", "==", activeProjectId))
        } else {
          q = query(taskRef);
        };
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const taskData = querySnapshot.docs.map((doc) => ({
              'task-title': doc.data()['task-title'],
              'task-description': doc.data()['task-description'],
              'task-deadline': doc.data()['task-deadline'],
              'task-status': doc.data()['task-status'],
              'task-team': doc.data()['task-team'],
              'task-id': doc.id,
          }));
          setTaskData(taskData);
          console.log('Task fetched using the ID', activeProjectId)
        } else {
          console.log('No task data found');
          setTaskData([]);
        }
      } catch (error) {
        console.log('Error fetching tasks', error)
      } finally {
        setLoading(false);
      };
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchNoteData();
        setLoading(true);
      } else {
        setLoading(false);
      };
    });

    return () => unsubscribe();
  }, [activeProjectId, setLoading, refreshKey])
}

const useFetchUsers = (setUsers, setLoading, refreshKey) => {
  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const userRef = collection(db, 'users');
        const querySnapshot = await getDocs(userRef);

        if (!querySnapshot.empty) {
          const users = querySnapshot.docs.map((doc) => doc.data());
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

