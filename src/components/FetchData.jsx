import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

export { FetchUserName };
