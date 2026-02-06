import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, where, query, orderBy,or } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


function UseFetchUserName() {
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


const useFetchProjectData = (
  refreshKey,
  orderValue = "",
  orderPos = "asc"
) => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async (user) => {
      try {
        if (!user) return;

        const projectRef = collection(db, "projects");

        let q = query(
          projectRef,
          where("owner", "==", user.uid)
        );

        if (orderValue) {
          q = query(
            projectRef,
            where("owner", "==", user.uid),
            orderBy(orderValue, orderPos)
          );
        }

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjectData(data);
      } catch (error) {
        console.error("Error Fetching Project Data:", error);
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
  }, [orderValue, orderPos, refreshKey]);

  return { projectData, loading };
};


const useFetchNoteData = ( refreshKey, customWhere ) => {
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchNoteData = async (user) => {
      try {
        if (user) {
          const noteRef = collection(db, 'notes');
          const q = customWhere 
            ? query(noteRef, customWhere) 
            : query(noteRef, where("ownerUid", "==", user.uid));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
            setNoteData(data);
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

  return{ noteData, loading }
}

const useFetchActiveProjectData = ( projectId, refreshKey ) => {
  const [projectData, setProjectData] = useState({});
  const [loading, setLoading] = useState(true);
  const id = projectId;


  useEffect(() => {
    if (!id) {
      console.warn('Waiting for valid document ID...');
      return;
    }
  
    const fetchData = async () => {
      try {
        const projectRef = doc(db, 'projects', id);
        const projectDoc = await getDoc(projectRef);
  
        if (projectDoc.exists()) {
          setProjectData({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          throw new Error('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setProjectData({});
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
  }, [id, projectData, refreshKey]);


  return { projectData, loading}
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

const useFetchMessageData = (activeUser, projectId) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [sentMessageData, setSentMessageData] = useState([]);
  const [receivedMessageData, setReceivedMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchMessages = async (isInitial = false) => {
    const sentFilter = [];
    const receivedFilter = [];

    if (!activeUser) return;

    if (activeUser.uid) {
      sentFilter.push(where('messageTo', '==', activeUser.uid));
      sentFilter.push(where('senderId', '==', auth.currentUser.uid));

      receivedFilter.push(where('messageTo', '==', auth.currentUser.uid));
      receivedFilter.push(where('senderId', '==', activeUser.uid));
    } else if (activeUser.tag) {
      sentFilter.push(where('messageTo', '==', activeUser.tag));
      sentFilter.push(where('senderId', '==', auth.currentUser.uid));

      receivedFilter.push(where('messageTo', '==', activeUser.tag));
      receivedFilter.push(where('senderId', '!=', auth.currentUser.uid));
    }

    if (isInitial) setLoading(true);

    try {
      const [snapshotSent, snapshotReceived] = await Promise.all([
        getDocs(query(collection(db, 'messages'), ...sentFilter, where('messageFrom', '==', projectId))),
        getDocs(query(collection(db, 'messages'), ...receivedFilter, where('messageFrom', '==', projectId))),
      ]);

      const sentMessages = snapshotSent.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const receivedMessages = snapshotReceived.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setSentMessageData(sentMessages);
      setReceivedMessageData(receivedMessages);
    } catch (error) {
      console.log("Error accessing message data:", error);
      setSentMessageData([]);
      setReceivedMessageData([]);
    } finally {
      if (isInitial) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMessages(true); 
  }, [activeUser]);

  useEffect(() => {
    if (!initialLoad) fetchMessages();
  }, [refreshKey]);

  return { sentMessageData, receivedMessageData, loading };
};

const useFetchTeams = (userId, refreshKey) => {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      if(!userId) return ;
      setLoading(true);
      
      try {
        const teamsRef = collection(db, 'teams');
        const q = query(
          teamsRef, 
          or(
            where('creator', '==', userId),
            where('memberUids', 'array-contains', userId)
          )
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTeamsData(data);
      } catch (error) {
        setTeamsData([]);
        console.error(error.message)
      } finally {
        setLoading(false);
      };
    };

   
    fetchTeams();

  }, [refreshKey, userId])

  return { teamsData, loading };
}


export { UseFetchUserName, useFetchUsers, useFetchProjectData, useFetchNoteData, useFetchActiveProjectData, useFetchTaskData, useFetchMessageData, useFetchTeams};

