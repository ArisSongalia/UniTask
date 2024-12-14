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
    return <span>Loading...</span>;
  }

  if (!username) {
    return <span>{auth.currentUser?.email}</span>;
  }

  return <span>{username}</span>;
}


function FetchProjectData({ setProjectData, setLoading }) {
  
  useEffect(() => {
    const fetchProjectData = async (user) => {
      try {
        if (user) {
          const projectsRef = collection(db, 'projects');
          const q = query(projectsRef, where("owner", "==", user.uid))
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const projectData = [];
            querySnapshot.forEach((doc) => {
              projectData.push({
                title: doc.data().title,
                description: doc.data().description,
                date: doc.data().date,
                type: doc.data().type
              });
            });
            setProjectData(projectData);
          } 
        } else {
          alert("No logged-in user");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        alert("Error fetching project data");
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
  }, [setProjectData, setLoading]);

  return null;
}


export { FetchUserName, FetchProjectData };
