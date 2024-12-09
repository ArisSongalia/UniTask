import React from 'react';
import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

function FetchUserName() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          } else {
            console.log("User document not found");
            console.log("No username found")
          }
        }
      } catch (error) {
        console.error("Error fetching username: " + error);
        setUsername("Error fetching username")
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  if (loading) {
    return <span>Loading...</span>;
  };

  return <span>{username}</span>;
}

export default FetchUserName