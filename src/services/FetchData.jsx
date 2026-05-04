import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, where, query, orderBy,or, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';


function UseFetchUserData(uid) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchUserData = async () => {
      try {
        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('User document not found');
          }
        };
      } catch (error) {
        console.error('Error fetching username:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData()
  }, [uid]);

  return {userData, loading};
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
          where("team-uids", "array-contains", user.uid)
        );

        if (orderValue) {
          q = query(
            projectRef,
            where("team-uids", "array-contains", user.uid),
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
            : query(noteRef, where("team-uids", "array-contains", user.uid));
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
  }, [id, refreshKey]);


  return { projectData, loading}
};

const useFetchTaskData = (customWhere, refreshKey) => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);

      try {
        const taskRef = collection(db, "tasks");
        let filters = [];

        if (Array.isArray(customWhere)) {
          filters = customWhere.filter(Boolean);
        } else if (projectId) {
          filters = [where("project-id", "==", projectId)];
          console.log('using def where')
        }

        if (filters.length === 0) {
          setTaskData([]);
          setLoading(false);
          return;
        }

        const q = query(taskRef, ...filters);
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTaskData(data);

      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [customWhere, refreshKey, projectId]);

  return { taskData, loading };
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
    const senderId = auth.currentUser?.uid;
    const targetId = activeUser?.uid ?? activeUser?.tag;

    if (!activeUser || !projectId || !senderId || !targetId) {
      setSentMessageData([]);
      setReceivedMessageData([]);
      if (isInitial) setLoading(false);
      return;
    }

    if (activeUser.uid) {
      // Direct message to specific user
      sentFilter.push(where('messageTo', '==', activeUser.uid));
      sentFilter.push(where('senderId', '==', senderId));

      receivedFilter.push(where('messageTo', '==', senderId));
      receivedFilter.push(where('senderId', '==', activeUser.uid));
    } else if (activeUser.tag) {
      // Group message to 'everyone'
      sentFilter.push(where('messageTo', '==', activeUser.tag));
      sentFilter.push(where('senderId', '==', senderId));

      receivedFilter.push(where('messageTo', '==', activeUser.tag));
      receivedFilter.push(where('senderId', '!=', senderId));
    }

    if (isInitial) setLoading(true);

    try {
      // Query from project-specific messages subcollection
      const messagesCollection = collection(db, 'projects', projectId, 'messages');
      
      const [snapshotSent, snapshotReceived] = await Promise.all([
        getDocs(query(messagesCollection, ...sentFilter)),
        getDocs(query(messagesCollection, ...receivedFilter)),
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
    if (!activeUser || (!activeUser.uid && !activeUser.tag) || !projectId) {
      setLoading(false);
      return;
    }

    fetchMessages(true); 
  }, [activeUser, projectId]);

  useEffect(() => {
    if (!initialLoad && activeUser && (activeUser.uid || activeUser.tag) && projectId) {
      fetchMessages();
    }
  }, [refreshKey]);

  return { sentMessageData, receivedMessageData, loading };
};

export default useFetchMessageData;

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

  }, [refreshKey, userId  ])

  return { teamsData, loading };
}

const useFetchAnalytics = (projectId) => {
  const [ eventsData, setEventsData ] = useState([]);
  const [ metricsData, setMetricsData ] = useState({});

  if(!projectId) return console.log('Fetch Analytics: Missing ID');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try{
        const qMetrics = doc(db, 'projects', projectId, 'metrics', `${projectId}_metrics`);
        const metricsSnap = await getDoc(qMetrics);
        setMetricsData(metricsSnap.data());

        const qEvents = collection(db, 'projects', projectId, 'events');
        const eventsSnap = await getDocs(qEvents)
        setEventsData(eventsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })))
      } catch (error) {
        console.error('Failed to fetch analytics: ', error)
      }
    }

    fetchAnalytics();
  }, [projectId])

  return{ eventsData, metricsData };
}


export {
  useFetchUsers, 
  useFetchProjectData, 
  useFetchNoteData, 
  useFetchActiveProjectData, 
  useFetchTaskData,
  useFetchMessageData, 
  useFetchTeams,
  useFetchAnalytics,
  UseFetchUserData,
};

 