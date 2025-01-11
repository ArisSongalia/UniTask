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

const fetchNoteData = ( setNoteData, setLoading, refreshKey ) => {
  useEffect(() => {
    const fetchNoteData = async (user) => {
      try {
        if (user) {
          const noteRef = collection(db, 'notes');
          const q = query(noteRef, where("owner", "==", user.uid));

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

const useFetchTaskData = ( setTaskData, setLoading ) => {
  const activeProjectId = localStorage.getItem('activeProjectId');

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const taskRef = collection(db, 'tasks');
        const q = query(taskRef, where("task-project-id", "==", activeProjectId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const taskData = querySnapshot.docs.map((doc) => ({
              'task-title': doc.data()['task-title'],
              'task-description': doc.data()['task-description'],
              'task-deadline': doc.data()['task-deadline'],
              'task-status': doc.data()['task-status'],
              'task-team': doc.data()['task-team'],
          }));
          setTaskData(taskData);
        } else {
          console.log('No task data found')
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
      } else {
        setLoading(false);
      };
    });

    return () => unsubscribe();
  }, [activeProjectId, setLoading])
}


export { FetchUserName, fetchProjectData, fetchNoteData, useFetchActiveProjectData, useFetchTaskData};

